---
name: WSM VDS Monorepo Debugging
description: A complete protocol for unblocking strict Pnpm workspaces and Next.js 15 routing instances running in Alpine Docker structures.
---

# 🛡 TITAN OS: VDS DEBUGGING MASTER SKILL

This protocol was synthesized after resolving a cascading catastrophic failure loop across 6 Next.js + Pnpm workspaces on an Alpine Linux Docker VDS. Following these rules eliminates 99% of hydration traps and 404 container crashes.

## 1. The Pnpm `ERR_PNPM_FETCH_404` Trap
**Symptoms:** 
Docker container fails to build. `pnpm install` throws a 404 complaining that an internal package (e.g. `@wsm/events` or `@wsm/shared`) is missing from the NPM registry.

**The Cause:**
- Native `npm` lockfiles (`package-lock.json`) trick the Docker into standard NPM operations.
- Outdated or missing `pnpm-workspace.yaml` causes Pnpm to fail symlink resolution.
- Orphaned `pnpm-workspace.yaml` files inside `/apps/` trick the engine into creating nested ecosystems.

**The Fix:**
1. Ensure the root `Dockerfile` includes: `RUN corepack enable pnpm` and copies `pnpm-workspace.yaml` along with `pnpm-lock.yaml`.
2. Find and destroy any `pnpm-workspace.yaml` files outside the absolute root of the monorepo.
3. Rewrite ALL internal dependency versions in `package.json` from `*` to strict `workspace:*`. This forces Pnpm to ignore remote registries completely.

## 2. The Next.js 15 Layout Collision (`/robots.txt`)
**Symptoms:**
Next.js successfully builds, `dev` server initializes, but specific automated crawlers or browser instances trigger a `500 Server Error` that can crash or restart the pod.

**The Cause:**
- The presence of BOTH `public/robots.txt` and the modern App Router `app/robots.ts`. This triggers a lethal Cross-Origin/Hydration routing mismatch.

**The Fix:**
1. Delete `public/robots.txt` across all UI directories (`rm -f apps/*/public/robots.txt`).
2. Rely exclusively on the App Router standard (`app/robots.ts` or `app/sitemap.ts`).

## 3. The Docker Compose Name Collision & Volume Trap
**Symptoms:**
`docker-compose up -d` fails with: `Volume already exists but was created for project X (expected Y)` or `Container /XYZ is already in use.`

**The Cause:**
- Docker infers the Project Name from the directory name (e.g., `titan-ecosystem`). If you rename the folder locally but push without tearing down the remote daemon cache, namespaces clash.

**The Fix:**
- Force-stop and rm all running containers.
- Enforce the strict project namespace via orchestrator: `docker compose -p wsm-ecosystem up -d --build`.

## 4. The Infinite "Завантаження..." (Turbopack + Alpine Hanging)
**Symptoms:**
The UI renders a fallback boundary (e.g. `<div id="loading">Завантаження...</div>`), but the internal Javascript chunks never execute. The viewport stays trapped in an infinite loading state. The docker logs show NO API errors, and all HTTP outputs say `GET / 200`.

**The Cause:**
- `next dev --turbopack` relies on heavily optimized binary executions. In an Alpine Linux Docker container running a massive Pnpm Monorepo, Turbopack silently hangs while tracing symlink boundaries (`workspace:*`), causing Javascript delivery to permanently suspend without throwing a 500.

**The Fix:**
- Rip out `--turbopack` from every `package.json` dev script: `"dev": "next dev -p 3000"`.
- Use the bulletproof Webpack standard locally and in remote container environments. 

## 5. The Docker Compose Filter Pattern
**Symptoms:**
`pnpm --filter nextapp dev` fails with "No projects matched the filters in /app" despite the folder definitely existing.

**The Cause:**
- Packages missing their exact `"name": "nextapp"` string mapping or confusing `@` suffixing.

**The Fix:**
- In `docker-compose.yml`, ALWAYS use relative directory filters instead of package names:
`command: sh -c "pnpm install && pnpm --filter ./apps/boostertea-web dev"`

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
