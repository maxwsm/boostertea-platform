import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useI18n, Language } from '../lib/i18n';

export interface SEOProps {
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
  };
  product?: {
    price: number;
    currency?: string;
    availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
    brand?: string;
    sku?: string;
    reviewCount?: number;
    ratingValue?: number;
  };
  breadcrumbs?: Array<{ name: string; url: string }>;
  faq?: Array<{ question: string; answer: string }>;
  noIndex?: boolean;
}

// Base URL for the site
const BASE_URL = 'https://www.boostertea.com.ua';

// Organization structured data
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'BoosterTea',
  alternateName: 'Booster Tea Ukraine',
  url: BASE_URL,
  logo: `${BASE_URL}/og-image.png`,
  description: 'Ukrainian premium tea concentrates brand. Ready drink in 15 seconds.',
  foundingDate: '2023',
  foundingLocation: {
    '@type': 'Place',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Lviv',
      addressCountry: 'UA'
    }
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+380963109622',
      contactType: 'customer service',
      areaServed: 'UA',
      availableLanguage: ['Ukrainian', 'English', 'Spanish']
    },
    {
      '@type': 'ContactPoint',
      telephone: '+380963109622',
      contactType: 'sales',
      areaServed: 'UA'
    }
  ],
  sameAs: [
    'https://www.instagram.com/booster_tea_ua',
    'https://www.tiktok.com/@booster_tea',
    'https://t.me/boostertea_b2b_bot'
  ],
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'вул. Богдана Хмельницького 66а',
    addressLocality: 'Львів',
    addressRegion: 'Львівська область',
    postalCode: '79000',
    addressCountry: 'UA'
  },
  email: 'office@boostertea.com.ua'
};

// Local Business structured data
const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${BASE_URL}/#localbusiness`,
  name: 'BoosterTea',
  image: `${BASE_URL}/og-image.png`,
  telephone: '+380963109622',
  email: 'office@boostertea.com.ua',
  url: BASE_URL,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'вул. Богдана Хмельницького 66а',
    addressLocality: 'Львів',
    addressRegion: 'Львівська область',
    postalCode: '79000',
    addressCountry: 'UA'
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '49.8397',
    longitude: '24.0297'
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00'
    }
  ],
  priceRange: '₴₴'
};

// Website with SearchAction structured data
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${BASE_URL}/#website`,
  url: BASE_URL,
  name: 'BoosterTea',
  description: 'Premium tea concentrates - ready drink in 15 seconds',
  publisher: {
    '@id': `${BASE_URL}/#organization`
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/products?search={search_term_string}`
    },
    'query-input': 'required name=search_term_string'
  },
  inLanguage: ['uk', 'en', 'es']
};

// Generate product schema
const generateProductSchema = (product: SEOProps['product'], title: string, description: string, url: string, image: string) => {
  if (!product) return null;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: title,
    description: description,
    image: image,
    url: url,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'BoosterTea'
    },
    sku: product.sku,
    mpn: product.sku,
    category: 'Health & Wellness > Supplements > Nootropics',
    audience: {
      '@type': 'Audience',
      audienceType: 'Biohackers, Professionals, Wellness Enthusiasts'
    },
    isSimilarTo: [
      {
        '@type': 'Product',
        name: 'Natural Nootropics'
      },
      {
        '@type': 'Product',
        name: 'L-Theanine Supplements'
      }
    ],
    // Deep semantic categorization
    keywords: 'біохакінг, ноотропи, фокус, енергія, енергетик без цукру, натуральний енергетик, теанін, здоров\'я',
    manufacturer: {
      '@type': 'Organization',
      name: 'BoosterTea',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'UA',
        addressLocality: 'Lviv'
      }
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency || 'UAH',
      availability: `https://schema.org/${product.availability || 'InStock'}`,
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'BoosterTea'
      },
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'UA'
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          businessDays: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
          },
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 2,
            unitCode: 'd'
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 3,
            unitCode: 'd'
          }
        }
      }
    },
    ...(product.reviewCount && product.ratingValue ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.ratingValue,
        reviewCount: product.reviewCount,
        bestRating: '5',
        worstRating: '1'
      }
    } : {})
  };
};

// Generate breadcrumb schema
const generateBreadcrumbSchema = (breadcrumbs: SEOProps['breadcrumbs']) => {
  if (!breadcrumbs || breadcrumbs.length === 0) return null;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url === '/' ? BASE_URL : (item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`)
    }))
  };
};

// Generate FAQ schema for B2B page
export const generateFAQSchema = (faqs: Array<{ question: string; answer: string }>) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
};

// Language to locale mapping
const languageToLocale: Record<Language, string> = {
  uk: 'uk_UA',
  en: 'en_US',
  es: 'es_ES'
};

// Language to hreflang mapping
const languageToHreflang: Record<Language, string> = {
  uk: 'uk',
  en: 'en',
  es: 'es'
};

export const SEO = ({
  title,
  description,
  image = '/og-image.png',
  type = 'website',
  article,
  product,
  breadcrumbs,
  faq,
  noIndex = false
}: SEOProps) => {
  const location = usePathname() || '/';
  const { language } = useI18n();
  
  const fullTitle = `${title} | BoosterTea`;
  const fullUrl = `${BASE_URL}${location}`;
  const fullImage = image.startsWith('http') ? image : `${BASE_URL}${image}`;
  const locale = languageToLocale[language];

  useEffect(() => {
    // Update document title
    document.title = fullTitle;
    document.documentElement.lang = languageToHreflang[language];

    // Масив для зберігання створених елементів, щоб видалити їх при переході на іншу сторінку
    const appendedElements: HTMLElement[] = [];

    // Helper to create, append and track meta tags
    const addMeta = (attrs: Record<string, string>) => {
      const meta = document.createElement('meta');
      Object.entries(attrs).forEach(([key, value]) => meta.setAttribute(key, value));
      document.head.appendChild(meta);
      appendedElements.push(meta); // Додаємо в трекер
    };

    // Helper to create, append and track link tags
    const addLink = (attrs: Record<string, string>) => {
      const link = document.createElement('link');
      Object.entries(attrs).forEach(([key, value]) => link.setAttribute(key, value));
      document.head.appendChild(link);
      appendedElements.push(link); // Додаємо в трекер
    };

    // Helper to add and track JSON-LD script
    const addJsonLd = (data: object) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(data);
      document.head.appendChild(script);
      appendedElements.push(script); // Додаємо в трекер
    };

    // --- Basic meta tags ---
    addMeta({ name: 'description', content: description });
    addMeta({ name: 'robots', content: noIndex ? 'noindex,nofollow' : 'index,max-snippet:-1,max-image-preview:large,max-video-preview:-1' });

    // Canonical & Hreflang
    addLink({ rel: 'canonical', href: fullUrl });
    Object.entries(languageToHreflang).forEach(([lang, hreflang]) => {
      addLink({ rel: 'alternate', hreflang: hreflang, href: fullUrl });
    });
    addLink({ rel: 'alternate', hreflang: 'x-default', href: fullUrl });

    // --- Open Graph tags ---
    addMeta({ property: 'og:title', content: fullTitle });
    addMeta({ property: 'og:description', content: description });
    addMeta({ property: 'og:image', content: fullImage });
    addMeta({ property: 'og:image:width', content: '1200' });
    addMeta({ property: 'og:image:height', content: '630' });
    addMeta({ property: 'og:url', content: fullUrl });
    addMeta({ property: 'og:type', content: type === 'product' ? 'product' : type });
    addMeta({ property: 'og:site_name', content: 'BoosterTea' });
    addMeta({ property: 'og:locale', content: locale });

    const alternateLocales = Object.values(languageToLocale).filter(l => l !== locale);
    alternateLocales.forEach(altLocale => {
      addMeta({ property: 'og:locale:alternate', content: altLocale });
    });

    // Article-specific OG tags
    if (article) {
      if (article.publishedTime) addMeta({ property: 'article:published_time', content: article.publishedTime });
      if (article.modifiedTime) addMeta({ property: 'article:modified_time', content: article.modifiedTime });
      if (article.author) addMeta({ property: 'article:author', content: article.author });
    }

    // Product-specific OG tags
    if (product) {
      addMeta({ property: 'product:price:amount', content: product.price.toString() });
      addMeta({ property: 'product:price:currency', content: product.currency || 'UAH' });
      addMeta({ property: 'product:availability', content: product.availability || 'in stock' });
      if (product.brand) addMeta({ property: 'product:brand', content: product.brand });
    }

    // --- Twitter Card tags ---
    addMeta({ name: 'twitter:card', content: 'summary_large_image' });
    addMeta({ name: 'twitter:site', content: '@booster_tea_ua' });
    addMeta({ name: 'twitter:title', content: fullTitle });
    addMeta({ name: 'twitter:description', content: description });
    addMeta({ name: 'twitter:image', content: fullImage });

    // --- JSON-LD Structured Data ---
    addJsonLd({ ...organizationSchema, '@id': `${BASE_URL}/#organization` });

    if (location === '/' || location === '/contacts') addJsonLd(localBusinessSchema);
    if (location === '/') addJsonLd(websiteSchema);

    const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);
    if (breadcrumbSchema) addJsonLd(breadcrumbSchema);

    if (product) {
      const productSchema = generateProductSchema(product, title, description, fullUrl, fullImage);
      if (productSchema) addJsonLd(productSchema);
    }

    if (faq && faq.length > 0) addJsonLd(generateFAQSchema(faq));

    // --- CLEANUP FUNCTION (КРИТИЧНО ДЛЯ SPA) ---
    return () => {
      // Видаляємо всі додані теги при переході на інший роут, 
      // щоб вони не дублювалися в <head>
      appendedElements.forEach(el => {
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });
    };
  }, [fullTitle, description, fullUrl, fullImage, type, article, product, breadcrumbs, faq, locale, noIndex, location]);

  return null;
};

// Predefined SEO configs for common pages
export const seoConfigs = {
  home: {
    uk: {
      title: 'Рідкий Пуер та ГАБА чай | Преміальні чайні концентрати',
      description: 'Купити справжній китайський чай у форматі концентрату від BoosterTea. Рідкий Пуер для енергії, ГАБА чай для фокусу. Без цукру. Натуральний концентрат чаю за 15 секунд.'
    },
    en: {
      title: 'Premium Tea Concentrates',
      description: 'BoosterTea — Ukrainian premium tea concentrates brand. Ready drink in 15 seconds. Pu-erh, Da Hong Pao, GABA tea. Natural ingredients, incredible taste.'
    },
    es: {
      title: 'Concentrados de Té Premium',
      description: 'BoosterTea — marca ucraniana de concentrados de té premium. Bebida lista en 15 segundos. Pu-erh, Da Hong Pao, té GABA. Ingredientes naturales, sabor increíble.'
    }
  },
  products: {
    uk: {
      title: 'Купити Пуер, ГАБА, Да Хун Пао | Каталог чаю',
      description: 'Каталог преміальних рідких чаїв BoosterTea. Замовити справжній китайський чай: Шу Пуер (потужна енергія), Да Хун Пао (баланс), ГАБА (релакс та фокус). Доставка по Україні.'
    },
    en: {
      title: 'Product Catalog',
      description: 'BoosterTea premium tea concentrates catalog. Pu-erh for energy, Da Hong Pao for classic taste, GABA for relaxation. Delivery across Ukraine.'
    },
    es: {
      title: 'Catálogo de Productos',
      description: 'Catálogo de concentrados de té premium BoosterTea. Pu-erh para energía, Da Hong Pao para sabor clásico, GABA para relajación. Entrega en toda Ucrania.'
    }
  },
  accessories: {
    uk: {
      title: 'Чайні аксесуари',
      description: 'Каталог чайних аксесуарів BoosterTea. Термоси, кружки, чашки, піали та сухий чай для справжніх поціновувачів. Доставка по всій Україні.'
    },
    en: {
      title: 'Tea Accessories',
      description: 'BoosterTea tea accessories catalog. Thermoses, mugs, cups, pialas and dry tea for true connoisseurs. Delivery across Ukraine.'
    },
    es: {
      title: 'Accesorios de Té',
      description: 'Catálogo de accesorios de té BoosterTea. Termos, tazas, copas, pialas y té seco para verdaderos conocedores. Entrega en toda Ucrania.'
    }
  },
  b2b: {
    uk: {
      title: 'B2B партнерство для бізнесу',
      description: 'Станьте партнером BoosterTea. Преміальний чай для вашого закладу без зайвих клопотів. Калькулятор прибутку, підтримка, навчання персоналу.'
    },
    en: {
      title: 'B2B Business Partnership',
      description: 'Become a BoosterTea partner. Premium tea for your establishment without hassle. Profit calculator, support, staff training.'
    },
    es: {
      title: 'Asociación B2B para Empresas',
      description: 'Conviértase en socio de BoosterTea. Té premium para su establecimiento sin complicaciones. Calculadora de beneficios, soporte, capacitación del personal.'
    }
  },
  blog: {
    uk: {
      title: 'Блог про чай',
      description: 'Блог BoosterTea про китайський чай. Корисні статті про пуер, улуни, ГАБА чай. Історія, культура та секрети заварювання.'
    },
    en: {
      title: 'Tea Blog',
      description: 'BoosterTea blog about Chinese tea. Useful articles about pu-erh, oolong, GABA tea. History, culture and brewing secrets.'
    },
    es: {
      title: 'Blog de Té',
      description: 'Blog de BoosterTea sobre té chino. Artículos útiles sobre pu-erh, oolong, té GABA. Historia, cultura y secretos de preparación.'
    }
  },
  cart: {
    uk: {
      title: 'Кошик',
      description: 'Ваш кошик покупок BoosterTea. Оформіть замовлення та отримайте преміальний чай з доставкою по Україні.'
    },
    en: {
      title: 'Cart',
      description: 'Your BoosterTea shopping cart. Place your order and receive premium tea with delivery across Ukraine.'
    },
    es: {
      title: 'Carrito',
      description: 'Tu carrito de compras BoosterTea. Realiza tu pedido y recibe té premium con entrega en toda Ucrania.'
    }
  },
  account: {
    uk: {
      title: 'Мій акаунт',
      description: 'Особистий кабінет BoosterTea. Відстежуйте замовлення, накопичуйте бонуси, керуйте профілем.'
    },
    en: {
      title: 'My Account',
      description: 'BoosterTea personal account. Track orders, earn bonuses, manage your profile.'
    },
    es: {
      title: 'Mi Cuenta',
      description: 'Cuenta personal de BoosterTea. Rastrea pedidos, gana bonos, gestiona tu perfil.'
    }
  },
  contacts: {
    uk: {
      title: 'Контакти',
      description: 'Зв\'яжіться з BoosterTea. Телефон: +380 96 310 96 22. Адреса: Львів, вул. Богдана Хмельницького 66а. Email: office@boostertea.com.ua'
    },
    en: {
      title: 'Contacts',
      description: 'Contact BoosterTea. Phone: +380 96 310 96 22. Address: Lviv, 66a Bohdana Khmelnytskoho St. Email: office@boostertea.com.ua'
    },
    es: {
      title: 'Contactos',
      description: 'Contacte con BoosterTea. Teléfono: +380 96 310 96 22. Dirección: Lviv, calle Bohdana Khmelnytskoho 66a. Email: office@boostertea.com.ua'
    }
  },
  login: {
    uk: {
      title: 'Вхід',
      description: 'Увійдіть до свого акаунту BoosterTea щоб відстежувати замовлення та накопичувати бонуси.'
    },
    en: {
      title: 'Login',
      description: 'Log in to your BoosterTea account to track orders and earn bonuses.'
    },
    es: {
      title: 'Iniciar Sesión',
      description: 'Inicia sesión en tu cuenta BoosterTea para rastrear pedidos y ganar bonos.'
    }
  },
  register: {
    uk: {
      title: 'Реєстрація',
      description: 'Створіть акаунт BoosterTea. Отримуйте бонуси за кожне замовлення, ексклюзивні знижки та швидке оформлення.'
    },
    en: {
      title: 'Register',
      description: 'Create a BoosterTea account. Earn bonuses for every order, exclusive discounts and fast checkout.'
    },
    es: {
      title: 'Registrarse',
      description: 'Crea una cuenta BoosterTea. Gana bonos por cada pedido, descuentos exclusivos y pago rápido.'
    }
  },
  adaptation: {
    uk: {
      title: 'Адаптація для бізнесу',
      description: 'Повний гайд з інтеграції BoosterTea у ваш бізнес. Покрокова інструкція, навчання персоналу, маркетингова підтримка.'
    },
    en: {
      title: 'Business Adaptation',
      description: 'Complete guide to integrating BoosterTea into your business. Step-by-step instructions, staff training, marketing support.'
    },
    es: {
      title: 'Adaptación para Empresas',
      description: 'Guía completa para integrar BoosterTea en tu negocio. Instrucciones paso a paso, capacitación del personal, soporte de marketing.'
    }
  },
  admin: {
    uk: {
      title: 'Адмін панель',
      description: 'Панель адміністратора BoosterTea.'
    },
    en: {
      title: 'Admin Panel',
      description: 'BoosterTea admin panel.'
    },
    es: {
      title: 'Panel de Administración',
      description: 'Panel de administración de BoosterTea.'
    }
  },
  notFound: {
    uk: {
      title: '404 - Сторінку не знайдено',
      description: 'Ой! Здається, цієї сторінки не існує. Поверніться на головну та знайдіть свій ідеальний чай.'
    },
    en: {
      title: '404 - Page Not Found',
      description: 'Oops! This page doesn\'t seem to exist. Return to homepage and find your perfect tea.'
    },
    es: {
      title: '404 - Página No Encontrada',
      description: '¡Ups! Esta página parece no existir. Vuelve a la página principal y encuentra tu té perfecto.'
    }
  },
  checkout: {
    uk: {
      title: 'Оформлення замовлення',
      description: 'Оформіть замовлення на BoosterTea. Швидка оплата, безпечна доставка по всій Україні.'
    },
    en: {
      title: 'Checkout',
      description: 'Complete your BoosterTea order. Fast payment, secure delivery across Ukraine.'
    },
    es: {
      title: 'Finalizar Compra',
      description: 'Completa tu pedido de BoosterTea. Pago rápido, entrega segura en toda Ucrania.'
    }
  },
  orderSuccess: {
    uk: {
      title: 'Замовлення прийнято',
      description: 'Дякуємо за ваше замовлення на BoosterTea! Ваш чай вже в дорозі.'
    },
    en: {
      title: 'Order Confirmed',
      description: 'Thank you for your BoosterTea order! Your tea is on its way.'
    },
    es: {
      title: 'Pedido Confirmado',
      description: '¡Gracias por tu pedido de BoosterTea! Tu té está en camino.'
    }
  },
  certificates: {
    uk: {
      title: 'Сертифікати якості',
      description: 'Сертифікати якості BoosterTea. HACCP, ISO 22000, лабораторні тести. Гарантія натуральності та безпеки нашої продукції.'
    },
    en: {
      title: 'Quality Certificates',
      description: 'BoosterTea quality certificates. HACCP, ISO 22000, laboratory tests. Guarantee of natural and safe products.'
    },
    es: {
      title: 'Certificados de Calidad',
      description: 'Certificados de calidad de BoosterTea. HACCP, ISO 22000, pruebas de laboratorio. Garantía de productos naturales y seguros.'
    }
  }
};

// Helper hook to get SEO config based on current language
export const useSEOConfig = (page: keyof typeof seoConfigs) => {
  const { language } = useI18n();
  return seoConfigs[page][language];
};

export default SEO;
