import { Suspense } from 'react';
import { prisma } from '@wsm/db';
import DocumentEditor from './DocumentEditor';
import { getUserSession } from '@/lib/auth'; // Ensure this matches their auth helper if available
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'WSM Document Flow | Native In-House Editor'
};

export default async function DocumentFlowPage({ 
  searchParams 
}: { 
  searchParams: { docId?: string } 
}) {
  // Try to use auth if available, otherwise mock for DEV
  const sessionUser = { id: 'admin', brandId: 'tlab' }; // Replace with actual session if known
  
  let documentMode = 'NEW';
  let initialContent = '';
  let docTitle = 'Untitled Document';

  if (searchParams.docId) {
    const existingDoc = await prisma.knowledgeDocument.findUnique({
      where: { id: searchParams.docId }
    });
    if (existingDoc) {
      documentMode = 'EDIT';
      initialContent = existingDoc.content || '';
      docTitle = existingDoc.title;
    }
  }

  // Fetch list of documents for sidebar
  const docs = await prisma.knowledgeDocument.findMany({
    orderBy: { updatedAt: 'desc' },
    take: 10,
  });

  return (
    <div className="flex h-screen bg-[#09090b] text-white">
      {/* Sidebar: Document List */}
      <aside className="w-64 border-r border-white/10 bg-black/50 p-4 pt-20 hidden md:block">
        <h2 className="text-sm font-semibold uppercase text-zinc-400 tracking-wider mb-4">
          Knowledge Base (RAG)
        </h2>
        <div className="flex flex-col gap-2">
          <a href="/erp/document-flow" className="p-2 rounded hover:bg-white/5 text-sm font-medium border border-dashed border-white/20 text-center mb-4 transition-colors">
            + Створити Новий
          </a>
          {docs.map(doc => (
            <a 
              key={doc.id} 
              href={`/erp/document-flow?docId=${doc.id}`}
              className={`p-2 rounded text-sm transition-colors truncate ${searchParams.docId === doc.id ? 'bg-primary/20 text-primary border-l-2 border-primary' : 'hover:bg-white/5 text-zinc-300'}`}
            >
              📄 {doc.title || 'Untitled'}
            </a>
          ))}
        </div>
      </aside>

      {/* Main Editor Canvas */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto no-scrollbar pt-20 px-8 lg:px-24">
        <div className="max-w-4xl w-full mx-auto pb-32">
          {/* Header */}
          <div className="mb-8">
            <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-mono mb-4 border border-primary/20 backdrop-blur-md">
              native_notion_engine_v1
            </span>
            <p className="text-zinc-500 text-sm">
              Press <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-xs">/</kbd> to open commands. 100% In-House RAG Base.
            </p>
          </div>

          <Suspense fallback={<div className="animate-pulse bg-white/5 h-64 rounded-xl"></div>}>
            <DocumentEditor 
              docId={searchParams.docId} 
              initialTitle={docTitle}
              initialContent={initialContent} 
            />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
