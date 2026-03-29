---
description: [WSM Ecosystem Vercel Architecture Blueprint]
---

# WSM Ecosystem: Vercel Production Blueprint 🚀

This document defines the exact Environment Variables, native features, and configurations required across all Vercel Projects to guarantee 99.99% uptime, secure webhook execution, and ultra-fast Edge caching for the Omniverse master architecture.

## 1. Project: `boostertea-web` (Retail & B2B Portal)

This project powers live consumer traffic, cart sessions, Novaposhta logistics, and Monobank checkouts. It requires maximum speed and secure API logic.

### 🔑 Environment Variables
| Variable Key | Purpose | Required? | Example Value |
| :--- | :--- | :---: | :--- |
| **`DATABASE_URL`** | Prisma Edge connection. Without it, the Next.js server crashes (500) upon first DB fetch. | 🔴 YES | `postgresql://user:pass@ep-pool.db.com/wsm?sslmode=require` |
| **`DIRECT_URL`** | Unpooled DB URL. Needed if Vercel attempts `prisma migrate` or heavy cron writes. | 🟡 REC | `postgresql://user:pass@ep-raw.db.com/...` |
| **`JWT_SECRET`** | Used to cryptographically sign session state. | 🔴 YES | `your-32-character-secure-random-string` |
| **`PACKIFY_API_KEY`** | Internal CRM/Logistics key for `packages/wsm-config`. | 🔴 YES | `bzAGmiHW3Gv...` |
| **`MONOBANK_TOKEN`** | Used to generate checkout invoices. | 🔴 YES | `uA1B2C...` |
| **`NOVAPOSHTA_KEY`** | Used for real-time warehouse calculation. | 🔴 YES | `c4b12...` |
| **`NEXT_PUBLIC_SITE_URL`** | The front-facing domain used for Webhook callbacks to Monobank. | 🔴 YES | `https://www.boostertea.com.ua` |

### ⚡ Vercel Features to Enable
1. **Edge Middleware (`middleware.ts`)**: Must be enabled natively in Next.js to intercept locale rewriting and cart injection.
2. **Vercel Cron Jobs**: To track unpaid Monobank carts. Requires adding `"crons": [{"path": "/api/crons/abandoned-cart", "schedule": "0 * * * *"}]` to `vercel.json` and a specific Cron Secret.

---

## 2. Project: `wsm-dashboard` (The Orchestrator)

This project powers EcosystemOS, internal B2B analytics, AI Gemini parsing, and Better-Auth sessions.

### 🔑 Environment Variables
| Variable Key | Purpose | Required? | Example Value |
| :--- | :--- | :---: | :--- |
| **`DATABASE_URL`** | Same Prisma Edge connection as the retail site. | 🔴 YES | `postgresql://user:pass@ep-pool.db.com/wsm` |
| **`BETTER_AUTH_SECRET`** | Mandatory for `better-auth`. Server crashes if missing. | 🔴 YES | `1a2b3c4d5e...` |
| **`GEMINI_API_KEY`** | Required for AI chat orchestrations in CRM. | 🔴 YES | `AIzaSyB...` |
| **`OPENAI_API_KEY`** | Required if using fallback neural generation. | 🟡 REC | `sk-...` |
| **`TELEGRAM_BOT_TOKEN`** | Used to stream live purchase notifications to the internal admin group. | 🔴 YES | `12345:ABC-DEF` |
| **`NEXT_PUBLIC_APP_URL`** | Used by `better-auth` for OAuth callbacks. | 🔴 YES | `https://dash.boostertea.com.ua` |

### ⚡ Vercel Features to Enable
1. **Vercel Blob Storage**: Because you handle B2B contracts and uploaded `.glb` 3D elements, standard Vercel cannot store files. Attach Vercel Blob to the `wsm-dashboard` project.
2. **Vercel KV (Redis)**: Connect an Upstash Redis database to handle Rate Limiting for the AI Gemini endpoints to prevent API abuse.
3. **Advanced Serverless Functions Timeout**: By default, Vercel kills functions after 10-15 seconds. For complex AI queries or massive ERP synchronization, go to **Settings -> Functions -> Function Max Duration** and increase it to `60` seconds (Requires Vercel Pro).

---

## 3. Global Ecosystem Configurations

- **Node.js Memory Limit (`max-old-space-size`)**: In big Turborepo builds, Vercel can run out of RAM. Add `NODE_OPTIONS=--max-old-space-size=4096` to your Environment Variables globally.
- **Ignore Build Errors (Fallback)**: If urgent hotfixes are needed and TS types break, keep `ignoreBuildErrors: true` in `next.config.js` to ensure the pipeline succeeds.
