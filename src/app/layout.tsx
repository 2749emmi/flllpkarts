import type { Metadata, Viewport } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CartProvider } from '@/context/CartContext';

const roboto = Roboto({ subsets: ['latin'], weight: ['400', '500', '700'] });

export const metadata: Metadata = {
  title: 'Online Shopping Site for Mobiles, Electronics, Furniture, Grocery, Lifestyle, Books & More. Best Offers!',
  description: 'Shop for electronics, apparels & more using our Flipkart app Free shipping & COD.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={roboto.className} style={{ margin: 0, padding: 0 }}>
        <CartProvider>
          <Navbar />
          <main style={{ minHeight: '100vh', backgroundColor: '#f1f3f6' }}>
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
