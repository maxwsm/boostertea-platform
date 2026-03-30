import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  // Generate JSON-LD for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href ? `https://boostertea.com.ua${item.href}` : undefined,
    })),
  };

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Breadcrumbs UI */}
      <nav 
        aria-label="Навігація" 
        className={`overflow-x-auto whitespace-nowrap scrollbar-hide ${className}`}
      >
        <ol className="flex items-center gap-1 text-sm text-[var(--text-secondary)]">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            const isFirst = index === 0;
            
            return (
              <li key={index} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 mx-1 flex-shrink-0" aria-hidden="true" />
                )}
                
                {isLast ? (
                  // Current page - no link, bold
                  <span 
                    className="font-medium text-[var(--text-primary)] truncate max-w-[200px]"
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                ) : item.href ? (
                  // Link to other page
                  <Link
                    href={item.href}
                    className="flex items-center gap-1 hover:text-[var(--color-primary)] transition-colors"
                  >
                    {isFirst && <Home className="w-3.5 h-3.5" aria-hidden="true" />}
                    <span className="truncate max-w-[150px]">{item.label}</span>
                  </Link>
                ) : (
                  // No link
                  <span className="truncate max-w-[150px]">{item.label}</span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      
      {/* Hide scrollbar */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}

export default Breadcrumbs;
