'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Heart, Menu, X, Search } from 'lucide-react';
import { useStore } from '@/lib/store-context';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Sarees' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/wholesale', label: 'Wholesale' },
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { cartCount, wishlist } = useStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (pathname?.startsWith('/admin')) return null;

  return (
    <header
      className={cn(
        'fixed top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'bg-background/95 shadow-md backdrop-blur-sm'
          : 'bg-background/80 backdrop-blur-sm'
      )}
    >
      <div className="border-b border-accent/20">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 text-xs text-muted-foreground">
          <span className="hidden sm:block">
            Handwoven silk sarees from Arni, Tamil Nadu
          </span>
          <div className="flex items-center gap-3">
            <span className="text-accent">Call: 04173-43323</span>
            <span className="hidden md:inline">| 04173-43443</span>
            <span className="hidden md:inline">| 04173-43393</span>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <button
          className="lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary bg-primary text-primary-foreground">
            <span className="font-serif text-lg font-bold">SA</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-serif text-lg font-bold text-primary sm:text-xl">
              Sri Abirami Silks
            </span>
            <span className="text-[0.625rem] uppercase tracking-widest text-accent">
              & Sarees
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-accent',
                pathname === link.href ? 'text-accent' : 'text-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/wishlist"
            className="relative rounded-full p-2 transition-colors hover:bg-secondary"
            aria-label="Wishlist"
          >
            <Heart className="h-5 w-5" />
            {wishlist.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[0.625rem] font-bold text-accent-foreground">
                {wishlist.length}
              </span>
            )}
          </Link>
          <Link
            href="/cart"
            className="relative rounded-full p-2 transition-colors hover:bg-secondary"
            aria-label="Cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[0.625rem] font-bold text-primary-foreground">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="flex flex-col px-4 py-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'border-b border-border/50 py-3 text-sm font-medium transition-colors hover:text-accent',
                  pathname === link.href ? 'text-accent' : 'text-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
