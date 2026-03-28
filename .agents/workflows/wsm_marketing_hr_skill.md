---
description: [WSM Native Marketing, SEO & HR Intelligence Standard]
---

# 🎯 WSM Native Marketing, SEO & HR Intelligence Standard

*Суть підходу: Ми викидаємо важкі маркетингові комбайни (Hubspot/BambooHR). Замість цього ми імплантуємо автоматизовану "воронку", яка зливається з UI і телеграм-чатботом.*

## 1. Автоматизація Реклами (Retargeting & Contextual AI)
- **Shadow Cart Sync**: Покинуті кошики (`fbp`, `fbc`, `gclid`) не просто логуються, а автоматично формуються у CSV / Facebook Offline Conversions API. 
- **Dynamic ROAS (Return On Ad Spend)**: Індивідуальні промокоди генеруються в Колізеї (Gamification). Коли промокод активований, система через Meta-CAPI надсилає "Purchase_Intent", збільшуючи або зменшуючи цінність користувача (Dynamic LTV) для алгоритму Facebook/Google.
- **A/B Split Engine Вбудований**: Сервер (Next.js Middleware) вирішує, який Button Color або Hero Copy показувати, виходячи з HTTP `Referer` або `utm_source`, без сторонніх важких сервісів на зразок Google Optimize.

## 2. SEO-Автоматизація Зсередини
- **RAG for SEO Content**: Бот (Gemini) під капотом щоночі формує статті для "Блогу Баристо" з урахуванням Search Console запитів (які імпортуються по API).
- **Dynamic Sitemap & Next.js ISR**: Регенерація сторінок (Incremental Static Regeneration) після публікації відгуку або нової карточки товару. Canonical Links, OpenGraph карти для Telegram розшарювань – 100% за стандартом Next 15 Metadata API. 
- **Semantic Crawl Rate**: Режим для Googlebot — сайт віддає чистий HTML (без клієнтських анімацій React Three Fiber), щоб бот обробив 2000 сторінок за секунду.

## 3. Native HR, Навчання та Онбординг
- **Телеграм як LMS (Learning Management System)**: Коли менеджер або бариста приходить на роботу, не потрібна HR-програма. Discord/TG Бот веде його через 5-кроковий гайд з відео, питає тести (Quiz) в інтерактивній базі і після складання тестів генерує йому роль (`B2B_Franchise`), пускаючи в T-Lab.
- **Staff Time Tracking**: Punch In/Punch out через просканований QR код на планшеті в HoReCa (замість Jibble, Deputy та ін.).
- **Генеративний Feedback (Pulse Check)**: Система аналізує "тон" повідомлень співробітників у чаті компанії, і AI-менеджер може попередити засновника, якщо у відділі падає рівень ентузіазму.
