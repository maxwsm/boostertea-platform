import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { SEO } from '../components/SEO';
import { Breadcrumbs } from '../components/Breadcrumbs';

interface BlogPost {
  id: number;
  slug: string;
  title_uk: string;
  excerpt_uk: string;
  cover_image: string | null;
  category_slug: string;
  category_name: string;
  published_at: string;
  reading_time: number;
  views: number;
  is_featured: boolean;
}

interface Category {
  id: number;
  slug: string;
  name_uk: string;
  post_count: number;
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPosts = async (cat = '', p = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: '9' });
      if (cat) params.set('category', cat);
      const res = await fetch(`/api/blog/posts?${params}`);
      const data = await res.json();
      setPosts(data.posts || []);
      setTotalPages(Math.ceil((data.pagination?.total || 0) / 9));
    } catch (e) {
      console.error('Blog fetch error:', e);
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/blog/categories');
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (e) {
      console.error('Categories fetch error:', e);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  const selectCategory = (slug: string) => {
    setActiveCategory(slug);
    setPage(1);
    fetchPosts(slug, 1);
  };

  const formatDate = (d: string) => {
    return new Date(d).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <main id="main-content" style={{ minHeight: '100vh', background: '#fafaf8' }}>
      <SEO
        title="Блог | BoosterTea"
        description="Корисні статті про чай, здоров'я, рецепти та бізнес можливості від BoosterTea."
        url="https://boostertea.com.ua/blog"
        breadcrumbs={[
          { name: 'Головна', url: 'https://boostertea.com.ua/' },
          { name: 'Блог', url: 'https://boostertea.com.ua/blog' },
        ]}
      />

      <section style={{ background: 'linear-gradient(135deg, #2d5016 0%, #4a7c23 50%, #6b9b37 100%)', padding: '60px 20px', textAlign: 'center', color: 'white' }}>
        <h1 style={{ fontSize: '2.5rem', margin: '0 0 12px', fontWeight: 700 }}>Блог BoosterTea</h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: 600, margin: '0 auto' }}>
          Корисні статті про чай, здоров'я, рецепти та бізнес можливості
        </p>
      </section>

      {/* Breadcrumbs */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 20px 0' }}>
        <Breadcrumbs 
          items={[
            { label: 'Головна', href: '/' },
            { label: 'Блог' }
          ]} 
        />
      </div>

      <nav style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 20px 0', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <button
          onClick={() => selectCategory('')}
          style={{
            padding: '8px 20px', borderRadius: 20,
            border: `2px solid ${!activeCategory ? '#4a7c23' : '#ddd'}`,
            background: !activeCategory ? '#4a7c23' : 'white',
            color: !activeCategory ? 'white' : '#333',
            cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500
          }}
        >
          Всі статті
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => selectCategory(cat.slug)}
            style={{
              padding: '8px 20px', borderRadius: 20,
              border: `2px solid ${activeCategory === cat.slug ? '#4a7c23' : '#ddd'}`,
              background: activeCategory === cat.slug ? '#4a7c23' : 'white',
              color: activeCategory === cat.slug ? 'white' : '#333',
              cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500
            }}
          >
            {cat.name_uk} ({cat.post_count})
          </button>
        ))}
      </nav>

      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 20px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ display: 'inline-block', width: 40, height: 40, border: '3px solid #4a7c23', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          </div>
        ) : posts.length > 0 ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  style={{ textDecoration: 'none', color: 'inherit', background: 'white', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column' }}
                >
                  <div style={{ height: 200, background: `linear-gradient(135deg, ${post.is_featured ? '#4a7c23' : '#6b9b37'} 0%, ${post.is_featured ? '#2d5016' : '#4a7c23'} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <span style={{ fontSize: '3rem', opacity: 0.3 }}>🍵</span>
                    {post.is_featured && (
                      <span style={{ position: 'absolute', top: 12, right: 12, background: '#f59e0b', color: 'white', padding: '4px 12px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 600 }}>Популярне</span>
                    )}
                  </div>
                  <div style={{ padding: 20, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                      <span style={{ background: '#e8f5e1', color: '#2d5016', padding: '4px 10px', borderRadius: 8, fontSize: '0.75rem', fontWeight: 600 }}>
                        {post.category_name || 'Блог'}
                      </span>
                      <span style={{ color: '#999', fontSize: '0.8rem' }}>{post.reading_time} хв</span>
                    </div>
                    <h2 style={{ fontSize: '1.15rem', lineHeight: 1.4, margin: '0 0 10px', color: '#1a1a1a', fontWeight: 600 }}>{post.title_uk}</h2>
                    <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: 1.5, margin: '0 0 16px', flex: 1 }}>{post.excerpt_uk?.substring(0, 150)}...</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f0f0f0', paddingTop: 12 }}>
                      <span style={{ color: '#999', fontSize: '0.8rem' }}>{formatDate(post.published_at)}</span>
                      <span style={{ color: '#4a7c23', fontWeight: 600, fontSize: '0.85rem' }}>Читати →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 40 }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => { setPage(p); fetchPosts(activeCategory, p); }}
                    style={{ width: 40, height: 40, borderRadius: 8, border: `2px solid ${page === p ? '#4a7c23' : '#ddd'}`, background: page === p ? '#4a7c23' : 'white', color: page === p ? 'white' : '#333', cursor: 'pointer', fontWeight: 600 }}>
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}>
            <p style={{ fontSize: '1.2rem' }}>Статті не знайдені</p>
          </div>
        )}
      </section>

      <section style={{ background: '#f0f7eb', padding: '48px 20px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#2d5016', margin: '0 0 16px' }}>Дізнавайтесь більше про чай</h2>
          <p style={{ color: '#555', lineHeight: 1.7 }}>
            Наш блог — це джерело перевіреної інформації про чай, здоровий спосіб життя та бізнес можливості.
          </p>
        </div>
      </section>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) { h1 { font-size: 1.8rem !important; } }
      `}</style>
    </main>
  );
}
