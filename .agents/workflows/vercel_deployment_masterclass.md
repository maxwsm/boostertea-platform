---
description: [Vercel Monorepo Deployment Mastery & Node.js Edge Traps]
---

# Vercel Next.js Monorepo Mastery 🚀

This skill documents the exact combination of Vercel Cloud constraints, Node.js environment bugs, and Turborepo schema validation rules that cause fatal 404s, 11-second "exited with 1" crashes, and `ERR_INVALID_THIS` package manager bugs in WSM Omniverse.

## 1. The "Root Directory Does Not Exist" Trap (Git iCloud Nests)
**The Bug:** Vercel clones the GitHub repository and immediately fails with `The specified Root Directory "apps/boostertea-web" does not exist`.
**The Cause:** If a Mac user initializes `~` or `~/Library` as a Git repository, the absolute path of the workspace (e.g., `Library/Mobile Documents/com~apple~CloudDocs/ANTI 001/wsm-ecosystem`) is uploaded to GitHub instead of the code root. Vercel rejects Root Directories containing spaces (` `) or tildes (`~`).
**The Fix:** NEVER initialize `.git` in your Mac root. Always initialize the `.git` repository strictly inside the `wsm-ecosystem` directory. If migrating, use `git init` within the workspace, add all files, and `git push --force` to overwrite the bad origin branch. Vercel's Root Directory then correctly becomes `apps/[project-name]`.

## 2. The `ERR_INVALID_THIS` & Node 24 Fetch API Bug
**The Bug:** Vercel initiates `pnpm install` and instantly crashes with `ERR_PNPM_META_FETCH_FAIL GET ... Value of "this" must be of type URLSearchParams` or `ERR_INVALID_THIS`.
**The Cause:** Vercel allows selecting Node.js 24.x. However, standard versions of PNPM (e.g., v8.x or v9.0.x) contain a catastrophic bug when native Fetch API is used in Node.js 22/24. Vercel's default internal PNPM will crash repeatedly when fetching lockfiles.
**The Fix Approaches:**
- **Best:** Downgrade project settings in Vercel from Node 24.x to **Node 20.x**. Node 20 natively supports standard PNPM without the `url.parse()` / Fetch context bugs.
- **Alternative:** Force Vercel to install a fixed PNPM version by overriding the Install Command: `npm i -g pnpm@9.15.5 && pnpm install`.
- **Nuclear (The Bun Switch):** If the monorepo has `bun.lock`, override the Vercel Install Command to strictly say `bun install`. Bun is drastically faster and completely bypasses Node's `ERR_INVALID_THIS` bug.

## 3. The `.next` Output Override Trap (The 404 DEPLOYMENT_NOT_FOUND)
**The Bug:** Vercel successfully installs and builds, but loading the site instantly returns `404: NOT_FOUND (DEPLOYMENT_NOT_FOUND)`.
**The Cause:** The user explicitly overrode the **Output Directory** in Vercel Project Settings to `.next` (or hardcoded it in `vercel.json`). This physically forces Vercel to treat an advanced Next.js Edge Serverless app as a "Static Website", ripping out the Next.js runtime and deploying raw compiled files without a router.
**The Fix:** Disconnect and turn OFF all "Override" toggles for Build Command, Install Command, and Output Directory in Vercel Project Settings. Vercel’s Zero-Config engine must handle Next.js Apps natively to compile Lambda/Edge functions `/api/[[...route]]/route.ts`. 

## 4. Turborepo v2 "exited with 1" Schema Crash
**The Bug:** After dependencies install correctly, Vercel initiates `turbo run build` and it instantly exits with `1` within 10 seconds.
**The Cause:** Vercel globally uses the latest Turborepo CLI (v2.7+). In Turborepo v2, the `pipeline` key in `turbo.json` was deprecated and generates a fatal syntax error.
**The Fix:** Open `turbo.json` at the root of the monorepo and rename `"pipeline"` to `"tasks"`. The build will immediately proceed.

## 5. Next.js `trailingSlash: true` Webhook Destruction
**The Bug:** Third-party webhooks (e.g., Monobank POST) return 308 Redirects and their JSON payload is destroyed.
**The Fix:** Remove `trailingSlash: true` in `next.config.js`. Vercel Edge Serverless functions will incorrectly 308 redirect `POST /api/webhooks` to `POST /api/webhooks/`, killing the `req.body` payload because 308 redirects automatically drop POST streams.

## 6. The Vercel Prisma Edge Generation Trap
**The Bug:** Vercel perfectly installs packages and passes Turbo validation, but Next.js compiler instantly crashes with `Error: @prisma/client did not initialize yet. Please run "prisma generate" and try to import it again`.
**The Cause:** In local development, `postinstall` scripts trigger `prisma generate`, but Vercel caching natively skips or isolates nested `postinstall` steps for `bun` on monorepo workspaces, leaving the `.prisma/client` engine binaries missing.
**The Fix:** Leverage Turborepo's dependency tree. Add `"build": "prisma generate"` natively inside your `packages/wsm-db/package.json`. Turborepo's `dependsOn: ["^build"]` rule will guarantee that Prisma recompiles its native Edge binaries BEFORE the Next.js `next build` command ever executes!
