import React, { useMemo } from 'react';
import type { BlogPostMeta, TocItem } from '../../lib/blog/types';
import { RecipeCard } from './RecipeCard';
import { TeaTimeline } from './TeaTimeline';
import { EnergyImpactCalculator } from './EnergyImpactCalculator';
import { BlogMechanics } from './mechanics/BlogMechanics';

interface ArticleContentProps {
  content: string;
  meta: BlogPostMeta;
  onTocExtract?: (toc: TocItem[]) => void;
}

// Simple MDX parser for our content
export function ArticleContent({ content, meta, onTocExtract }: ArticleContentProps) {
  // Extract TOC and parse content
  const { parsedContent, tocItems } = useMemo(() => {
    const toc: TocItem[] = [];
    let counter = 0;
    
    // Extract headings for TOC
    const headingRegex = /^(#{2,3})\s+(.+)$/gm;
    let match;
    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].replace(/\*\*/g, '');
      const id = `heading-${counter++}`;
      toc.push({ id, text, level });
    }
    
    onTocExtract?.(toc);
    
    const html = parseMarkdown(content);
    
    return { parsedContent: html, tocItems: toc };
  }, [content, onTocExtract]);

  // We need to render custom React components that were injected into the markdown
  // Split by the specific token <EnergyImpactCalculator />
  const parts = parsedContent.split('<EnergyImpactCalculator />');

  return (
    <div className="blog-content prose prose-invert prose-lg max-w-none">
      <BlogMechanics slug={meta.slug} />
      
      {parts.map((part, index) => (
        <React.Fragment key={index}>
          <div dangerouslySetInnerHTML={{ __html: part }} />
          {index < parts.length - 1 && (
             <div className="my-8">
               <EnergyImpactCalculator />
             </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// Simple markdown to HTML parser
function parseMarkdown(md: string): string {
  let html = md;

  
  // Escape HTML
  html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  
  // Headings with IDs
  let headingCounter = 0;
  html = html.replace(/^## (.+)$/gm, (_, text) => {
    const id = `heading-${headingCounter++}`;
    return `<h2 id="${id}" class="archival-heading text-3xl font-bold text-[#E8DDD0] mt-12 mb-4 scroll-mt-24">${parseInline(text)}</h2>`;
  });
  
  html = html.replace(/^### (.+)$/gm, (_, text) => {
    const id = `heading-${headingCounter++}`;
    return `<h3 id="${id}" class="archival-heading text-xl font-semibold text-[#E8DDD0] mt-8 mb-3 scroll-mt-24">${parseInline(text)}</h3>`;
  });
  
  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="text-[#C4956A]">$1</strong>');
  
  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[#C4956A] hover:underline">$1</a>');
  
  // Unordered lists
  html = html.replace(/^\* (.+)$/gm, '<li class="text-[#A89880] ml-6 mb-2">$1</li>');
  html = html.replace(/(<li[^>]*>.*<\/li>\n)+/g, '<ul class="mb-4 space-y-1">$&</ul>');
  
  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="text-[#A89880] ml-6 mb-2">$1</li>');
  html = html.replace(/(<li[^>]*>.*<\/li>\n)+/g, '<ol class="mb-4 space-y-1 list-decimal">$&</ol>');
  
  // Paragraphs
  const lines = html.split('\n');
  const result: string[] = [];
  let inParagraph = false;
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip empty lines
    if (!trimmed) {
      if (inParagraph) {
        result.push('</p>');
        inParagraph = false;
      }
      continue;
    }
    
    // Skip HTML tags
    if (trimmed.startsWith('<') && !trimmed.startsWith('<strong') && !trimmed.startsWith('<em') && !trimmed.startsWith('<a')) {
      if (inParagraph) {
        result.push('</p>');
        inParagraph = false;
      }
      result.push(line);
      continue;
    }
    
    // Start or continue paragraph
    if (!inParagraph) {
      result.push('<p class="text-[#A89880] leading-relaxed mb-4">');
      inParagraph = true;
    }
    result.push(line);
  }
  
  if (inParagraph) {
    result.push('</p>');
  }
  
  html = result.join('\n');
  
  // Remove duplicate tags
  html = html.replace(/<\/p>\s*<p[^>]*>/g, ' ');
  
  // Horizontal rules
  html = html.replace(/^---+$/gm, '<hr class="border-[#3A2E22] my-8" />');
  
  // Blockquotes
  html = html.replace(/^&gt; (.+)$/gm, '<blockquote class="border-l-4 border-[#C4956A] pl-4 italic text-[#E8DDD0]/80 my-6">$1</blockquote>');
  
  return html;
}

function parseInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-[#C4956A]">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[#C4956A] hover:underline">$1</a>');
}

// Standalone content renderer without hooks
export function renderArticleContent(content: string): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = [];
  let counter = 0;
  
  // Extract headings for TOC
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].replace(/\*\*/g, '');
    const id = `heading-${counter++}`;
    toc.push({ id, text, level });
  }
  
  return { html: parseMarkdown(content), toc };
}
