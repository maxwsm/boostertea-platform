// Blog post types for BoosterTea blog

export interface BlogPostMeta {
  id: number;
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  category: 'recipe' | 'culture' | 'science' | 'production' | 'tips';
  tags: string[];
  date: string;
  readingTime: number;
  coverImage: string;
  coverAlt: string;
  ogImage: string;
  author: string;
  featured: boolean;
  schema: ('Article' | 'Recipe' | 'FAQPage' | 'HowTo')[];
  internalLinks?: InternalLink[];
  productLinks?: ProductLink[];
  faq?: FAQItem[];
}

export interface InternalLink {
  slug: string;
  anchor: string;
}

export interface ProductLink {
  product: string;
  anchor: string;
}

export interface FAQItem {
  q: string;
  a: string;
}

export interface BlogPost extends BlogPostMeta {
  content: string;
  rawContent: string;
}

export interface RecipeIngredient {
  name: string;
  amount: string;
  link?: string;
}

export interface RecipeCardProps {
  title: string;
  prepTime: string;
  servings: number;
  difficulty: 'легко' | 'середня' | 'складно';
  calories?: number;
  ingredients: RecipeIngredient[];
  steps: string[];
}

export interface TeaTimelineStage {
  time: string;
  label: string;
  color: string;
  description: string;
}

export interface TeaTimelineProps {
  stages: TeaTimelineStage[];
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export interface CategoryInfo {
  slug: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
}

export const CATEGORY_MAP: Record<string, CategoryInfo> = {
  recipe: {
    slug: 'recipe',
    name: 'Рецепти',
    emoji: '🧋',
    color: '#7CB342',
    description: 'Рецепти напоїв з чайних концентратів'
  },
  culture: {
    slug: 'culture',
    name: 'Культура',
    emoji: '🏛️',
    color: '#AB47BC',
    description: 'Китайська чайна культура та традиції'
  },
  science: {
    slug: 'science',
    name: 'Наука чаю',
    emoji: '🔬',
    color: '#29B6F6',
    description: 'Наукові аспекти чаю та ферментації'
  },
  production: {
    slug: 'production',
    name: 'Виробництво',
    emoji: '🌿',
    color: '#8D6E63',
    description: 'Клімат, виробництво та терруар чаю'
  },
  tips: {
    slug: 'tips',
    name: 'Лайфхаки',
    emoji: '💡',
    color: '#FFB300',
    description: 'Корисні поради та лайфхаки'
  }
};

// GTM Event types
export type GTMEvent =
  | { event: 'blog_view'; article_slug: string; category: string; tags: string[] }
  | { event: 'blog_scroll_25'; article_slug: string }
  | { event: 'blog_scroll_50'; article_slug: string }
  | { event: 'blog_scroll_75'; article_slug: string }
  | { event: 'blog_scroll_100'; article_slug: string }
  | { event: 'blog_share'; article_slug: string; platform: string }
  | { event: 'blog_recipe_print'; article_slug: string; recipe_name: string }
  | { event: 'blog_cta_click'; article_slug: string; product: string }
  | { event: 'blog_quiz_complete'; article_slug: string; score: number }
  | { event: 'blog_time_on_page'; article_slug: string; seconds: number }
  | { event: 'blog_related_click'; from_slug: string; to_slug: string };

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

// Helper to push GTM events
export const pushGTMEvent = (event: GTMEvent) => {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(event);
    
    // Also try gtag if available
    if (window.gtag) {
      window.gtag('event', event.event, Object.fromEntries(
        Object.entries(event).filter(([k]) => k !== 'event')
      ));
    }
  }
};
