import './globals.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display, Cormorant_Garamond } from 'next/font/google';
import { StoreProvider } from '@/lib/store-context';
import { SiteHeader } from '@/components/site/site-header';
import { SiteFooter } from '@/components/site/site-footer';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700'],
});
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Sri Abirami Silks & Sarees — Premium South Indian Silk Sarees',
  description:
    'Authentic Kanchipuram, Banarasi, and soft silk sarees from Sri Abirami Silks & Sarees, Arni. Handwoven heritage for weddings, festivals, and every occasion.',
  openGraph: {
    title: 'Sri Abirami Silks & Sarees',
    description: 'Premium South Indian silk sarees from Arni, Tamil Nadu.',
    images: [{ url: 'https://images.pexels.com/photos/10317106/pexels-photo-10317106.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} ${cormorant.variable} font-sans`}
      >
        <StoreProvider>
          <SiteHeader />
          <main className="min-h-screen">{children}</main>
          <SiteFooter />
          <Toaster />
        </StoreProvider>
      </body>
    </html>
  );
}
