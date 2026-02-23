import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');

    try {
        const productsPath = path.join(process.cwd(), 'src/data/products.json');
        const productsData = fs.readFileSync(productsPath, 'utf8');
        const products = JSON.parse(productsData);

        if (!q) {
            // Return "Trending" / "Discover More" products
            // Just sorting by rating to simulate trending
            const trending = [...products]
                .sort((a: any, b: any) => (b.ratingCount || 0) - (a.ratingCount || 0))
                .slice(0, 6);
            return NextResponse.json({ results: trending });
        }

        const query = q.toLowerCase();

        // Filter products based on title, brand, or category matching the query
        const results = products.filter((p: any) =>
            p.title?.toLowerCase().includes(query) ||
            p.brand?.toLowerCase().includes(query) ||
            p.category?.toLowerCase().includes(query)
        ).slice(0, 8); // Return max 8 suggestions for the dropdown

        return NextResponse.json({ results });
    } catch (error) {
        console.error('Search API error:', error);
        return NextResponse.json({ results: [] }, { status: 500 });
    }
}
