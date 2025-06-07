
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/components/ProductCard';
import { useToast } from '@/hooks/use-toast';

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCartItems = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setCartItems([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          quantity,
          products (*)
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching cart items:', error);
        return;
      }

      const transformedItems: CartItem[] = data?.map((item: any) => ({
        id: item.id,
        quantity: item.quantity,
        product: {
          id: item.products.id,
          name: item.products.name,
          price: parseFloat(item.products.price),
          originalPrice: item.products.original_price ? parseFloat(item.products.original_price) : undefined,
          image: item.products.image || '',
          category: item.products.category,
          rating: parseFloat(item.products.rating || '0'),
          reviews: item.products.reviews || 0,
          description: item.products.description || '',
          features: item.products.features || [],
          inStock: item.products.in_stock
        }
      })) || [];

      setCartItems(transformedItems);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product: Product, quantity: number = 1) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to add items to cart.",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('cart_items')
        .upsert({
          user_id: user.id,
          product_id: product.id,
          quantity: quantity
        }, {
          onConflict: 'user_id,product_id'
        });

      if (error) {
        console.error('Error adding to cart:', error);
        toast({
          title: "Error",
          description: "Failed to add item to cart.",
          variant: "destructive"
        });
        return;
      }

      await fetchCartItems();
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId);

      if (error) {
        console.error('Error removing from cart:', error);
        return;
      }

      await fetchCartItems();
      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart.",
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(cartItemId);
      return;
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', cartItemId);

      if (error) {
        console.error('Error updating quantity:', error);
        return;
      }

      await fetchCartItems();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const clearCart = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error clearing cart:', error);
        return;
      }

      setCartItems([]);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  return {
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    fetchCartItems
  };
};
