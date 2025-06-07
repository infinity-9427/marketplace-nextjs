import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, X, Star, StarHalf, Heart, Share2, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "./ProductCard";
import { cn } from "@/lib/utils";

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

const ProductModal = ({ product, isOpen, onClose, onAddToCart }: ProductModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  if (!product) return null;

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Mock multiple images for gallery (you can replace with actual product images)
  const productImages = [product.image, product.image, product.image];

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    onClose();
    setQuantity(1);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalf key="half" className="w-4 h-4 fill-amber-400 text-amber-400" />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      );
    }

    return stars;
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[100vw] sm:max-w-[90vw] md:max-w-4xl lg:max-w-5xl xl:max-w-6xl w-full max-h-[100vh] sm:max-h-[90vh] p-0 overflow-hidden bg-white m-0 sm:m-4 rounded-none sm:rounded-xl shadow-2xl border-0 sm:border">
        
        {/* Enhanced Mobile/Desktop Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4">
          {/* First Row: Category + Title + Close Button */}
          <div className="flex items-start justify-between gap-2 sm:gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-1 min-w-0 overflow-hidden">
              <Badge 
                variant="outline" 
                className="text-xs font-medium text-purple-600 border-purple-200 bg-purple-50 px-2 py-1 whitespace-nowrap flex-shrink-0 w-fit"
              >
                {product.category}
              </Badge>
              <DialogTitle className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900 leading-tight break-words line-clamp-2 sm:line-clamp-1 overflow-hidden">
                {product.name}
              </DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 p-0 hover:bg-gray-100 rounded-full ml-2"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
          
          {/* Second Row: Rating and Stock - Better Mobile Layout */}
          <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 mt-3 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm min-w-0 overflow-hidden">
              <div className="flex items-center gap-1 flex-shrink-0">
                {renderStars(product.rating)}
              </div>
              <span className="font-semibold text-gray-700 flex-shrink-0">{product.rating}</span>
              <span className="text-gray-500 truncate">({product.reviews || 0} reviews)</span>
            </div>
            <div className={cn(
              "flex items-center gap-2 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium w-fit flex-shrink-0",
              product.inStock 
                ? "text-emerald-700 bg-emerald-100" 
                : "text-red-700 bg-red-100"
            )}>
              <div className={cn(
                "w-2 h-2 rounded-full flex-shrink-0",
                product.inStock ? "bg-emerald-500" : "bg-red-500"
              )} />
              <span className="whitespace-nowrap">
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col lg:grid lg:grid-cols-3 min-h-0">
            
            {/* Image Gallery Section */}
            <div className="lg:col-span-2 p-3 sm:p-4 md:p-6">
              <div className="space-y-3 sm:space-y-4">
                {/* Main Image */}
                <div className="relative group">
                  <div className="aspect-square w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden shadow-sm">
                    <img
                      src={productImages[selectedImageIndex]}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Discount Badge */}
                    {discountPercentage > 0 && (
                      <Badge className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold px-2 sm:px-3 py-1 sm:py-2 shadow-lg border-0 text-xs sm:text-sm">
                        -{discountPercentage}% OFF
                      </Badge>
                    )}

                    {/* Image Navigation */}
                    {productImages.length > 1 && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={prevImage}
                          className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-10 sm:w-10 p-0 bg-white/80 hover:bg-white rounded-full shadow-md opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                        >
                          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={nextImage}
                          className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-10 sm:w-10 p-0 bg-white/80 hover:bg-white rounded-full shadow-md opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                        >
                          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Thumbnail Gallery */}
                {productImages.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {productImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={cn(
                          "flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all",
                          selectedImageIndex === index 
                            ? "border-purple-500 ring-1 ring-purple-200" 
                            : "border-gray-200 hover:border-gray-300"
                        )}
                      >
                        <img
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Product Details Section */}
            <div className="lg:col-span-1 p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 bg-gray-50/50 lg:bg-transparent">
              
              {/* Price Section */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 sm:p-6 border border-purple-100">
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="flex flex-col">
                      <span className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
                        ${product.price}
                      </span>
                      {product.originalPrice && (
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
                          <span className="text-base sm:text-lg text-gray-400 line-through">
                            ${product.originalPrice}
                          </span>
                          <span className="text-xs sm:text-sm text-emerald-600 font-semibold">
                            Save ${(product.originalPrice - product.price).toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  {discountPercentage > 0 && (
                    <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold px-2 sm:px-3 py-1 w-fit border-0 text-xs sm:text-sm">
                      {discountPercentage}% OFF
                    </Badge>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2 sm:space-y-3">
                <h4 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">About This Product</h4>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
              
              {/* Key Features */}
              <div className="space-y-3 sm:space-y-4">
                <h4 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">Key Features</h4>
                <div className="space-y-2">
                  {product.features?.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-purple-200 hover:bg-purple-50/30 transition-all">
                      <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-gray-800 font-medium break-words">{feature}</span>
                    </div>
                  )) || (
                    <p className="text-sm text-gray-500 italic">No features listed</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Bottom Purchase Section */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-3 sm:p-4 md:p-6 shadow-lg">
          <div className="space-y-3 sm:space-y-4">
            
            {/* Quantity Selector */}
            <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3">
              <h5 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 flex-shrink-0">Quantity:</h5>
              <div className="flex items-center justify-between xs:justify-end gap-3">
                <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-10 sm:h-12 w-10 sm:w-12 p-0 hover:bg-purple-100 rounded-none border-0"
                    disabled={quantity <= 1 || !product.inStock}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="px-3 sm:px-4 py-2 sm:py-3 min-w-[2.5rem] sm:min-w-[3rem] text-center font-bold text-sm sm:text-base lg:text-lg bg-white border-x border-gray-200">
                    {quantity}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    className="h-10 sm:h-12 w-10 sm:w-12 p-0 hover:bg-purple-100 rounded-none border-0"
                    disabled={quantity >= 10 || !product.inStock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap flex-shrink-0">Max 10</span>
              </div>
            </div>

            {/* Total Price Display */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-3 sm:p-4 text-white shadow-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm sm:text-base lg:text-lg font-semibold">Total Price:</span>
                <span className="text-lg sm:text-xl lg:text-2xl font-bold">
                  ${(product.price * quantity).toFixed(2)}
                </span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-2 sm:space-y-3">
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-300 font-bold py-3 sm:py-4 shadow-lg hover:shadow-xl rounded-lg border-0 text-sm sm:text-base"
              >
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                <span className="truncate">
                  {product.inStock 
                    ? `Add ${quantity} ${quantity === 1 ? 'Item' : 'Items'} to Cart`
                    : 'Currently Out of Stock'
                  }
                </span>
              </Button>
              
              {product.inStock && (
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={cn(
                      "flex-1 hover:bg-purple-50 hover:border-purple-300 py-2 sm:py-3 text-sm sm:text-base font-semibold rounded-lg border-2 transition-all min-w-0",
                      isWishlisted && "bg-purple-50 border-purple-300 text-purple-700"
                    )}
                  >
                    <Heart className={cn(
                      "w-4 h-4 mr-1 sm:mr-2 flex-shrink-0",
                      isWishlisted && "fill-purple-600 text-purple-600"
                    )} />
                    <span className="hidden sm:inline truncate">
                      {isWishlisted ? 'Wishlisted' : 'Wishlist'}
                    </span>
                    <span className="sm:hidden">♥</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 hover:bg-purple-50 hover:border-purple-300 py-2 sm:py-3 text-sm sm:text-base font-semibold rounded-lg border-2 transition-all min-w-0"
                  >
                    <Share2 className="w-4 h-4 mr-1 sm:mr-2 flex-shrink-0" />
                    <span className="hidden sm:inline truncate">Share</span>
                    <span className="sm:hidden">📤</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
