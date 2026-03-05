import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';

const CACHE_DIR = path.join(process.cwd(), 'public', 'img-cache');

function ensureCacheDir() {
    if (!existsSync(CACHE_DIR)) {
        mkdirSync(CACHE_DIR, { recursive: true });
    }
}

function getExtFromUrl(url: string): string {
    if (url.includes('.png')) return 'png';
    if (url.includes('.jpeg') || url.includes('.jpg')) return 'jpeg';
    if (url.includes('.webp')) return 'webp';
    return 'jpeg';
}

function getMimeType(ext: string): string {
    if (ext === 'png') return 'image/png';
    if (ext === 'webp') return 'image/webp';
    return 'image/jpeg';
}

export async function GET(req: NextRequest) {
    const url = req.nextUrl.searchParams.get('url');
    if (!url) {
        return new NextResponse('Missing url param', { status: 400 });
    }

    ensureCacheDir();

    const hash = createHash('md5').update(url).digest('hex');
    const ext = getExtFromUrl(url);
    const cachePath = path.join(CACHE_DIR, `${hash}.${ext}`);

    // ✅ Serve from disk cache if already downloaded
    if (existsSync(cachePath)) {
        const file = readFileSync(cachePath);
        return new NextResponse(file, {
            headers: {
                'Content-Type': getMimeType(ext),
                'Cache-Control': 'public, max-age=31536000, immutable',
                'X-Cache': 'HIT',
            },
        });
    }

    // ⬇️ Download from external URL
    try {
        const fetchRes = await fetch(url, {
            headers: {
                // Spoof Referer to bypass Flipkart hotlink protection
                'Referer': 'https://www.flipkart.com/',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
            },
            next: { revalidate: 0 },
        });

        if (!fetchRes.ok) {
            return new NextResponse(`Upstream returned ${fetchRes.status}`, { status: 502 });
        }

        const contentType = fetchRes.headers.get('content-type') || getMimeType(ext);
        const buffer = Buffer.from(await fetchRes.arrayBuffer());

        // Save to disk
        writeFileSync(cachePath, buffer);

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
                'X-Cache': 'MISS',
            },
        });
    } catch (err) {
        console.error('[img-proxy] error fetching', url, err);
        return new NextResponse('Failed to fetch image', { status: 500 });
    }
}
