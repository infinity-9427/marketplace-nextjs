import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Product } from '@/components/ProductCard';
import { useToast } from '@/hooks/use-toast';

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  product: Product;
}

// In-memory cart item interface for react-query
interface MemoryCartItem {
  productId: string;
  quantity: number;
  addedAt: string;
  product: Product;
}

// Get current user's cart items - stored in react-query cache only
export const useCartQuery = () => {
  const queryClient = useQueryClient();
  
  return useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const cachedCart = queryClient.getQueryData<MemoryCartItem[]>(['cartItems']) || [];
      
      return cachedCart.map(item => ({
        id: `memory_${item.productId}`,
        product_id: item.productId,
        quantity: item.quantity,
        created_at: item.addedAt,
        product: item.product
      })) as CartItem[];
    },
    staleTime: 0, // Always refetch to ensure fresh data
    gcTime: 1000 * 60 * 5, // Keep in cache for 5 minutes
  });
};

// Add item to cart - react-query cache only
export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ product, quantity }: { product: Product; quantity: number }) => {
      // Validate inputs
      if (!product || !product.id) {
        throw new Error('Product is required and must have an id');
      }
      
      if (quantity <= 0) {
        throw new Error('Quantity must be greater than 0');
      }

      const currentCart = queryClient.getQueryData<MemoryCartItem[]>(['cartItems']) || [];
      
      const existingItemIndex = currentCart.findIndex(item => item.productId === product.id);
      
      let updatedCart: MemoryCartItem[];
      
      if (existingItemIndex >= 0) {
        updatedCart = [...currentCart];
        updatedCart[existingItemIndex].quantity += quantity;
      } else {
        updatedCart = [
          ...currentCart,
          {
            productId: product.id,
            quantity,
            addedAt: new Date().toISOString(),
            product
          }
        ];
      }
      
      // Update both cache keys immediately
      queryClient.setQueryData(['cartItems'], updatedCart);
      
      // Manually update the cart query data as well
      const cartItems = updatedCart.map(item => ({
        id: `memory_${item.productId}`,
        product_id: item.productId,
        quantity: item.quantity,
        created_at: item.addedAt,
        product: item.product
      })) as CartItem[];
      
      queryClient.setQueryData(['cart'], cartItems);
      
      return { success: true };
    },
    onSuccess: () => {
      // Force invalidation to trigger re-renders
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['cartItems'] });
      
      toast({
        title: "Added to cart",
        description: "Item has been added to your cart",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add item to cart",
        variant: "destructive",
      });
    },
  });
};

// Remove item from cart - react-query cache only
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (cartItemId: string) => {
      const productId = cartItemId.startsWith('memory_') ? cartItemId.replace('memory_', '') : cartItemId;
      
      const currentCart = queryClient.getQueryData<MemoryCartItem[]>(['cartItems']) || [];
      const updatedCart = currentCart.filter(item => item.productId !== productId);
      
      // Update both cache keys immediately
      queryClient.setQueryData(['cartItems'], updatedCart);
      
      const cartItems = updatedCart.map(item => ({
        id: `memory_${item.productId}`,
        product_id: item.productId,
        quantity: item.quantity,
        created_at: item.addedAt,
        product: item.product
      })) as CartItem[];
      
      queryClient.setQueryData(['cart'], cartItems);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['cartItems'] });
      
      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive",
      });
    },
  });
};

// Update item quantity - react-query cache only
export const useUpdateQuantity = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ cartItemId, quantity }: { cartItemId: string; quantity: number }) => {
      const productId = cartItemId.startsWith('memory_') ? cartItemId.replace('memory_', '') : cartItemId;
      
      const currentCart = queryClient.getQueryData<MemoryCartItem[]>(['cartItems']) || [];
      
      let updatedCart: MemoryCartItem[];
      
      if (quantity <= 0) {
        updatedCart = currentCart.filter(item => item.productId !== productId);
      } else {
        updatedCart = currentCart.map(item => 
          item.productId === productId 
            ? { ...item, quantity }
            : item
        );
      }
      
      // Update both cache keys immediately
      queryClient.setQueryData(['cartItems'], updatedCart);
      
      const cartItems = updatedCart.map(item => ({
        id: `memory_${item.productId}`,
        product_id: item.productId,
        quantity: item.quantity,
        created_at: item.addedAt,
        product: item.product
      })) as CartItem[];
      
      queryClient.setQueryData(['cart'], cartItems);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['cartItems'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      });
    },
  });
};

// Clear entire cart - react-query cache only
export const useClearCart = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      queryClient.setQueryData(['cartItems'], []);
      queryClient.setQueryData(['cart'], []);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['cartItems'] });
      
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to clear cart",
        variant: "destructive",
      });
    },
  });
};

// Helper functions
export const calculateTotalPrice = (cartItems: CartItem[]) => {
  return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
};

export const calculateTotalItems = (cartItems: CartItem[]) => {
  return cartItems.reduce((total, item) => total + item.quantity, 0);
};