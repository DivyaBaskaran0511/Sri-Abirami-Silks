'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, MapPin, Mail, Facebook, Instagram } from 'lucide-react';
import { BUSINESS_ADDRESS, BUSINESS_PHONES } from '@/lib/supabase';

export function SiteFooter() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  return (
    <footer className="mt-20 border-t-2 border-primary/20 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-accent bg-primary-foreground text-primary">
                <span className="font-serif text-lg font-bold">SA</span>
              </div>
              <div>
                <span className="font-serif text-lg font-bold">
                  Sri Abirami Silks
                </span>
                <p className="text-[0.625rem] uppercase tracking-widest text-accent">
                  & Sarees
                </p>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/80">
              Handwoven silk sarees crafted with tradition and care in Arni,
              the silk town of Tamil Nadu.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-serif text-lg font-semibold text-accent">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><Link href="/products" className="transition-colors hover:text-accent">All Sarees</Link></li>
              <li><Link href="/about" className="transition-colors hover:text-accent">About Us</Link></li>
              <li><Link href="/contact" className="transition-colors hover:text-accent">Contact</Link></li>
              <li><Link href="/wholesale" className="transition-colors hover:text-accent">Wholesale Enquiry</Link></li>
              <li><Link href="/cart" className="transition-colors hover:text-accent">Cart</Link></li>
              <li><Link href="/wishlist" className="transition-colors hover:text-accent">Wishlist</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-serif text-lg font-semibold text-accent">
              Categories
            </h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><Link href="/products?category=kanchipuram-silk" className="transition-colors hover:text-accent">Kanchipuram Silk</Link></li>
              <li><Link href="/products?category=banarasi-silk" className="transition-colors hover:text-accent">Banarasi Silk</Link></li>
              <li><Link href="/products?category=soft-silk" className="transition-colors hover:text-accent">Soft Silk</Link></li>
              <li><Link href="/products?category=wedding-collection" className="transition-colors hover:text-accent">Wedding Collection</Link></li>
              <li><Link href="/products?category=festive-collection" className="transition-colors hover:text-accent">Festive Collection</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-serif text-lg font-semibold text-accent">
              Get in Touch
            </h3>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>{BUSINESS_ADDRESS}</span>
              </li>
              {BUSINESS_PHONES.map((phone) => (
                <li key={phone} className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0 text-accent" />
                  <a href={`tel:${phone}`} className="transition-colors hover:text-accent">
                    {phone}
                  </a>
                </li>
              ))}
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-accent" />
                <span>sriabiramisilks@gmail.com</span>
              </li>
            </ul>
            <div className="mt-4 flex gap-3">
              <a href="#" className="rounded-full bg-primary-foreground/10 p-2 transition-colors hover:bg-accent hover:text-primary" aria-label="Facebook">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="rounded-full bg-primary-foreground/10 p-2 transition-colors hover:bg-accent hover:text-primary" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-primary-foreground/20 pt-6 text-center text-xs text-primary-foreground/60">
          <p>
            &copy; {new Date().getFullYear()} Sri Abirami Silks &amp; Sarees.
            All rights reserved. |{' '}
            <Link href="/admin" className="transition-colors hover:text-accent">
              Admin
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
