import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { SEO } from '../components/SEO';
import { Breadcrumbs } from '../components/Breadcrumbs';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TelegramButton from '../components/TelegramButton';
import { 
  BlogHero, 
  BlogFilter, 
  BlogSearch, 
  BlogCard 
} from '../components/blog';
import { 
  getAllPosts, 
  getFeaturedPosts, 
  getPostsByCategory,
  CATEGORY_MAP,
  type BlogPostMeta 
} from '../lib/blog/getBlogPosts';

const POSTS_PER_PAGE = 9;

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('');
  const [searchResults, setSearchResults] = useState<BlogPostMeta[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const allPosts = useMemo(() => getAllPosts(), []);
  const featuredPosts = useMemo(() => getFeaturedPosts(), []);

  // Filter posts based on category and search
  const displayedPosts = useMemo(() => {
    if (searchResults !== null) {
      return searchResults;
    }
    if (activeCategory) {
      return getPostsByCategory(activeCategory);
    }
    return allPosts;
  }, [activeCategory, searchResults, allPosts]);

  // Paginate posts
  const paginatedPosts = useMemo(() => {
    const start = 0;
    const end = currentPage * POSTS_PER_PAGE;
    return displayedPosts.slice(start, end);
  }, [displayedPosts, currentPage]);

  const hasMore = paginatedPosts.length < displayedPosts.length;
  const totalPages = Math.ceil(displayedPosts.length / POSTS_PER_PAGE);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchResults]);

  const handleLoadMore = () => {
    setIsLoading(true);
    // Simulate loading for smooth UX
    setTimeout(() => {
      setCurrentPage(prev => prev + 1);
      setIsLoading(false);
    }, 300);
  };

  const handleSearch = (query: string, results: BlogPostMeta[]) => {
    if (query.length >= 2) {
      setSearchResults(results);
    } else {
      setSearchResults(null);
    }
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setSearchResults(null);
  };

  const getPageTitle = () => {
    if (searchResults !== null) {
      return `Результати пошуку (${searchResults.length})`;
    }
    if (activeCategory) {
      return CATEGORY_MAP[activeCategory]?.name || 'Статті';
    }
    return 'Усі статті';
  };

  return (
    <div className="min-h-screen bg-[#0F0B08]">
      <SEO
        title="Чайний журнал BoosterTea"
        description="Рецепти, наука чаю та китайська чайна культура. Дізнайтеся більше про DA HONG PAO, PU-ERH, GABA чай та чайні концентрати."
        type="website"
        breadcrumbs={[
          { name: 'Головна', url: 'https://boostertea.com.ua/' },
          { name: 'Блог', url: 'https://boostertea.com.ua/blog' },
        ]}
      />
      <Header />

      {/* Hero Section - only show on first page without filters */}
      {currentPage === 1 && !activeCategory && searchResults === null && (
        <BlogHero featuredPosts={featuredPosts} />
      )}

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <div className="mb-8">
            <Breadcrumbs
              items={[
                { label: 'Головна', href: '/' },
                { label: 'Блог', href: '/blog' },
                ...(activeCategory ? [{ label: CATEGORY_MAP[activeCategory]?.name || 'Категорія' }] : [])
              ]}
            />
          </div>

          {/* Search */}
          <div className="max-w-2xl mx-auto mb-8">
            <BlogSearch onSearch={handleSearch} />
          </div>

          {/* Filters */}
          {searchResults === null && (
            <div className="mb-8">
              <BlogFilter 
                activeCategory={activeCategory} 
                onCategoryChange={handleCategoryChange} 
              />
            </div>
          )}

          {/* Section Title */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-6"
          >
            <h2 className="text-2xl text-[#E8DDD0] font-semibold" style={{ fontFamily: '"Playfair Display", serif' }}>
              {getPageTitle()}
            </h2>
            <span className="text-[#A89880] text-sm">
              {displayedPosts.length} {displayedPosts.length === 1 ? 'стаття' : displayedPosts.length < 5 ? 'статті' : 'статей'}
            </span>
          </motion.div>

          {/* Posts Grid */}
          {displayedPosts.length > 0 ? (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {paginatedPosts.map((post, i) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <BlogCard post={post} />
                  </motion.div>
                ))}
              </motion.div>

              {/* Load More / Pagination */}
              {(hasMore || totalPages > 1) && (
                <div className="mt-12 flex justify-center">
                  {hasMore ? (
                    <button
                      onClick={handleLoadMore}
                      disabled={isLoading}
                      className="px-8 py-3 bg-[#1A1410] text-[#E8DDD0] border border-[#3A2E22] rounded-xl hover:border-[#C4956A] hover:text-[#C4956A] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Завантаження...
                        </>
                      ) : (
                        <>
                          Показати ще
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-lg font-medium transition-all ${
                            currentPage === page
                              ? 'bg-[#C4956A] text-[#0F0B08]'
                              : 'bg-[#1A1410] text-[#A89880] border border-[#3A2E22] hover:border-[#C4956A]/50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#1A1410] flex items-center justify-center">
                <svg className="w-10 h-10 text-[#3A2E22]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl text-[#E8DDD0] mb-2">Статті не знайдені</h3>
              <p className="text-[#A89880] mb-6">Спробуйте змінити фільтри або пошуковий запит</p>
              <button
                onClick={() => {
                  setActiveCategory('');
                  setSearchResults(null);
                }}
                className="px-6 py-2 bg-[#C4956A] text-[#0F0B08] rounded-lg hover:bg-[#D4A57A] transition-colors"
              >
                Скинути фільтри
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Categories Summary */}
      {!activeCategory && searchResults === null && (
        <section className="py-12 bg-[#1A1410]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl text-[#E8DDD0] mb-8 text-center" 
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              Категорії
            </motion.h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {Object.values(CATEGORY_MAP).map((cat, i) => (
                <motion.button
                  key={cat.slug}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setActiveCategory(cat.slug)}
                  className="p-6 bg-[#0F0B08] rounded-xl border border-[#3A2E22] hover:border-[#C4956A]/50 transition-all group text-left"
                >
                  <span className="text-3xl mb-3 block transform group-hover:scale-110 transition-transform origin-left">{cat.emoji}</span>
                  <h3 className="text-[#E8DDD0] font-medium mb-1 group-hover:text-[#C4956A] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[#A89880] text-sm">{cat.description}</p>
                </motion.button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Academy & Casting Promo Section */}
      <section className="py-16 bg-[#0F0B08] border-t border-[#3A2E22] relative overflow-hidden">
        {/* Abstract Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[400px] bg-[#C4956A]/5 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[#1A1410] rounded-3xl p-8 md:p-12 border border-[#3A2E22] flex flex-col md:flex-row items-center gap-12"
          >
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C4956A]/10 border border-[#C4956A]/20 mb-6">
                <span className="w-2 h-2 rounded-full bg-[#C4956A] animate-pulse"></span>
                <span className="text-xs font-medium text-[#C4956A] uppercase tracking-wider">Прийом Відкрито</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-[#E8DDD0] mb-6" style={{ fontFamily: '"Playfair Display", serif' }}>
                BoosterTea <span className="text-[#C4956A]">Академія</span> & Кастинг
              </h2>
              
              <p className="text-[#A89880] text-lg mb-8 leading-relaxed">
                Шукаємо енергійних кріейторів! Навчайся безкоштовно у нашій Influencer LMS, користуйся <strong className="text-[#E8DDD0]">AI Prompt-генератором</strong> для вірусних відео та стань офіційним амбасадором українського чайного бренду.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  href="/influencer"
                  className="px-8 py-3.5 bg-[#C4956A] text-[#0F0B08] font-bold rounded-xl hover:bg-[#D4A57A] transition-all transform hover:-translate-y-1 hover:shadow-[0_8px_20px_-6px_rgba(196,149,106,0.4)] text-center"
                >
                  Подати заявку
                </Link>
                <Link
                  href="/influencer"
                  className="px-8 py-3.5 bg-transparent text-[#E8DDD0] border border-[#3A2E22] font-semibold rounded-xl hover:border-[#C4956A] transition-all text-center"
                >
                  Детальніше про LMS
                </Link>
              </div>
            </div>
            
            {/* Visual Decorative Element */}
            <div className="hidden lg:flex flex-1 justify-center">
              <div className="relative w-72 h-72">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border border-[rgba(196,149,106,0.3)]"
                />
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-4 rounded-full border border-[rgba(196,149,106,0.5)] border-dashed"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div 
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="w-32 h-32 bg-gradient-to-br from-[#1A1410] to-[#2A2018] rounded-2xl flex items-center justify-center border border-[#3A2E22] transform rotate-12 shadow-[0_0_30px_rgba(196,149,106,0.1)]"
                  >
                    <span className="text-5xl">🎬</span>
                  </motion.div>
                  <motion.div 
                    animate={{ y: [10, -10, 10] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute w-24 h-24 bg-gradient-to-br from-[#1A1410] to-[#2A2018] rounded-full flex items-center justify-center border border-[#3A2E22] transform -translate-x-12 translate-y-12 shadow-[0_0_20px_rgba(196,149,106,0.1)]"
                  >
                     <span className="text-3xl">🤖</span>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-[#1A1410] to-[#0F0B08]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 
            className="text-3xl text-[#E8DDD0] mb-4"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            Спробуйте наші чайні концентрати
          </h2>
          <p className="text-[#A89880] mb-8 text-lg">
            Преміальний чай DA HONG PAO, PU-ERH та GABA у зручному рідкому форматі
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/products"
              className="px-8 py-3 bg-[#C4956A] text-[#0F0B08] font-semibold rounded-xl hover:bg-[#D4A57A] transition-all"
            >
              Переглянути продукти
            </Link>
            <a
              href="https://t.me/boostertea_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-[#1A1410] text-[#E8DDD0] border border-[#3A2E22] rounded-xl hover:border-[#C4956A] transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-3.043-1.197-4.99-4.337-5.143-4.539-.153-.202-1.226-1.632-1.226-3.114 0-1.483.772-2.206 1.045-2.51.274-.303.603-.378.803-.378.2 0 .4.002.574.012.183.01.427-.07.669.513.242.582.825 2.011.899 2.158.074.147.122.319.024.515-.098.196-.147.318-.293.487-.147.169-.306.354-.437.476-.147.137-.301.286-.133.566.168.279.747 1.23 1.604 1.99 1.102.975 2.032 1.278 2.319 1.418.287.14.454.117.622-.07.169-.188.712-.826.9-1.107.187-.281.375-.235.627-.141.253.094 1.617.763 1.893.901.275.138.458.208.526.325.068.117.05.677-.224 1.452z"/>
              </svg>
              Написати в Telegram
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <TelegramButton />

      {/* Blog-specific CSS */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
