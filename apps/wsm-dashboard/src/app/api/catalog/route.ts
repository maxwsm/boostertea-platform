import { NextRequest, NextResponse } from 'next/server';
import { prisma as db } from '@wsm/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const brandId = searchParams.get('brandId');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const where: any = {};
    if (brandId && brandId !== 'all') where.brandId = brandId;
    if (category && category !== 'all') where.category = category;
    if (search) {
      where.nameUk = { contains: search };
    }

    const products = await db.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { brand: true }
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error('[Catalog GET Error]', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // Ensure slug is uniquely generated or provided
    const slug = data.slug || data.nameUk.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    const newProduct = await db.product.create({
      data: {
        brandId: data.brandId,
        slug: slug,
        nameUk: data.nameUk,
        descriptionUk: data.descriptionUk || '',
        price: parseFloat(data.price),
        image: data.image || null,
        category: data.category || 'Standard',
        stockStatus: data.stockStatus ?? true,
        stockQuantity: parseInt(data.stockQuantity) || 100
      }
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    console.error('[Catalog POST Error]', error);
    return NextResponse.json({ error: 'Failed to create product. Maybe duplicate slug?' }, { status: 500 });
  }
}

// BATCH OPERATIONS (Bulk Edit)
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { productIds, action, value } = body;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({ error: 'No products selected' }, { status: 400 });
    }

    if (action === 'updateStatus') {
      const isStocked = value === true || value === 'true';
      await db.product.updateMany({
        where: { id: { in: productIds } },
        data: { stockStatus: isStocked }
      });
      return NextResponse.json({ success: true, message: `Updated ${productIds.length} products to stockStatus=${isStocked}` });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('[Catalog PATCH Error]', error);
    return NextResponse.json({ error: 'Failed to perform batch operation' }, { status: 500 });
  }
}
