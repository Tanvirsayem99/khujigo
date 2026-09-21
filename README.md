<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# KhujiGo — storefront & admin dashboard

Next.js 15 (App Router) + React 19 + Tailwind v4. All data comes from the **KhujiGo API**
(NestJS + PostgreSQL + Prisma, in the sibling `khujigo-api` folder).

## Run locally

**Prerequisites:** Node.js, and the API running (see `../khujigo-api/README.md`).

1. Start the API first (it listens on `https://khujigo-server.onrender.com/api/v1`).
2. Install dependencies:
   `npm install --include=dev`
3. Point the app at the API — `NEXT_PUBLIC_API_URL` in `.env.local` (already set for local dev):
   ```bash
   NEXT_PUBLIC_API_URL="https://khujigo-server.onrender.com/api/v1"
   ```
4. Run the app:
   `npm run dev`

> The `--include=dev` flag matters if your npm is configured with `omit=dev`; without it the
> TypeScript/ESLint toolchain isn't installed.

## How the data layer is wired

The API speaks **camelCase**; the components and `types/index.ts` still use the original
**snake_case**. One mapping layer bridges them, so no component had to be rewritten:

```
component → lib/hooks/api.ts (SWR)  →  lib/api/endpoints.ts  →  lib/api/client.ts
                                              ↓
                                        lib/api/mappers.ts   (camelCase ⇄ snake_case)
```

| Path | Responsibility |
|---|---|
| `lib/api/client.ts` | `fetch` wrapper, per-subject token storage, silent refresh-on-401, `ApiError` |
| `lib/api/types.ts` | camelCase DTOs mirroring the API responses |
| `lib/api/mappers.ts` | API ⇄ frontend translation, plus write-payload allowlists |
| `lib/api/endpoints.ts` | One typed function per endpoint |
| `lib/hooks/api.ts` | SWR hooks (`useProducts`, `useAdminOrders`, …) + `revalidate*()` helpers |
| `lib/coupon-messages.ts` | Localises the API's `reason` codes into Bangla |

Notable behaviour:

- **Auth** keeps short-lived access tokens and rotating refresh tokens in `localStorage`, stored
  **per subject** (a customer session and an admin session can coexist). A 401 triggers one silent
  refresh and retry; if that fails the session is cleared and the UI falls back to its login state.
- **Cart and wishlist** stay in `localStorage` — the API has no cart endpoints.
- **Checkout sends no amounts**; the API recomputes prices, discounts, delivery and totals. The
  figures shown before submitting are a preview derived from `GET /delivery-settings`.
- **Reviews submit as `PENDING`** and appear on the product page only after an admin approves them.

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` / `npm run start` | Production build / serve |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` (not a package script; run `npx tsc --noEmit`) |
| `npm run test:integration` | Exercises the real data layer against a running API |

### `npm run test:integration`

Compiles `lib/api/**` to `.tmp-fe-build/` and runs `scripts/integration-check.js` against the live
API. It covers the mapping layer, per-subject token storage, the refresh-on-401 path, checkout
totals and cross-audience rejection — the parts a type check can't prove. Requires the API to be
running.

## Deploy

View the app in AI Studio: https://ai.studio/apps/4871da46-dcac-416b-8a2b-1af71d8fe748
