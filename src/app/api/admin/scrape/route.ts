import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url || !url.includes('flipkart.com')) {
      return NextResponse.json({ error: 'Valid Flipkart URL required' }, { status: 400 });
    }

    const scriptsDir = path.join(process.cwd(), 'scripts');
    const scraperPath = path.join(scriptsDir, 'scrape-flipkart.js');

    if (!fs.existsSync(scraperPath)) {
      return NextResponse.json({ error: 'Scraper script not found' }, { status: 500 });
    }

    const { stdout, stderr } = await execAsync(
      `node "${scraperPath}" "${url}" --download`,
      { cwd: process.cwd(), timeout: 180000, maxBuffer: 10 * 1024 * 1024 }
    );

    const outputPath = path.join(scriptsDir, 'scraped-product.json');
    if (!fs.existsSync(outputPath)) {
      return NextResponse.json({ error: 'Scraping failed: no output file', logs: stderr || stdout }, { status: 500 });
    }

    const scrapedRaw = fs.readFileSync(outputPath, 'utf-8');
    const scraped = JSON.parse(scrapedRaw);
    const product = Array.isArray(scraped) ? scraped[0] : scraped;

    if (product.error) {
      return NextResponse.json({ error: `Scraping error: ${product.error}` }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      product: {
        title: product.title || '',
        originalPrice: product.originalPrice || product.price || 0,
        price: product.price || 0,
        discount: product.discount || 0,
        images: product.images || [],
        image: product.images?.[0] || product.image || '',
        rating: product.rating || 0,
        ratingCount: product.ratingCount || '0',
        reviewCount: product.reviewCount || product.ratingCount || '0',
        highlights: product.highlights || [],
        specs: product.specs || {},
        offers: product.offers || [],
        description: product.description || '',
        brand: product.brand || '',
        seller: product.seller || '',
        category: product.category || 'general',
        variants: product.variants || [],
        reviews: (product.reviews || []).slice(0, 5),
        sourceUrl: url,
      },
      logs: stdout?.substring(0, 500),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
