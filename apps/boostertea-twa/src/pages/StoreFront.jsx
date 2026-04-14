import React, { useState, useEffect } from 'react';
import { useCart } from '../components/CartStore';

const MOCK_PRODUCTS = [
  { id: 'p1', name: 'Tai Drink (Classic)', price: 80.00, category: 'tea', description: 'Оригінальний крафтовий чай з сатурацією. Для справжніх кібер-самураїв.' },
  { id: 'p2', name: 'Booster T (Mango)', price: 95.00, category: 'tea', description: 'Тропічний вибух дофаміну. Максимальна концентрація на цілях.' },
  { id: 'p3', name: 'Концентрат (База)', price: 450.00, category: 'concentrate', description: 'Оптова база 1л для кав\'ярень. Змішувати 1:5.' },
];

const MOCK_ARTICLES = [
  { id: 'a1', title: 'Як сатурація змінює смак чаю', excerpt: 'Чому газований чай - це майбутнє, і чому Cola втрачає позиції.', readTime: '3 min read', image: '🧪' },
  { id: 'a2', title: 'D2C vs Супермаркети: Чому ми пішли своїм шляхом', excerpt: 'Маніфест бренду Booster T: жодних полиць, тільки прямий продаж.', readTime: '5 min read', image: '📦' },
];

export default function StoreFront() {
  const { addToCart } = useCart();
  const [products] = useState(MOCK_PRODUCTS);
  const [articles] = useState(MOCK_ARTICLES);
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'feed'

  // Future integration with API
  /*
  useEffect(() => {
    fetch('/api/products').then(res => res.json()).then(data => setProducts(data));
  }, []);
  */

  const handleBuy = (product) => {
    addToCart(product);
  };

  return (
    <div className="store-front-container">
      {/* PHASE 1: HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="cyber-glitch-text" data-text="BOOSTER TAI">[ BOOSTER TAI ]</h1>
          <p className="hero-subtitle">ЛЕГАЛЬНИЙ ДОФАМІН ДЛЯ ТВОЄЇ ПРОДУКТИВНОСТІ</p>
          <div className="mesh-placeholder">
            <div className="scanline"></div>
            <span>// 3D BOOSTER CAN RENDER INCOMING //</span>
            <div className="stats-overlay">
              <p>VOL: 330ml</p>
              <p>STATUS: ACTIVE</p>
            </div>
          </div>
          <button className="action-btn glitching glow-btn" onClick={() => window.scrollTo({ top: document.getElementById('catalog').offsetTop, behavior: 'smooth' })}>
            ACCESS CATALOG {'>'}
          </button>
        </div>
      </section>

      {/* TWO TABS: PRODUCT CATALOG vs CYBER BLOG FEED */}
      <div className="store-tabs">
        <button className={`store-tab ${activeTab === 'catalog' ? 'active' : ''}`} onClick={() => setActiveTab('catalog')}>
          [ PRODUCTS ]
        </button>
        <button className={`store-tab ${activeTab === 'feed' ? 'active' : ''}`} onClick={() => setActiveTab('feed')}>
          [ FEED ]
        </button>
      </div>

      {activeTab === 'catalog' && (
        <section id="catalog" className="catalog-section">
          <div className="product-grid">
            {products.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image-placeholder">
                  [ {product.category.toUpperCase()} VISUAL ]
                </div>
                <div className="product-details">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-desc">{product.description}</p>
                  <div className="product-footer">
                    <span className="product-price">{product.price.toFixed(2)} UAH</span>
                    <button className="buy-btn action-btn glitching" style={{width: 'auto'}} onClick={() => handleBuy(product)}>
                      + ADD
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'feed' && (
        <section className="catalog-section feed-section">
          <div className="product-grid">
            {articles.map(article => (
               <div key={article.id} className="article-card">
                 <div className="article-icon">{article.image}</div>
                 <div className="article-content">
                   <h3 className="article-title">{article.title}</h3>
                   <span className="article-meta">{article.readTime}</span>
                   <p className="article-desc">{article.excerpt}</p>
                   <button className="read-btn action-btn orange" style={{marginTop: '10px'}} onClick={() => setActiveTab('catalog')}>
                     ЧИТАТИ ДАЛІ {'>'}
                   </button>
                 </div>
               </div>
            ))}
          </div>
          <div className="feed-footer-msg">
            <p className="cyber-glitch-text" style={{fontSize: '0.8rem', textAlign: 'center', marginTop: '20px'}}>
              // END OF FEED //
            </p>
          </div>
        </section>
      )}

      <style>{`
        .store-front-container { padding-bottom: 20px; }
        .hero-section {
          min-height: 70vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 20px;
          border-bottom: 1px dashed var(--neon-blue);
          margin-bottom: 30px;
        }
        .hero-subtitle {
          color: var(--text-muted);
          font-family: 'Space Mono', monospace;
          margin-bottom: 30px;
          letter-spacing: 2px;
          font-size: 0.9rem;
        }
        .mesh-placeholder {
          width: 250px;
          height: 350px;
          margin: 0 auto 30px;
          border: 1px solid var(--neon-green);
          background: rgba(57, 255, 20, 0.05);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          color: var(--neon-green);
          text-shadow: 0 0 5px var(--neon-green-glow);
          overflow: hidden;
          box-shadow: inset 0 0 20px var(--neon-green-glow);
        }
        .scanline {
          position: absolute;
          top: 0; left: 0; right: 0; height: 5px;
          background: var(--neon-green);
          opacity: 0.5;
          animation: scan 3s infinite linear;
        }
        @keyframes scan {
          0% { top: -10%; }
          100% { top: 110%; }
        }
        .stats-overlay {
          position: absolute;
          bottom: 10px; right: 10px;
          text-align: right;
          font-size: 0.6rem;
          color: rgba(255,255,255,0.5);
        }
        .glow-btn { box-shadow: 0 0 15px var(--neon-blue-glow); border-color: var(--neon-blue); color: var(--neon-blue); }
        .glow-btn:hover { background: var(--neon-blue); color: #000; }
        
        .catalog-section { padding: 0 20px; }
        .store-tabs { display: flex; justify-content: center; gap: 10px; margin-bottom: 20px; border-bottom: 1px solid var(--border-dark); padding: 0 20px; }
        .store-tab { background: none; border: none; color: var(--text-muted); font-family: inherit; font-size: 1rem; padding: 10px; cursor: pointer; transition: all 0.3s; border-bottom: 2px solid transparent; }
        .store-tab.active { color: var(--neon-blue); text-shadow: 0 0 10px var(--neon-blue-glow); border-bottom-color: var(--neon-blue); }
        .product-grid { display: flex; flex-direction: column; gap: 20px; }
        .product-card {
          background: var(--bg-card);
          border: 1px solid var(--border-dark);
          border-radius: 8px;
          overflow: hidden;
          transition: transform 0.2s;
        }
        .product-card:active { transform: scale(0.98); border-color: var(--neon-orange); }
        .product-image-placeholder {
          height: 150px;
          background: rgba(0, 204, 255, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--neon-blue);
          font-size: 0.8rem;
          border-bottom: 1px solid var(--neon-blue);
        }
        .product-details { padding: 15px; }
        .product-name { color: #fff; font-size: 1.2rem; margin-bottom: 5px; }
        .product-desc { color: var(--text-muted); font-size: 0.85rem; margin-bottom: 15px; line-height: 1.4; height: 40px; }
        .product-footer { display: flex; justify-content: space-between; align-items: center; }
        .product-price { color: var(--neon-green); font-weight: bold; font-family: monospace; font-size: 1.3rem; }
        
        .article-card { background: rgba(0,0,0,0.6); border: 1px solid var(--border-dark); border-left: 3px solid var(--neon-orange); display: flex; padding: 15px; gap: 15px; align-items: flex-start; }
        .article-icon { font-size: 2rem; background: rgba(255, 153, 0, 0.1); padding: 10px; border-radius: 8px; }
        .article-title { color: #fff; font-size: 1.1rem; margin-bottom: 5px; }
        .article-meta { color: var(--neon-orange); font-size: 0.7rem; font-family: monospace; margin-bottom: 10px; display: block; }
        .article-desc { color: var(--text-muted); font-size: 0.85rem; line-height: 1.4; }
      `}</style>
    </div>
  );
}
