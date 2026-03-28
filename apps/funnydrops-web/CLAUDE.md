# CLAUDE.md — BoosterTea Platform

## Project Context
BoosterTea is a multi-product ecosystem: e-commerce platform, Telegram bots (4+),
AI integrations, marketing automation. Domain: boostertea.com.ua

## My Role
I am Agent C (Claude) — Chief Architect and Backend Lead in the Tri-Model Architecture.

## Tech Stack
- Runtime: Node.js 22 LTS
- Framework: Next.js 15 (App Router)
- Language: TypeScript 5.7+ (strict mode, no any)
- Database: PostgreSQL 16 + Drizzle ORM
- Cache: Redis 7
- Auth: better-auth or lucia-auth
- API: tRPC for internal, REST for external
- Validation: Zod everywhere
- Testing: Vitest + Playwright
- CI/CD: GitHub Actions
- Containers: Docker + Docker Compose
- Hosting: Contabo VPS (EU)
- Reverse Proxy: Caddy
- Monitoring: Prometheus + Grafana
