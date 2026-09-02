'use client';

import { useEffect, useState, useCallback } from 'react';
import { Mail, Phone, Trash2, Eye, Clock, CheckCircle2, Package } from 'lucide-react';
import { supabase, type EnquiryWithProduct } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<EnquiryWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'contact' | 'wholesale'>('all');
  const [selected, setSelected] = useState<EnquiryWithProduct | null>(null);
  const { toast } = useToast();

  const fetchEnquiries = useCallback(async () => {
    let query = supabase
      .from('enquiries')
      .select('*, products(id, name, code)')
      .order('created_at', { ascending: false });

    if (filter !== 'all') {
      query = query.eq('type', filter);
    }

    const { data } = await query;
    setEnquiries((data as EnquiryWithProduct[]) ?? []);
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  const updateStatus = async (id: string, status: 'new' | 'read' | 'responded') => {
    const { error } = await supabase
      .from('enquiries')
      .update({ status })
      .eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: `Marked as ${status}` });
      fetchEnquiries();
      if (selected?.id === id) {
        setSelected({ ...selected, status });
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this enquiry?')) return;
    const { error } = await supabase.from('enquiries').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Enquiry deleted' });
      setSelected(null);
      fetchEnquiries();
    }
  };

  const statusBadge = (status: string) => {
    if (status === 'new')
      return (
        <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
          <Clock className="h-3 w-3" /> New
        </span>
      );
    if (status === 'read')
      return (
        <span className="flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
          <Eye className="h-3 w-3" /> Read
        </span>
      );
    return (
      <span className="flex items-center gap-1 rounded-full bg-accent/20 px-2 py-0.5 text-xs font-medium text-accent-foreground">
        <CheckCircle2 className="h-3 w-3" /> Responded
      </span>
    );
  };

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-primary">Enquiries</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Contact and wholesale enquiries from your store
      </p>

      {/* Filter Tabs */}
      <div className="mt-6 flex gap-2">
        {(['all', 'contact', 'wholesale'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'rounded-md px-4 py-2 text-sm font-medium capitalize transition-colors',
              filter === f
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Enquiry List */}
      <div className="mt-6 space-y-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-muted" />
          ))
        ) : enquiries.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border py-12 text-center text-muted-foreground">
            No enquiries found.
          </div>
        ) : (
          enquiries.map((enquiry) => (
            <div
              key={enquiry.id}
              className="rounded-lg border border-border bg-card p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-serif font-semibold text-foreground">
                      {enquiry.name}
                    </h3>
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-xs font-medium',
                        enquiry.type === 'wholesale'
                          ? 'bg-accent/20 text-accent-foreground'
                          : 'bg-secondary text-secondary-foreground'
                      )}
                    >
                      {enquiry.type}
                    </span>
                    {statusBadge(enquiry.status)}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <a
                      href={`tel:${enquiry.phone}`}
                      className="flex items-center gap-1 hover:text-accent"
                    >
                      <Phone className="h-3.5 w-3.5" /> {enquiry.phone}
                    </a>
                    {enquiry.email && (
                      <a
                        href={`mailto:${enquiry.email}`}
                        className="flex items-center gap-1 hover:text-accent"
                      >
                        <Mail className="h-3.5 w-3.5" /> {enquiry.email}
                      </a>
                    )}
                    {enquiry.products && (
                      <span className="flex items-center gap-1">
                        <Package className="h-3.5 w-3.5" /> {enquiry.products.name}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {enquiry.message}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(enquiry.created_at).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelected(enquiry);
                      if (enquiry.status === 'new') updateStatus(enquiry.id, 'read');
                    }}
                  >
                    <Eye className="mr-1 h-3.5 w-3.5" /> View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(enquiry.id)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detail Dialog */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-lg border border-border bg-card p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-serif text-xl font-bold text-primary">
                  {selected.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {selected.type} enquiry &middot; {statusBadge(selected.status)}
                </p>
              </div>
              <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground">
                &times;
              </button>
            </div>

            <div className="mt-4 space-y-3 text-sm">
              <div>
                <span className="font-semibold text-muted-foreground">Phone: </span>
                <a href={`tel:${selected.phone}`} className="text-accent hover:underline">
                  {selected.phone}
                </a>
              </div>
              {selected.email && (
                <div>
                  <span className="font-semibold text-muted-foreground">Email: </span>
                  <a href={`mailto:${selected.email}`} className="text-accent hover:underline">
                    {selected.email}
                  </a>
                </div>
              )}
              {selected.products && (
                <div>
                  <span className="font-semibold text-muted-foreground">Product: </span>
                  {selected.products.name} ({selected.products.code})
                </div>
              )}
              <div>
                <span className="font-semibold text-muted-foreground">Date: </span>
                {new Date(selected.created_at).toLocaleString('en-IN')}
              </div>
              <div className="rounded-md bg-secondary p-3">
                <p className="whitespace-pre-wrap text-foreground">{selected.message}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Button size="sm" onClick={() => updateStatus(selected.id, 'responded')}>
                <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Mark Responded
              </Button>
              <Button size="sm" variant="outline" onClick={() => updateStatus(selected.id, 'read')}>
                Mark Read
              </Button>
              <Button size="sm" variant="outline" onClick={() => updateStatus(selected.id, 'new')}>
                Mark New
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
