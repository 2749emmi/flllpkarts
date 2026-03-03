import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', backgroundColor: '#f1f3f6' }}>
        {children}
      </main>
      <Footer />
    </>
  );
}
