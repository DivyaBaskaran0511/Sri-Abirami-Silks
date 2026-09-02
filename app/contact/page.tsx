'use client';

import { useState } from 'react';
import { MapPin, Phone, Mail, Send, CheckCircle2 } from 'lucide-react';
import { supabase, BUSINESS_ADDRESS, BUSINESS_PHONES } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const { error: insertError } = await supabase.from('enquiries').insert({
      type: 'contact',
      name,
      email: email || null,
      phone,
      message,
    });

    if (insertError) {
      setError('Something went wrong. Please try again or call us directly.');
      setSubmitting(false);
      return;
    }

    setSubmitted(true);
    setSubmitting(false);
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
  };

  return (
    <div className="bg-silk-pattern pt-20">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-accent">
            Get in Touch
          </p>
          <h1 className="font-serif text-4xl font-bold text-primary sm:text-5xl">
            Contact Us
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Have a question about a saree, need help choosing, or want to place
            a custom order? We&apos;d love to hear from you.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-accent" />
                <div>
                  <h3 className="font-serif text-lg font-semibold text-primary">
                    Visit Our Store
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {BUSINESS_ADDRESS}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-start gap-3">
                <Phone className="mt-1 h-5 w-5 shrink-0 text-accent" />
                <div>
                  <h3 className="font-serif text-lg font-semibold text-primary">
                    Call Us
                  </h3>
                  <div className="mt-1 space-y-1 text-sm text-muted-foreground">
                    {BUSINESS_PHONES.map((p) => (
                      <a
                        key={p}
                        href={`tel:${p}`}
                        className="block transition-colors hover:text-accent"
                      >
                        {p}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-start gap-3">
                <Mail className="mt-1 h-5 w-5 shrink-0 text-accent" />
                <div>
                  <h3 className="font-serif text-lg font-semibold text-primary">
                    Email Us
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    sriabiramisilks@gmail.com
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="rounded-lg border border-border bg-card p-6">
            {submitted ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <CheckCircle2 className="mb-4 h-16 w-16 text-green-600" />
                <h2 className="font-serif text-2xl font-semibold text-primary">
                  Thank You!
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Your message has been received. We&apos;ll get back to you soon.
                </p>
                <Button
                  variant="outline"
                  className="mt-6"
                  onClick={() => setSubmitted(false)}
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="font-serif text-2xl font-semibold text-primary">
                  Send a Message
                </h2>

                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="mt-1"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Your phone number"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us how we can help..."
                    className="mt-1"
                    rows={5}
                  />
                </div>

                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

                <Button type="submit" disabled={submitting} className="w-full">
                  {submitting ? 'Sending...' : (
                    <>
                      <Send className="mr-2 h-4 w-4" /> Send Message
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
