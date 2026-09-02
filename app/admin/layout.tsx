'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Package, Tags, Mail, LogOut, Store } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/use-auth';
import { cn } from '@/lib/utils';

const adminNav = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: Tags },
  { href: '/admin/enquiries', label: 'Enquiries', icon: Mail },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !session && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [loading, session, pathname, router]);

  if (pathname === '/admin/login') {
    return <div className="min-h-screen bg-silk-pattern">{children}</div>;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-silk-pattern">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-silk-pattern">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 w-64 border-r border-border bg-primary text-primary-foreground">
        <div className="flex h-20 items-center gap-2 border-b border-primary-foreground/20 px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-accent bg-primary-foreground text-primary">
            <span className="font-serif text-sm font-bold">SA</span>
          </div>
          <div>
            <span className="font-serif text-base font-bold">Abirami Admin</span>
            <p className="text-[0.625rem] uppercase tracking-widest text-accent">
              Silks &amp; Sarees
            </p>
          </div>
        </div>

        <nav className="mt-4 space-y-1 px-3">
          {adminNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-accent text-accent-foreground'
                    : 'text-primary-foreground/80 hover:bg-primary-foreground/10'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute inset-x-0 bottom-0 space-y-2 border-t border-primary-foreground/20 p-3">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-primary-foreground/80 transition-colors hover:bg-primary-foreground/10"
          >
            <Store className="h-4 w-4" />
            View Store
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-primary-foreground/80 transition-colors hover:bg-primary-foreground/10"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    </div>
  );
}
