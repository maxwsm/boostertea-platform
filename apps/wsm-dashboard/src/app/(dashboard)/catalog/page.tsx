import { prisma as db } from '@wsm/db';
import CatalogClient from './CatalogClient';

export const dynamic = 'force-dynamic';

export default async function CatalogPage() {
  // Fetch initial base data to pass to the client for dropdowns
  const brands = await db.brand.findMany({ select: { id: true, name: true, slug: true } });
  
  // Fetch distinct categories directly from Products for the category filter
  const categoriesRaw = await db.product.findMany({ select: { category: true }, distinct: ['category'] });
  const categories = categoriesRaw.map(c => c.category).filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Master Catalog</h1>
          <p className="text-sm text-gray-400">
            Manage inventory, update metadata, and control pricing across the entire ecosystem.
          </p>
        </div>
      </div>

      <CatalogClient brands={brands} categories={categories} />
    </div>
  );
}
