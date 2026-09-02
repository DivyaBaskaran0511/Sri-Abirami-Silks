'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { Plus, Pencil, Trash2, X, Star } from 'lucide-react';
import { supabase, type Product, type Category } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

type ProductFormData = {
  name: string;
  code: string;
  description: string;
  price: string;
  category_id: string;
  fabric: string;
  color: string;
  occasion: string;
  stock: string;
  images: string;
  is_featured: boolean;
  is_new_arrival: boolean;
};

const emptyForm: ProductFormData = {
  name: '',
  code: '',
  description: '',
  price: '',
  category_id: '',
  fabric: '',
  color: '',
  occasion: '',
  stock: '0',
  images: '',
  is_featured: false,
  is_new_arrival: false,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    const [productsRes, categoriesRes] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name', { ascending: true }),
    ]);
    setProducts(productsRes.data ?? []);
    setCategories(categoriesRes.data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setDialogOpen(true);
  };

  const openEdit = (product: Product) => {
    setForm({
      name: product.name,
      code: product.code,
      description: product.description,
      price: String(product.price),
      category_id: product.category_id,
      fabric: product.fabric,
      color: product.color,
      occasion: product.occasion,
      stock: String(product.stock),
      images: product.images.join('\n'),
      is_featured: product.is_featured,
      is_new_arrival: product.is_new_arrival,
    });
    setEditingId(product.id);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const images = form.images
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      name: form.name,
      code: form.code,
      description: form.description,
      price: parseFloat(form.price) || 0,
      category_id: form.category_id,
      fabric: form.fabric,
      color: form.color,
      occasion: form.occasion,
      stock: parseInt(form.stock) || 0,
      images,
      is_featured: form.is_featured,
      is_new_arrival: form.is_new_arrival,
    };

    if (editingId) {
      const { error } = await supabase
        .from('products')
        .update(payload)
        .eq('id', editingId);
      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Product updated successfully' });
        setDialogOpen(false);
        fetchData();
      }
    } else {
      const { error } = await supabase.from('products').insert(payload);
      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Product added successfully' });
        setDialogOpen(false);
        fetchData();
      }
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Product deleted' });
      fetchData();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-primary">Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {products.length} product{products.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      {/* Product List */}
      <div className="mt-8 space-y-3">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-muted" />
          ))
        ) : products.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border py-12 text-center text-muted-foreground">
            No products yet. Click &quot;Add Product&quot; to create one.
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-4 rounded-lg border border-border bg-card p-4"
            >
              <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-md">
                {product.images[0] && (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-semibold text-foreground">
                    {product.name}
                  </h3>
                  {product.is_featured && (
                    <Star className="h-4 w-4 fill-accent text-accent" />
                  )}
                  {product.is_new_arrival && (
                    <span className="rounded-full bg-accent/20 px-2 py-0.5 text-xs font-medium text-accent-foreground">
                      New
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {product.code} &middot; ₹{product.price.toLocaleString('en-IN')} &middot; Stock: {product.stock}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => openEdit(product)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => handleDelete(product.id)}
                  className="text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="p-name">Name *</Label>
                <Input
                  id="p-name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="p-code">Code *</Label>
                <Input
                  id="p-code"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  className="mt-1"
                  placeholder="e.g. KAN-001"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="p-desc">Description *</Label>
              <Textarea
                id="p-desc"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="mt-1"
                rows={3}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="p-price">Price (₹) *</Label>
                <Input
                  id="p-price"
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="p-stock">Stock</Label>
                <Input
                  id="p-stock"
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="p-category">Category *</Label>
              <Select
                value={form.category_id}
                onValueChange={(v) => setForm({ ...form, category_id: v })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="p-fabric">Fabric *</Label>
                <Input
                  id="p-fabric"
                  value={form.fabric}
                  onChange={(e) => setForm({ ...form, fabric: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="p-color">Color *</Label>
                <Input
                  id="p-color"
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="p-occasion">Occasion *</Label>
                <Input
                  id="p-occasion"
                  value={form.occasion}
                  onChange={(e) => setForm({ ...form, occasion: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="p-images">Image URLs (one per line)</Label>
              <Textarea
                id="p-images"
                value={form.images}
                onChange={(e) => setForm({ ...form, images: e.target.value })}
                className="mt-1"
                rows={4}
                placeholder="https://..."
              />
            </div>

            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <Switch
                  checked={form.is_featured}
                  onCheckedChange={(v) => setForm({ ...form, is_featured: v })}
                />
                <span className="text-sm">Featured</span>
              </label>
              <label className="flex items-center gap-2">
                <Switch
                  checked={form.is_new_arrival}
                  onCheckedChange={(v) => setForm({ ...form, is_new_arrival: v })}
                />
                <span className="text-sm">New Arrival</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : editingId ? 'Update' : 'Add Product'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
