import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  Minus, Plus, Trash2, ShoppingBag, CreditCard, 
  Clock, Truck, BadgePercent, AlertCircle 
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
  
  const [promoCode, setPromoCode] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  
  const subtotal = calculateTotalPrice(cartItems);
  const tax = subtotal * 0.08; // Assuming 8% tax
  const shipping = subtotal > 100 ? 0 : 9.99; // Free shipping over $100
  const total = subtotal + tax + shipping;

  const handleImageError = (itemId: string) => {
    setImageErrors(prev => ({ ...prev, [itemId]: true }));
  };

  const handleRemoveFromCart = (cartItemId: string) => {
    removeFromCartMutation.mutate(cartItemId, {
      onSuccess: () => {
        toast({
          title: "Item removed",
          description: "The item has been removed from your cart",
        });
      }
    });
  };

  const handleUpdateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity < 1) return;
    updateQuantityMutation.mutate({ cartItemId, quantity });
  };

  const handleApplyPromoCode = () => {
    setIsApplyingPromo(true);
    setTimeout(() => {
      setIsApplyingPromo(false);
      toast({
        title: "Invalid promo code",
        description: "The promo code you entered is invalid or expired",
        variant: "destructive",
      });
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <ShoppingBag className="h-12 w-12 text-purple-500 animate-pulse" />
              <h3 className="text-xl font-semibold text-gray-900">Loading your cart...</h3>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 p-4">
        <div className="max-w-6xl mx-auto">
          <Card className="text-center py-12 shadow-lg border-0">
            <CardContent>
              <div className="flex flex-col items-center">
                <ShoppingBag className="h-20 w-20 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">Your cart is empty</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Looks like you haven't added anything to your cart yet. 
                  Explore our products and find something you'll love!
                </p>
                <Button 
                  onClick={() => router.push('/')} 
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 rounded-lg text-lg"
                  size="lg"
                >
                  Start Shopping
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left side - Cart items */}
          <div className="lg:w-2/3">
            <Card className="border-0 shadow-lg mb-6">
              <CardHeader className="border-b bg-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    Your Cart ({calculateTotalItems(cartItems)} items)
                  </CardTitle>
                  <Button variant="ghost" onClick={() => router.push('/')}>
                    Continue Shopping
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {cartItems.map((item) => (
                  <div 
                    key={item.id}
                    className="p-4 border-b"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      {/* Product Image - Improved with Next/Image */}
                      <Link href={`/product/${item.product.id}`} className="block relative w-full sm:w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg group">
                        <div className="relative w-full h-full aspect-square overflow-hidden">
                          <Image
                            src={imageErrors[item.id] || !item.product.image ? 
                              "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop" : 
                              item.product.image}
                            alt={item.product.name}
                            fill
                            sizes="(max-width: 640px) 100vw, 96px"
                            className="object-cover transition-all duration-300 group-hover:scale-105"
                            onError={() => handleImageError(item.id)}
                            loading="lazy"
                            style={{ objectPosition: 'center' }}
                          />
                        </div>
                      </Link>
                      
                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <Link href={`/product/${item.product.id}`} className="hover:text-purple-700">
                          <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{item.product.name}</h3>
                        </Link>
                        <div className="flex items-center text-sm text-gray-500 mt-1 space-x-3">
                          {item.product.category && (
                            <span className="capitalize">{item.product.category}</span>
                          )}
                          {item.product.size && (
                            <>
                              <span>•</span>
                              <span>Size: {item.product.size}</span>
                            </>
                          )}
                          {item.product.color && (
                            <>
                              <span>•</span>
                              <span>Color: {item.product.color}</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-lg font-bold text-purple-600">${item.product.price}</span>
                          {item.product.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">${item.product.originalPrice}</span>
                          )}
                          {item.product.originalPrice && (
                            <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                              {Math.round((1 - item.product.price / item.product.originalPrice) * 100)}% OFF
                            </span>
                          )}
                        </div>

                        {/* Estimated delivery */}
                        <div className="flex items-center mt-2 text-xs text-gray-600">
                          <Truck className="h-3 w-3 mr-1" />
                          <span>Free delivery by Tuesday, Jun 18</span>
                        </div>

                        {/* Mobile quantity controls */}
                        <div className="mt-3 flex items-center justify-between sm:hidden">
                          <div className="flex items-center border rounded-md overflow-hidden">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 rounded-none"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              disabled={updateQuantityMutation.isPending || item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 rounded-none"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              disabled={updateQuantityMutation.isPending}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <span className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                      
                      {/* Quantity & Pricing - Desktop */}
                      <div className="hidden sm:flex items-center space-x-2">
                        <div className="flex items-center border rounded-md overflow-hidden">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 rounded-none"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={updateQuantityMutation.isPending || item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 rounded-none"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            disabled={updateQuantityMutation.isPending}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Item Total - Desktop */}
                      <div className="hidden sm:block text-right">
                        <p className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                    
                    {/* Item Actions */}
                    <div className="flex justify-end mt-3 gap-2 text-sm">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFromCart(item.id)}
                        className="text-red-600 hover:text-red-700"
                        disabled={removeFromCartMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          
          {/* Right side - Order Summary */}
          <div className="lg:w-1/3">
            <div className="sticky top-4">
              <Card className="border-0 shadow-lg mb-4">
                <CardHeader className="border-b">
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({calculateTotalItems(cartItems)} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    {shipping > 0 ? 
                      <span>${shipping.toFixed(2)}</span> : 
                      <span className="text-green-600 font-medium">Free</span>
                    }
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Estimated Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  
                  {/* Promo code input */}
                  <div className="pt-2">
                    <p className="text-sm font-medium mb-2">Promo Code</p>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <BadgePercent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input 
                          placeholder="Enter code" 
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <Button 
                        onClick={handleApplyPromoCode} 
                        disabled={!promoCode || isApplyingPromo}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        {isApplyingPromo ? "Applying..." : "Apply"}
                      </Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-xl font-bold text-purple-600">${total.toFixed(2)}</span>
                  </div>
                  
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700 py-6 text-lg"
                    size="lg"
                    onClick={() => router.push('/checkout')}
                  >
                    <CreditCard className="mr-2 h-5 w-5" /> Checkout
                  </Button>
                  
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mt-4">
                    <Clock className="h-4 w-4" />
                    <span>Estimated delivery: 2-4 business days</span>
                  </div>
                  
                  <div className="bg-purple-50 p-3 rounded-lg border border-purple-100 text-sm">
                    <p className="font-medium text-purple-800 mb-1">Secure Checkout</p>
                    <p className="text-purple-700 text-xs">
                      We use industry-standard encryption to protect your personal information
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex gap-3 items-center">
                      <Truck className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="font-medium text-sm">Free Shipping</p>
                        <p className="text-xs text-gray-600">On orders over $100</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex gap-3 items-center">
                      <AlertCircle className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="font-medium text-sm">Need Help?</p>
                        <p className="text-xs text-gray-600">
                          <a href="#" className="text-purple-600 hover:underline">Contact us</a> or call (800) 123-4567
                        </p>
                      </div>
                    </div>
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
