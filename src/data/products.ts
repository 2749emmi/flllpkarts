import productsData from './products.json';

export interface Review {
    author: string;
    rating: number;
    title: string;
    comment: string;
    date: string;
    verifiedPurchase: boolean;
    likes?: number;
    dislikes?: number;
}

export interface Product {
    id: string;
    title: string;
    price: number;
    originalPrice: number;
    discount: number;
    image: string;
    rating: number;
    ratingCount: string;
    reviewCount: string;
    category: string;
    offers: string[];
    highlights: string[];
    description: string;
    images?: string[];
    specs?: Record<string, string>;
    reviews?: Review[];
    brand?: string;
    seller?: string;
}

export const products: Product[] = productsData as unknown as Product[];
