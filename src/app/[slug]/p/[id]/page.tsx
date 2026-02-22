import { products } from '@/data/products';
import Link from 'next/link';
import ProductPageClient from '@/components/ProductPageClient';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = products.find((p) => p.id === id);

    if (!product) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#212121', marginBottom: '8px' }}>Product Not Found</h1>
                    <Link href="/" style={{ color: '#2874f0', fontSize: '14px' }}>Go to Homepage</Link>
                </div>
            </div>
        );
    }

    return <ProductPageClient product={product} />;
}
