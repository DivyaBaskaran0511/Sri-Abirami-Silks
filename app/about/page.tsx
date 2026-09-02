'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Award, Handshake, Gem, MapPin, Phone, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BUSINESS_ADDRESS, BUSINESS_PHONES } from '@/lib/supabase';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

export default function AboutPage() {
  return (
    <div className="bg-silk-pattern pt-20">
      {/* Hero */}
      <section className="relative flex min-h-[50vh] items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.pexels.com/photos/10317113/pexels-photo-10317113.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Silk sarees"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/50" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 text-primary-foreground">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-accent">
            Our Story
          </p>
          <h1 className="font-serif text-5xl font-bold sm:text-6xl">
            A Legacy of Silk
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-12 md:grid-cols-2">
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
            <Image
              src="https://images.pexels.com/photos/10317106/pexels-photo-10317106.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Saree collection"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="font-serif text-3xl font-bold text-primary sm:text-4xl">
              From the Silk Town of Tamil Nadu
            </h2>
            <div className="mt-6 space-y-4 text-muted-foreground">
              <p>
                Sri Abirami Silks &amp; Sarees is a family-run business rooted in
                Arni, a historic town in Tiruvannamalai district renowned for its
                silk weaving tradition that spans centuries. Arni sarees are
                celebrated across South India for their fine texture, vibrant
                colors, and exquisite zari work.
              </p>
              <p>
                For decades, we have served generations of families — dressing
                brides, adorning festival celebrations, and providing everyday
                elegance. Every saree in our store is handpicked from master
                weavers who carry forward a craft passed down through
                generations.
              </p>
              <p>
                We believe a saree is more than a garment — it is a story, a
                tradition, and a piece of art. Our mission is to bring you
                authentic, high-quality silk sarees at honest prices, whether
                you are shopping for a wedding, a festival, or simply to add
                something beautiful to your wardrobe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-10 text-center font-serif text-3xl font-bold sm:text-4xl">
            Why Choose Us
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <Award className="mx-auto mb-4 h-12 w-12 text-accent" />
              <h3 className="font-serif text-xl font-semibold">Authentic Silk</h3>
              <p className="mt-2 text-sm text-primary-foreground/80">
                Every saree is genuine pure silk, sourced directly from master
                weavers in Arni and Kanchipuram.
              </p>
            </div>
            <div className="text-center">
              <Handshake className="mx-auto mb-4 h-12 w-12 text-accent" />
              <h3 className="font-serif text-xl font-semibold">Trusted Service</h3>
              <p className="mt-2 text-sm text-primary-foreground/80">
                Decades of trust from families across Tamil Nadu. Honest pricing
                and personalised attention for every customer.
              </p>
            </div>
            <div className="text-center">
              <Gem className="mx-auto mb-4 h-12 w-12 text-accent" />
              <h3 className="font-serif text-xl font-semibold">Curated Quality</h3>
              <p className="mt-2 text-sm text-primary-foreground/80">
                Each piece is handpicked for quality, design, and craftsmanship —
                from bridal heirlooms to everyday silks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <h2 className="font-serif text-3xl font-bold text-primary">
            Visit Our Store
          </h2>
          <div className="mt-6 flex flex-col items-center gap-4 text-muted-foreground">
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              <span>{BUSINESS_ADDRESS}</span>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {BUSINESS_PHONES.map((phone) => (
                <a
                  key={phone}
                  href={`tel:${phone}`}
                  className="flex items-center gap-1 transition-colors hover:text-accent"
                >
                  <Phone className="h-4 w-4" /> {phone}
                </a>
              ))}
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/contact">
              <Button size="lg">
                Contact Us <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a
              href={buildWhatsAppUrl('Hello Sri Abirami Silks, I would like to know more about your sarees.')}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" variant="outline" className="border-green-600 text-green-700 hover:bg-green-600 hover:text-white">
                WhatsApp Us
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
