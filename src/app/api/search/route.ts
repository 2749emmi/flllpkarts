import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');

    if (!q) {
        return NextResponse.json({ results: [] });
    }

    const query = q.toLowerCase();

    try {
        const productsPath = path.join(process.cwd(), 'src/data/products.json');
        const productsData = fs.readFileSync(productsPath, 'utf8');
        const products = JSON.parse(productsData);

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
