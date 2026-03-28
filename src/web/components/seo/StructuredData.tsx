/**
 * Structured Data (LD+JSON) Components
 *
 * File: client/src/components/seo/StructuredData.tsx
 *
 * Google Rich Results:
 *   - Organization → brand card in search
 *   - Product → price, availability, rating in search
 *   - BreadcrumbList → breadcrumb trail in search
 *   - WebSite → sitelinks searchbox
 *   - FAQPage → FAQ accordion in search
 *   - LocalBusiness → map/hours in search (if physical location)
 *
 * Reference: https://schema.org / https://developers.google.com/search/docs/appearance/structured-data
 */

import React from "react";

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

interface ProductData {
  name: string;
  description: string;
  slug: string;
  price: number;
  currency?: string;
  imageUrl: string;
  sku?: string;
  brand?: string;
  availability?: "InStock" | "OutOfStock" | "PreOrder";
  ratingValue?: number;
  reviewCount?: number;
  category?: string;
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

// ═══════════════════════════════════════════════════════════════
// BASE_URL
// ═══════════════════════════════════════════════════════════════

const BASE_URL = "https://boostertea.com.ua";

// ═══════════════════════════════════════════════════════════════
// JSON-LD INJECTOR
// ═══════════════════════════════════════════════════════════════

function JsonLd({ data }: { data: Record<string, any> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ═══════════════════════════════════════════════════════════════
// ORGANIZATION (на кожній сторінці через layout)
// ═══════════════════════════════════════════════════════════════

export function OrganizationSchema() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "BoosterTea",
        url: BASE_URL,
        logo: `${BASE_URL}/logo.png`,
        description:
          "Натуральні чайні концентрати преміум якості. Пуер, Улун, ГАБА — автентичний смак без компромісів.",
        foundingDate: "2024",
        sameAs: [
          "https://www.instagram.com/booster_tea_ua",
          "https://www.tiktok.com/@booster_tea",
          "https://t.me/boostertea_bot",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          availableLanguage: ["Ukrainian", "Russian"],
          url: `${BASE_URL}/contacts`,
        },
        address: {
          "@type": "PostalAddress",
          addressCountry: "UA",
        },
      }}
    />
  );
}

// ═══════════════════════════════════════════════════════════════
// WEBSITE + SITELINKS SEARCHBOX (на головній)
// ═══════════════════════════════════════════════════════════════

export function WebSiteSchema() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "BoosterTea",
        url: BASE_URL,
        description:
          "Натуральні чайні концентрати — Пуер Шу, Пуер Шен, Улун Молочний, ГАБА",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      }}
    />
  );
}

// ═══════════════════════════════════════════════════════════════
// PRODUCT (на сторінці товару)
// ═══════════════════════════════════════════════════════════════

export function ProductSchema({ product }: { product: ProductData }) {
  const data: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.imageUrl.startsWith("http")
      ? product.imageUrl
      : `${BASE_URL}${product.imageUrl}`,
    url: `${BASE_URL}/products/${product.slug}`,
    brand: {
      "@type": "Brand",
      name: product.brand || "BoosterTea",
    },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: product.currency || "UAH",
      availability: `https://schema.org/${product.availability || "InStock"}`,
      url: `${BASE_URL}/products/${product.slug}`,
      seller: {
        "@type": "Organization",
        name: "BoosterTea",
      },
      priceValidUntil: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .split("T")[0],
    },
  };

  if (product.sku) {
    data.sku = product.sku;
  }

  if (product.category) {
    data.category = product.category;
  }

  if (product.ratingValue && product.reviewCount) {
    data.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.ratingValue,
      reviewCount: product.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return <JsonLd data={data} />;
}

// ═══════════════════════════════════════════════════════════════
// BREADCRUMBS (на кожній сторінці крім головної)
// ═══════════════════════════════════════════════════════════════

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: item.url.startsWith("http") ? item.url : `${BASE_URL}${item.url}`,
        })),
      }}
    />
  );
}

// ═══════════════════════════════════════════════════════════════
// FAQ PAGE (для /faq або product FAQ секцій)
// ═══════════════════════════════════════════════════════════════

export function FAQSchema({ items }: { items: FAQItem[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }}
    />
  );
}

// ═══════════════════════════════════════════════════════════════
// PRODUCT LIST / COLLECTION (для каталогу)
// ═══════════════════════════════════════════════════════════════

export function ProductCollectionSchema({
  name,
  description,
  products,
  url,
}: {
  name: string;
  description: string;
  products: ProductData[];
  url: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name,
        description,
        url: url.startsWith("http") ? url : `${BASE_URL}${url}`,
        mainEntity: {
          "@type": "ItemList",
          itemListElement: products.map((product, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `${BASE_URL}/products/${product.slug}`,
            name: product.name,
          })),
        },
      }}
    />
  );
}

// ═══════════════════════════════════════════════════════════════
// BLOG POST / ARTICLE (для /blog/:slug)
// ═══════════════════════════════════════════════════════════════

export function ArticleSchema({
  title,
  description,
  slug,
  imageUrl,
  publishedAt,
  updatedAt,
  authorName,
}: {
  title: string;
  description: string;
  slug: string;
  imageUrl?: string;
  publishedAt: string;
  updatedAt?: string;
  authorName?: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description,
        url: `${BASE_URL}/blog/${slug}`,
        image: imageUrl
          ? imageUrl.startsWith("http")
            ? imageUrl
            : `${BASE_URL}${imageUrl}`
          : `${BASE_URL}/og-image.png`,
        datePublished: publishedAt,
        dateModified: updatedAt || publishedAt,
        author: {
          "@type": "Organization",
          name: authorName || "BoosterTea",
          url: BASE_URL,
        },
        publisher: {
          "@type": "Organization",
          name: "BoosterTea",
          logo: {
            "@type": "ImageObject",
            url: `${BASE_URL}/logo.png`,
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${BASE_URL}/blog/${slug}`,
        },
      }}
    />
  );
}
