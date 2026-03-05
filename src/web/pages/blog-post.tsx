import { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'wouter';
import { SEO } from '../components/SEO';

interface Post {
  id: number;
  slug: string;
  title_uk: string;
  content_uk: string;
  excerpt_uk: string;
  cover_image: string | null;
  category_slug: string;
  category_name: string;
  meta_title_uk: string;
  meta_description_uk: string;
  meta_keywords: string;
  author: string;
  published_at: string;
  reading_time: number;
  views: number;
}

interface RelatedPost {
  id: number;
  slug: string;
  title_uk: string;
  excerpt_uk: string;
  published_at: string;
  reading_time: number;
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

// Extract headings from HTML content for Table of Contents
const extractHeadings = (html: string): TocItem[] => {
  const headings: TocItem[] = [];
  const regex = /<h([23])[^>]*>([^<]+)<\/h[23]>/gi;
  let match;
  let counter = 0;
  
  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1]);
    const text = match[2].trim();
    const id = `heading-${counter++}`;
    headings.push({ id, text, level });
  }
  
  return headings;
};

// Add IDs to headings in HTML content
const addHeadingIds = (html: string): string => {
  let counter = 0;
  return html.replace(/<h([23])([^>]*)>([^<]+)<\/h[23]>/gi, (match, level, attrs, text) => {
    const id = `heading-${counter++}`;
    return `<h${level}${attrs} id="${id}">${text}</h${level}>`;
  });
};

export default function BlogPost() {
  const params = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [related, setRelated] = useState<RelatedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeHeading, setActiveHeading] = useState<string>('');

  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/blog/posts/${params.slug}`);
        if (!res.ok) { setNotFound(true); setLoading(false); return; }
        const data = await res.json();
        setPost(data.post);
        setRelated(data.related || []);
      } catch (e) {
        setNotFound(true);
      }
      setLoading(false);
      try {
        const w = window as any;
        if (w.BoosterFunnel) w.BoosterFunnel.trackPageView();
        if (w.BT_Track) w.BT_Track.viewProduct(params.slug, 0, `blog-${params.slug}`);
      } catch(e) {}
    };
    loadPost();
  }, [params.slug]);

  // Extract headings for Table of Contents
  const tableOfContents = useMemo(() => {
    if (!post?.content_uk) return [];
    return extractHeadings(post.content_uk);
  }, [post?.content_uk]);

  // Add heading IDs to content
  const contentWithIds = useMemo(() => {
    if (!post?.content_uk) return '';
    return addHeadingIds(post.content_uk);
  }, [post?.content_uk]);

  // Track active heading on scroll
  useEffect(() => {
    if (tableOfContents.length === 0) return;

    const handleScroll = () => {
      const headingElements = tableOfContents.map(h => document.getElementById(h.id)).filter(Boolean);
      
      for (let i = headingElements.length - 1; i >= 0; i--) {
        const el = headingElements[i];
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) {
            setActiveHeading(tableOfContents[i].id);
            return;
          }
        }
      }
      setActiveHeading(tableOfContents[0]?.id || '');
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tableOfContents]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' });

  const shareUrl = `https://boostertea.com.ua/blog/${params.slug}`;

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 100;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <main id="main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ width: 40, height: 40, border: '3px solid #4a7c23', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </main>
    );
  }

  if (notFound || !post) {
    return (
      <main id="main-content" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h1 style={{ fontSize: '2rem', color: '#333' }}>Стаття не знайдена</h1>
        <p style={{ color: '#666', margin: '16px 0' }}>Перевірте адресу або перейдіть до блогу</p>
        <Link to="/blog" style={{ color: '#4a7c23', fontWeight: 600, textDecoration: 'none' }}>Повернутися до блогу</Link>
      </main>
    );
  }

  return (
    <main id="main-content" style={{ minHeight: '100vh', background: '#fafaf8' }}>
      <SEO
        title={post.meta_title_uk || post.title_uk}
        description={post.meta_description_uk || post.excerpt_uk}
        url={shareUrl}
        breadcrumbs={[
          { name: 'Головна', url: 'https://boostertea.com.ua/' },
          { name: 'Блог', url: 'https://boostertea.com.ua/blog' },
          { name: post.category_name || 'Стаття', url: `https://boostertea.com.ua/blog?category=${post.category_slug}` },
          { name: post.title_uk, url: shareUrl },
        ]}
      />

      <header style={{ background: 'linear-gradient(135deg, #2d5016 0%, #4a7c23 100%)', padding: '50px 20px 40px', color: 'white' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <nav style={{ marginBottom: 20 }}>
            <Link to="/blog" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.9rem' }}>← Блог</Link>
            <span style={{ margin: '0 8px', opacity: 0.5 }}>/</span>
            <Link to={`/blog?category=${post.category_slug}`} style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none', fontSize: '0.9rem' }}>
              {post.category_name}
            </Link>
          </nav>
          <h1 style={{ fontSize: '2.2rem', lineHeight: 1.3, margin: '0 0 20px', fontWeight: 700 }}>{post.title_uk}</h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', opacity: 0.9, fontSize: '0.9rem' }}>
            <span>{post.author}</span>
            <span>{formatDate(post.published_at)}</span>
            <span>{post.reading_time} хв читання</span>
            <span>{post.views} переглядів</span>
          </div>
        </div>
      </header>

      {/* Table of Contents - shows when there are headings */}
      {tableOfContents.length > 0 && (
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 20px 0' }}>
          <div style={{ 
            background: 'white', 
            borderRadius: 12, 
            padding: '20px 24px', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            border: '1px solid #e8f5e1'
          }}>
            <h3 style={{ 
              fontSize: '0.9rem', 
              fontWeight: 600, 
              color: '#2d5016', 
              margin: '0 0 12px',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
              Зміст статті
            </h3>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {tableOfContents.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToHeading(item.id)}
                  aria-label={`Перейти до: ${item.text}`}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    padding: item.level === 3 ? '4px 0 4px 16px' : '4px 0',
                    fontSize: item.level === 3 ? '0.85rem' : '0.9rem',
                    color: activeHeading === item.id ? '#4a7c23' : '#555',
                    fontWeight: activeHeading === item.id ? 600 : 400,
                    borderLeft: activeHeading === item.id ? '2px solid #4a7c23' : '2px solid transparent',
                    marginLeft: item.level === 3 ? 8 : 0,
                    transition: 'all 0.2s ease'
                  }}
                >
                  {item.text}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      <article style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px' }}>
        <div className="blog-content" dangerouslySetInnerHTML={{ __html: contentWithIds }} />
        <div style={{ borderTop: '2px solid #e8f5e1', marginTop: 40, paddingTop: 24 }}>
          <p style={{ fontWeight: 600, color: '#333', margin: '0 0 12px' }}>Поділитися:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <a href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title_uk)}`} target="_blank" rel="noopener noreferrer"
              style={{ padding: '10px 20px', background: '#0088cc', color: 'white', borderRadius: 8, textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>Telegram</a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer"
              style={{ padding: '10px 20px', background: '#1877F2', color: 'white', borderRadius: 8, textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>Facebook</a>
            <a href={`viber://forward?text=${encodeURIComponent(post.title_uk + ' ' + shareUrl)}`}
              style={{ padding: '10px 20px', background: '#7360F2', color: 'white', borderRadius: 8, textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>Viber</a>
            <button
              onClick={() => {
                navigator.clipboard.writeText(shareUrl);
                alert('Посилання скопійовано!');
              }}
              style={{ padding: '10px 20px', background: '#f5f5f5', color: '#333', borderRadius: 8, border: '1px solid #ddd', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer' }}
            >
              Копіювати
            </button>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section style={{ background: '#f0f7eb', padding: '48px 20px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.5rem', color: '#2d5016', margin: '0 0 24px', textAlign: 'center' }}>Схожі статті</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
              {related.map((r) => (
                <Link key={r.id} to={`/blog/${r.slug}`}
                  style={{ textDecoration: 'none', color: 'inherit', background: 'white', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'block' }}>
                  <h3 style={{ fontSize: '1rem', margin: '0 0 8px', color: '#1a1a1a', lineHeight: 1.4 }}>{r.title_uk}</h3>
                  <p style={{ color: '#666', fontSize: '0.85rem', margin: '0 0 12px', lineHeight: 1.5 }}>{r.excerpt_uk?.substring(0, 100)}...</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#999', fontSize: '0.8rem' }}>
                    <span>{formatDate(r.published_at)}</span>
                    <span>{r.reading_time} хв</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section style={{ padding: '48px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#2d5016', margin: '0 0 12px' }}>Спробуйте чай BoosterTea</h2>
          <p style={{ color: '#666', margin: '0 0 20px' }}>Преміальний чай з доставкою по Україні</p>
          <Link to="/products" style={{ display: 'inline-block', padding: '14px 36px', background: '#4a7c23', color: 'white', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>
            Перейти до каталогу
          </Link>
        </div>
      </section>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .blog-content h2 { font-size: 1.4rem; color: #2d5016; margin: 32px 0 12px; font-weight: 600; scroll-margin-top: 100px; }
        .blog-content h3 { font-size: 1.15rem; color: #333; margin: 24px 0 8px; font-weight: 600; scroll-margin-top: 100px; }
        .blog-content p { color: #444; line-height: 1.8; margin: 0 0 16px; font-size: 1rem; }
        .blog-content ul, .blog-content ol { color: #444; line-height: 1.8; margin: 0 0 16px; padding-left: 24px; }
        .blog-content a { color: #4a7c23; text-decoration: underline; }
        @media (max-width: 768px) { header h1 { font-size: 1.6rem !important; } }
      `}</style>
    </main>
  );
}
