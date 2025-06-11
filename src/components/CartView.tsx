import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Minus, Plus, Trash2, ShoppingBag, CreditCard, ArrowLeft
} from "lucide-react";
import { useRouter } from "next/navigation";
import { 
  useCartQuery, 
  useRemoveFromCart, 
  useUpdateQuantity, 
  calculateTotalPrice, 
  calculateTotalItems 
} from "@/stores/cartStore";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import Image from "next/image";

const CartView = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { data: cartItems = [], isLoading } = useCartQuery();
  const removeFromCartMutation = useRemoveFromCart();
  const updateQuantityMutation = useUpdateQuantity();
  
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  
  const subtotal = calculateTotalPrice(cartItems);
  const shipping = subtotal > 100 ? 0 : 9.99; // Free shipping over $100
  const total = subtotal + shipping;

  const handleImageError = (itemId: string) => {
    setImageErrors(prev => ({ ...prev, [itemId]: true }));
  };

  const handleRemoveFromCart = (cartItemId: string) => {
    removeFromCartMutation.mutate(cartItemId, {
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to remove item from cart",
          variant: "destructive",
        });
      }
    });
  };

  const handleUpdateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity < 1) {
      handleRemoveFromCart(cartItemId);
      return;
    }
    
    updateQuantityMutation.mutate({ cartItemId, quantity }, {
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to update quantity",
          variant: "destructive",
        });
      }
    });
  };

  const handleDecreaseQuantity = (cartItemId: string, currentQuantity: number) => {
    handleUpdateQuantity(cartItemId, currentQuantity - 1);
  };

  const handleIncreaseQuantity = (cartItemId: string, currentQuantity: number) => {
    handleUpdateQuantity(cartItemId, currentQuantity + 1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <ShoppingBag className="h-12 w-12 text-purple-500 animate-pulse mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900">Loading your cart...</h3>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Card className="text-center py-12">
            <CardContent>
              <ShoppingBag className="h-20 w-20 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Your cart is empty</h3>
              <p className="text-gray-600 mb-6">
                Discover amazing products and add them to your cart!
              </p>
              <Button 
                onClick={() => router.push('/')} 
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3"
                size="lg"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/')}
            className="mb-4 text-purple-600 hover:text-purple-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Shopping Cart ({calculateTotalItems(cartItems)} {calculateTotalItems(cartItems) === 1 ? 'item' : 'items'})
          </h1>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <Card className="shadow-sm">
              <CardContent className="p-0">
                {cartItems.map((item, index) => (
                  <div 
                    key={item.id}
                    className={`p-4 sm:p-6 ${index !== cartItems.length - 1 ? 'border-b' : ''}`}
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-full sm:w-24 h-24">
                        <Link href={`/product/${item.product.id}`} className="block relative w-full h-full rounded-lg overflow-hidden group">
                          <Image
                            src={imageErrors[item.id] || !item.product.image ? 
                              "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop" : 
                              item.product.image}
                            alt={item.product.name}
                            fill
                            sizes="(max-width: 640px) 100vw, 96px"
                            className="object-cover group-hover:scale-105 transition-transform duration-200"
                            onError={() => handleImageError(item.id)}
                          />
                        </Link>
                      </div>
                      
                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <div className="flex-1">
                            <Link href={`/product/${item.product.id}`} className="hover:text-purple-600">
                              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{item.product.name}</h3>
                            </Link>
                            {item.product.category && (
                              <p className="text-sm text-gray-500 mt-1 capitalize">{item.product.category}</p>
                            )}
                            <div className="flex items-center mt-2">
                              <span className="text-lg font-bold text-purple-600">${item.product.price}</span>
                              {item.product.originalPrice && (
                                <>
                                  <span className="text-sm text-gray-500 line-through ml-2">${item.product.originalPrice}</span>
                                  <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded ml-2">
                                    {Math.round((1 - item.product.price / item.product.originalPrice) * 100)}% OFF
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          
                          {/* Desktop: Quantity and Total */}
                          <div className="hidden sm:flex sm:flex-col sm:items-end sm:justify-between sm:ml-4">
                            <div className="flex items-center border rounded-lg">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 rounded-r-none"
                                onClick={() => handleDecreaseQuantity(item.id, item.quantity)}
                                disabled={updateQuantityMutation.isPending}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-12 text-center text-sm font-medium">{item.quantity}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 rounded-l-none"
                                onClick={() => handleIncreaseQuantity(item.id, item.quantity)}
                                disabled={updateQuantityMutation.isPending}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <p className="text-lg font-semibold text-gray-900 mt-2">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                        
                        {/* Mobile: Quantity and Actions */}
                        <div className="flex items-center justify-between mt-4 sm:hidden">
                          <div className="flex items-center border rounded-lg">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 rounded-r-none"
                              onClick={() => handleDecreaseQuantity(item.id, item.quantity)}
                              disabled={updateQuantityMutation.isPending}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-12 text-center text-sm font-medium">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 rounded-l-none"
                              onClick={() => handleIncreaseQuantity(item.id, item.quantity)}
                              disabled={updateQuantityMutation.isPending}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-lg font-semibold text-gray-900">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        
                        {/* Remove Button */}
                        <div className="flex justify-end mt-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFromCart(item.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            disabled={removeFromCartMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="sticky top-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    {shipping > 0 ? (
                      <span className="font-medium">${shipping.toFixed(2)}</span>
                    ) : (
                      <span className="font-medium text-green-600">Free</span>
                    )}
                  </div>
                  
                  {subtotal < 100 && shipping > 0 && (
                    <div className="text-sm text-purple-600 bg-purple-50 p-3 rounded-lg">
                      Add ${(100 - subtotal).toFixed(2)} more for free shipping!
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-purple-600">${total.toFixed(2)}</span>
                  </div>
                  
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700 py-6 text-lg font-medium"
                    size="lg"
                    onClick={() => router.push('/checkout')}
                  >
                    <CreditCard className="mr-2 h-5 w-5" />
                    Proceed to Checkout
                  </Button>
                  
                  <div className="text-center text-sm text-gray-500 mt-4">
                    Secure checkout with SSL encryption
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartView;
