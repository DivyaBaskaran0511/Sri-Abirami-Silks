'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  ArrowRight,
  Phone,
  MapPin,
  Award,
  Handshake,
  Gem,
} from 'lucide-react';
import { supabase, type Product, type Category } from '@/lib/supabase';
import { ProductCard } from '@/components/site/product-card';
import { Button } from '@/components/ui/button';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(4),
      supabase
        .from('products')
        .select('*')
        .eq('is_new_arrival', true)
        .order('created_at', { ascending: false })
        .limit(4),
      supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true }),
    ]).then(([featured, arrivals, cats]) => {
      setFeaturedProducts(featured.data ?? []);
      setNewArrivals(arrivals.data ?? []);
      setCategories(cats.data ?? []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="bg-silk-pattern">
      {/* Hero */}
      <section className="relative flex min-h-[85vh] items-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <Image
            src="https://images.pexels.com/photos/28943474/pexels-photo-28943474.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Sri Abirami Silks hero"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/30" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-20">
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-2 text-accent animate-fade-up">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-medium uppercase tracking-widest">
                Handwoven Heritage Since Generations
              </span>
            </div>
            <h1 className="font-serif text-5xl font-bold leading-tight text-primary-foreground sm:text-6xl lg:text-7xl animate-fade-up" style={{ animationDelay: '0.1s' }}>
              Timeless Silk
              <span className="block text-accent">Woven with Tradition</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-primary-foreground/90 animate-fade-up" style={{ animationDelay: '0.2s' }}>
              Discover authentic Kanchipuram, Banarasi, and soft silk sarees
              from Arni — the silk heartland of Tamil Nadu. Each drape tells a
              story of craftsmanship passed down through generations.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <Link href="/products">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 w-full sm:w-auto">
                  Explore Collection
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a
                href={buildWhatsAppUrl(
                  'Hello Sri Abirami Silks, I would like to know more about your silk saree collection.'
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-accent text-accent hover:bg-accent hover:text-accent-foreground w-full sm:w-auto"
                >
                  Enquire on WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-10 text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-accent">
            Curated Collections
          </p>
          <h2 className="font-serif text-4xl font-bold text-primary sm:text-5xl">
            Shop by Category
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {categories.map((cat, idx) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group relative aspect-[3/4] overflow-hidden rounded-lg animate-fade-up"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                {cat.image_url && (
                  <Image
                    src={cat.image_url}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, 16vw"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                  <h3 className="font-serif text-sm font-semibold text-primary-foreground sm:text-base">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-widest text-accent">
              Bestsellers
            </p>
            <h2 className="font-serif text-4xl font-bold text-primary sm:text-5xl">
              Featured Sarees
            </h2>
          </div>
          <Link href="/products" className="hidden sm:block">
            <Button variant="ghost" className="text-primary hover:text-accent">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-96 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* About Snippet */}
      <section className="bg-primary py-20 text-primary-foreground">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 md:grid-cols-2">
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
            <Image
              src="https://images.pexels.com/photos/10317106/pexels-photo-10317106.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Saree collection"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-widest text-accent">
              Our Story
            </p>
            <h2 className="font-serif text-4xl font-bold sm:text-5xl">
              A Legacy of Silk
            </h2>
            <p className="mt-6 text-lg text-primary-foreground/85">
              For decades, Sri Abirami Silks &amp; Sarees has been a trusted
              name in Arni, the historic silk town of Tamil Nadu. We bring you
              handwoven sarees crafted by master weavers who have perfected
              their art over generations.
            </p>
            <p className="mt-4 text-primary-foreground/75">
              From bridal Kanchipuram sarees to everyday soft silks, every drape
              in our collection is a testament to quality, authenticity, and the
              timeless beauty of Indian craftsmanship.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="text-center">
                <Award className="mx-auto mb-2 h-8 w-8 text-accent" />
                <p className="font-serif text-2xl font-bold">100%</p>
                <p className="text-xs text-primary-foreground/70">Pure Silk</p>
              </div>
              <div className="text-center">
                <Handshake className="mx-auto mb-2 h-8 w-8 text-accent" />
                <p className="font-serif text-2xl font-bold">500+</p>
                <p className="text-xs text-primary-foreground/70">Happy Customers</p>
              </div>
              <div className="text-center">
                <Gem className="mx-auto mb-2 h-8 w-8 text-accent" />
                <p className="font-serif text-2xl font-bold">50+</p>
                <p className="text-xs text-primary-foreground/70">Unique Designs</p>
              </div>
            </div>
            <Link href="/about" className="mt-8 inline-block">
              <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                Read Our Story <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-10 text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-accent">
            Just Arrived
          </p>
          <h2 className="font-serif text-4xl font-bold text-primary sm:text-5xl">
            New Arrivals
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-96 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* WhatsApp CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary/80 p-10 text-center text-primary-foreground md:p-16">
          <div className="absolute inset-0 opacity-10">
            <Image
              src="https://images.pexels.com/photos/7232404/pexels-photo-7232404.jpeg?auto=compress&cs=tinysrgb&w=1920"
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
          <div className="relative z-10">
            <h2 className="font-serif text-3xl font-bold sm:text-4xl">
              Can&apos;t Find What You&apos;re Looking For?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/85">
              Message us on WhatsApp and our team will help you find the perfect
              saree for your occasion. We also offer custom orders and bulk
              pricing for weddings and events.
            </p>
            <a
              href={buildWhatsAppUrl(
                'Hello Sri Abirami Silks, I need help finding the right saree.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block"
            >
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                Chat on WhatsApp
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
