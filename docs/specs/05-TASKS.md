# Task Tree — DSH Harness Plugin Catalog

WBS levels: WBS → work package → task → subtask → acceptance check.

## WBS-1 Data pipeline

- **WBS-1.1** Catalog sync script
  - WBS-1.1.1 Fetch CDN index.json → `data/raw/YYYY-MM-DD.json` (AC: HTTP 200, valid JSON)
  - WBS-1.1.2 Validate schema (Zod) (AC: no validation errors or logged skips)
  - WBS-1.1.3 Count check declared vs fetched (AC: match or documented drift)
  - WBS-1.1.4 Update `data/catalog.json` latest (AC: file written, diff committed)
  - WBS-1.1.5 Snapshot to `data/snapshots/YYYY-MM-DD.json` (AC: file exists)
- **WBS-1.2** Build-time DB
  - WBS-1.2.1 Generate SQLite from catalog (AC: row count == plugin count)
  - WBS-1.2.2 Aggregations (category counts, tag counts) (AC: sums match)

## WBS-2 Site scaffold (Astro)

- **WBS-2.1** Init Astro project with chosen template (Astro-Rocket base + minted directory patterns)
  - WBS-2.1.1 Create project, install deps (AC: `astro dev` runs)
  - WBS-2.1.2 Configure TS strict, ESLint, Prettier (AC: lint passes)
  - WBS-2.1.3 Configure Tailwind tokens, theme vars (AC: build ok)
- **WBS-2.2** Layouts
  - WBS-2.2.1 BaseLayout (head, SEO, theme) (AC: renders)
  - WBS-2.2.2 Header with dropdown nav + mobile (AC: responsive)
  - WBS-2.2.3 Footer ≥5 columns (AC: links resolve)
- **WBS-2.3** i18n routing
  - WBS-2.3.1 Locale config + content dirs (AC: 7 locales)
  - WBS-2.3.2 hreflang + canonical components (AC: reciprocity test passes)

## WBS-3 Catalog pages

- **WBS-3.1** Home / list page
  - WBS-3.1.1 Plugin grid + pagination (AC: 24 per page)
  - WBS-3.1.2 Filter sidebar (category, tag, security, sort) (AC: filters work)
  - WBS-3.1.3 Search box (Pagefind) (AC: results <300ms)
- **WBS-3.2** Plugin detail page `/p/[slug]`
  - WBS-3.2.1 Render all fields (AC: AC-4)
  - WBS-3.2.2 Security badge + report link (AC: badge shows)
  - WBS-3.2.3 Related plugins (AC: ≥3)
  - WBS-3.2.4 Compare view (AC: 2-4 side by side)
- **WBS-3.3** Category pages `/category/[slug]`
- **WBS-3.4** Tag pages `/tag/[slug]`
- **WBS-3.5** Author pages `/author/[slug]`

## WBS-4 Security

- **WBS-4.1** Security scan script (Semgrep + npm audit + YARA)
  - WBS-4.1.1 Fetch sources into sandbox (AC: no execution)
  - WBS-4.1.2 Run scanners, produce status JSON (AC: all plugins scored)
  - WBS-4.1.3 Malicious detection → mark + report (AC: malicious list)
- **WBS-4.2** Rewrite pipeline (manual review gate)
- **WBS-4.3** Security pages (`/security/`, `/security/[slug]`)
- **WBS-4.4** SECURITY.md + disclosure

## WBS-5 SEO / GEO / AEO

- **WBS-5.1** SEO head component (title, meta, canonical, OG, twitter, favicon)
- **WBS-5.2** JSON-LD generator from knowledge graph
- **WBS-5.3** Sitemap + robots.txt
- **WBS-5.4** llms.txt + .md twins
- **WBS-5.5** RSS/Atom feeds per locale
- **WBS-5.6** Q&A blocks from query data

## WBS-6 PWA

- **WBS-6.1** Manifest + icons
- **WBS-6.2** Service worker + offline fallback
- **WBS-6.3** Install prompt

## WBS-7 Content

- **WBS-7.1** Blog/changelog/news (MDX, localized)
- **WBS-7.2** About page
- **WBS-7.3** Monetization pages (sponsors, donate)

## WBS-8 Monetization

- **WBS-8.1** Sponsored slots config + rendering (marked)
- **WBS-8.2** Donation links
- **WBS-8.3** Affiliate link wrapper + disclosure
- **WBS-8.4** API/data edge function (future, gated)

## WBS-9 Knowledge graph & wiki

- **WBS-9.1** Entity/triple generation from catalog
- **WBS-9.2** Related plugins algorithm
- **WBS-9.3** LLM wiki (brain/) + indexes + DB
- **WBS-9.4** Claims provenance

## WBS-10 CI / CD

- **WBS-10.1** GitHub Actions: sync (daily), build, deploy
- **WBS-10.2** Gates (secret, factcheck, links, build, tests, visual, perf, a11y, seo, identity, no-placeholder, security, i18n, self-critique)
- **WBS-10.3** Lighthouse CI budget

## WBS-11 GitHub packaging

- **WBS-11.1** README (en + 6 locales), LICENSE, SECURITY, CONTRIBUTING, CODE_OF_CONDUCT, CHANGELOG
- **WBS-11.2** Topics, description, homepage field
- **WBS-11.3** GitHub Pages (optional, for index.json mirror)

## WBS-12 Deploy

- **WBS-12.1** Cloudflare Pages project + custom domain (harness-market-ds.refertur.net)
- **WBS-12.2** DNS CNAME (owner action)
- **WBS-12.3** Verify HTTP 200 + marker

## WBS-13 Handoff

- **WBS-13.1** HANDOFF.md + INDEX.md
- **WBS-13.2** Cold-agent test
- **WBS-13.3** Update ritual docs

## Dependencies

- WBS-2 depends on WBS-1 (data shape known).
- WBS-3 depends on WBS-2.
- WBS-4 depends on WBS-1 (sources).
- WBS-5 depends on WBS-3 (pages exist).
- WBS-6 depends on WBS-2.
- WBS-10 depends on all.
- WBS-12 depends on WBS-10.
