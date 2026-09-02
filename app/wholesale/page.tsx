'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Send, CheckCircle2, Package, TrendingDown, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function WholesalePage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    business: '',
    city: '',
    quantity: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const fullMessage = [
      `Business: ${form.business || 'N/A'}`,
      `City: ${form.city || 'N/A'}`,
      `Estimated Quantity: ${form.quantity || 'N/A'}`,
      ``,
      form.message,
    ].join('\n');

    const { error: insertError } = await supabase.from('enquiries').insert({
      type: 'wholesale',
      name: form.name,
      email: form.email || null,
      phone: form.phone,
      message: fullMessage,
    });

    if (insertError) {
      setError('Something went wrong. Please try again or call us directly.');
      setSubmitting(false);
      return;
    }

    setSubmitted(true);
    setSubmitting(false);
    setForm({
      name: '',
      email: '',
      phone: '',
      business: '',
      city: '',
      quantity: '',
      message: '',
    });
  };

  return (
    <div className="bg-silk-pattern pt-20">
      {/* Hero */}
      <section className="relative flex min-h-[40vh] items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.pexels.com/photos/7232413/pexels-photo-7232413.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Wholesale silk"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/50" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 text-primary-foreground">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-accent">
            Bulk Orders & Trade
          </p>
          <h1 className="font-serif text-5xl font-bold sm:text-6xl">
            Wholesale Enquiry
          </h1>
          <p className="mt-4 max-w-xl text-primary-foreground/85">
            Special pricing for boutiques, retailers, wedding planners, and bulk
            orders. Partner with us for authentic Arni silk sarees at wholesale
            rates.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-6 text-center">
            <TrendingDown className="mx-auto mb-3 h-10 w-10 text-accent" />
            <h3 className="font-serif text-xl font-semibold text-primary">
              Wholesale Pricing
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Significant discounts on bulk orders. The more you order, the
              better the rate.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6 text-center">
            <Package className="mx-auto mb-3 h-10 w-10 text-accent" />
            <h3 className="font-serif text-xl font-semibold text-primary">
              Wide Selection
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Access to our full catalog including bridal, festive, and daily
              wear silk sarees.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6 text-center">
            <Users className="mx-auto mb-3 h-10 w-10 text-accent" />
            <h3 className="font-serif text-xl font-semibold text-primary">
              Trusted Partner
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Decades of experience supplying retailers and boutiques across
              Tamil Nadu and beyond.
            </p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="mx-auto max-w-3xl px-4 pb-16">
        <div className="rounded-lg border border-border bg-card p-8">
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle2 className="mb-4 h-16 w-16 text-green-600" />
              <h2 className="font-serif text-2xl font-semibold text-primary">
                Enquiry Received!
              </h2>
              <p className="mt-2 text-muted-foreground">
                Thank you for your interest in our wholesale program. Our team
                will contact you within 24 hours to discuss pricing and
                availability.
              </p>
              <Button
                variant="outline"
                className="mt-6"
                onClick={() => setSubmitted(false)}
              >
                Submit Another Enquiry
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="font-serif text-2xl font-semibold text-primary">
                Wholesale Enquiry Form
              </h2>
              <p className="text-sm text-muted-foreground">
                Fill in the details below and we&apos;ll get back to you with
                wholesale pricing.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    required
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Your name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    required
                    value={form.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="Your phone number"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="you@example.com"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="business">Business / Shop Name</Label>
                  <Input
                    id="business"
                    value={form.business}
                    onChange={(e) => handleChange('business', e.target.value)}
                    placeholder="Your business name"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={form.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    placeholder="Your city"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="quantity">Estimated Quantity</Label>
                  <Input
                    id="quantity"
                    value={form.quantity}
                    onChange={(e) => handleChange('quantity', e.target.value)}
                    placeholder="e.g. 20-50 sarees"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  required
                  value={form.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  placeholder="Tell us about your requirements, preferred saree types, etc."
                  className="mt-1"
                  rows={5}
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? 'Submitting...' : (
                  <>
                    <Send className="mr-2 h-4 w-4" /> Submit Enquiry
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
