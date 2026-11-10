# Astro Templates / Starters — Research for a Catalog/Directory Site

- **Project:** harness-market-ds — Astro + Cloudflare catalog of DeepSeek Harness plugins, 7 locales (en, ru, zh, es, de, fr, ja), SEO+GEO+AEO, daily CDN sync.
- **Date:** 2026-11-10
- **Author:** researcher subagent
- **Scope:** Non-banal, optimized Astro templates/starters suitable for a catalog/directory site with filters, categories, search, i18n, SEO. Evaluated on performance, accessibility, SEO, i18n support, component quality.
- **Primary sources:** GitHub repository search (topic:directory + language:astro; queries "astro directory template", "astro catalog template", "astro i18n directory", "astro starter i18n"), Astro themes index, direct README/package.json/astro.config/tree inspection. Confidence markers: **R** = reported by maintainer, **M** = measured, **I** = inferred.

## 1. Method & queries logged

See `queries.log` in this folder for the full query trail. Summary of searches performed:

1. GitHub: `topic:directory language:astro` (sort: stars) → 18 repos; top: open-apps (4.5k, not a template), botdirectory.ai (310), minted-directory-astro (165).
2. GitHub: `astro directory template` (sort: stars) → 12 repos; top: minted-directory-astro (165), astro-template-directory-website (36), directory-web-minimal-template (3).
3. GitHub: `astro catalog template` (sort: stars) → 13 repos; mostly product-catalog micro-templates, no strong i18n.
4. GitHub: `astro i18n directory` (sort: stars) → 3 repos; tradingaihub (Astro, 13 langs, 0⭐), astro-i18n-plus, astro-content-ai-translator.
5. GitHub: `astro starter i18n` (sort: stars) → 52 repos; top: astro-i18n-starter (150), Astro-Rocket (124), Advanced-Astro-i18n (65), astro-cloudflare-starter (44).
6. GitHub topics: `astro-theme` (sort: stars) for general high-quality bases (AstroWind, astro-paper, fuwari, astroplate, nebulix).
7. Direct inspection (README, package.json, astro.config, file tree, selected components) of: minted-directory-astro, Astro-Rocket, botdirectory.ai, tradingaihub, astro-i18n-starter, astro-cloudflare-starter, directory-web-minimal-template.

## 2. Evaluation rubric

| Criterion | Weight | Notes |
|---|---|---|
| Directory domain fit (listings, categories, filters, tags, search) | 30% | Purpose-built catalog UX |
| i18n support (routing, content collections by locale, hreflang, switcher, fallback) | 20% | Must support 7 locales |
| Performance (static SSG, minimal JS, Lighthouse, Core Web Vitals) | 15% | R/M/I markers |
| SEO (meta, OG, JSON-LD, sitemap, robots, llms.txt, OG images) | 15% | GEO/AEO readiness |
| Accessibility (WCAG, reduced motion, keyboard, contrast tokens) | 10% | |
| Component quality (TS, tests, CVA variants, design tokens, docs) | 10% | |

## 3. Candidate evaluation

### 3.1 masterkram/minted-directory-astro — **Best directory-domain template**

- **Link:** https://github.com/masterkram/minted-directory-astro
- **Stars:** 165 · **License:** (check LICENSE; repo has LICENSE file) · **Last push:** 2025-04-02 · **Astro:** 5.5.2 · **Stack:** Tailwind v4, Vue 3.5, MDX, astro-icon, sharp, nanostores, @astrojs/sitemap.
- **Domain fit (R):** Purpose-built directory. Markdown/JSON/CSV/Google Sheets/Notion/Airtable data sources via content-collection loaders; listings, tags, categories via tags; sponsored content slots; pre-built directory cards (Bullet/Rectangle/SmallHorizontal), Grid, Search, FeaturedTag; sidebar or inline tag filters; sponsored listings.
- **Search (R/I):** Client-side filtering via nanostores `search` store + Vue `Select`/`Grid` (client:load). ⌘K focus shortcut. Good for small/medium catalogs; not static full-text search (Pagefind). No per-locale index.
- **SEO (R):** "Optimized for SEO" + "programmatic SEO out of the box"; sitemap integration; per-listing OG image generation via @vercel/og (`src/pages/og/[...slug].png.ts`); BaseLayout meta. Strong for directory SEO.
- **i18n (I):** None built in. Astro config has no i18n block; content collection single locale; no hreflang/switcher. **Gap:** must be added (Astro native i18n + content folders by locale) — significant rework.
- **Performance (I):** Static SSG, minimal client JS (Vue islands only for tag filter), Tailwind v4. No Lighthouse claim reported. Inferred: high on desktop, but client-side filtering ships all listings as islands → JS payload grows with catalog size; not ideal for 7-locale × large catalog.
- **Accessibility (I):** Basic (focus styles, kbd). No reported WCAG, no reduced-motion handling, no contrast token documentation. Vue Select may need a11y audit.
- **Component quality (I):** TypeScript, Zod validation for data source/settings, TOML config, theme tokens (spearmint/peppermint/brookmint/hemingway). No tests, no CI. Good structure (lib/loaders, validation, types). Moderate quality.
- **Verdict:** Best *directory* starting point. Use as the domain model + data-source layer; port i18n + search from Astro-Rocket.

### 3.2 hansmartensdev/Astro-Rocket — **Best optimized general starter (i18n + perf + a11y)**

- **Link:** https://github.com/hansmartensdev/astro-rocket
- **Stars:** 124 · **License:** MIT · **Version:** 2.6.0 · **Last push:** 2026-09-19 · **Astro:** 7.3.1 · **Stack:** Tailwind v4 (OKLCH), React 19, MDX, Pagefind, sharp, Zod 4, Vitest, ESLint+Prettier.
- **Domain fit (I):** Blog + projects portfolio with tags and pagination, not a directory. But content collections (blog/projects/authors/faqs) with `locale` field and Zod validation are a clean model to rename into `listings`/`categories`. No category/filter UI for directories; would need to build.
- **Search (R):** Pagefind static search, ⌘K/Ctrl+K modal, lazy-loaded bundle, zero JS until open, build-time index, works on every deploy target. **Strong.**
- **SEO (R):** Meta, OG, Twitter, JSON-LD (WebSite/Organization/BlogPosting/Breadcrumb/FAQ), sitemap, robots, per-page OG image generation (1200×630 via sharp, fonts), llms.txt-ready? (not reported). GEO/AEO: structured data present.
- **i18n (R):** Opt-in, off by default, byte-for-byte identical when off. Locale-prefixed routes, LanguageSwitcher (accessible dropdown), hreflang, `t()`/`tData()` helpers, JSON dictionaries, content collections by locale folder, fallback to default locale, localized blog/projects routing (index/post/pagination/tag archives) auto-generated, uid-based cross-locale pairing, build-time duplicate-URL validation. **Excellent — best in class among starters.**
- **Performance (R):** Lighthouse 100/100/100/100 (reported, badge in README) on mobile+desktop; zero JS by default (islands); optimized fonts; image optimization; prefetching. **Strong.**
- **Accessibility (R):** WCAG contrast documented (AAA for foreground, AA for muted), reduced-motion support, keyboard navigation, cookie consent (Google Consent Mode v2). **Strong.**
- **Component quality (R):** 44 components (34 UI via CVA + 7 patterns + 2 layout + 1 hero), design tokens (3-tier OKLCH), TypeScript, Vitest tests, ESLint/Prettier, CI (GitHub Actions deploy workflow), `validate` script. **Strong.**
- **Cloudflare (R):** `@astrojs/cloudflare`, `DEPLOY_TARGET=cloudflare pnpm build`, wrangler deploy; secrets via dashboard. Matches project infra.
- **Verdict:** Best *foundation* for performance/a11y/i18n/SEO/search. Use as the base shell; replace blog/projects with directory listings and add category/filter UI + client filters (or Pagefind facets).

### 3.3 skyboundropship-code/tradingaihub — **Reference: production multilingual directory (13 langs)**

- **Link:** https://github.com/skyboundropship-code/tradingaihub
- **Stars:** 0 · **License:** (check) · **Last push:** 2026-11-09 (active) · **Astro:** (Astro, Cloudflare wrangler.toml) · **Stack:** Astro, i18n (13 langs incl. ar/de/en/es/fr/he/hi/ja/ko/pt/ru/tr/zh), A11yWidget, JSON-LD, RSS, robots, sitemap, llms.txt, OG images, Cloudflare.
- **Domain fit (I):** Real directory: categories, tools/items, compare pages, badges, verification, weekly leaderboard, submit flow, accessibility widget. Filters/categories present in UI (category pages, compare). Strong domain reference.
- **Search (I):** Not clearly Pagefind; likely client filtering. Has `tools.json.ts` endpoint. Need inspect. (Inference from tree: no pagefind dep visible in top-level; scripts include crawl/verify.)
- **SEO (R/I):** robots.txt.ts, rss.xml.ts, sitemap (locale_sitemaps.mjs), llms.txt.ts, llms-full.txt.ts, jsonld.ts, OG images per tool. **GEO/AEO-ready (llms.txt) — unique among candidates.**
- **i18n (R/I):** 13 locale JSON files + `src/i18n/index.ts`; `src/pages/[...lang]/...` routing. Real multilingual directory. **Strong reference for i18n wiring at directory scale.**
- **Performance (I):** Static SSG, Cloudflare. No Lighthouse reported. Large image set (OG per item) → build-time heavy but static. Inferred: good with caching.
- **Accessibility (R/I):** Dedicated `A11yWidget.astro`, `a11y.css`, per-locale a11y translations, accessibility page. **Strong intent.**
- **Component quality (I):** Has tests (tests/*.mjs, test_verify.py), verification scripts. But 0 stars, single maintainer, finance-specific, not a starter/template, no license clarity, heavy domain coupling. Component reuse limited.
- **Verdict:** Not a starter to clone verbatim, but the **best reference** for multilingual directory patterns (i18n routing, a11y widget, llms.txt, locale sitemaps, JSON-LD). Extract patterns; do not inherit domain code.

### 3.4 elie222/botdirectory.ai — **Reference: polished single-language directory (310⭐)**

- **Link:** https://github.com/elie222/botdirectory.ai
- **Stars:** 310 · **License:** (check) · **Last push:** 2026-11-10 (active) · **Astro:** (Astro + Cloudflare worker) · **Stack:** Astro, Tailwind, content collections, Cloudflare worker, Posthog.
- **Domain fit (R/I):** Real directory: categories, integrations, collections, bot detail pages, 404, about/contact/developers, API endpoints (bots.json, openapi.json), llms.txt, RSS, sitemap, robots. Filters via `browse.ts`/`select.ts` scripts. Strong SEO lib (`src/lib/seo.ts` 7KB).
- **Search (I):** Client-side browse/select scripts; no Pagefind. Faceted filtering by category/integration.
- **SEO (R/I):** sitemap-0.xml.ts, sitemap-index.xml.ts, robots.txt.ts, rss.xml.ts, llms.txt.ts, openapi.json.ts, api-discovery. **GEO/AEO (llms.txt) + API discovery.**
- **i18n (I):** None (single language). Content collections single locale.
- **Performance (I):** Static + Cloudflare worker for API. Inferred good.
- **Accessibility (I):** Not reported; basic.
- **Component quality (I):** Clean component set (Header/Footer/Select/TagDialog), lib modules, scripts for icon fetching/validation. Moderate. Not a starter (site-specific).
- **Verdict:** Good reference for directory UX (categories, integrations, collections, SEO, API discovery). Single-language; combine with Astro-Rocket i18n.

### 3.5 Other candidates considered (not top 3)

- **psephopaiktes/astro-i18n-starter** (150⭐, MDX): minimal i18n starter, no directory, no search, no SEO beyond basics. Too thin.
- **Scorpio3310/astro-i18n-starter** (65⭐): multilingual (locale routing), no directory/search. Thin.
- **milzamsz/astro-cloudflare-starter** (44⭐): Cloudflare Pages + i18n-ready + Starlight docs with full-text search. Good infra reference but docs-oriented, not catalog.
- **EdgeKits/astro-edgekits-core** (6⭐): zero-JS i18n for Cloudflare Workers. Niche; useful for edge-rendered locale detection, but low maturity.
- **ever-works/directory-web-minimal-template** (3⭐, AGPL-3.0): minimal directory boilerplate, is_template=true, recently updated. AGPL license + low maturity make it risky; consider only if AGPL acceptable.
- **AstroWind / astro-paper / fuwari / astroplate** (2k–6k⭐): high-quality blog/landing bases, but no directory domain model and weak i18n; not catalog-focused.
- **tortuvshin/open-apps** (4.5k⭐): curated directory of codebases, but not a template/starter (it's a content site).

## 4. Top 3 recommendations

### #1 — masterkram/minted-directory-astro (directory-first)
- **Link:** https://github.com/masterkram/minted-directory-astro
- **Why:** Only mature, purpose-built *directory* template with multi-source data (MD/JSON/CSV/Sheets/Notion/Airtable), tags + client search, sponsored slots, per-listing OG images, programmatic SEO, dark/light, Tailwind v4. Highest domain fit.
- **Use for:** Data model, loaders, validation, card/grid/search UI, sponsored content, OG image pipeline.
- **Gaps to close:** i18n (add Astro native i18n + locale content folders), replace client-side nanostores filter with Pagefind or locale-scoped filtering for 7 locales, a11y audit of Vue Select, tests/CI.

### #2 — hansmartensdev/Astro-Rocket (foundation)
- **Link:** https://github.com/hansmartensdev/astro-rocket
- **Why:** Best overall optimized starter: Astro 7, Lighthouse 100/100/100/100 (reported), opt-in i18n with locale routes + content collections by locale + hreflang + LanguageSwitcher + fallback, Pagefind search, 44 accessible TS components (CVA), 8 themes, Cloudflare deploy, tests/CI, content validation. Directly matches project infra (Cloudflare) and locale set.
- **Use for:** Base shell, i18n system, search, SEO/OG, a11y, design tokens, CI. Adapt content collections from blog/projects → listings/categories.
- **Gaps to close:** Build directory domain model (listings, categories, filters, facets) on top; no category/filter UI; need to add faceted filtering (client or Pagefind filters).

### #3 — skyboundropship-code/tradingaihub (multilingual directory reference)
- **Link:** https://github.com/skyboundropship-code/tradingaihub
- **Why:** The only real production Astro directory with 13-language i18n, category + compare + badges + verification flows, a11y widget, and GEO/AEO assets (llms.txt, llms-full.txt, locale sitemaps, JSON-LD, RSS, robots). Extract i18n-at-scale patterns and AEO surfaces that neither #1 nor #2 has.
- **Use for:** Reference only — i18n routing at catalog scale, a11y widget, llms.txt/locale sitemap/JSON-LD patterns, verification flow.
- **Gaps/caveats:** 0 stars, single maintainer, finance-specific, no starter packaging, license unclear, heavy coupling. Do not clone wholesale; port patterns.

**Recommended composition (non-banal, optimized):** Start from Astro-Rocket (#2) for the optimized, tested, i18n-capable shell + Pagefind + Cloudflare; port the directory domain model, loaders, cards, and sponsored slots from minted-directory-astro (#1); layer AEO/i18n-at-scale patterns (llms.txt, locale sitemaps, a11y widget, verification) from tradingaihub (#3). This avoids the "banal blog template" trap while keeping i18n + perf + a11y + SEO.

## 5. Risks & open questions

- minted is Astro 5 (vs Astro-Rocket Astro 7); mixing requires upgrading minted components or keeping separate. Prefer Astro-Rocket's Astro 7 base.
- Client-side filtering (minted) vs static search (Astro-Rocket Pagefind): for 7 locales × growing catalog, Pagefind with filters is the better optimized path; budget effort to add faceted filters.
- i18n content volume: 7 locales × N listings; consider whether listings are translated or English-only with localized UI (project brief says multilingual site). Confirm translation strategy before scaffolding collections.
- License: ever-works template is AGPL-3.0 — avoid unless AGPL acceptable. tradingaihub license unverified — verify before copying code.
- No candidate has first-class "categories + filters + search + i18n" together; expect ~2–4 weeks integration work. Confidence: 7/10 (inferred).

## 6. References

- Astro themes index: https://astro.build/themes/
- GitHub topic astro-theme: https://github.com/topics/astro-theme
- minted-directory-astro: https://github.com/masterkram/minted-directory-astro
- Astro-Rocket: https://github.com/hansmartensdev/astro-rocket
- tradingaihub: https://github.com/skyboundropship-code/tradingaihub
- botdirectory.ai: https://github.com/elie222/botdirectory.ai
- Astro i18n docs: https://docs.astro.build/en/guides/internationalization/
- Pagefind: https://pagefind.app
