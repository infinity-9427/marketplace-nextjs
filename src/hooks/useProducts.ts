import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/components/ProductCard';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching products:', error);
          setError('Failed to load products');
          return;
        }

        // Transform the data to match the Product interface
        const transformedProducts: Product[] = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          price: parseFloat(item.price),
          originalPrice: item.original_price ? parseFloat(item.original_price) : undefined,
          image: item.image || '',
          category: item.category,
          subcategory: item.subcategory || undefined,
          brand: item.brand || undefined,
          rating: parseFloat(item.rating || '0'),
          reviews: item.reviews || 0,
          description: item.description || '',
          features: item.features || [],
          tags: item.tags || undefined,
          specifications: item.specifications || undefined,
          priceRange: item.price_range || undefined,
          targetAudience: item.target_audience || undefined,
          embeddings: item.embeddings || undefined,
          similarProducts: item.similar_products || undefined,
          crossSell: item.cross_sell || undefined,
          alternativeModels: item.alternative_models || undefined,
          inStock: item.in_stock
        }));

        setProducts(transformedProducts);
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
};
