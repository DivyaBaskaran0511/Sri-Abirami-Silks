'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2, ShoppingBag, MessageCircle, ArrowRight } from 'lucide-react';
import { useStore } from '@/lib/store-context';
import { Button } from '@/components/ui/button';
import { buildWhatsAppUrl, buildCartCheckoutMessage } from '@/lib/whatsapp';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useStore();

  const handleWhatsAppCheckout = () => {
    const message = buildCartCheckoutMessage(cart);
    window.open(buildWhatsAppUrl(message), '_blank');
  };

  return (
    <div className="bg-silk-pattern pt-20">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="mb-8 font-serif text-4xl font-bold text-primary">
          Your Cart
        </h1>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-20 text-center">
            <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground" />
            <h2 className="font-serif text-2xl font-semibold text-muted-foreground">
              Your cart is empty
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Browse our collection and find the perfect saree
            </p>
            <Link href="/products" className="mt-6">
              <Button size="lg">
                Explore Sarees <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 rounded-lg border border-border bg-card p-4"
                  >
                    <Link
                      href={`/products/${item.id}`}
                      className="relative h-28 w-24 shrink-0 overflow-hidden rounded-md"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </Link>
                    <div className="flex flex-1 flex-col">
                      <Link href={`/products/${item.id}`}>
                        <h3 className="font-serif text-lg font-semibold hover:text-accent">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        Code: {item.code}
                      </p>
                      <p className="mt-1 font-serif text-lg font-bold text-primary">
                        ₹{item.price.toLocaleString('en-IN')}
                      </p>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center rounded-md border border-input">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-1 transition-colors hover:bg-secondary"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-3 text-sm font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-1 transition-colors hover:bg-secondary"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="flex items-center gap-1 text-sm text-destructive transition-colors hover:text-destructive/80"
                        >
                          <Trash2 className="h-4 w-4" /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={clearCart}
                className="mt-4 text-sm text-destructive hover:underline"
              >
                Clear cart
              </button>
            </div>

            {/* Summary */}
            <div className="h-fit rounded-lg border border-border bg-card p-6 lg:sticky lg:top-24">
              <h2 className="mb-4 font-serif text-xl font-semibold text-primary">
                Order Summary
              </h2>
              <div className="space-y-2 text-sm">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-muted-foreground">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-medium">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t border-border pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">
                    ₹{cartTotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Final price confirmed via WhatsApp
                </p>
              </div>

              <Button
                size="lg"
                className="mt-6 w-full border-green-600 bg-green-600 text-white hover:bg-green-700"
                onClick={handleWhatsAppCheckout}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Checkout via WhatsApp
              </Button>

              <Link href="/products" className="mt-3 block">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
