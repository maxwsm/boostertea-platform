import { NextRequest, NextResponse } from 'next/server';
import { prisma as db } from '@wsm/db';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const data = await req.json();
    const resolvedParams = await params;
    
    // Convert boolean strings to actual booleans if necessary, and ensure numbers
    const updatedProduct = await db.product.update({
      where: { id: resolvedParams.id },
      data: {
        nameUk: data.nameUk,
        descriptionUk: data.descriptionUk,
        price: parseFloat(data.price),
        image: data.image || null,
        category: data.category,
        stockStatus: data.stockStatus === true || data.stockStatus === 'true',
        stockQuantity: parseInt(data.stockQuantity) || 0,
        brandId: data.brandId
      }
    });

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error('[Product PUT Error]', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    await db.product.delete({
      where: { id: resolvedParams.id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Product DELETE Error]', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
