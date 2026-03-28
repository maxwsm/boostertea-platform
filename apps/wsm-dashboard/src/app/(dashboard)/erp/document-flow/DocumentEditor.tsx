'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { useState, useCallback, useEffect } from 'react';
import { SaveIcon, Share2Icon, MoreHorizontal } from 'lucide-react';
import { saveDocumentAction } from './actions';

export default function DocumentEditor({
  docId,
  initialTitle,
  initialContent
}: {
  docId?: string;
  initialTitle: string;
  initialContent: string;
}) {
  const [title, setTitle] = useState(initialTitle);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');

  const editor = useEditor({
    extensions: [
      StarterKit,
      TaskList,
      TaskItem.configure({ nested: true }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') return 'What’s the title?';
          return 'Type "/" for commands or just start typing...';
        },
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-p:text-zinc-400 prose-headings:text-white max-w-none focus:outline-none min-h-[50vh]',
      },
    },
    onUpdate: () => {
      setSaveStatus('idle');
    }
  });

  const handleSave = useCallback(async () => {
    if (!editor) return;
    setIsSaving(true);
    try {
      const htmlContent = editor.getHTML();
      // Server Action
      const res = await saveDocumentAction({
        id: docId,
        title: title || 'Untitled Document',
        content: htmlContent,
      });
      
      if (res.error) throw new Error(res.error);
      setSaveStatus('saved');
      
      // Update URL silently if it was new
      if (!docId && res.id) {
        window.history.replaceState(null, '', `?docId=${res.id}`);
      }
    } catch (e) {
      console.error(e);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  }, [editor, title, docId]);

  // Auto-save debounce effect could be here
  useEffect(() => {
    const timer = setTimeout(() => {
      if (saveStatus === 'idle' && title && editor?.getHTML() !== initialContent) {
        // Uncomment to enable 5s autosave
        // handleSave();
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [title, editor?.getHTML(), saveStatus, handleSave]);

  return (
    <div className="flex flex-col gap-6">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between sticky top-0 bg-[#09090b]/80 backdrop-blur-md py-4 z-10 border-b border-white/5">
        <input 
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled Document"
          className="bg-transparent text-3xl font-bold w-full outline-none placeholder:text-zinc-700 focus:placeholder:opacity-0 transition-opacity"
        />
        <div className="flex items-center gap-2 ml-4 flex-shrink-0">
          <span className="text-xs text-zinc-500 font-mono mr-2">
            {saveStatus === 'saved' ? 'Saved' : saveStatus === 'error' ? 'Failed' : isSaving ? 'Saving...' : ''}
          </span>
          <button 
            className="p-2 hover:bg-white/10 rounded-md transition-colors"
            title="Share"
          >
            <Share2Icon size={18} className="text-zinc-400" />
          </button>
          <button 
            className="p-2 hover:bg-white/10 rounded-md transition-colors"
            title="More Options"
          >
            <MoreHorizontal size={18} className="text-zinc-400" />
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-white text-black px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 hover:bg-zinc-200 transition-colors disabled:opacity-50"
          >
            <SaveIcon size={16} />
            Опублікувати
          </button>
        </div>
      </div>

      {/* Tiptap Container */}
      <div className="w-full relative mt-4">
        {/* Decorative Native Side Line for current block */}
        <div className="absolute -left-6 top-0 bottom-0 w-1 bg-white/5 opacity-0 hover:opacity-100 transition-opacity rounded-full cursor-grab"></div>
        <EditorContent editor={editor} className="tiptap-wrapper" />
      </div>

      {/* Minimalistic Inline CSS for the Editor */}
      <style dangerouslySetInnerHTML={{__html: `
        .tiptap-wrapper .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #52525b; /* zinc-600 */
          pointer-events: none;
          height: 0;
        }
        ul[data-type="taskList"] {
          list-style: none;
          padding: 0;
        }
        ul[data-type="taskList"] li {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        ul[data-type="taskList"] li input[type="checkbox"] {
          cursor: pointer;
        }
      `}} />
    </div>
  );
}
