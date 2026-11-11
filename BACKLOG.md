# Backlog

## Accepted decisions (2026-11-11)
- Payment rail: **Lemon Squeezy** (MoR, 5% + 50¢, license keys, webhooks, 200+ countries).
- Product scope: **own original artifacts only** — SDD specs, templates,
  security scan packs, prompt packs, evaluation suites. Never third-party
  plugins resold as-is (ToS/copyright risk).
- Books: **PDF via Lemon Squeezy** (no KDP/AI disclosure needed; direct sales).

## Open / blocked
- Rotate any keys pasted in chat (owner reminder).
- DNS for harness-market-ds.refertur.net (owner action — zone is on another
  Cloudflare account; add CNAME → harness-market-ds.refertur.net.pages.dev or
  the Workers custom domain).
- Workers Paid ($5/mo) to ship all 7 locales in one deployment (decision).

## In progress
- EN static build (15,382 pages) → verify seo-gate → deploy.
- Machine translation of ~2,500 top plugins into ru/es/de/fr/ja (MyMemory API,
  cached; ongoing, ~6,300 done, ~4,180 rate-limited failures so far).

## Later
- Lemon Squeezy storefront wired to catalog site (checkout links + webhooks).
- Own-original products: SDD spec pack, plugin author handbook (PDF), DSH
  security report pack.
- Semgrep+YARA CI security pipeline (WBS-4).
- PWA service worker.
- Knowledge graph triples → JSON-LD + related-content generation.
- GitHub workflow scope (`gh auth refresh -s workflow`) → CI re-enabled.
