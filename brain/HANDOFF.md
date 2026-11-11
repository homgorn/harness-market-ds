# HANDOFF — harness-market-ds

## State (2026-11-11)

- **Phase:** P8 build / P11 deploy. Static per-locale architecture (ADR-0001).
- **Live:** https://harness-market-ds.homgorn.workers.dev (Workers Pages; custom
  domain `harness-market-ds.refertur.net` pending DNS — zone refertur.net is on
  another account, so the CNAME has to be added by the owner).
- **Repo:** https://github.com/homgorn/harness-market-ds (public, topics set).

## Data (measured)

- Catalog: **10,620 artifacts** — 10,368 plugins + ecosystem items (desktop
  apps, hosted services, bots, marketplaces, sites).
- Merged from `awesome-dsh-plugin.com/plugins.json` (10,365) and the DSH
  format-1 index (5,126), plus npm registry keywords and OSV advisories.
- Categories: 23 · Tags: 10,662 · Authors: 6,864 · Capabilities: 10.
- Security: 801 high-risk, 1020 with upstream red lines, 2 with OSV advisories.

## Architecture constraints (measured, not assumed)

- Cloudflare Workers: **20,000 static asset files per version** (Free) —
  reproduced live (API error 10304). Paid = 100,000.
- Static asset requests are free and unlimited; Worker invocations are capped.
- Pagefind emitted ~72,000 index files → removed, replaced by one 3.8 MB
  client-side index.
- Inline CSS cost 560 MB of HTML → externalised to `public/site.css`.

## Next 3 actions

1. Finish the EN build, run `node scripts/seo-gate.mjs`, deploy to Workers.
2. Build the remaining 6 locales (`node scripts/build-all-locales.mjs`) — each
   ~15,400 files, under the cap.
3. Owner: add DNS for `harness-market-ds.refertur.net` and decide whether to
   enable Workers Paid ($5/mo) to ship all seven locales from one deployment.

## In flight

- Machine translation of descriptions into ru/es/de/fr/ja (MyMemory API, cached
  in `data/i18n-cache/`, top 2,500 plugins per locale by downloads).
- Machine translations are labelled in the UI as machine-generated.

## Evidence

- `brain/research/` — catalogs, monetization, security, Astro templates,
  ecosystem artifacts, Cloudflare scale, marketplace UX/benchmark.
- `docs/adr/0001-static-per-locale.md`, `docs/adr/0002-data-sources.md`.
- `scripts/` — sync, enrich, scan, build-ssr-data, build-listing-index,
  seo-gate, split-locales, build-all-locales, translate-descriptions.
