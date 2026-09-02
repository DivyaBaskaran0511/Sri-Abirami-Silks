'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, Mail, Tags, TrendingUp, ArrowRight, Clock } from 'lucide-react';
import { supabase, type Enquiry } from '@/lib/supabase';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    enquiries: 0,
    newEnquiries: 0,
  });
  const [recentEnquiries, setRecentEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('categories').select('*', { count: 'exact', head: true }),
      supabase.from('enquiries').select('*', { count: 'exact', head: true }),
      supabase.from('enquiries').select('*', { count: 'exact', head: true }).eq('status', 'new'),
      supabase.from('enquiries').select('*').order('created_at', { ascending: false }).limit(5),
    ]).then(([p, c, e, ne, recent]) => {
      setStats({
        products: p.count ?? 0,
        categories: c.count ?? 0,
        enquiries: e.count ?? 0,
        newEnquiries: ne.count ?? 0,
      });
      setRecentEnquiries(recent.data ?? []);
      setLoading(false);
    });
  }, []);

  const statCards = [
    { label: 'Total Products', value: stats.products, icon: Package, href: '/admin/products', color: 'text-primary' },
    { label: 'Categories', value: stats.categories, icon: Tags, href: '/admin/categories', color: 'text-accent' },
    { label: 'Total Enquiries', value: stats.enquiries, icon: Mail, href: '/admin/enquiries', color: 'text-primary' },
    { label: 'New Enquiries', value: stats.newEnquiries, icon: TrendingUp, href: '/admin/enquiries', color: 'text-green-600' },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-primary">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Overview of your store
      </p>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="group rounded-lg border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="mt-2 font-serif text-3xl font-bold text-primary">
                    {loading ? '...' : stat.value}
                  </p>
                </div>
                <div className={`rounded-full bg-secondary p-3 ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground transition-colors group-hover:text-accent">
                View details <ArrowRight className="h-3 w-3" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Enquiries */}
      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl font-semibold text-primary">
            Recent Enquiries
          </h2>
          <Link
            href="/admin/enquiries"
            className="text-sm text-accent hover:underline"
          >
            View All
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : recentEnquiries.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border py-12 text-center text-muted-foreground">
            No enquiries yet
          </div>
        ) : (
          <div className="space-y-3">
            {recentEnquiries.map((enquiry) => (
              <div
                key={enquiry.id}
                className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">
                      {enquiry.name}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        enquiry.type === 'wholesale'
                          ? 'bg-accent/20 text-accent-foreground'
                          : 'bg-secondary text-secondary-foreground'
                      }`}
                    >
                      {enquiry.type}
                    </span>
                    {enquiry.status === 'new' && (
                      <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                        <Clock className="h-3 w-3" /> New
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {enquiry.phone} &middot; {enquiry.message.slice(0, 60)}
                    {enquiry.message.length > 60 ? '...' : ''}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(enquiry.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
