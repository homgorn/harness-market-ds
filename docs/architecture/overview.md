# Architecture — DSH Harness Plugin Catalog

## Overview

Static-first Astro site deployed to Cloudflare Pages. Data from synced catalog JSON. Search via Pagefind. i18n via file-based locales. Knowledge graph drives JSON-LD and related links.

## Stack

- Astro 5 (static output, islands for interactive components)
- TypeScript strict
- Tailwind CSS 4 (hand-tuned tokens) + CSS variables for theming
- Pagefind for search
- Cloudflare Pages for hosting + Functions (edge) for API/data endpoints
- GitHub Actions for daily sync + CI gates
- SQLite (better-sqlite3) at build time for queries/aggregations; output static
- Zod for schema validation
- Vitest + Playwright for tests

## Directory structure

```
src/
  components/        Astro + island components
  layouts/           Base layout, SEO head, theme
  pages/             Routes (index, [locale], p/[slug], category/[slug], tag/[slug], blog/, security/, etc.)
  content/           Astro content collections (blog posts, docs)
  lib/               data loaders, i18n, seo, kg
  styles/            global css, tokens
public/              favicon set, manifest, sw, robots, llms.txt
data/                synced catalog JSON + snapshots
scripts/             sync, scan, gates, wiki-index
```

## Data flow

1. GitHub Actions daily: fetch CDN index.json → validate (Zod) → count check → write data/catalog-YYYYMMDD.json + update data/catalog.json (latest) → commit → trigger build.
2. Build: load catalog → generate static pages (list, detail, category, tag, author) for all locales → build Pagefind index → run gates.
3. Deploy: wrangler pages deploy.

## Rendering strategy

- Static HTML for all catalog pages (SSG). No SSR needed.
- Islands: search box (Pagefind), theme toggle, filter sidebar (client JS over JSON), compare view.
- Edge Functions: /api/* for data export (future, auth-gated).

## i18n routing

- `/` → en
- `/<locale>/` → locale (ru, zh, es, de, fr, ja)
- Plugin detail: `/<locale>/p/<slug>/`
- hreflang + canonical on every page.

## Knowledge graph

- Entities: Plugin, Category, Tag, Author, Version, SecurityStatus, Locale.
- Triples in `brain/index/graph.jsonl`: subject | predicate | object | source.
- Generated: related plugins, JSON-LD, internal links, category/tag pages, sitemap priorities.

## Security pipeline

- Weekly (separate cron): clone/fetch plugin sources → run Semgrep + npm audit + YARA → produce security-status.json → commit → rebuild.
- Malicious findings → mark, remove code, rewrite where feasible, publish report.

## Monetization surfaces

- Sponsored slots: frontmatter-flagged in a `sponsors.json` config (manual curation).
- Donation links: footer + about.
- Affiliate: outbound link wrapper with disclosure.
- API/data: edge function behind API key (future).

## Caching & performance

- Cloudflare CDN caching for static assets.
- Image optimization via Astro image service (AVIF/WebP).
- Font subsetting.
- Pagefind lazy-loaded.

## Observability

- Cloudflare Web Analytics.
- Error logging via console + optional Sentry (free tier).
- Uptime check via external (e.g., UptimeRobot free).

## Backup & rollback

- Git history + `.snapshots/` daily zip.
- Cloudflare Pages keeps previous deployments; rollback via wrangler.
