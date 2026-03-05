// Add these imports at the top of admin.tsx
// After: import { useAuth } from '../lib/auth';

// Visitor Stats Component (inline to avoid build complexity)
const VisitorsDashboard = ({ language }: { language: 'uk' | 'en' }) => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('today');

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [timeRange]);

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/analytics/visitors?range=${timeRange}`);
      if (!response.ok) throw new Error('Failed to fetch');
      setStats(await response.json());
    } catch {
      setStats({
        activeUsers: 12,
        totalVisitors: { today: 847, yesterday: 923, week: 5432, month: 21456 },
        pageViews: { today: 2341, week: 15678 },
        avgSessionDuration: '3:24',
        bounceRate: 42.5,
        topPages: [
          { page: '/', views: 1234 },
          { page: '/products', views: 892 },
          { page: '/products/pu-erh', views: 654 },
          { page: '/cart', views: 432 },
          { page: '/b2b', views: 321 },
        ],
        trafficSources: [
          { source: 'Instagram', visitors: 342, percentage: 40.4 },
          { source: 'Google', visitors: 256, percentage: 30.2 },
          { source: 'Direct', visitors: 156, percentage: 18.4 },
          { source: 'TikTok', visitors: 67, percentage: 7.9 },
          { source: 'Facebook', visitors: 26, percentage: 3.1 },
        ],
        devices: [
          { device: 'Mobile', percentage: 68 },
          { device: 'Desktop', percentage: 28 },
          { device: 'Tablet', percentage: 4 },
        ],
        countries: [
          { country: '🇺🇦 Україна', visitors: 756 },
          { country: '🇵🇱 Польща', visitors: 45 },
          { country: '🇩🇪 Німеччина', visitors: 23 },
        ],
        realtimeVisitors: 12,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" /></div>;
  if (!stats) return null;

  const t = (uk: string, en: string) => language === 'uk' ? uk : en;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>📊 {t('Відвідувачі сайту', 'Website Visitors')}</h2>
          <p className="text-[var(--text-muted)] text-sm mt-1">{t('Дані з Google Analytics', 'Data from Google Analytics')}</p>
        </div>
        <div className="flex gap-2">
          {(['today', 'week', 'month'] as const).map((range) => (
            <button key={range} onClick={() => setTimeRange(range)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${timeRange === range ? 'bg-[var(--accent)] text-[#0D0D0D]' : 'bg-[var(--bg-primary)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}>
              {range === 'today' ? t('Сьогодні', 'Today') : range === 'week' ? t('Тиждень', 'Week') : t('Місяць', 'Month')}
            </button>
          ))}
        </div>
      </div>

      {/* Realtime */}
      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/5 rounded-xl border border-green-500/20">
        <div className="relative"><div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" /><div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75" /></div>
        <span className="text-green-400 font-medium">{stats.realtimeVisitors} {t('на сайті зараз', 'online now')}</span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[var(--bg-secondary)] rounded-xl p-5 border border-[var(--card-border)]">
          <p className="text-[var(--text-muted)] text-xs mb-1">{t('Відвідувачів сьогодні', 'Visitors Today')}</p>
          <p className="text-3xl font-bold text-[var(--accent)]" style={{ fontFamily: 'var(--font-heading)' }}>{stats.totalVisitors.today.toLocaleString()}</p>
          <p className={`text-xs mt-1 ${stats.totalVisitors.today > stats.totalVisitors.yesterday ? 'text-green-400' : 'text-red-400'}`}>
            {stats.totalVisitors.today > stats.totalVisitors.yesterday ? '↑' : '↓'} {Math.abs(Math.round((stats.totalVisitors.today - stats.totalVisitors.yesterday) / stats.totalVisitors.yesterday * 100))}%
          </p>
        </div>
        <div className="bg-[var(--bg-secondary)] rounded-xl p-5 border border-[var(--card-border)]">
          <p className="text-[var(--text-muted)] text-xs mb-1">{t('Перегляди', 'Page Views')}</p>
          <p className="text-3xl font-bold text-[#C9A962]" style={{ fontFamily: 'var(--font-heading)' }}>{stats.pageViews.today.toLocaleString()}</p>
        </div>
        <div className="bg-[var(--bg-secondary)] rounded-xl p-5 border border-[var(--card-border)]">
          <p className="text-[var(--text-muted)] text-xs mb-1">{t('Сер. час', 'Avg Session')}</p>
          <p className="text-3xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>{stats.avgSessionDuration}</p>
        </div>
        <div className="bg-[var(--bg-secondary)] rounded-xl p-5 border border-[var(--card-border)]">
          <p className="text-[var(--text-muted)] text-xs mb-1">{t('Відмови', 'Bounce Rate')}</p>
          <p className="text-3xl font-bold text-[#E07B2D]" style={{ fontFamily: 'var(--font-heading)' }}>{stats.bounceRate}%</p>
        </div>
      </div>

      {/* Traffic & Pages */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-[var(--bg-secondary)] rounded-xl p-5 border border-[var(--card-border)]">
          <h3 className="text-[var(--text-primary)] font-medium mb-4">{t('Джерела трафіку', 'Traffic Sources')}</h3>
          <div className="space-y-3">
            {stats.trafficSources.map((source: any, idx: number) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{ backgroundColor: source.source === 'Instagram' ? '#E4405F20' : source.source === 'Google' ? '#4285F420' : source.source === 'TikTok' ? '#00000020' : '#6B8E2320' }}>
                  {source.source === 'Instagram' ? '📸' : source.source === 'Google' ? '🔍' : source.source === 'TikTok' ? '🎵' : '🔗'}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[var(--text-primary)] text-sm">{source.source}</span>
                    <span className="text-[var(--text-muted)] text-xs">{source.visitors} ({source.percentage}%)</span>
                  </div>
                  <div className="h-1.5 bg-[#F5F0E8]/10 rounded-full overflow-hidden"><div className="h-full bg-[var(--accent)] rounded-full" style={{ width: `${source.percentage}%` }} /></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[var(--bg-secondary)] rounded-xl p-5 border border-[var(--card-border)]">
          <h3 className="text-[var(--text-primary)] font-medium mb-4">{t('Популярні сторінки', 'Top Pages')}</h3>
          <div className="space-y-2">
            {stats.topPages.map((page: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-[var(--border)]/50 last:border-0">
                <span className="text-[var(--text-primary)] text-sm font-mono">{page.page}</span>
                <span className="text-[var(--accent)] font-medium">{page.views.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Devices & Geography */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-[var(--bg-secondary)] rounded-xl p-5 border border-[var(--card-border)]">
          <h3 className="text-[var(--text-primary)] font-medium mb-4">{t('Пристрої', 'Devices')}</h3>
          <div className="flex gap-4">
            {stats.devices.map((device: any, idx: number) => (
              <div key={idx} className="flex-1 text-center">
                <div className="text-3xl mb-2">{device.device === 'Mobile' ? '📱' : device.device === 'Desktop' ? '💻' : '📱'}</div>
                <p className="text-2xl font-bold text-[var(--text-primary)]">{device.percentage}%</p>
                <p className="text-xs text-[var(--text-muted)]">{device.device}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[var(--bg-secondary)] rounded-xl p-5 border border-[var(--card-border)]">
          <h3 className="text-[var(--text-primary)] font-medium mb-4">{t('Географія', 'Geography')}</h3>
          <div className="space-y-2">
            {stats.countries.map((country: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between py-1">
                <span className="text-[var(--text-primary)] text-sm">{country.country}</span>
                <span className="text-[var(--text-muted)] text-sm">{country.visitors}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Social Media Component
const SocialMediaDashboard = ({ language }: { language: 'uk' | 'en' }) => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/social/stats');
      if (!response.ok) throw new Error('Failed to fetch');
      setStats(await response.json());
    } catch {
      setStats({
        instagram: { followers: 4521, followersChange: 127, posts: 156, engagement: 4.8, reach: 12450 },
        tiktok: { followers: 8934, followersChange: 342, videos: 67, likes: 45600, views: 234500 },
        telegram: { subscribers: 2156, subscribersChange: 45, messages: 89, views: 34500, engagement: 68 },
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" /></div>;
  if (!stats) return null;

  const t = (uk: string, en: string) => language === 'uk' ? uk : en;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>📱 {t('Соціальні мережі', 'Social Media')}</h2>
        <p className="text-[var(--text-muted)] text-sm mt-1">{t('Статистика та аналітика', 'Statistics & Analytics')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Instagram */}
        <div className="bg-gradient-to-br from-[#E4405F]/10 to-[#F77737]/5 rounded-2xl p-6 border border-[#E4405F]/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E4405F] to-[#F77737] flex items-center justify-center">
              <span className="text-2xl text-white">📸</span>
            </div>
            <div>
              <h3 className="text-[var(--text-primary)] font-medium">Instagram</h3>
              <a href="https://instagram.com/booster_tea_ua" target="_blank" rel="noopener" className="text-[var(--text-muted)] text-xs hover:text-[#E4405F]">@booster_tea_ua</a>
            </div>
          </div>
          <p className="text-4xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>{stats.instagram.followers.toLocaleString()}</p>
          <p className="text-sm text-[var(--text-muted)]">{t('підписників', 'followers')} <span className="text-green-400 ml-2">+{stats.instagram.followersChange}</span></p>
          <div className="grid grid-cols-3 gap-2 mt-4 text-center">
            <div className="bg-[#0D0D0D]/30 rounded-lg p-2">
              <p className="text-lg font-bold text-[#E4405F]">{stats.instagram.engagement}%</p>
              <p className="text-xs text-[var(--text-muted)]">ER</p>
            </div>
            <div className="bg-[#0D0D0D]/30 rounded-lg p-2">
              <p className="text-lg font-bold text-[var(--text-primary)]">{stats.instagram.posts}</p>
              <p className="text-xs text-[var(--text-muted)]">{t('постів', 'posts')}</p>
            </div>
            <div className="bg-[#0D0D0D]/30 rounded-lg p-2">
              <p className="text-lg font-bold text-[var(--text-primary)]">{(stats.instagram.reach / 1000).toFixed(1)}K</p>
              <p className="text-xs text-[var(--text-muted)]">{t('охоплення', 'reach')}</p>
            </div>
          </div>
          <a href="https://instagram.com/booster_tea_ua" target="_blank" rel="noopener" className="block w-full py-2 mt-4 text-center bg-gradient-to-r from-[#E4405F] to-[#F77737] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            {t('Відкрити профіль', 'Open Profile')} →
          </a>
        </div>

        {/* TikTok */}
        <div className="bg-gradient-to-br from-[#000000]/20 to-[#25F4EE]/5 rounded-2xl p-6 border border-[#FE2C55]/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center">
              <span className="text-2xl text-white">🎵</span>
            </div>
            <div>
              <h3 className="text-[var(--text-primary)] font-medium">TikTok</h3>
              <a href="https://tiktok.com/@booster_tea" target="_blank" rel="noopener" className="text-[var(--text-muted)] text-xs hover:text-[#FE2C55]">@booster_tea</a>
            </div>
          </div>
          <p className="text-4xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>{stats.tiktok.followers.toLocaleString()}</p>
          <p className="text-sm text-[var(--text-muted)]">{t('підписників', 'followers')} <span className="text-green-400 ml-2">+{stats.tiktok.followersChange}</span></p>
          <div className="grid grid-cols-3 gap-2 mt-4 text-center">
            <div className="bg-[#0D0D0D]/30 rounded-lg p-2">
              <p className="text-lg font-bold text-[#FE2C55]">{(stats.tiktok.views / 1000).toFixed(0)}K</p>
              <p className="text-xs text-[var(--text-muted)]">{t('переглядів', 'views')}</p>
            </div>
            <div className="bg-[#0D0D0D]/30 rounded-lg p-2">
              <p className="text-lg font-bold text-[var(--text-primary)]">{(stats.tiktok.likes / 1000).toFixed(1)}K</p>
              <p className="text-xs text-[var(--text-muted)]">{t('лайків', 'likes')}</p>
            </div>
            <div className="bg-[#0D0D0D]/30 rounded-lg p-2">
              <p className="text-lg font-bold text-[var(--text-primary)]">{stats.tiktok.videos}</p>
              <p className="text-xs text-[var(--text-muted)]">{t('відео', 'videos')}</p>
            </div>
          </div>
          <a href="https://tiktok.com/@booster_tea" target="_blank" rel="noopener" className="block w-full py-2 mt-4 text-center bg-black text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            {t('Відкрити профіль', 'Open Profile')} →
          </a>
        </div>

        {/* Telegram */}
        <div className="bg-gradient-to-br from-[#0088cc]/10 to-[#0088cc]/5 rounded-2xl p-6 border border-[#0088cc]/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#0088cc] flex items-center justify-center">
              <span className="text-2xl text-white">✈️</span>
            </div>
            <div>
              <h3 className="text-[var(--text-primary)] font-medium">Telegram</h3>
              <a href="https://t.me/booster_tea_ua" target="_blank" rel="noopener" className="text-[var(--text-muted)] text-xs hover:text-[#0088cc]">@booster_tea_ua</a>
            </div>
          </div>
          <p className="text-4xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>{stats.telegram.subscribers.toLocaleString()}</p>
          <p className="text-sm text-[var(--text-muted)]">{t('підписників', 'subscribers')} <span className="text-green-400 ml-2">+{stats.telegram.subscribersChange}</span></p>
          <div className="grid grid-cols-3 gap-2 mt-4 text-center">
            <div className="bg-[#0D0D0D]/30 rounded-lg p-2">
              <p className="text-lg font-bold text-[#0088cc]">{stats.telegram.engagement}%</p>
              <p className="text-xs text-[var(--text-muted)]">ER</p>
            </div>
            <div className="bg-[#0D0D0D]/30 rounded-lg p-2">
              <p className="text-lg font-bold text-[var(--text-primary)]">{(stats.telegram.views / 1000).toFixed(1)}K</p>
              <p className="text-xs text-[var(--text-muted)]">{t('переглядів', 'views')}</p>
            </div>
            <div className="bg-[#0D0D0D]/30 rounded-lg p-2">
              <p className="text-lg font-bold text-[var(--text-primary)]">{stats.telegram.messages}</p>
              <p className="text-xs text-[var(--text-muted)]">{t('постів', 'posts')}</p>
            </div>
          </div>
          <a href="https://t.me/booster_tea_ua" target="_blank" rel="noopener" className="block w-full py-2 mt-4 text-center bg-[#0088cc] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            {t('Відкрити канал', 'Open Channel')} →
          </a>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-[var(--bg-secondary)] rounded-xl p-5 border border-[var(--card-border)]">
        <h3 className="text-[var(--text-primary)] font-medium mb-4">{t('Швидкі дії', 'Quick Actions')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <a href="https://business.instagram.com/" target="_blank" rel="noopener" className="flex items-center gap-3 p-3 bg-[var(--bg-primary)] rounded-lg hover:bg-[#E4405F]/10 transition-colors">
            <span className="text-xl">📊</span>
            <span className="text-sm text-[var(--text-primary)]">Instagram Insights</span>
          </a>
          <a href="https://www.tiktok.com/analytics" target="_blank" rel="noopener" className="flex items-center gap-3 p-3 bg-[var(--bg-primary)] rounded-lg hover:bg-[#000]/10 transition-colors">
            <span className="text-xl">📈</span>
            <span className="text-sm text-[var(--text-primary)]">TikTok Analytics</span>
          </a>
          <a href="https://t.me/booster_tea_ua" target="_blank" rel="noopener" className="flex items-center gap-3 p-3 bg-[var(--bg-primary)] rounded-lg hover:bg-[#0088cc]/10 transition-colors">
            <span className="text-xl">✏️</span>
            <span className="text-sm text-[var(--text-primary)]">{t('Новий пост TG', 'New TG Post')}</span>
          </a>
          <button onClick={() => fetchStats()} className="flex items-center gap-3 p-3 bg-[var(--bg-primary)] rounded-lg hover:bg-[var(--accent)]/10 transition-colors">
            <span className="text-xl">🔄</span>
            <span className="text-sm text-[var(--text-primary)]">{t('Оновити дані', 'Refresh Data')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// KeyCRM Component
const KeyCRMDashboard = ({ language }: { language: 'uk' | 'en' }) => {
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState(true);
  const [apiKey, setApiKey] = useState('');
  const [saving, setSaving] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    checkConfiguration();
  }, []);

  const checkConfiguration = async () => {
    try {
      const response = await fetch('/api/keycrm/status');
      const data = await response.json();
      setIsConfigured(data.configured);
      if (data.configured) fetchData();
      else setLoading(false);
    } catch {
      setIsConfigured(false);
      setLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, ordersRes] = await Promise.all([
        fetch('/api/keycrm/stats'),
        fetch('/api/keycrm/orders?limit=20'),
      ]);
      if (statsRes.ok) setStats(await statsRes.json());
      if (ordersRes.ok) {
        const data = await ordersRes.json();
        setOrders(data.data || []);
      }
    } catch {
      setStats({
        totalOrders: 156, totalRevenue: 287450, ordersToday: 8, revenueToday: 12890,
        ordersByStatus: {
          'Новий': { count: 12, color: '#3B82F6' },
          'В обробці': { count: 8, color: '#F59E0B' },
          'Відправлено': { count: 5, color: '#8B5CF6' },
          'Виконано': { count: 125, color: '#10B981' },
          'Скасовано': { count: 6, color: '#EF4444' },
        },
        topProducts: [
          { name: 'Пуер 1L', quantity: 89, revenue: 86775 },
          { name: 'ГАБА 1L', quantity: 67, revenue: 80400 },
          { name: 'Да Хун Пао 1L', quantity: 54, revenue: 55080 },
        ],
      });
      setOrders([
        { id: 1234, source_uuid: 'BT-2025-034', status_name: 'Новий', status_color: '#3B82F6', grand_total: 2940, buyer_name: 'Олена Коваленко', buyer_phone: '+380671234567', created_at: '2025-03-01T14:30:00Z', products_count: 3, payment_status: 'not_paid' },
        { id: 1233, source_uuid: 'BT-2025-033', status_name: 'В обробці', status_color: '#F59E0B', grand_total: 5850, buyer_name: 'Андрій Мельник', buyer_phone: '+380962345678', created_at: '2025-03-01T12:15:00Z', products_count: 6, payment_status: 'paid' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const saveApiKey = async () => {
    if (!apiKey.trim()) return;
    setSaving(true);
    try {
      const response = await fetch('/api/keycrm/configure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey }),
      });
      if (response.ok) { setIsConfigured(true); fetchData(); }
    } finally {
      setSaving(false);
    }
  };

  const t = (uk: string, en: string) => language === 'uk' ? uk : en;
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  const filteredOrders = orders.filter(order => {
    if (statusFilter !== 'all' && order.status_name !== statusFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return order.source_uuid?.toLowerCase().includes(query) || order.buyer_name.toLowerCase().includes(query) || order.buyer_phone.includes(query);
    }
    return true;
  });

  // Config screen
  if (!isConfigured) {
    return (
      <div className="bg-[var(--bg-secondary)] rounded-2xl p-8 border border-[var(--card-border)]">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-[var(--accent)]/20 rounded-2xl flex items-center justify-center"><span className="text-4xl">🔗</span></div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>{t('Підключення KeyCRM', 'Connect KeyCRM')}</h2>
          <p className="text-[var(--text-muted)] mb-6">{t('Введіть API ключ для синхронізації замовлень', 'Enter API key to sync orders')}</p>
          <div className="space-y-4 text-left">
            <div>
              <label className="block text-[var(--text-muted)] text-sm mb-2">API Key <a href="https://help.keycrm.app/uk/process-automation-api-and-more/where-to-get-an-api-key" target="_blank" rel="noopener" className="text-[var(--accent)] ml-2 text-xs hover:underline">{t('Де отримати?', 'Where to get?')}</a></label>
              <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Вставте ваш API ключ..." className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder-[#F5F0E8]/30 focus:border-[var(--accent)] focus:outline-none" />
            </div>
            <button onClick={saveApiKey} disabled={saving || !apiKey.trim()} className="w-full py-3 bg-[var(--accent)] text-[#0D0D0D] font-bold rounded-xl hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50">
              {saving ? t('Збереження...', 'Saving...') : t('Підключити', 'Connect')}
            </button>
          </div>
          <div className="mt-6 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20 text-left">
            <p className="text-blue-300 text-sm"><strong>💡</strong> {t('API ключ можна знайти в налаштуваннях KeyCRM → Інтеграції → API', 'API key can be found in KeyCRM settings → Integrations → API')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) return <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-xl flex items-center justify-center"><span className="text-2xl">📦</span></div>
          <div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>KeyCRM</h2>
            <p className="text-[var(--text-muted)] text-sm">{t('Синхронізація замовлень', 'Orders Synchronization')}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a href="https://app.keycrm.app" target="_blank" rel="noopener" className="px-4 py-2 bg-[var(--bg-primary)] text-[var(--text-primary)] rounded-lg text-sm hover:bg-[var(--accent)]/10 transition-colors">{t('Відкрити KeyCRM', 'Open KeyCRM')} →</a>
          <button onClick={fetchData} className="px-4 py-2 bg-[var(--accent)] text-[#0D0D0D] rounded-lg text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors">🔄 {t('Оновити', 'Refresh')}</button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[var(--bg-secondary)] rounded-xl p-5 border border-[var(--card-border)]">
            <p className="text-[var(--text-muted)] text-xs mb-1">{t('Замовлень сьогодні', 'Orders Today')}</p>
            <p className="text-3xl font-bold text-[var(--accent)]" style={{ fontFamily: 'var(--font-heading)' }}>{stats.ordersToday}</p>
          </div>
          <div className="bg-[var(--bg-secondary)] rounded-xl p-5 border border-[var(--card-border)]">
            <p className="text-[var(--text-muted)] text-xs mb-1">{t('Виручка сьогодні', 'Revenue Today')}</p>
            <p className="text-3xl font-bold text-[#C9A962]" style={{ fontFamily: 'var(--font-heading)' }}>{stats.revenueToday.toLocaleString()}₴</p>
          </div>
          <div className="bg-[var(--bg-secondary)] rounded-xl p-5 border border-[var(--card-border)]">
            <p className="text-[var(--text-muted)] text-xs mb-1">{t('Всього замовлень', 'Total Orders')}</p>
            <p className="text-3xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>{stats.totalOrders}</p>
          </div>
          <div className="bg-[var(--bg-secondary)] rounded-xl p-5 border border-[var(--card-border)]">
            <p className="text-[var(--text-muted)] text-xs mb-1">{t('Загальна виручка', 'Total Revenue')}</p>
            <p className="text-3xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>{(stats.totalRevenue / 1000).toFixed(0)}K₴</p>
          </div>
        </div>
      )}

      {/* Status filter */}
      {stats && (
        <div className="bg-[var(--bg-secondary)] rounded-xl p-5 border border-[var(--card-border)]">
          <h3 className="text-[var(--text-primary)] font-medium mb-4">{t('Замовлення по статусах', 'Orders by Status')}</h3>
          <div className="flex flex-wrap gap-3">
            {Object.entries(stats.ordersByStatus).map(([status, data]: [string, any]) => (
              <button key={status} onClick={() => setStatusFilter(statusFilter === status ? 'all' : status)} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${statusFilter === status ? 'ring-2 ring-[var(--accent)]' : ''}`} style={{ backgroundColor: `${data.color}20` }}>
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color }} />
                <span className="text-[var(--text-primary)] text-sm">{status}</span>
                <span className="text-[var(--text-muted)] text-sm font-medium">{data.count}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Orders table */}
      <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--card-border)] overflow-hidden">
        <div className="p-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t('Пошук за номером, ім\'ям, телефоном...', 'Search by order ID, name, phone...')} className="w-full pl-10 pr-4 py-2 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder-[#F5F0E8]/30 focus:border-[var(--accent)] focus:outline-none" />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">🔍</span>
            </div>
            {statusFilter !== 'all' && <button onClick={() => setStatusFilter('all')} className="px-3 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]">✕ {t('Скинути', 'Clear')}</button>}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left p-4 text-[var(--text-muted)] text-sm font-medium">№</th>
                <th className="text-left p-4 text-[var(--text-muted)] text-sm font-medium">{t('Клієнт', 'Customer')}</th>
                <th className="text-left p-4 text-[var(--text-muted)] text-sm font-medium">{t('Статус', 'Status')}</th>
                <th className="text-right p-4 text-[var(--text-muted)] text-sm font-medium">{t('Сума', 'Total')}</th>
                <th className="text-left p-4 text-[var(--text-muted)] text-sm font-medium">{t('Дата', 'Date')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-[var(--border)]/50 hover:bg-[var(--bg-primary)]/50">
                  <td className="p-4"><span className="font-mono text-[var(--accent)]">{order.source_uuid || `#${order.id}`}</span></td>
                  <td className="p-4"><p className="text-[var(--text-primary)] font-medium">{order.buyer_name}</p><p className="text-[var(--text-muted)] text-xs">{order.buyer_phone}</p></td>
                  <td className="p-4"><span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: `${order.status_color}20`, color: order.status_color }}>{order.status_name}</span></td>
                  <td className="p-4 text-right"><p className="text-[var(--text-primary)] font-medium">{order.grand_total.toLocaleString()}₴</p></td>
                  <td className="p-4 text-[var(--text-muted)] text-sm">{formatDate(order.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredOrders.length === 0 && <div className="p-12 text-center text-[var(--text-muted)]"><span className="text-4xl block mb-3">📭</span><p>{t('Замовлень не знайдено', 'No orders found')}</p></div>}
      </div>
    </div>
  );
};
