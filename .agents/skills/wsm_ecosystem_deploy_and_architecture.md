---
description: Patterns for WSM Ecosystem Deployments, Telegram Bots, Master Dashboard and Vercel Turborepo Architecture.
---
# WSM Ecosystem Architecture and Deployment Skill

## 1. Monorepo & Vercel Deployments
- The project is a monorepo utilizing Workspaces (`npm workspaces` in `package.json` with `apps/*` and `packages/*`).
- When encountering Vercel CLI errors, ensure node/npm versions match production requirements (Node 20+) and run builds from the workspace root (e.g., `npm run build:prod` which internally calls `npx -y -p node@20 ...`).
- If Vercel fails to link or deploy, explicitly ensure environment variables are configured in the Vercel Dashboard for each respective application.

## 2. API & Orchestrator (Next.js Dashboard)
- Next.js 15+ App Router is used (`app/api/.../route.ts`).
- Always structure APIs to safely parse bodies (e.g., `await req.json()`), check for missing fields, and handle errors with `try-catch`. 
- Use standard HTTP status codes (`201` for created, `200` for success, `400` for bad input, `500` for system errors).
- Prisma is used as the ORM. Standard import pattern: `import { prisma as db } from '@wsm/db'`. Keep database operations efficient. 

## 3. UI/UX Rules & Gamification
- **Aesthetic**: Rely on advanced glassmorphism (dark backgrounds, semi-transparent white overlays, e.g., `bg-white/5 backdrop-blur`, `border-white/10`). All apps must feel premium.
- **Micro-animations**: Use subtle transitions and hovers to make the experience lively. Check `OrdersKanban.tsx` as an example of interactive UI elements.
- **3D Features for 13wsm13**: Emphasize neural DNA connections, deeply nested object exploration (Macro to Micro), and dynamic scroll interactions.

## 4. Bot Gateway Configuration
- Validate all required environment variables at startup (`fail-fast` principle) using `zod`. Check `config.ts` for the schema.
- Support multiple brands via webhook mapping in the Gateway. Each brand has a respective slug and token (`TELEGRAM_BOT_TOKEN_BOOSTERTEA`, etc.).
- Expose `/webhook/:brand` routes consistently. Payment operations (Mono, NovaPay) must be routed dynamically based on the bot invoking them.

## 5. Ecosystem Integrity
- The entire system is meant to work synchronously. Any change in Next.js backend schema usually requires Prisma sync (`pkg wsm-db`).
- Check dependencies before any build run. If types missing, run `npm install` within the target workspace.
