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

        if (!q || q.trim() === '') {
            // Return "Trending" / "Discover More" products
            const trending = [...products]
                .sort((a: any, b: any) => (b.ratingCount || 0) - (a.ratingCount || 0))
                .slice(0, 6);
            return NextResponse.json({ results: trending, suggestions: [] });
        }

        const query = q.toLowerCase().trim();

        // ---- KEYWORD SUGGESTIONS (like Flipkart / Amazon) ----
        // Extract unique keyword phrases from product titles, brands, and categories
        const suggestionSet = new Set<string>();

        for (const p of products) {
            const title = (p.title || '').toLowerCase();
            const brand = (p.brand || '').toLowerCase();
            const category = (p.category || '').toLowerCase();

            // Check if the product matches the query
            if (title.includes(query) || brand.includes(query) || category.includes(query)) {
                // Add brand as a suggestion if it matches
                if (brand && brand.includes(query)) {
                    suggestionSet.add(brand);
                }

                // Add category as a suggestion if it matches
                if (category && category.includes(query)) {
                    suggestionSet.add(category);
                }

                // Extract meaningful suggestion phrases from the title
                // e.g. "Apple iPhone 16 Pro Max (Desert Titanium, 512 GB)" 
                // -> "apple iphone 16 pro max"
                const cleanTitle = title.replace(/\(.*?\)/g, '').trim();
                const words = cleanTitle.split(/\s+/);

                // Find where the query starts matching in the title
                const queryWords = query.split(/\s+/);
                const firstQueryWord = queryWords[0];

                for (let i = 0; i < words.length; i++) {
                    if (words[i].includes(firstQueryWord)) {
                        // Build progressive suggestions from this match point
                        // e.g. query="app" -> "apple", "apple iphone", "apple iphone 16", etc.
                        for (let len = 2; len <= Math.min(words.length - i, 5); len++) {
                            const phrase = words.slice(i, i + len).join(' ');
                            if (phrase.length > query.length) {
                                suggestionSet.add(phrase);
                            }
                        }
                        break;
                    }
                }
            }
        }

        // Convert to array, sort by relevance (shorter = more relevant), limit to 8
        const suggestions = Array.from(suggestionSet)
            .sort((a, b) => a.length - b.length)
            .slice(0, 8);

        // Also return matching products for the thumbnail results
        const results = products.filter((p: any) =>
            p.title?.toLowerCase().includes(query) ||
            p.brand?.toLowerCase().includes(query) ||
            p.category?.toLowerCase().includes(query)
        ).slice(0, 4);

        return NextResponse.json({ results, suggestions });
    } catch (error) {
        console.error('Search API error:', error);
        return NextResponse.json({ results: [], suggestions: [] }, { status: 500 });
    }
}
