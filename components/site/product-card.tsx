'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag } from 'lucide-react';
import { Product } from '@/lib/supabase';
import { useStore } from '@/lib/store-context';
import { cn } from '@/lib/utils';

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const wished = isInWishlist(product.id);
  const primaryImage = product.images[0] ?? '';
  const hoverImage = product.images[1] ?? product.images[0] ?? '';

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-lg">
      <Link href={`/products/${product.id}`} className="relative block aspect-[3/4] overflow-hidden">
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
        <Image
          src={hoverImage}
          alt={product.name}
          fill
          className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
        {product.is_new_arrival && (
          <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-1 text-[0.625rem] font-bold uppercase tracking-wider text-accent-foreground">
            New
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60">
            <span className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      <button
        onClick={() => toggleWishlist(product.id)}
        className="absolute right-3 top-3 z-10 rounded-full bg-background/80 p-2 shadow-sm backdrop-blur-sm transition-all hover:bg-background"
        aria-label="Toggle wishlist"
      >
        <Heart
          className={cn(
            'h-4 w-4 transition-colors',
            wished ? 'fill-primary text-primary' : 'text-foreground'
          )}
        />
      </button>

      <div className="flex flex-1 flex-col p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-serif text-base font-semibold leading-tight transition-colors hover:text-accent">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 text-xs text-muted-foreground">
          {product.fabric} &middot; {product.color}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-serif text-lg font-bold text-primary">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          <button
            onClick={() =>
              addToCart({
                id: product.id,
                name: product.name,
                code: product.code,
                price: product.price,
                image: product.images[0] ?? '',
              })
            }
            disabled={product.stock === 0}
            className="rounded-full bg-primary p-2.5 text-primary-foreground transition-all hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Add to cart"
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
