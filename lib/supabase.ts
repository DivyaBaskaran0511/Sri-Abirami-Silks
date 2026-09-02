import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  created_at: string;
};

export type Product = {
  id: string;
  name: string;
  code: string;
  description: string;
  price: number;
  category_id: string;
  fabric: string;
  color: string;
  occasion: string;
  stock: number;
  images: string[];
  is_featured: boolean;
  is_new_arrival: boolean;
  is_sample: boolean;
  created_at: string;
};

export type ProductWithCategory = Product & {
  categories: Category | null;
};

export type Enquiry = {
  id: string;
  type: 'contact' | 'wholesale';
  name: string;
  email: string | null;
  phone: string;
  message: string;
  product_id: string | null;
  status: 'new' | 'read' | 'responded';
  created_at: string;
};

export type EnquiryWithProduct = Enquiry & {
  products: Pick<Product, 'id' | 'name' | 'code'> | null;
};

export const WHATSAPP_NUMBER = '9190417343323';
export const BUSINESS_NAME = 'Sri Abirami Silks & Sarees';
export const BUSINESS_ADDRESS =
  '461, Mettu Street, Onnupuram, Arni Taluk, Tiruvannamalai, Tamil Nadu – 632315, India';
export const BUSINESS_PHONES = ['04173-43323', '04173-43443', '04173-43393'];
