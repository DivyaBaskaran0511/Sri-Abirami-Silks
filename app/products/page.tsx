'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X } from 'lucide-react';
import { supabase, type Product, type Category } from '@/lib/supabase';
import { ProductCard } from '@/components/site/product-card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get('category') ?? 'all'
  );
  const [maxPrice, setMaxPrice] = useState<number>(50000);
  const [sortBy, setSortBy] = useState<string>('newest');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    let query = supabase.from('products').select('*');

    if (selectedCategory !== 'all') {
      const { data: catData } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', selectedCategory)
        .maybeSingle();
      if (catData) {
        query = query.eq('category_id', catData.id);
      }
    }

    query = query.lte('price', maxPrice);

    if (sortBy === 'price-low') query = query.order('price', { ascending: true });
    else if (sortBy === 'price-high') query = query.order('price', { ascending: false });
    else query = query.order('created_at', { ascending: false });

    const { data } = await query;
    setProducts(data ?? []);
    setLoading(false);
  }, [selectedCategory, maxPrice, sortBy]);

  useEffect(() => {
    supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data }) => setCategories(data ?? []));
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="bg-silk-pattern pt-20">
      {/* Page Header */}
      <div className="bg-primary/5 py-12">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-accent">
            Our Collection
          </p>
          <h1 className="font-serif text-4xl font-bold text-primary sm:text-5xl">
            Silk Sarees
          </h1>
          <p className="mt-4 text-muted-foreground">
            Browse our handwoven collection of authentic silk sarees
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside
            className={cn(
              'fixed inset-y-0 left-0 z-40 w-72 transform overflow-y-auto bg-background pt-20 shadow-lg transition-transform lg:static lg:z-0 lg:w-64 lg:translate-x-0 lg:bg-transparent lg:pt-0 lg:shadow-none',
              showFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            )}
          >
            <div className="flex items-center justify-between p-4 lg:pb-4 lg:pt-0">
              <h2 className="font-serif text-xl font-semibold text-primary">Filters</h2>
              <button
                className="lg:hidden"
                onClick={() => setShowFilters(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 px-4 pb-8 lg:px-0">
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Category
                </h3>
                <div className="space-y-2">
                  <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="category"
                      value="all"
                      checked={selectedCategory === 'all'}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="accent-primary"
                    />
                    All Categories
                  </label>
                  {categories.map((cat) => (
                    <label key={cat.id} className="flex cursor-pointer items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="category"
                        value={cat.slug}
                        checked={selectedCategory === cat.slug}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="accent-primary"
                      />
                      {cat.name}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Max Price
                </h3>
                <input
                  type="range"
                  min="1000"
                  max="50000"
                  step="1000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                  <span>₹1,000</span>
                  <span className="font-semibold text-primary">
                    ₹{maxPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Sort By
                </h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </aside>

          {showFilters && (
            <div
              className="fixed inset-0 z-30 bg-black/50 lg:hidden"
              onClick={() => setShowFilters(false)}
            />
          )}

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {loading ? 'Loading...' : `${products.length} saree${products.length !== 1 ? 's' : ''} found`}
              </p>
              <button
                className="flex items-center gap-2 rounded-md border border-input px-3 py-2 text-sm lg:hidden"
                onClick={() => setShowFilters(true)}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-96 animate-pulse rounded-lg bg-muted" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-20 text-center">
                <p className="text-lg font-semibold text-muted-foreground">
                  No sarees found
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try adjusting your filters
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSelectedCategory('all');
                    setMaxPrice(50000);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
