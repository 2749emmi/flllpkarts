'use server'

import fs from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const productsPath = path.join(process.cwd(), 'src/data/products.json');
const scrapedPath = path.join(process.cwd(), 'scripts/scraped-product.json');
const scriptPath = path.join(process.cwd(), 'scripts/scrape-flipkart.js');

export async function getProducts() {
    const data = fs.readFileSync(productsPath, 'utf8');
    return JSON.parse(data);
}

export async function deleteProduct(id: string) {
    try {
        const products = await getProducts();
        const updated = products.filter((p: any) => p.id !== id);
        fs.writeFileSync(productsPath, JSON.stringify(updated, null, 2));
        revalidatePath('/admin');
        revalidatePath('/');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function addManualProduct(data: any) {
    try {
        const products = await getProducts();
        const newProduct = {
            id: Date.now().toString(),
            ...data,
            images: data.images || (data.image ? [data.image] : []),
            rating: data.rating || parseFloat((4 + Math.random()).toFixed(1)),
            ratingCount: Math.floor(Math.random() * 50000).toString() + ',000',
            reviewCount: Math.floor(Math.random() * 5000).toString() + ',000',
            reviews: [],
            variants: [],
            offers: ["Special Price", "Bank Offer 5% Cashback"],
            highlights: ["Premium Quality", "1 Year Manufacturer Warranty"],
            specs: {}
        };

        products.unshift(newProduct);
        fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
        revalidatePath('/admin');
        revalidatePath('/');
        return { success: true, id: newProduct.id };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function scrapeProductFromUrl(url: string, targetPriceStr?: string) {
    try {
        // 1. Run the scraper
        await execAsync(`node "${scriptPath}" "${url}" --download`);

        // 2. Read the output
        if (!fs.existsSync(scrapedPath)) {
            throw new Error("Scraper failed to generate output file.");
        }
        const scrapedData = JSON.parse(fs.readFileSync(scrapedPath, 'utf8'));

        const productDetails = Array.isArray(scrapedData) ? scrapedData[0] : scrapedData;

        if (productDetails.error) {
            throw new Error(productDetails.error);
        }

        // 3. Format and append to our DB
        const products = await getProducts();

        if (targetPriceStr) {
            const targetPrice = parseInt(targetPriceStr, 10);
            if (!isNaN(targetPrice) && targetPrice > 0) {
                productDetails.price = targetPrice;
                if (productDetails.originalPrice > targetPrice) {
                    productDetails.discount = Math.round((1 - targetPrice / productDetails.originalPrice) * 100);
                } else {
                    productDetails.originalPrice = targetPrice * 10;
                    productDetails.discount = 90;
                }
            }
        }

        productDetails.id = Date.now().toString();
        products.unshift(productDetails);

        fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));

        // Clean up temp file
        fs.unlinkSync(scrapedPath);

        revalidatePath('/admin');
        revalidatePath('/');
        return { success: true, title: productDetails.title };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
