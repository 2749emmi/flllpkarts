#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

try { require.resolve('puppeteer-extra'); require.resolve('puppeteer-extra-plugin-stealth'); }
catch { console.error('\n  Install deps first:\n  npm install puppeteer puppeteer-extra puppeteer-extra-plugin-stealth\n'); process.exit(1); }

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const PRODUCTS_FILE = path.join(__dirname, '..', 'src', 'data', 'products.json');

async function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

function slugify(str) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 60);
}

// Scrape a search page for product URLs
async function scrapeSearchPage(browser, url) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    try {
        console.log(`  Searching: ${url}`);
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

        // scroll down
        await page.evaluate(async () => {
            for (let y = 0; y < document.body.scrollHeight; y += 800) {
                window.scrollTo(0, y);
                await new Promise(r => setTimeout(r, 250));
            }
        });

        const urls = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('a[href*="/p/"]'));
            // only get actual product links, not reviews or sellers
            return [...new Set(links.map(a => a.href).filter(h => !h.includes('/product-reviews/') && !h.includes('/seller/')))];
        });

        return urls.slice(0, 15); // Grab top 15 from this search
    } finally {
        await page.close();
    }
}

async function main() {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080', '--disable-blink-features=AutomationControlled'],
    });

    const queries = [
        'https://www.flipkart.com/search?q=apple+iphone+15',
        'https://www.flipkart.com/search?q=apple+iphone+14',
        'https://www.flipkart.com/search?q=apple+iphone+13',
        'https://www.flipkart.com/search?q=samsung+galaxy+s24+ultra',
        'https://www.flipkart.com/search?q=samsung+galaxy+s23+ultra',
        'https://www.flipkart.com/search?q=google+pixel+8+pro',
        'https://www.flipkart.com/search?q=apple+airpods+pro',
        'https://www.flipkart.com/search?q=apple+macbook+pro',
        'https://www.flipkart.com/search?q=sony+playstation+5',
        'https://www.flipkart.com/search?q=samsung+galaxy+z+fold+5',
        'https://www.flipkart.com/search?q=apple+watch+ultra+2',
        'https://www.flipkart.com/search?q=dji+drone',
        'https://www.flipkart.com/search?q=ipad+pro'
    ];

    let allUrls = [];

    for (const query of queries) {
        console.log(`\nFetching links for query: ${query}`);
        try {
            const urls = await scrapeSearchPage(browser, query);
            console.log(`Found ${urls.length} product URLs`);
            allUrls = allUrls.concat(urls);
        } catch (err) {
            console.error(`Error scraping search: ${err.message}`);
        }
        await delay(2000);
    }

    // Dedup URLs
    allUrls = [...new Set(allUrls)];
    console.log(`\nTotal unique URLs to scrape: ${allUrls.length}`);

    // Write URL list to file to be processed by original scraper
    fs.writeFileSync(path.join(__dirname, 'urls_to_scrape.txt'), allUrls.join('\n'));
    console.log('Saved URLs to urls_to_scrape.txt');

    await browser.close();

    console.log('\nRun the following command to scrape these products:');
    console.log('node scripts/scrape-flipkart.js $(cat scripts/urls_to_scrape.txt | tr "\\n" ",")');
}

main().catch(console.error);
