import { useState } from "react";
import { ShoppingCart, Mic, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchBar from "./SearchBar";
import { useRouter } from "next/navigation";
import { useCartQuery, calculateTotalItems } from "@/stores/cartStore";

interface HeaderProps {
  onSearchChange: (query: string) => void;
  onVoiceActivate: () => void;
  searchData?: any[];
  searchLoading?: boolean;
  searchError?: string | null;
  onSearchResultSelect?: (result: any) => void;
}

const Header = ({ 
  onSearchChange, 
  onVoiceActivate,
  searchData = [],
  searchLoading = false,
  searchError = null,
  onSearchResultSelect
}: HeaderProps) => {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const router = useRouter();
  const { data: cartItems = [], isLoading: cartLoading, error: cartError } = useCartQuery();
  const cartItemCount = calculateTotalItems(cartItems);

  // Debug logging
  console.log('Cart Debug:', { cartItems, cartItemCount, cartLoading, cartError });

  const handleCartClick = () => {
    router.push('/cart');
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Header Row */}
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center cursor-pointer" onClick={() => router.push('/')}>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                RAG Marketplace
              </h1>
            </div>

            {/* Desktop Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xl mx-4 lg:mx-8">
              <SearchBar
                data={searchData}
                onSearch={onSearchChange}
                onResultSelect={onSearchResultSelect}
                placeholder="Search products..."
                isLoading={searchLoading}
                error={searchError}
                maxResults={8}
                showCategories={true}
                debounceMs={300}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Mobile Search Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                className="md:hidden flex items-center space-x-2 hover:bg-purple-50 hover:border-purple-300 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Button>

              {/* Voice Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={onVoiceActivate}
                className="flex items-center space-x-2 hover:bg-purple-50 hover:border-purple-300 transition-colors"
              >
                <Mic className="h-4 w-4" />
                <span className="hidden sm:inline">AI Voice Assistant</span>
              </Button>
              
              {/* Cart Button with Debug Info */}
              <Button 
                variant="outline" 
                size="sm" 
                className="relative hover:bg-purple-50 hover:border-purple-300 transition-colors"
                onClick={handleCartClick}
                title={`Cart items: ${cartItemCount} | Loading: ${cartLoading} | Error: ${cartError ? 'Yes' : 'No'}`}
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">
                  Cart {cartLoading ? '(...)' : `(${cartItemCount})`}
                </span>
                <span className="sm:hidden text-xs ml-1">
                  {cartLoading ? '(...)' : `(${cartItemCount})`}
                </span>
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[1.25rem] animate-pulse shadow-lg border-2 border-white">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
                {cartError && (
                  <span className="absolute -top-1 -left-1 bg-red-500 text-white text-xs rounded-full h-3 w-3 flex items-center justify-center">
                    !
                  </span>
                )}
              </Button>
              
              {/* User Button */}
              <Button variant="outline" size="sm" className="hidden sm:flex hover:bg-purple-50 hover:border-purple-300 transition-colors">
                <User className="h-4 w-4" />
                <span className="hidden lg:inline ml-2">Account</span>
              </Button>

              {/* Mobile Menu Button */}
              <Button variant="outline" size="sm" className="sm:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {isMobileSearchOpen && (
            <div className="md:hidden pb-4 border-t pt-4">
              <SearchBar
                data={searchData}
                onSearch={onSearchChange}
                onResultSelect={(result) => {
                  onSearchResultSelect?.(result);
                  setIsMobileSearchOpen(false);
                }}
                placeholder="Search products..."
                isLoading={searchLoading}
                error={searchError}
                maxResults={6}
                showCategories={true}
                debounceMs={300}
              />
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
