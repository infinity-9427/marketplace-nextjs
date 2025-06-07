import { Product } from "@/components/ProductCard";

export class AIService {
  private products: Product[];
  private baseUrl: string;
  private useRAG: boolean;

  constructor(products: Product[]) {
    this.products = products;
    this.baseUrl = 'http://localhost:5000';
    this.useRAG = true; // Set to false to use local processing as fallback
  }

  async processUserQuery(query: string): Promise<string> {
    // Try RAG backend first
    if (this.useRAG) {
      try {
        const ragResponse = await this.queryRAGBackend(query);
        if (ragResponse) {
          return ragResponse;
        }
      } catch (error) {
        console.warn('RAG backend unavailable, falling back to local processing:', error);
        // Continue to local processing as fallback
      }
    }

    // Fallback to local processing (original logic)
    return this.processLocalQuery(query);
  }

private async queryRAGBackend(query: string): Promise<string | null> {
  try {
    const response = await fetch(`${this.baseUrl}/api/ask`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question: query }),
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status === 'error') {
      throw new Error(data.error);
    }
    
    return data.answer || null;
    
  } catch (error) {
    console.error('RAG backend error:', error);
    return null; // Return null to trigger fallback
  }
}

  private processLocalQuery(query: string): string {
    const lowerQuery = query.toLowerCase();
    
    // Greetings
    if (this.isGreeting(lowerQuery)) {
      return "Hello! Welcome to Marketplace. I'm your AI shopping assistant. I can help you find products, answer questions about our inventory, or provide recommendations. What are you looking for today?";
    }

    // Product search
    if (this.isProductSearch(lowerQuery)) {
      return this.handleProductSearch(lowerQuery);
    }

    // Price inquiries
    if (this.isPriceInquiry(lowerQuery)) {
      return this.handlePriceInquiry(lowerQuery);
    }

    // Recommendations
    if (this.isRecommendationRequest(lowerQuery)) {
      return this.handleRecommendations(lowerQuery);
    }

    // Stock inquiries
    if (this.isStockInquiry(lowerQuery)) {
      return this.handleStockInquiry(lowerQuery);
    }

    // Category browsing
    if (this.isCategoryBrowsing(lowerQuery)) {
      return this.handleCategoryBrowsing(lowerQuery);
    }

    // Default response
    return "I'm here to help you find products in our marketplace. You can ask me about specific items, categories, prices, or I can give you recommendations. What would you like to know about? Note: I'm currently working with enhanced AI capabilities.";
  }

  private isGreeting(query: string): boolean {
    const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'];
    return greetings.some(greeting => query.includes(greeting));
  }

  private isProductSearch(query: string): boolean {
    const searchTerms = ['find', 'show', 'looking for', 'search', 'need', 'want'];
    return searchTerms.some(term => query.includes(term));
  }

  private isPriceInquiry(query: string): boolean {
    const priceTerms = ['price', 'cost', 'how much', 'expensive', 'cheap', 'budget'];
    return priceTerms.some(term => query.includes(term));
  }

  private isRecommendationRequest(query: string): boolean {
    const recTerms = ['recommend', 'suggest', 'best', 'popular', 'what should'];
    return recTerms.some(term => query.includes(term));
  }

  private isStockInquiry(query: string): boolean {
    const stockTerms = ['available', 'in stock', 'stock', 'inventory'];
    return stockTerms.some(term => query.includes(term));
  }

  private isCategoryBrowsing(query: string): boolean {
    const categories = ['electronics', 'wearables', 'furniture', 'gaming', 'kitchen', 'smart home', 'accessories'];
    return categories.some(category => query.includes(category));
  }

  private handleProductSearch(query: string): string {
    const matchingProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(query.replace(/find|show|looking for|search|need|want/g, '').trim()) ||
      product.description.toLowerCase().includes(query.replace(/find|show|looking for|search|need|want/g, '').trim()) ||
      product.category.toLowerCase().includes(query.replace(/find|show|looking for|search|need|want/g, '').trim())
    );

    if (matchingProducts.length === 0) {
      return "I couldn't find any products matching your search. Could you try a different keyword or let me know what category you're interested in? We have electronics, wearables, furniture, gaming, kitchen, smart home, and accessories.";
    }

    if (matchingProducts.length === 1) {
      const product = matchingProducts[0];
      return `I found the ${product.name} for $${product.price}. ${product.description} It has a ${product.rating} star rating from ${product.reviews} reviews. ${product.inStock ? 'It\'s currently in stock.' : 'Unfortunately, it\'s currently out of stock.'} Would you like to know more about this product?`;
    }

    const productList = matchingProducts.slice(0, 3).map(p => `${p.name} for $${p.price}`).join(', ');
    return `I found ${matchingProducts.length} products that match your search. Here are the top options: ${productList}. Would you like me to tell you more about any of these?`;
  }

  private handlePriceInquiry(query: string): string {
    // Try to extract product name from query
    const productKeywords = query.replace(/price|cost|how much|expensive|cheap|budget/g, '').trim();
    
    if (productKeywords.length > 2) {
      const matchingProducts = this.products.filter(product =>
        product.name.toLowerCase().includes(productKeywords) ||
        product.category.toLowerCase().includes(productKeywords)
      );

      if (matchingProducts.length > 0) {
        const product = matchingProducts[0];
        const priceInfo = product.originalPrice 
          ? `$${product.price}, marked down from $${product.originalPrice}` 
          : `$${product.price}`;
        return `The ${product.name} costs ${priceInfo}. ${product.inStock ? 'It\'s available now.' : 'Currently out of stock.'}`;
      }
    }

    const priceRanges = [
      { range: 'under $50', products: this.products.filter(p => p.price < 50) },
      { range: '$50-$150', products: this.products.filter(p => p.price >= 50 && p.price <= 150) },
      { range: 'over $150', products: this.products.filter(p => p.price > 150) }
    ];

    const summary = priceRanges.map(pr => `${pr.products.length} items ${pr.range}`).join(', ');
    return `Our products range from $39.99 to $449.99. We have ${summary}. What's your budget range, and what type of product are you looking for?`;
  }

  private handleRecommendations(query: string): string {
    const highRatedProducts = this.products
      .filter(p => p.rating >= 4.6 && p.inStock)
      .slice(0, 3);

    if (highRatedProducts.length === 0) {
      return "I'd recommend checking out our most popular categories: electronics and gaming accessories. What type of product interests you most?";
    }

    const recommendations = highRatedProducts
      .map(p => `${p.name} (${p.rating} stars, $${p.price})`)
      .join(', ');

    return `I recommend these highly-rated products: ${recommendations}. These all have excellent customer reviews and are currently in stock. Would you like more details about any of these?`;
  }

  private handleStockInquiry(query: string): string {
    const inStockCount = this.products.filter(p => p.inStock).length;
    const totalCount = this.products.length;
    
    return `We currently have ${inStockCount} out of ${totalCount} products in stock. Most of our electronics, gaming, and kitchen items are available. Is there a specific product you'd like me to check for you?`;
  }

  private handleCategoryBrowsing(query: string): string {
    const categories = {
      electronics: this.products.filter(p => p.category.toLowerCase() === 'electronics'),
      wearables: this.products.filter(p => p.category.toLowerCase() === 'wearables'),
      furniture: this.products.filter(p => p.category.toLowerCase() === 'furniture'),
      gaming: this.products.filter(p => p.category.toLowerCase() === 'gaming'),
      kitchen: this.products.filter(p => p.category.toLowerCase() === 'kitchen'),
      'smart home': this.products.filter(p => p.category.toLowerCase() === 'smart home'),
      accessories: this.products.filter(p => p.category.toLowerCase() === 'accessories')
    };

    const foundCategory = Object.entries(categories).find(([category]) => 
      query.includes(category)
    );

    if (foundCategory) {
      const [categoryName, categoryProducts] = foundCategory;
      if (categoryProducts.length > 0) {
        const topProducts = categoryProducts.slice(0, 3).map(p => `${p.name} ($${p.price})`).join(', ');
        return `In our ${categoryName} category, we have ${categoryProducts.length} products. Popular items include: ${topProducts}. Would you like to hear more about any of these?`;
      }
    }

    return "We have several categories: electronics, wearables, furniture, gaming, kitchen, smart home, and accessories. Which category interests you most?";
  }

  // Method to toggle between RAG and local processing
  public toggleRAGMode(useRAG: boolean): void {
    this.useRAG = useRAG;
  }

  // Method to check RAG backend status
  public async checkRAGStatus(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}
