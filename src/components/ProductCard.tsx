import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAddToCart } from "@/stores/cartStore";
import { toast } from "sonner";
import Image from "next/image";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  subcategory?: string;
  brand?: string;
  description: string;
  features: string[];
  tags?: string[];
  specifications?: Record<string, any>;
  inStock: boolean;
}

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
}

const ProductCard = ({ product, onProductClick }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const addToCartMutation = useAddToCart();

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const defaultImage = "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=300&fit=crop&crop=center";

  const handleImageError = () => {
    setImageError(true);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    console.log('Adding to cart:', product.id); // Debug log
    
    if (!product.inStock) {
      toast.error("This product is currently unavailable.");
      return;
    }

    try {
      await addToCartMutation.mutateAsync(
        { product: product, quantity: 1 },
      {
        onSuccess: () => {
          toast.success(`Item added to cart`, {
            style: {
              background: "#0f172a", // Blue background
              color: "#ffffff",
            }
          });
        },
          onError: (error) => {
            console.error('Failed to add to cart:', error); // Debug log
            toast.error("Failed to add to cart", {
              position: "top-right",
              style: {
                background: "#EF4444",
                color: "#ffffff",
                border: "1px solid #DC2626",
                fontSize: "13px",
                fontWeight: "500",
                borderRadius: "8px",
                padding: "8px 12px",
                minHeight: "auto",
                height: "auto"
              },
              duration: 2000,
            });
          }
        }
      );
    } catch (error) {
      console.error('Cart mutation error:', error);
      toast.error("Failed to add to cart", {
        position: "top-right",
        style: {
          background: "#EF4444",
          color: "#ffffff", 
          border: "1px solid #DC2626",
          fontSize: "13px",
          fontWeight: "500",
          borderRadius: "8px",
          padding: "8px 12px",
          minHeight: "auto",
          height: "auto"
        },
        duration: 2000,
      });
    }
  };

  return (
    <Card 
      className="group cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl bg-white border-0 shadow-lg hover:shadow-purple-100/50 w-full h-full flex flex-col overflow-hidden p-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onProductClick(product)}
    >
      {/* Optimized image container with better aspect ratios */}
      <div className="relative overflow-hidden aspect-[3/2] lg:aspect-[4/3] xl:aspect-[3/2]">
        <Image
          src={imageError || !product.image ? defaultImage : product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-all duration-500 group-hover:scale-105"
          onError={handleImageError}
          loading="lazy"
          style={{ objectPosition: 'center' }}
        />
        
        {/* Subtle overlay for better text visibility on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Badges - positioned for better mobile/desktop experience */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
          {discountPercentage > 0 && (
            <Badge className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-2 py-1 shadow-lg">
              -{discountPercentage}% OFF
            </Badge>
          )}
          {!product.inStock && (
            <Badge variant="secondary" className="bg-gray-800/80 text-white text-xs backdrop-blur-sm">
              Out of Stock
            </Badge>
          )}
        </div>
      </div>
      
      {/* Condensed content section */}
      <div className="p-3 lg:p-4 flex-1 flex flex-col min-h-0">
        <div className="mb-2">
          <Badge variant="outline" className="text-xs font-medium text-purple-600 border-purple-200 bg-purple-50">
            {product.category}
          </Badge>
        </div>
        
        <h3 className="font-bold text-sm lg:text-base xl:text-lg mb-2 line-clamp-2 leading-tight text-gray-900 group-hover:text-purple-700 transition-colors duration-200">
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-xs lg:text-sm mb-3 line-clamp-2 leading-relaxed flex-1">
          {product.description}
        </p>
        
        {/* Compact price section */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-lg lg:text-xl font-bold text-purple-600">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
            )}
          </div>
          {discountPercentage > 0 && (
            <span className="text-xs text-green-600 font-semibold bg-green-50 px-1.5 py-0.5 rounded">
              Save ${(product.originalPrice! - product.price).toFixed(2)}
            </span>
          )}
        </div>
        
        {/* Integrated button - no separate CardFooter */}
        <Button
          onClick={handleAddToCart}
          disabled={!product.inStock || addToCartMutation.isPending}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-200 text-sm font-semibold py-2 lg:py-2.5 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
        >
          {addToCartMutation.isPending 
            ? 'Adding...' 
            : product.inStock 
              ? 'Add to Cart' 
              : 'Out of Stock'
          }
        </Button>
      </div>
    </Card>
  );
};

export default ProductCard;
