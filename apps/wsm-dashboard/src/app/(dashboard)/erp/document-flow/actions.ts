'use server';

import { prisma } from '@wsm/db';
import { revalidatePath } from 'next/cache';

export async function saveDocumentAction(data: {
  id?: string;
  title: string;
  content: string;
}) {
  try {
    // In production, grab user from active session
    // const user = await getUser(cookies().get('session'));
    const authorId = undefined; // mock
    const brandId = undefined;  // mock

    if (data.id) {
      // Update existing
      const doc = await prisma.knowledgeDocument.update({
        where: { id: data.id },
        data: {
          title: data.title,
          content: data.content,
          status: 'PUBLISHED'
        }
      });
      revalidatePath('/erp/document-flow');
      return { id: doc.id };
    } else {
      // Create new
      const doc = await prisma.knowledgeDocument.create({
        data: {
          title: data.title,
          content: data.content,
          status: 'DRAFT',
          type: 'NOTION_PAGE'
          // authorId, brandId
        }
      });
      revalidatePath('/erp/document-flow');
      return { id: doc.id };
    }
  } catch (error: any) {
    console.error('[Document Flow Save Error]', error.message);
    return { error: 'Failed to save document. Please check connection.' };
  }
}
