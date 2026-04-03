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
  | { event: 'blog_related_click'; from_slug: string; to_slug: string }
  | { event: 'blog_mechanic_interaction'; article_slug: string; mechanic_type: string; mechanic_value: string | number }
  | { event: 'b2b_mechanic_interaction'; mechanic_type: string; mechanic_value: string | number }
  | { event: 'b2b_protocol_completed'; mechanic_type: string; mechanic_value: string }
  | { event: 'b2b_resource_download'; resource_id: string; format: string }
  | { event: 'b2b_lead_submission'; business_type: string }
  | { event: 'b2b_faq_read'; question_index: number }
  | { event: 'cabinet_profile_sync'; completion_score: number }
  | { event: 'cabinet_bonus_claimed'; points: number }
  | { event: 'cabinet_referral_shared'; platform: string }
  | { event: 'cabinet_c2b2b_lead'; cafe_name: string };

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

// Helper to push GTM events
export const pushGTMEvent = (event: GTMEvent) => {
  if (typeof window !== 'undefined') {
    // Google Tag Manager
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(event);
    
    // Also try gtag if available
    if (window.gtag) {
      window.gtag('event', event.event, Object.fromEntries(
        Object.entries(event).filter(([k]) => k !== 'event')
      ));
    }

    // Meta Pixel Deep Integration for Biohacking Context
    if ((window as any).fbq) {
      const fbq = (window as any).fbq;
      const eventData = Object.fromEntries(
        Object.entries(event).filter(([k]) => k !== 'event')
      );

      // We explicitly map 'blog_view' and high-engagement scrolls to 'ViewContent'
      // This is crucial to inform the ad network about the exact content flavor (biohacking vs recipes)
      if (event.event === 'blog_view') {
        fbq('track', 'ViewContent', {
          content_name: event.article_slug,
          content_category: event.category,
          content_type: 'product_interest', // Treating blog read as product interest
          ...eventData
        });
      } else if (event.event === 'blog_scroll_50' || event.event === 'blog_scroll_75') {
        fbq('trackCustom', 'DeepEngagement', {
          content_name: event.article_slug,
          scroll_depth: event.event.split('_').pop(),
        });
      } else if (event.event === 'blog_mechanic_interaction') {
        fbq('trackCustom', 'DeepEngagement', {
          content_name: event.article_slug,
          action: 'mechanic',
          type: event.mechanic_type,
          value: event.mechanic_value
        });
      } else if (event.event === 'b2b_mechanic_interaction' || event.event === 'b2b_protocol_completed' || event.event === 'b2b_resource_download' || event.event === 'b2b_faq_read' || event.event === 'b2b_lead_submission') {
        fbq('trackCustom', 'B2BEngagement', {
          action: event.event,
          ...eventData
        });
      } else if (event.event.startsWith('cabinet_')) {
        // Cabinet Events map to B2C Engagement and specific bottom-funnel events
        if (event.event === 'cabinet_c2b2b_lead') {
          fbq('track', 'Lead', {
            content_name: 'C2B2B Hunt',
            ...eventData
          });
        } else if (event.event === 'cabinet_profile_sync') {
          fbq('track', 'CompleteRegistration', {
            content_name: 'Profile Synergy',
            ...eventData
          });
        } else {
          fbq('trackCustom', 'B2CEngagement', {
            action: event.event,
            ...eventData
          });
        }
      } else {
        // Track other blog custom actions
        fbq('trackCustom', event.event, eventData);
      }
    }
  }
};
