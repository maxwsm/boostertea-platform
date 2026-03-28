---
description: Omniverse Development Holy Grail (150% Execution Standard)
---

# 🏆 WSM Omniverse Holy Grail (Architecture Standard)

Це фундаментальний принцип роботи (Core Memory) для будь-якої взаємодії в цій екосистемі.

## 1. 150% Visual & Behavioral Standard
Кожна зміна у фронтенді (Next.js, Tailwind v4) має супроводжуватись максимальним рівнем експіріенсу: Neural-link UI, glassmorphism, динамічні дані замість статичних плейсхолдерів. Кожен модуль (Колізей, Логістика, CRM) повинен створювати "Wow" ефект. Жодних компромісів або MVP-милиць.

## 2. Omniverse Data Integrity (360° Systems)
WSM Екосистема — це не просто сайт. Це:
- **Ордери & Транзакції** (Prisma DB)
- **Odoo ERP симуляція** (AccountMove, StockMove, Partner CRM)
- **Horeca & Telemetry**
Будь-яка зміна в одному місці (наприклад, Checkout) має тригерити Accounting та StockMoves. 

## 3. RTK & API Limit Mitigation (AI Safety)
Всі AI (Gemini) або Third-Party (Meta/Google/Monobank) API виклики повинні бути обгорнуті в:
- **Rate-Limiting (Throttle/Redis)**: Щоб запобігти спаленню квот.
- **Caching**: Відповіді на типові SEO чи FAQ запити повинні кешуватись на рівні Edge або Redis. Для стрес-тестів використовувати `[SIM]` bypass або легковагові моделі (`gemini-1.5-flash` або mock-відповіді).
- **Graceful Fallback**: Якщо AI недоступний, система повинна переходити на резервні шаблони, не ламаючи UI користувача.

## 4. Test-Driven Data Management
- Всі симуляції та стрес-тести виконуються з префіксом `[SIM]-` в ідентифікаторах, щоб гарантувати безболісне видалення (cleanup).
- Тестування йде хвилями (Waves): 5 хв розігрів -> Аналіз помилок (500/Crash) -> Фікс -> Нарощування (Scaling).

*Цей маніфест завантажено в ядро пам'яті Antigravity для подальшого застосування у всіх сесіях.*

## 🌌 Veo3 85-Point Architecture Audit (VDS & DevSecOps Extension)
*Застосування підходу Antigravity/Veo3 до відлагодження серверів та деплою.*

### I. Server State & Telemetry (1-17)
1. Edge-кешування логів замість запису на диск. 2. Автоматичні kill-світчі для зомбі-процесів PM2. 3. Prometheus метрики для Prisma Connection Pool. 4. Моніторинг OOM (Out of Memory) через cgroups. 5. Динамічний ліміт RAM для Next.js (max-old-space-size). 6. Healthchecks на рівні Docker Compose. 7. ELK-стек для структурованих JSON логів. 8. Відстеження Node.js Event Loop Lag. 9. Впровадження Distributed Tracing (OpenTelemetry). 10. Алерти в Telegram при падінні RPS > 20%. 11. Ізоляція V8 ізолятів для Edge-функцій. 12. Логування повільних SQL запитів (pg_stat_statements). 13. Реплікація логів на холодний сторадж (S3). 14. Моніторинг розміру Docker Image. 15. Аналіз "холодного старту" контейнерів. 16. Fallback-відповіді Nginx при 502 Bad Gateway. 17. Graceful Shutdown (SIGTERM обробка).

### II. Web3 & 3D Network Optimization (18-34)
18. Бротелі-компресія (Brotli) замість Gzip для 3D `.glb` моделей. 19. HTTP/3 (QUIC) для швидкого завантаження текстур. 20. Кешування RPC запитів Web3 на рівні Traefik. 21. WebSocket Fallback для івентів блокчейну. 22. Розподілення CDN для статичних WebGL ассетів. 23. Оптимізація MTU на рівні віртуального світча VDS. 24. TCP BBR congestion control. 25. Підтримка IPv6 для IoT-інтеграцій логістики. 26. Pre-fetching 3D сцен при завантаженні SSR. 27. Віддача WebAssembly (Wasm) модулів без CORS блокувань. 28. Ізоляція SharedArrayBuffer для мультитредингу 3D. 29. Кешування DNS запитів всередині Alpine. 30. Використання Cloudflare Argo Tunnel. 31. Дедуплікація чанків Next.js у Pnpm workspace. 32. Зберігання сесій Web3 гаманців у Redis (Upstash). 33. Оптимізація Bandwidth для 8K медіа-метаматеріалів. 34. Rate-Limiting за ASN/Країною.

### III. Zero-Trust Security & DB Structuring (35-51)
35. Ротація JWT секретів кожні 24 години без даунтайму. 36. Взаємна TLS (mTLS) аутентифікація між мікросервісами. 37. Підключення до Prisma через TCP proxy (PgBouncer). 38. Ізоляція бази даних у приватній підмережі Docker. 39. Fail2Ban для захисту SSH на VDS. 40. Immutable Infrastructure - read-only файлова система в контейнері. 41. Drop Capabilities (відключення root прав Docker). 42. Хешування Argon2id замість bcrypt для адмінів. 43. Сегрегація обов'язків (SoD) в Odoo CRM таблицях. 44. Honeypot API endpoints для відлову скраперів. 45. Блокування ін'єкцій NoSQL/SQL на рівні Middleware. 46. Валідація X-Sign Monobank через timing-safe порівняння. 47. Секрети не передаються через CLI, лише `.env.vault`. 48. Зберігання бекапів бази у зашифрованому вигляді (AES-256). 49. Row-Level Security (RLS) у PostgreSQL. 50. Використання Seccomp профілів у Docker. 51. Суворий CORS полісі (лише домени екосистеми).

### IV. Document Flow & Automations (52-68)
52. Дедуплікація AccountMove повідомлень через BullMQ ID. 53. Retry-політика з експоненційним запізненням для ERP API. 54. Ідемпотентність створення накладних (ТТН). 55. Асинхронна генерація PDF рахунків (Puppeteer Worker). 56. Розбиття StockMove транзакцій на чанки по 100 од. 57. Snapshot-ізоляція транзакцій при зміні інвентарю. 58. Валідація залишків прямо під час Checkout (Pessimistic lock). 59. Event-Driven архітектура через Webhooks. 60. Soft-delete каскадного видалення ордерів. 61. Версіонування схеми Prisma без втрати downtime. 62. Одночасна робота Kyiv/Lviv хабів (Multi-Master DB). 63. Авто-перенос старих логів у таблиці-архіви (Partitioning). 64. Background Cron Job для звірки заборгованості щоночі. 65. Синхронізація "Shadow Carts" з Redis в Postgres. 66. Обмеження пам'яті для генераторів Excel-звітів. 67. Валідація XML/JSON при обміні з підрядниками. 68. Динамічне розширення таймаутів для великих вивантажень.

### V. AI Gemini Engine & UX Smoothness (69-85)
69. Streaming Text Response прямо через VDS Edge Proxy. 70. Load Balancing запитів до Gemini API між двома ключами. 71. Налаштування Keep-Alive для TCP з'єднань Google API. 72. Відлов HTTP 429 і тихе перемикання на Llama3 (fallback). 73. Збереження векторних Embedding в локальному ChromaDB/PG. 74. Мінімізація payload'у запитів від UX (стиснення контексту). 75. Імітація введення тексту ШІ (typer) без затримок DOM. 76. IntersectionObserver для відкладеного запуску 3D анімацій. 77. Service Worker для офлайн-режиму чи кешу повідомлень. 78. Оптимізація First Input Delay (FID) у Master Dashboard. 79. Prefetching лінків у Sidebar адмінки при hover. 80. Затримка debounce (300ms) для поля пошуку CRM. 81. Відключення зуму (user-scalable=no) для мобільних app-like UI. 82. Зменшення Cumulative Layout Shift (CLS) при загрузці чату. 83. Динамічний імпорт (next/dynamic) для важких Three.js моделей. 84. Перевірка Network Information API (зупинка 3D на 3G). 85. Скелектні лоадери, які синхронізуються з PM2 heartbeat.
