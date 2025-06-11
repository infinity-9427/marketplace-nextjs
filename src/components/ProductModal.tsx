import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "./ProductCard";
import Image from "next/image";
import { X } from "lucide-react";

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

const ProductModal = ({ product, isOpen, onClose, onAddToCart }: ProductModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);

  if (!product) return null;

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
    
  // Parse features from pipe-separated string if needed
  const parsedFeatures = Array.isArray(product.features) 
    ? product.features 
    : typeof product.features === 'string' 
      ? product.features.split('|') 
      : [];
      
  // Parse tags if provided as string
  const parsedTags = product.tags 
    ? (typeof product.tags === 'string' ? product.tags.split('|') : product.tags) 
    : [];
    
  const defaultImage = "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=300&fit=crop&crop=center";

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 sm:p-6">
        <DialogHeader className="p-4 sm:p-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl sm:text-2xl font-bold line-clamp-2">{product.name}</DialogTitle>

          </div>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 sm:p-0">
          {/* Product Image Section */}
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden aspect-[4/3]">
              <Image
                src={imageError || !product.image ? defaultImage : product.image}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-cover"
                onError={handleImageError}
                priority
              />
              {discountPercentage > 0 && (
                <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2">
                  -{discountPercentage}% OFF
                </Badge>
              )}
            </div>
            
            {/* Tags Section (Mobile: below image, Desktop: in right column) */}
            <div className="md:hidden">
              {parsedTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {parsedTags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Product Details Section */}
          <div className="space-y-6">
            {/* Category & Brand */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                {product.category}
              </Badge>
              {product.subcategory && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {product.subcategory}
                </Badge>
              )}
              {product.brand && (
                <span className="text-sm text-gray-600 font-medium">
                  by <span className="text-gray-900">{product.brand}</span>
                </span>
              )}
            </div>
            
            {/* Description */}
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed">{product.description}</p>
            
            {/* Price Section */}
            <div className="flex items-center space-x-3">
              <span className="text-2xl sm:text-3xl font-bold text-purple-600">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-lg sm:text-xl text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
              )}
              {discountPercentage > 0 && (
                <Badge className="bg-green-100 text-green-800 border-0">
                  You save ${(product.originalPrice! - product.price).toFixed(2)}
                </Badge>
              )}
            </div>
            
            {/* Stock Status */}
            <div className="flex items-center">
              {product.inStock ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  In Stock
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  Out of Stock
                </Badge>
              )}
            </div>
            
            {/* Tags (Desktop only) */}
            <div className="hidden md:block">
              {parsedTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {parsedTags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            {/* Features Section */}
            <div>
              <h4 className="font-semibold text-base sm:text-lg mb-2">Key Features</h4>
              <ul className="space-y-2">
                {parsedFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">•</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Specifications Section */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div>
                <h4 className="font-semibold text-base sm:text-lg mb-2">Specifications</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex flex-col">
                      <span className="text-sm text-gray-500 capitalize">{key}</span>
                      <span className="text-gray-800">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Quantity & Add to Cart */}
            <div className="pt-2 space-y-4">
              {/* Quantity Selector */}
              <div className="flex items-center space-x-3">
                <label htmlFor="quantity" className="text-sm font-medium">Quantity:</label>
                <div className="flex items-center border rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={!product.inStock}
                    className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 border-x" id="quantity" aria-live="polite">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={!product.inStock}
                    className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>
              
              {/* Add to Cart Button */}
              <Button
                onClick={() => {
                  onAddToCart(product, quantity);
                  onClose();
                }}
                disabled={!product.inStock}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 text-white font-medium py-3 rounded-md shadow-md"
              >
                {product.inStock 
                  ? `Add ${quantity} to Cart - $${(product.price * quantity).toFixed(2)}` 
                  : 'Out of Stock'
                }
              </Button>
              
              {!product.inStock && (
                <p className="text-red-500 text-center text-sm">This item is currently out of stock</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
