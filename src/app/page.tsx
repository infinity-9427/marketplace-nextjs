"use client";

import { useState } from "react";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import VoiceAssistant from "@/components/VoiceAssistant";
import { sampleProducts } from "@/data/products";
import { Product } from "@/components/ProductCard";

const page = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState(sampleProducts);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredProducts(sampleProducts);
    } else {
      const filtered = sampleProducts.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  const handleAddToCart = (product: Product) => {
    console.log("Adding to cart:", product);
    // This would integrate with your cart system
  };

  const handleVoiceToggle = () => {
    setIsVoiceActive(!isVoiceActive);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      <Header
        cartItemCount={0}
        onSearchChange={handleSearchChange}
        onVoiceActivate={handleVoiceToggle}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Discover Amazing Products
          </h2>
          <p className="text-gray-600">
            {searchQuery 
              ? `Found ${filteredProducts.length} results for "${searchQuery}"`
              : `Browse our collection of ${sampleProducts.length} premium products`
            }
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onProductClick={setSelectedProduct}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search terms or browse our categories.
            </p>
          </div>
        )}
      </main>

      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <VoiceAssistant
        isActive={isVoiceActive}
        onToggle={handleVoiceToggle}
        products={sampleProducts}
      />
    </div>
  );
}

export default page