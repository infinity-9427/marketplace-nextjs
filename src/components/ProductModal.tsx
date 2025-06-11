import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "./ProductCard";
import Image from "next/image";
import { toast } from "sonner";
import { useAddToCart } from "@/stores/cartStore";

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);
  const addToCartMutation = useAddToCart();

  if (!product) return null;

  const discountPercentage = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  // Parse features from pipe-separated string if needed
  const parsedFeatures = Array.isArray(product.features)
    ? product.features
    : typeof product.features === "string"
    ? product.features.split("|")
    : [];

  // Parse tags if provided as string
  const parsedTags = product.tags
    ? typeof product.tags === "string"
      ? product.tags.split("|")
      : product.tags
    : [];

  const defaultImage =
    "/noImage.webp"
  const handleImageError = () => {
    setImageError(true);
  };

  // Improved add to cart handler with proper error handling
  const handleAddToCart = async () => {
    if (!product.inStock) {
      toast.error("This product is currently unavailable.");
      return;
    }

    try {
      await addToCartMutation.mutateAsync(
        { product, quantity },
        {
          onSuccess: () => {
            toast.success(
              quantity === 1
                ? "Item added to cart"
                : `${quantity} items added to cart`,
              {
                style: {
                  background: "#0f172a", // Blue background
                  color: "#ffffff",
                },
              }
            );
            onClose(); // Close modal on success
          },
          onError: (error) => {
            console.error("Failed to add to cart:", error);
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
                height: "auto",
              },
              duration: 2000,
            });
          },
        }
      );
    } catch (error) {
      console.error("Cart mutation error:", error);
      toast.error("Failed to add to cart");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl lg:max-w-5xl xl:max-w-6xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-4 sm:p-6 lg:p-6 border-b">
          <div className="flex items-start justify-between pb-2">
            <DialogTitle className="text-xl sm:text-2xl lg:text-3xl font-bold line-clamp-2 mr-4">
              {product.name}
            </DialogTitle>
          </div>

          {/* Mobile-only: Category, Brand & Tags */}
          <div className="flex flex-wrap items-center gap-2 mt-2 md:hidden">
            <Badge
              variant="outline"
              className="bg-purple-50 text-purple-700 border-purple-200"
            >
              {product.category}
            </Badge>
            {product.subcategory && (
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200"
              >
                {product.subcategory}
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="p-4 sm:p-6">
          {/* Mobile: Stacked layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8">
            {/* Product Image Section */}
            <div className="lg:col-span-2 lg:sticky lg:self-start lg:top-6 space-y-4">
              <div className="relative rounded-lg overflow-hidden aspect-[4/3] md:aspect-square lg:aspect-[4/3]">
                <Image
                  src={
                    imageError || !product.image ? defaultImage : product.image
                  }
                  alt={product.name}
                  fill
                  sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 40vw"
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  onError={handleImageError}
                  priority
                />
                {discountPercentage > 0 && (
                  <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2">
                    -{discountPercentage}% OFF
                  </Badge>
                )}
              </div>

              {/* Price Section - Moved up on mobile, appears below image */}
              <div className="flex items-center flex-wrap gap-2 md:gap-3 mt-2">
                <span className="text-2xl sm:text-3xl font-bold text-purple-600">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-500 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
                {discountPercentage > 0 && (
                  <Badge className="bg-green-100 text-green-800 border-0">
                    You save $
                    {(product.originalPrice! - product.price).toFixed(2)}
                  </Badge>
                )}
              </div>

              {/* Stock & Add to Cart - Moved up on mobile for better UX */}
              <div className="space-y-3 pb-3 lg:pb-0">
                <div className="flex items-center">
                  {product.inStock ? (
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      In Stock
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-red-50 text-red-700 border-red-200"
                    >
                      Out of Stock
                    </Badge>
                  )}
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center space-x-3">
                  <label htmlFor="quantity" className="text-sm font-medium">
                    Quantity:
                  </label>
                  <div className="flex items-center border rounded-md">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={!product.inStock}
                      className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span
                      className="px-4 py-1 border-x"
                      id="quantity"
                      aria-live="polite"
                    >
                      {quantity}
                    </span>
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

                {/* Add to Cart Button - Updated with direct mutation handling */}
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock || addToCartMutation.isPending}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 text-white font-medium py-3 rounded-md shadow-md"
                >
                  {addToCartMutation.isPending
                    ? "Adding to Cart..."
                    : product.inStock
                    ? `Add to Cart`
                    : "Out of Stock"}
                </Button>

                {!product.inStock && (
                  <p className="text-red-500 text-center text-sm">
                    This item is currently out of stock
                  </p>
                )}
              </div>

              {/* Tags - Now visible on all screen sizes below image */}
              {parsedTags.length > 0 && (
                <div className="flex flex-wrap gap-2 border-t pt-4 mt-2">
                  <span className="text-sm font-medium text-gray-600 mr-1">
                    Tags:
                  </span>
                  {parsedTags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs bg-gray-100 text-gray-700"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details Section - No changes needed here */}
            <div className="space-y-6 lg:col-span-3">
              {/* Desktop-only: Category & Brand */}
              <div className="hidden md:flex md:flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-purple-50 text-purple-700 border-purple-200"
                >
                  {product.category}
                </Badge>
                {product.subcategory && (
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200"
                  >
                    {product.subcategory}
                  </Badge>
                )}
                {product.brand && (
                  <span className="text-sm text-gray-600 font-medium ml-1">
                    by <span className="text-gray-900">{product.brand}</span>
                  </span>
                )}
              </div>

              {/* Description */}
              <div>
                <h4 className="font-semibold text-base sm:text-lg mb-2">
                  Description
                </h4>
                <p className="text-gray-700 text-base leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Features Section */}
              <div>
                <h4 className="font-semibold text-base sm:text-lg mb-2">
                  Key Features
                </h4>
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
              {product.specifications &&
                Object.keys(product.specifications).length > 0 && (
                  <div>
                    <h4 className="font-semibold text-base sm:text-lg mb-3">
                      Specifications
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 bg-gray-50 p-4 rounded-lg">
                      {Object.entries(product.specifications).map(
                        ([key, value]) => (
                          <div key={key} className="flex flex-col">
                            <span className="text-sm text-gray-500 capitalize">
                              {key}
                            </span>
                            <span className="text-gray-800 font-medium">
                              {value}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Mobile-only: Brand information (if it exists) */}
              {product.brand && (
                <div className="md:hidden border-t pt-4">
                  <span className="text-sm text-gray-600 font-medium">
                    Brand:{" "}
                    <span className="text-gray-900">{product.brand}</span>
                  </span>
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
