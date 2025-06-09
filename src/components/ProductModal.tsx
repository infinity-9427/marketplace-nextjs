import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Minus, 
  Plus, 
  X, 
  ShoppingCart, 
  Star,
  CheckCircle,
  Truck,
  Shield,
  RotateCcw,
  Info
} from "lucide-react";
import { Product } from "./ProductCard";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

const ProductModal = ({ product, isOpen, onClose, onAddToCart }: ProductModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("overview");

  if (!product) return null;

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Parse features - handle both string (CSV format) and array formats
  const parseFeatures = (features: string[] | string | undefined): string[] => {
    if (!features) return [];
    if (Array.isArray(features)) return features;
    if (typeof features === 'string') {
      return features.split('|').filter(Boolean).map(f => f.trim());
    }
    return [];
  };

  // Parse tags - handle both string (CSV format) and array formats
  const parseTags = (tags: string[] | string | undefined): string[] => {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags;
    if (typeof tags === 'string') {
      return tags.split('|').filter(Boolean).map(t => t.trim());
    }
    return [];
  };

  const featuresArray = parseFeatures(product.features);
  const tagsArray = parseTags(product.tags);

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    onClose();
    setQuantity(1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[100vw] max-h-[100vh] w-full h-full md:max-w-[85vw] md:max-h-[85vh] lg:max-w-4xl xl:max-w-5xl md:w-auto md:h-auto p-0 overflow-hidden bg-white m-0 md:m-4 rounded-none md:rounded-lg shadow-xl border-0 md:border">
        
        {/* Compact Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-3 sm:px-4 lg:px-3 py-2 lg:py-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 lg:gap-1">
                <Badge 
                  variant="outline" 
                  className="text-xs lg:text-[10px] text-purple-600 border-purple-200 bg-purple-50 px-2 py-0.5 lg:px-1.5 lg:py-0.5"
                >
                  {product.category}
                </Badge>
                {product.subcategory && (
                  <Badge 
                    variant="outline" 
                    className="text-xs lg:text-[10px] text-blue-600 border-blue-200 bg-blue-50 px-2 py-0.5 lg:px-1.5 lg:py-0.5"
                  >
                    {product.subcategory}
                  </Badge>
                )}
              </div>
              <DialogTitle className="text-sm sm:text-base lg:text-sm xl:text-base font-semibold text-gray-900 leading-tight line-clamp-2">
                {product.name}
              </DialogTitle>
              {product.brand && (
                <div className="flex items-center gap-1">
                  <span className="text-xs lg:text-[10px] text-gray-500">by</span>
                  <span className="text-xs lg:text-[10px] font-medium text-gray-700 bg-gray-100 px-2 py-0.5 lg:px-1.5 lg:py-0.5 rounded">
                    {product.brand}
                  </span>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="flex-shrink-0 h-7 w-7 lg:h-6 lg:w-6 p-0 hover:bg-gray-100 rounded-full"
            >
              <X className="h-4 w-4 lg:h-3 lg:w-3" />
            </Button>
          </div>
        </div>
        
        {/* Main Content with proper scrolling */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col lg:grid lg:grid-cols-12 min-h-0">
            
            {/* Image Section - Enhanced height for better visibility */}
            <div className="lg:col-span-8 relative">
              {/* Main Image with enhanced height */}
              <div className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[65vh] xl:h-[70vh] w-full">
                <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-4">
                  <Image
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain max-w-full max-h-full"
                    height={500}
                    width={500}
                  />
                  
                  {/* Compact Discount Badge */}
                  {discountPercentage > 0 && (
                    <div className="absolute top-3 sm:top-4 lg:top-2 left-3 sm:left-4 lg:left-2">
                      <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold px-2.5 sm:px-3 lg:px-2 py-1 sm:py-1.5 lg:py-0.5 shadow-lg border-0 text-xs sm:text-sm lg:text-[10px]">
                        -{discountPercentage}%
                      </Badge>
                    </div>
                  )}

                  {/* Compact Stock Status */}
                  <div className="absolute top-3 sm:top-4 lg:top-2 right-3 sm:right-4 lg:right-2">
                    <Badge 
                      className={cn(
                        "font-medium px-2.5 sm:px-3 lg:px-2 py-1 sm:py-1.5 lg:py-0.5 shadow-md border-0 text-xs sm:text-sm lg:text-[10px]",
                        product.inStock 
                          ? "bg-green-500 text-white" 
                          : "bg-red-500 text-white"
                      )}
                    >
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 lg:w-2.5 lg:h-2.5 mr-1 sm:mr-1.5 lg:mr-1" />
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Trust Badges - More compact for desktop */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-1 p-3 sm:p-4 lg:p-2 bg-gray-50/50">
                <div className="flex flex-col items-center text-center p-2 sm:p-3 lg:p-1.5 bg-green-50 rounded-lg border border-green-200 shadow-sm">
                  <Truck className="w-4 h-4 sm:w-5 sm:h-5 lg:w-3 lg:h-3 text-green-600 mb-1 sm:mb-2 lg:mb-0.5" />
                  <span className="text-xs sm:text-sm lg:text-[9px] font-medium text-green-700">Free Ship</span>
                </div>
                <div className="flex flex-col items-center text-center p-2 sm:p-3 lg:p-1.5 bg-blue-50 rounded-lg border border-blue-200 shadow-sm">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 lg:w-3 lg:h-3 text-blue-600 mb-1 sm:mb-2 lg:mb-0.5" />
                  <span className="text-xs sm:text-sm lg:text-[9px] font-medium text-blue-700">Warranty</span>
                </div>
                <div className="flex flex-col items-center text-center p-2 sm:p-3 lg:p-1.5 bg-orange-50 rounded-lg border border-orange-200 shadow-sm">
                  <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 lg:w-3 lg:h-3 text-orange-600 mb-1 sm:mb-2 lg:mb-0.5" />
                  <span className="text-xs sm:text-sm lg:text-[9px] font-medium text-orange-700">Returns</span>
                </div>
              </div>
            </div>
            
            {/* Product Details Section - More compact for desktop */}
            <div className="lg:col-span-4 p-3 sm:p-4 lg:p-2 space-y-4 sm:space-y-6 lg:space-y-2 bg-white">
              
              {/* Compact Price Section */}
              <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl p-4 sm:p-6 lg:p-2 text-white shadow-lg">
                <div className="space-y-2 sm:space-y-3 lg:space-y-1">
                  <div className="flex items-baseline gap-2 sm:gap-3 lg:gap-1.5">
                    <span className="text-2xl sm:text-3xl lg:text-lg xl:text-xl font-bold">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-base sm:text-lg lg:text-xs text-purple-200 line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                  {discountPercentage > 0 && (
                    <div className="flex items-center gap-2">
                      <Badge className="bg-white text-purple-600 font-bold px-2.5 sm:px-3 lg:px-1.5 py-1 sm:py-1.5 lg:py-0.5 text-xs sm:text-sm lg:text-[9px]">
                        Save ${(product.originalPrice! - product.price).toFixed(2)}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              {/* Enhanced Tabs Section */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 lg:space-y-2">
                <TabsList className="grid w-full grid-cols-3 bg-gray-100 rounded-lg p-1 lg:p-0.5">
                  <TabsTrigger value="overview" className="rounded-md text-xs sm:text-sm lg:text-[9px] font-medium py-2 sm:py-2.5 lg:py-1">Info</TabsTrigger>
                  <TabsTrigger value="specs" className="rounded-md text-xs sm:text-sm lg:text-[9px] font-medium py-2 sm:py-2.5 lg:py-1">Specs</TabsTrigger>
                  <TabsTrigger value="features" className="rounded-md text-xs sm:text-sm lg:text-[9px] font-medium py-2 sm:py-2.5 lg:py-1">Features</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4 lg:space-y-1.5 mt-4 lg:mt-1.5">
                  <div className="bg-white rounded-lg p-4 sm:p-6 lg:p-2 border border-gray-200 shadow-sm">
                    <h4 className="text-base sm:text-lg lg:text-xs font-semibold text-gray-900 mb-3 sm:mb-4 lg:mb-1.5 flex items-center gap-2 lg:gap-1">
                      <Info className="w-4 h-4 sm:w-5 sm:h-5 lg:w-2.5 lg:h-2.5 text-purple-600" />
                      About This Product
                    </h4>
                    <div className="max-h-32 sm:max-h-40 lg:max-h-24 xl:max-h-28 overflow-y-auto">
                      <p className="text-xs sm:text-sm lg:text-[10px] xl:text-[11px] text-gray-700 leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  {/* Enhanced Tags */}
                  {tagsArray?.length > 0 && (
                    <div className="bg-white rounded-lg p-4 sm:p-6 lg:p-2 border border-gray-200 shadow-sm">
                      <h5 className="text-sm sm:text-base lg:text-[10px] font-semibold text-gray-900 mb-3 sm:mb-4 lg:mb-1.5">Tags</h5>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 lg:gap-0.5">
                        {tagsArray.slice(0, 6).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs sm:text-sm lg:text-[9px] bg-purple-50 border-purple-200 text-purple-700 px-2 sm:px-3 lg:px-1 py-1 sm:py-1.5 lg:py-0.5">
                            #{tag}
                          </Badge>
                        ))}
                        {tagsArray.length > 6 && (
                          <Badge variant="outline" className="text-xs sm:text-sm lg:text-[9px] bg-gray-50 border-gray-200 text-gray-500 px-2 sm:px-3 lg:px-1 py-1 sm:py-1.5 lg:py-0.5">
                            +{tagsArray.length - 6} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="specs" className="space-y-4 lg:space-y-1.5 mt-4 lg:mt-1.5">
                  {product.specifications && Object.keys(product.specifications).length > 0 ? (
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                      <div className="max-h-64 sm:max-h-80 lg:max-h-44 xl:max-h-52 overflow-y-auto">
                        {Object.entries(product.specifications).map(([key, value], index) => (
                          <div key={key} className={cn(
                            "flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 sm:p-4 lg:p-1.5 border-b border-gray-100 last:border-b-0 gap-1 sm:gap-2 lg:gap-0.5",
                            index % 2 === 0 ? "bg-gray-50/50" : "bg-white"
                          )}>
                            <span className="text-xs sm:text-sm lg:text-[9px] xl:text-[10px] text-gray-600 font-semibold capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <span className="text-xs sm:text-sm lg:text-[9px] xl:text-[10px] text-gray-900 font-medium sm:text-right">
                              {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : 
                               Array.isArray(value) ? value.join(', ') : String(value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg p-6 sm:p-8 lg:p-3 border border-gray-200 text-center shadow-sm">
                      <p className="text-xs sm:text-sm lg:text-[9px] text-gray-500">No specifications available</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="features" className="mt-4 lg:mt-1.5">
                  {featuresArray?.length > 0 ? (
                    <div className="space-y-2 sm:space-y-3 lg:space-y-1 max-h-64 sm:max-h-80 lg:max-h-44 xl:max-h-52 overflow-y-auto">
                      {featuresArray.map((feature, index) => (
                        <div key={index} className="flex items-start gap-2 sm:gap-3 lg:gap-1.5 p-3 sm:p-4 lg:p-1.5 bg-white rounded-lg border border-gray-200 hover:border-purple-200 hover:bg-purple-50/30 transition-all shadow-sm">
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-2.5 lg:h-2.5 text-green-500 mt-0.5 lg:mt-0 flex-shrink-0" />
                          <span className="text-xs sm:text-sm lg:text-[9px] xl:text-[10px] text-gray-800 font-medium leading-relaxed">{feature}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg p-6 sm:p-8 lg:p-3 border border-gray-200 text-center shadow-sm">
                      <p className="text-xs sm:text-sm lg:text-[9px] text-gray-500">No features listed</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Enhanced Sticky Bottom Purchase Section */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 p-3 sm:p-4 lg:p-1.5 shadow-lg">
          <div className="space-y-3 sm:space-y-4 lg:space-y-1.5">
            
            {/* Quantity and Total Layout */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 lg:gap-2">
              {/* Enhanced Quantity Selector */}
              <div className="flex items-center gap-2 sm:gap-3 lg:gap-1.5">
                <span className="text-xs sm:text-sm lg:text-[9px] font-semibold text-gray-900">Quantity:</span>
                <div className="flex items-center bg-gray-100 rounded-lg border border-gray-200 overflow-hidden">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-8 w-8 sm:h-10 sm:w-10 lg:h-6 lg:w-6 p-0 hover:bg-purple-100 rounded-none border-0"
                    disabled={quantity <= 1 || !product.inStock}
                  >
                    <Minus className="h-3 w-3 sm:h-4 sm:w-4 lg:h-2 lg:w-2" />
                  </Button>
                  <div className="px-3 sm:px-4 lg:px-1.5 py-1.5 sm:py-2 lg:py-0.5 min-w-[2.5rem] sm:min-w-[3rem] lg:min-w-[1.5rem] text-center font-bold text-sm sm:text-base lg:text-[10px] bg-white border-x border-gray-200">
                    {quantity}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    className="h-8 w-8 sm:h-10 sm:w-10 lg:h-6 lg:w-6 p-0 hover:bg-purple-100 rounded-none border-0"
                    disabled={quantity >= 10 || !product.inStock}
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4 lg:h-2 lg:w-2" />
                  </Button>
                </div>
              </div>

              {/* Enhanced Total Price Display */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg p-2.5 sm:p-3 lg:p-1.5 text-white shadow-md">
                <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-1">
                  <span className="text-xs sm:text-sm lg:text-[9px] font-semibold">Total:</span>
                  <span className="text-lg sm:text-xl lg:text-sm font-bold">
                    ${(product.price * quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Enhanced Action Button */}
            <Button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-300 font-semibold py-3 sm:py-4 lg:py-1.5 shadow-lg hover:shadow-xl rounded-lg border-0 text-sm sm:text-base lg:text-[10px]"
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 lg:w-2.5 lg:h-2.5 mr-2 lg:mr-1" />
              {product.inStock 
                ? `Add ${quantity} ${quantity === 1 ? 'Item' : 'Items'} to Cart`
                : 'Currently Out of Stock'
              }
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;