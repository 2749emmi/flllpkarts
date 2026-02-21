import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const PRODUCTS_PATH = path.join(process.cwd(), 'src', 'data', 'products.json');

function readProducts() {
  return JSON.parse(fs.readFileSync(PRODUCTS_PATH, 'utf-8'));
}

function writeProducts(products: Record<string, unknown>[]) {
  fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(products, null, 2) + '\n');
}

function generateId(products: Record<string, unknown>[]) {
  const ids = products.map(p => parseInt(String(p.id), 10)).filter(n => !isNaN(n));
  return String(Math.max(0, ...ids) + 1);
}

export async function GET() {
  try {
    const products = readProducts();
    return NextResponse.json({ products });
  } catch (err: unknown) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const product = await req.json();
    const products = readProducts();

    const id = generateId(products);
    const newProduct = { id, ...product };
    products.push(newProduct);
    writeProducts(products);

    return NextResponse.json({ success: true, product: newProduct, totalProducts: products.length });
  } catch (err: unknown) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'Product ID required' }, { status: 400 });

    const products = readProducts();
    const idx = products.findIndex((p: Record<string, unknown>) => p.id === id);
    if (idx === -1) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    const removed = products.splice(idx, 1)[0];
    writeProducts(products);

    return NextResponse.json({ success: true, removed, totalProducts: products.length });
  } catch (err: unknown) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, ...updates } = await req.json();
    if (!id) return NextResponse.json({ error: 'Product ID required' }, { status: 400 });

    const products = readProducts();
    const idx = products.findIndex((p: Record<string, unknown>) => p.id === id);
    if (idx === -1) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    products[idx] = { ...products[idx], ...updates };
    writeProducts(products);

    return NextResponse.json({ success: true, product: products[idx] });
  } catch (err: unknown) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
