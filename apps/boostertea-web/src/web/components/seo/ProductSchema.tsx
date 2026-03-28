import React from 'react';

export const ProductSchema = ({ product }: { product: any }) => {
  // Збираємо активні варіанти цін (0.25L, 1L, Sticks)
  const offers = [];
  
  if (product.price025L) {
    offers.push({
      "@type": "Offer",
      "priceCurrency": "UAH",
      "price": product.price025L,
      "sku": `${product.id}-025L`,
      "availability": "https://schema.org/InStock",
      "url": `https://boostertea.com.ua/product/${product.id}`,
      "itemCondition": "https://schema.org/NewCondition"
    });
  }
  
  if (product.price1L) {
    offers.push({
      "@type": "Offer",
      "priceCurrency": "UAH",
      "price": product.price1L,
      "sku": `${product.id}-1L`,
      "availability": "https://schema.org/InStock",
      "url": `https://boostertea.com.ua/product/${product.id}`,
      "itemCondition": "https://schema.org/NewCondition"
    });
  }

  // Обчислюємо мінімальну та максимальну ціну для AggregateOffer
  const prices = offers.map(o => o.price);
  const lowPrice = Math.min(...prices);
  const highPrice = Math.max(...prices);

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.nameUk,
    "image": [`https://boostertea.com.ua/assets/products/${product.image}`],
    "description": product.descriptionUk,
    "sku": product.id,
    "brand": { 
      "@type": "Brand", 
      "name": product.merchantId === 'funnydrops' ? 'FunnyDrops' : 'BoosterTea' 
    },
    // Google Shopping вимагає AggregateOffer якщо варіантів кілька
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "UAH",
      "lowPrice": lowPrice,
      "highPrice": highPrice,
      "offerCount": offers.length,
      "offers": offers
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};
