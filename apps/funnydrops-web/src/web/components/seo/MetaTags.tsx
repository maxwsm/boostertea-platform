/**
 * SEO Meta Tags Component — Open Graph + Twitter Cards
 *
 * File: client/src/components/seo/MetaTags.tsx
 *
 * Usage in any page:
 *   <MetaTags
 *     title="Пуер Шу Концентрат"
 *     description="Натуральний чайний концентрат Пуер Шу — глибокий землистий смак"
 *     image="/images/puer-shu.jpg"
 *     url="/products/puer-shu"
 *     type="product"
 *   />
 *
 * Renders: <title>, <meta description>, og:*, twitter:*
 *
 * NOTE: React 19 supports <title> and <meta> in component render directly.
 * They hoist to <head> automatically. No react-helmet needed.
 */

import React from "react";

const BASE_URL = "https://boostertea.com.ua";
const DEFAULT_IMAGE = "/og-image.png"; // 1200x630 recommended
const SITE_NAME = "BoosterTea";
const TWITTER_HANDLE = "@booster_tea_ua";
const DEFAULT_DESCRIPTION =
  "Натуральні чайні концентрати преміальної якості — Пуер Шу, Пуер Шен, Улун Молочний, ГАБА. Справжній смак без компромісів.";
const LOCALE = "uk_UA";

interface MetaTagsProps {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "product" | "article";
  // Product-specific
  price?: number;
  currency?: string;
  availability?: "instock" | "oos" | "preorder";
  // Article-specific
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  // Misc
  noindex?: boolean;
  canonical?: string;
}

export function MetaTags({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  url = "",
  type = "website",
  price,
  currency = "UAH",
  availability,
  publishedTime,
  modifiedTime,
  author,
  section,
  tags,
  noindex = false,
  canonical,
}: MetaTagsProps) {
  const fullTitle = title.includes(SITE_NAME)
    ? title
    : `${title} | ${SITE_NAME}`;
  const fullUrl = url.startsWith("http") ? url : `${BASE_URL}${url}`;
  const fullImage = image.startsWith("http") ? image : `${BASE_URL}${image}`;
  const canonicalUrl = canonical
    ? canonical.startsWith("http")
      ? canonical
      : `${BASE_URL}${canonical}`
    : fullUrl;

  // Truncate description for meta (max 160 chars)
  const metaDescription =
    description.length > 160 ? description.slice(0, 157) + "..." : description;

  // Map OG type
  const ogType =
    type === "product" ? "product" : type === "article" ? "article" : "website";

  // Map availability to og:availability
  const ogAvailability =
    availability === "instock"
      ? "instock"
      : availability === "oos"
        ? "oos"
        : availability === "preorder"
          ? "preorder"
          : undefined;

  return (
    <>
      {/* Basic Meta */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={canonicalUrl} />

      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content={LOCALE} />

      {/* Product-specific OG */}
      {type === "product" && price && (
        <>
          <meta property="product:price:amount" content={String(price)} />
          <meta property="product:price:currency" content={currency} />
          {ogAvailability && (
            <meta property="product:availability" content={ogAvailability} />
          )}
        </>
      )}

      {/* Article-specific OG */}
      {type === "article" && (
        <>
          {publishedTime && (
            <meta property="article:published_time" content={publishedTime} />
          )}
          {modifiedTime && (
            <meta property="article:modified_time" content={modifiedTime} />
          )}
          {author && <meta property="article:author" content={author} />}
          {section && <meta property="article:section" content={section} />}
          {tags?.map((tag) => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:image:alt" content={title} />

      {/* Mobile / Telegram preview */}
      <meta name="theme-color" content="#1a1a1a" />
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// PRE-BUILT PAGE CONFIGS
// ═══════════════════════════════════════════════════════════════

/** Homepage meta */
export function HomeMetaTags() {
  return (
    <MetaTags
      title="BoosterTea — Натуральні Чайні Концентрати"
      description="Преміум чайні концентрати Пуер Шу, Пуер Шен, Улун Молочний, ГАБА. 100% натуральний склад, автентичний смак. Доставка по Україні."
      url="/"
      type="website"
    />
  );
}

/** Catalog page meta */
export function CatalogMetaTags({ category }: { category?: string }) {
  const categoryName = category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : "Каталог";
  return (
    <MetaTags
      title={`${categoryName} — Каталог Чайних Концентратів`}
      description={`Купити ${categoryName.toLowerCase()} від BoosterTea. Натуральні концентрати преміум якості з доставкою по Україні.`}
      url={category ? `/catalog/${category}` : "/catalog"}
    />
  );
}

/** Blog list meta */
export function BlogListMetaTags() {
  return (
    <MetaTags
      title="Блог — Статті про Чай та Здоров'я"
      description="Корисні статті про чайну культуру, здоровий спосіб життя та натуральні продукти від BoosterTea."
      url="/blog"
    />
  );
}

/** About page meta */
export function AboutMetaTags() {
  return (
    <MetaTags
      title="Про Нас — BoosterTea"
      description="Ми створюємо натуральні чайні концентрати преміум якості. Дізнайтесь більше про нашу місію та цінності."
      url="/about"
    />
  );
}

/** 404 page meta */
export function NotFoundMetaTags() {
  return (
    <MetaTags
      title="Сторінку не знайдено"
      description="Вибачте, запитана сторінка не існує."
      noindex
    />
  );
}
