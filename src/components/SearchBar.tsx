import { useState, useEffect, useRef } from "react";
import { Search, X, Loader2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string | number;
  title: string;
  subtitle?: string;
  image?: string;
  price?: number;
  category?: string;
}

interface SearchBarProps {
  data?: SearchResult[];
  onSearch: (query: string) => void;
  onResultSelect?: (result: SearchResult) => void;
  placeholder?: string;
  className?: string;
  isLoading?: boolean;
  error?: string | null;
  maxResults?: number;
  showCategories?: boolean;
  debounceMs?: number;
}

const SearchBar = ({
  data = [],
  onSearch,
  onResultSelect,
  placeholder = "Search products...",
  className,
  isLoading = false,
  error = null,
  maxResults = 10,
  showCategories = false,
  debounceMs = 300
}: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Filter results based on query
  useEffect(() => {
    if (!query.trim()) {
      setFilteredResults([]);
      setIsOpen(false);
      return;
    }

    const filtered = data
      .filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle?.toLowerCase().includes(query.toLowerCase()) ||
        item.category?.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, maxResults);

    setFilteredResults(filtered);
    setIsOpen(filtered.length > 0 || isLoading || !!error);
    setSelectedIndex(-1);
  }, [data, query, maxResults, isLoading, error]);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      onSearch(query);
    }, debounceMs);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, onSearch, debounceMs]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
  };

  const handleClear = () => {
    setQuery("");
    setFilteredResults([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
    onSearch("");
  };

  const handleResultClick = (result: SearchResult) => {
    setQuery(result.title);
    setIsOpen(false);
    setSelectedIndex(-1);
    onResultSelect?.(result);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredResults.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && filteredResults[selectedIndex]) {
          handleResultClick(filteredResults[selectedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const groupedResults = showCategories
    ? filteredResults.reduce((acc, result) => {
        const category = result.category || "Other";
        if (!acc[category]) acc[category] = [];
        acc[category].push(result);
        return acc;
      }, {} as Record<string, SearchResult[]>)
    : { "": filteredResults };

  return (
    <div ref={searchRef} className={cn("relative w-full", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setIsOpen(true)}
          className="pl-10 pr-12 w-full"
          disabled={isLoading}
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
            disabled={isLoading}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
        )}
      </div>

      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-96 overflow-hidden shadow-lg">
          <CardContent className="p-0">
            {error ? (
              <div className="flex items-center gap-2 p-4 text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            ) : isLoading ? (
              <div className="flex items-center justify-center gap-2 p-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-gray-600">Searching...</span>
              </div>
            ) : filteredResults.length === 0 ? (
              <div className="p-4 text-center text-gray-600">
                <span className="text-sm">No results found for "{query}"</span>
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto">
                {Object.entries(groupedResults).map(([category, results]) => (
                  <div key={category}>
                    {showCategories && category && (
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-b">
                        {category}
                      </div>
                    )}
                    {results.map((result, index) => {
                      const globalIndex = filteredResults.indexOf(result);
                      return (
                        <div
                          key={result.id}
                          className={cn(
                            "flex items-center gap-3 p-3 cursor-pointer transition-colors hover:bg-gray-50 border-b border-gray-100 last:border-b-0",
                            selectedIndex === globalIndex && "bg-purple-50"
                          )}
                          onClick={() => handleResultClick(result)}
                        >
                          {result.image && (
                            <img
                              src={result.image}
                              alt={result.title}
                              className="w-10 h-10 object-cover rounded"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">
                              {result.title}
                            </div>
                            {result.subtitle && (
                              <div className="text-xs text-gray-600 truncate">
                                {result.subtitle}
                              </div>
                            )}
                          </div>
                          {result.price && (
                            <div className="text-sm font-semibold text-purple-600">
                              ${result.price.toFixed(2)}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SearchBar;