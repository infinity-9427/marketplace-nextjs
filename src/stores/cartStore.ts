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

      // Simulate network delay for better UX
      await new Promise(resolve => setTimeout(resolve, 100));

      const currentCart = queryClient.getQueryData<MemoryCartItem[]>(['cartItems']) || [];
      
      const existingItemIndex = currentCart.findIndex(item => item.productId === product.id);
      
      let updatedCart: MemoryCartItem[];
      let addedQuantity = quantity;
      let isNewItem = false;
      
      if (existingItemIndex >= 0) {
        // Update existing item
        updatedCart = currentCart.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        isNewItem = true;
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
      
      // Update cartItems cache
      queryClient.setQueryData(['cartItems'], updatedCart);
      
      // Update cart cache with proper format
      const cartItems = updatedCart.map(item => ({
        id: `memory_${item.productId}`,
        product_id: item.productId,
        quantity: item.quantity,
        created_at: item.addedAt,
        product: item.product
      })) as CartItem[];
      
      queryClient.setQueryData(['cart'], cartItems);
      
      return { success: true, addedQuantity, isNewItem };
    },
    onSuccess: (data) => {
      toast({
        title: "Added to cart",
        description: data.isNewItem 
          ? "Item has been added to your cart" 
          : `Quantity updated (+${data.addedQuantity})`,
      });
    },
    onError: (error) => {
      // Revert optimistic updates on error
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['cartItems'] });
      
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
      console.log('Remove operation started:', { cartItemId });
      
      // Extract product ID from cart item ID - handle both formats
      let productId: string;
      if (cartItemId.startsWith('memory_')) {
        productId = cartItemId.replace('memory_', '');
      } else {
        productId = cartItemId;
      }
      
      console.log('Extracted productId:', { productId, originalId: cartItemId });
      
      // Get current cart data from cache
      const currentCart = queryClient.getQueryData<MemoryCartItem[]>(['cartItems']) || [];
      
      console.log('Current cart items:', currentCart.map(item => ({ 
        productId: item.productId, 
        name: item.product.name 
      })));
      
      // Find the item to remove
      const itemToRemove = currentCart.find(item => item.productId === productId);
      
      if (!itemToRemove) {
        console.error('Remove operation failed - item not found:', { 
          cartItemId, 
          productId, 
          availableItems: currentCart.map(item => ({ id: item.productId, name: item.product.name }))
        });
        throw new Error(`Item not found in cart (ID: ${productId})`);
      }
      
      console.log('Item found for removal:', { 
        productId: itemToRemove.productId, 
        name: itemToRemove.product.name 
      });
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Remove the item from cart
      const updatedCart = currentCart.filter(item => item.productId !== productId);
      
      // Update cartItems cache
      queryClient.setQueryData(['cartItems'], updatedCart);
      
      // Update cart cache with proper format
      const cartItems = updatedCart.map(item => ({
        id: `memory_${item.productId}`,
        product_id: item.productId,
        quantity: item.quantity,
        created_at: item.addedAt,
        product: item.product
      })) as CartItem[];
      
      queryClient.setQueryData(['cart'], cartItems);
      
      return { 
        removedItem: itemToRemove,
        removedProductName: itemToRemove.product.name
      };
    },
    onSuccess: (data) => {
      toast({
        title: "Item removed",
        description: `${data.removedProductName} has been removed from your cart`,
      });
    },
    onError: (error) => {
      // Revert optimistic updates on error
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['cartItems'] });
      
      console.error('Remove from cart error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to remove item from cart",
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
      console.log('Update quantity operation started:', { cartItemId, quantity });
      
      // Extract product ID from cart item ID - handle both formats
      let productId: string;
      if (cartItemId.startsWith('memory_')) {
        productId = cartItemId.replace('memory_', '');
      } else {
        productId = cartItemId;
      }
      
      if (quantity < 0) {
        throw new Error('Quantity cannot be negative');
      }
      
      const currentCart = queryClient.getQueryData<MemoryCartItem[]>(['cartItems']) || [];
      const existingItem = currentCart.find(item => item.productId === productId);
      
      if (!existingItem) {
        console.error('Update quantity failed - item not found:', { 
          cartItemId, 
          productId, 
          availableItems: currentCart.map(item => ({ id: item.productId, name: item.product.name }))
        });
        throw new Error(`Item not found in cart (ID: ${productId})`);
      }
      
      console.log('Item found for quantity update:', { 
        productId: existingItem.productId, 
        name: existingItem.product.name,
        currentQuantity: existingItem.quantity,
        newQuantity: quantity
      });
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      let updatedCart: MemoryCartItem[];
      const previousQuantity = existingItem.quantity;
      
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        updatedCart = currentCart.filter(item => item.productId !== productId);
      } else {
        // Update quantity
        updatedCart = currentCart.map(item => 
          item.productId === productId 
            ? { ...item, quantity }
            : item
        );
      }
      
      // Update cartItems cache
      queryClient.setQueryData(['cartItems'], updatedCart);
      
      // Update cart cache with proper format
      const cartItems = updatedCart.map(item => ({
        id: `memory_${item.productId}`,
        product_id: item.productId,
        quantity: item.quantity,
        created_at: item.addedAt,
        product: item.product
      })) as CartItem[];
      
      queryClient.setQueryData(['cart'], cartItems);
      
      return { 
        previousQuantity, 
        newQuantity: quantity, 
        wasRemoved: quantity <= 0,
        productName: existingItem.product.name
      };
    },
    onSuccess: (data) => {
      if (data.wasRemoved) {
        toast({
          title: "Item removed",
          description: `${data.productName} has been removed from your cart`,
        });
      }
      // Don't show toast for regular quantity updates to avoid spam
    },
    onError: (error) => {
      // Revert optimistic updates on error
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['cartItems'] });
      
      console.error('Update quantity error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update quantity",
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
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Clear both caches
      queryClient.setQueryData(['cartItems'], []);
      queryClient.setQueryData(['cart'], []);
      
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart",
      });
    },
    onError: () => {
      // Revert on error
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['cartItems'] });
      
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