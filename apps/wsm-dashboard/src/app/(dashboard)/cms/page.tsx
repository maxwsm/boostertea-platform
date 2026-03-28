import { prisma as db } from '@wsm/db';
import CmsClient from './CmsClient';

export const dynamic = 'force-dynamic';

export default async function CmsPage() {
  const brands = await db.brand.findMany({ 
    select: { id: true, name: true, slug: true },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Headless Master CMS</h1>
          <p className="text-sm text-gray-400">
            Manage text, SEO metadata, and configuration variables across all 4 brands from A to Z.
          </p>
        </div>
      </div>

      <CmsClient brands={brands} />
    </div>
  );
}
