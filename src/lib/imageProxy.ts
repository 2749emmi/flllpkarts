/**
 * Routes all external product images through our server-side proxy.
 * First load: downloads from CDN, saves to /public/img-cache/
 * Subsequent loads: serves from local disk — fast & reliable.
 */
export function proxyImage(url: string | null | undefined): string {
    if (!url) return '/placeholder.png';
    // Already a local path — serve directly
    if (url.startsWith('/') && !url.startsWith('/api/')) return url;
    // Already proxied
    if (url.startsWith('/api/img')) return url;
    // Route through our proxy
    return `/api/img?url=${encodeURIComponent(url)}`;
}
