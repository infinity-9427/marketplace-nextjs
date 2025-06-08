import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, StarHalf } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  subcategory?: string;
  brand?: string;
  rating: number;
  reviews: number;
  description: string;
  features: string[];
  tags?: string[];
  specifications?: Record<string, any>;
  priceRange?: string;
  targetAudience?: string[];
  embeddings?: {
    text: string;
    features_vector: number[];
    price_tier: number;
  };
  similarProducts?: string[];
  crossSell?: string[];
  alternativeModels?: Array<{
    id: string;
    name: string;
    price: number;
    improvements: string[];
    tradeoffs: string[];
  }>;
  inStock: boolean;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCart, onProductClick }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const defaultImage = "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=300&fit=crop&crop=center";

  const handleImageError = () => {
    setImageError(true);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalf key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400" />
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

  return (
    <Card 
      className="group cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl bg-white border-0 shadow-lg hover:shadow-purple-100/50 w-full h-full flex flex-col overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onProductClick(product)}
    >
      <div className="relative overflow-hidden aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100">
        <img
          src={imageError || !product.image ? defaultImage : product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
          onError={handleImageError}
          loading="lazy"
        />
        
        {/* Overlay gradient for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {discountPercentage > 0 && (
            <Badge className="bg-red-500 hover:bg-red-600 text-white text-sm font-bold px-3 py-1 shadow-lg">
              -{discountPercentage}% OFF
            </Badge>
          )}
          {!product.inStock && (
            <Badge variant="secondary" className="bg-gray-800/80 text-white text-sm backdrop-blur-sm">
              Out of Stock
            </Badge>
          )}
        </div>

        {/* Quick action overlay */}
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-all duration-300 ${isHovered && product.inStock ? 'opacity-100' : 'opacity-0'}`}>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="bg-white text-purple-600 hover:bg-purple-50 font-semibold px-6 py-2 transform scale-90 hover:scale-100 transition-all duration-200 shadow-lg"
            size="sm"
          >
            Quick Add
          </Button>
        </div>
      </div>
      
      <CardContent className="p-5 flex-1 flex flex-col">
        <div className="mb-3">
          <Badge variant="outline" className="text-xs font-medium text-purple-600 border-purple-200 bg-purple-50">
            {product.category}
          </Badge>
        </div>
        
        <h3 className="font-bold text-lg mb-3 line-clamp-2 leading-tight text-gray-900 group-hover:text-purple-700 transition-colors duration-200">
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed flex-1">
          {product.description}
        </p>
        
        {/* Rating */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            {renderStars(product.rating)}
          </div>
          <span className="text-sm text-gray-500 font-medium">
            {product.rating} ({product.reviews})
          </span>
        </div>
        
        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-purple-600">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
            )}
          </div>
          {discountPercentage > 0 && (
            <span className="text-sm text-green-600 font-semibold bg-green-50 px-2 py-1 rounded">
              Save ${(product.originalPrice! - product.price).toFixed(2)}
            </span>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-5 pt-0">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          disabled={!product.inStock}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-200 text-base font-semibold py-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
        >
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
