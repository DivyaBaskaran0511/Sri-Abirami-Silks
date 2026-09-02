'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, ArrowRight } from 'lucide-react';
import { supabase, type Product } from '@/lib/supabase';
import { useStore } from '@/lib/store-context';
import { ProductCard } from '@/components/site/product-card';
import { Button } from '@/components/ui/button';

export default function WishlistPage() {
  const { wishlist } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (wishlist.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase
      .from('products')
      .select('*')
      .in('id', wishlist)
      .then(({ data }) => {
        setProducts(data ?? []);
        setLoading(false);
      });
  }, [wishlist]);

  return (
    <div className="bg-silk-pattern pt-20">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="mb-8 font-serif text-4xl font-bold text-primary">
          Your Wishlist
        </h1>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-96 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-20 text-center">
            <Heart className="mb-4 h-16 w-16 text-muted-foreground" />
            <h2 className="font-serif text-2xl font-semibold text-muted-foreground">
              Your wishlist is empty
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Save your favourite sarees here for later
            </p>
            <Link href="/products" className="mt-6">
              <Button size="lg">
                Browse Sarees <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
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
  );
}
