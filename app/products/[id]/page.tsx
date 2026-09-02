'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import {
  Heart,
  ShoppingBag,
  ChevronLeft,
  Check,
  Minus,
  Plus,
  MessageCircle,
} from 'lucide-react';
import { supabase, type Product, type Category } from '@/lib/supabase';
import { useStore } from '@/lib/store-context';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/site/product-card';
import { buildWhatsAppUrl, buildProductEnquiryMessage } from '@/lib/whatsapp';
import { cn } from '@/lib/utils';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const { addToCart, toggleWishlist, isInWishlist } = useStore();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle()
      .then(async ({ data }) => {
        if (data) {
          setProduct(data);
          const { data: catData } = await supabase
            .from('categories')
            .select('*')
            .eq('id', data.category_id)
            .maybeSingle();
          setCategory(catData);

          const { data: relatedData } = await supabase
            .from('products')
            .select('*')
            .eq('category_id', data.category_id)
            .neq('id', data.id)
            .limit(4);
          setRelated(relatedData ?? []);
        }
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      name: product.name,
      code: product.code,
      price: product.price,
      image: product.images[0] ?? '',
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="bg-silk-pattern pt-20">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="aspect-[3/4] animate-pulse rounded-lg bg-muted" />
            <div className="space-y-4">
              <div className="h-8 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-6 w-1/2 animate-pulse rounded bg-muted" />
              <div className="h-32 animate-pulse rounded bg-muted" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-silk-pattern pt-20">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center">
          <h1 className="font-serif text-3xl font-bold text-primary">
            Saree Not Found
          </h1>
          <p className="mt-4 text-muted-foreground">
            The product you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link href="/products" className="mt-6 inline-block">
            <Button>Browse All Sarees</Button>
          </Link>
        </div>
      </div>
    );
  }

  const wished = isInWishlist(product.id);
  const productUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="bg-silk-pattern pt-20">
      <div className="mx-auto max-w-7xl px-4 py-10">
        {/* Breadcrumb */}
        <Link
          href="/products"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-accent"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Sarees
        </Link>

        <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
          {/* Images */}
          <div>
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg border border-border bg-card">
              <Image
                src={product.images[selectedImage] ?? product.images[0]}
                alt={product.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            {product.images.length > 1 && (
              <div className="mt-4 flex gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={cn(
                      'relative aspect-[3/4] w-20 overflow-hidden rounded-md border-2 transition-colors',
                      selectedImage === idx ? 'border-accent' : 'border-border'
                    )}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            {category && (
              <Link
                href={`/products?category=${category.slug}`}
                className="text-sm font-medium uppercase tracking-widest text-accent hover:underline"
              >
                {category.name}
              </Link>
            )}
            <h1 className="mt-2 font-serif text-3xl font-bold text-primary sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Product Code: {product.code}
            </p>

            <div className="mt-4">
              <span className="font-serif text-4xl font-bold text-primary">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="mt-6 space-y-3 border-y border-border py-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-muted-foreground">Fabric</span>
                <span className="text-foreground">{product.fabric}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-muted-foreground">Color</span>
                <span className="text-foreground">{product.color}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-muted-foreground">Occasion</span>
                <span className="text-foreground">{product.occasion}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-muted-foreground">Availability</span>
                {product.stock > 0 ? (
                  <span className="flex items-center gap-1 text-green-600">
                    <Check className="h-4 w-4" /> In Stock ({product.stock})
                  </span>
                ) : (
                  <span className="text-destructive">Out of Stock</span>
                )}
              </div>
            </div>

            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            {/* Quantity + Actions */}
            {product.stock > 0 && (
              <div className="mt-6 flex items-center gap-4">
                <div className="flex items-center rounded-md border border-input">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 transition-colors hover:bg-secondary"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-2 transition-colors hover:bg-secondary"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1"
              >
                {added ? (
                  <>
                    <Check className="mr-2 h-5 w-5" /> Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag className="mr-2 h-5 w-5" /> Add to Cart
                  </>
                )}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => toggleWishlist(product.id)}
                className={cn(wished && 'border-primary text-primary')}
              >
                <Heart className={cn('mr-2 h-5 w-5', wished && 'fill-primary')} />
                {wished ? 'Wishlisted' : 'Wishlist'}
              </Button>
            </div>

            <a
              href={buildWhatsAppUrl(
                buildProductEnquiryMessage({
                  name: product.name,
                  code: product.code,
                  price: product.price,
                  url: productUrl,
                })
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 block"
            >
              <Button
                size="lg"
                variant="outline"
                className="w-full border-green-600 text-green-700 hover:bg-green-600 hover:text-white"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Enquire on WhatsApp
              </Button>
            </a>

            {product.is_sample && (
              <p className="mt-4 rounded-md bg-accent/10 px-3 py-2 text-xs text-accent-foreground/70">
                This is sample/demo data for showcase purposes.
              </p>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="mb-8 font-serif text-3xl font-bold text-primary">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
