import { NextResponse } from 'next/server';
import { prisma } from '@wsm/db';

export const revalidate = 3600;

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: {
        brand: { slug: 'funnydrops' },
      },
    });

    const domain = 'https://funnydrops.com.ua';

    const itemsXml = products
      .map((product) => {
        const id = product.id;
        const title = product.nameUk.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const description = product.descriptionUk.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const link = `${domain}/products/${product.slug}`;
        const imageLink = product.image || `${domain}/og-image.jpg`;
        const price = `${product.price.toString()} UAH`;
        const availability = product.stockStatus && product.stockQuantity > 0 ? 'in_stock' : 'out_of_stock';
        const inventory = product.stockQuantity;

        return `
    <item>
      <g:id>${id}</g:id>
      <g:title>${title}</g:title>
      <g:description>${description}</g:description>
      <g:link>${link}</g:link>
      <g:image_link>${imageLink}</g:image_link>
      <g:price>${price}</g:price>
      <g:availability>${availability}</g:availability>
      <g:condition>new</g:condition>
      <g:brand>FunnyDrops</g:brand>
      <g:inventory>${inventory}</g:inventory>
      <g:custom_label_0>${product.category}</g:custom_label_0>
      <g:custom_label_1>FB_Retargeting</g:custom_label_1>
    </item>`;
      })
      .join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>FunnyDrops - Facebook Catalog</title>
    <link>${domain}</link>
    <description>Офіційний каталог продукції FunnyDrops для Meta Ads</description>
${itemsXml}
  </channel>
</rss>`;

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate',
      },
    });
  } catch (error) {
    console.error('Error generating Facebook Feed:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
