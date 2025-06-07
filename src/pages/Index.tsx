
import { useState, useMemo } from "react";
import Header from "@/components/Header";
import ProductCard, { Product } from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import VoiceAssistant from "@/components/VoiceAssistant";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const { toast } = useToast();
  const { products, loading, error } = useProducts();
  const { addToCart, getTotalItems } = useCart();

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    
    return products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, products]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleVoiceActivate = () => {
    setIsVoiceActive(!isVoiceActive);
    toast({
      title: "Voice Assistant",
      description: isVoiceActive ? "Voice assistant deactivated" : "Voice assistant activated. You can now speak with me about products!",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
        <Header
          cartItemCount={getTotalItems()}
          onSearchChange={setSearchQuery}
          onVoiceActivate={handleVoiceActivate}
        />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading products...</h3>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
        <Header
          cartItemCount={getTotalItems()}
          onSearchChange={setSearchQuery}
          onVoiceActivate={handleVoiceActivate}
        />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-red-600 mb-2">Error loading products</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      <Header
        cartItemCount={getTotalItems()}
        onSearchChange={setSearchQuery}
        onVoiceActivate={handleVoiceActivate}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Discover Amazing Products
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            {searchQuery 
              ? `Showing ${filteredProducts.length} results for "${searchQuery}"`
              : "Browse our curated collection of premium products"
            }
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onProductClick={handleProductClick}
              />
            ))}
          </div>
        )}
      </main>

      <ProductModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onAddToCart={handleAddToCart}
      />

      <VoiceAssistant
        isActive={isVoiceActive}
        onToggle={() => setIsVoiceActive(!isVoiceActive)}
        products={products}
      />
    </div>
  );
};

export default Index;
