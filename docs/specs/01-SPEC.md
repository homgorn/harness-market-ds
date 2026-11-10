# Spec: DSH Harness Plugin Catalog

**Author:** Project Forge (owner: susa)
**Date:** 2026-11-10
**Status:** Approved (draft → approved for implementation)
**Reviewers:** owner
**Related specs:** 02-ARCHITECTURE.md, 03-API.md, 04-DATA-MODEL.md, 05-TASKS.md, 06-SECURITY.md, 07-SEO-GEO-AEO.md, 08-ACCEPTANCE.md

---

## Context

DeepSeek Harness (DSH) is an open-source agent harness with a growing plugin ecosystem (~5126 plugins as of 2026-11-10, served via `https://cdn.jsdelivr.net/npm/dsh-plugin-catalog/index.json`). The existing reference site `dshmarket.com` and the in-app market (`dsh-market` plugin) browse/search this catalog. Users need a fast, multilingual, SEO/GEO/AEO-optimized web catalog that lets them discover, filter, compare, and install plugins with confidence about safety.

This spec defines a standalone Astro + Cloudflare Pages site (`harness-market-ds.refertur.net`) that mirrors and improves the catalog: richer filtering, categories/subcategories, attributes/tags, security status per plugin, multilingual content (7 locales), and monetization surfaces. It must be better than dshmarket.com in speed, SEO, i18n completeness, and security transparency.

Evidence: catalog JSON fetched 2026-11-10 (5126 plugins, 23 categories, all npm source). Research: `brain/research/{catalogs,monetization,security,astro-templates}/`.

---

## Functional Requirements

### Catalog browsing

- FR-1: The system MUST render a paginated, filterable list of all plugins from the synced catalog JSON.
- FR-2: The system MUST support filtering by category (23 canonical categories), subcategory, tags/keywords, security status, language of description, and host-compatibility (engines.dsh).
- FR-3: The system MUST support sorting by: newest, most popular (stars/downloads), top-rated, alphabetical, recently updated.
- FR-4: The system MUST provide full-text search via Pagefind across plugin name, title, description (all locales), tags, and author.
- FR-5: The system MUST render a per-plugin detail page with: title, description (localized), category, tags, version, homepage, repository, install command, screenshots, security status, compatibility, comments link, and related plugins.
- FR-6: The system MUST show related plugins derived from the knowledge graph (shared category/tags/author), not hand-placed.
- FR-7: The system MUST support a "compare" view for 2-4 plugins side by side (attributes, security, compatibility).

### Multilingual

- FR-8: The system MUST serve 7 locales: en, ru, zh, es, de, fr, ja. EN is primary and complete; others are complete translations, not stubs.
- FR-9: The system MUST provide hreflang reciprocity across all locales for every page.
- FR-10: The system MUST switch UI language based on path prefix (`/ru/`, `/zh/`, etc.) and fall back to EN for untranslated strings (marked explicitly).
- FR-11: The system MUST localize plugin descriptions where the source provides them (zh/en from catalog); for other locales, machine-assisted translation with human review, marked as translated.

### Security

- FR-12: The system MUST run an automated security scan (Semgrep + npm audit + custom YARA) on every plugin source referenced by the catalog at least weekly.
- FR-13: The system MUST mark each plugin with a security status: `clean`, `warning`, `malicious`, `unknown`, `rewritten`.
- FR-14: If malicious code or injection is detected, the system MUST (a) mark the plugin `malicious`, (b) remove the malicious code from any cached/mirrored copy, (c) rewrite it as a safe plugin where feasible, and (d) publish a security report page.
- FR-15: The system MUST NOT serve or link to known-malicious code without the `malicious` badge and a warning.
- FR-16: The system MUST provide a public security policy page and a vulnerability disclosure process.

### Data sync

- FR-17: The system MUST sync the catalog JSON from CDN daily via GitHub Actions, validate schema, and rebuild/redeploy.
- FR-18: The system MUST detect and report drift between declared count and fetched count (pagination/count verification).
- FR-19: The system MUST keep a historical snapshot of each sync for diff/rollback.

### Navigation & UX

- FR-20: The system MUST have a header with dropdown navigation (Categories, Tags, Security, Blog, About, Language switcher).
- FR-21: The system MUST have a footer with at least 5 columns: Catalog, Categories, Resources, Community, Legal.
- FR-22: The system MUST be responsive and work on mobile (hamburger menu).
- FR-23: The system MUST support dark/light/auto theme with toggle persisted in localStorage.

### Monetization

- FR-24: The system MUST support sponsored/featured plugin slots (clearly marked as sponsored).
- FR-25: The system MUST support donation links (Buy Me a Coffee / GitHub Sponsors) in footer and about page.
- FR-26: The system MUST reserve API/data endpoints for paid export (future, gated behind auth).
- FR-27: The system MUST support affiliate link tracking on outbound clicks (with disclosure).

### Content

- FR-28: The system MUST include a blog/changelog/news section with MDX posts, localized.
- FR-29: The system MUST generate an RSS/Atom feed per locale.
- FR-30: The system MUST provide an `.md` twin of key pages for agent consumption (llms.txt, per-page .md).

### SEO/GEO/AEO

- FR-31: The system MUST implement full SEO checklist (title, meta description, canonical, OG, Twitter card, favicon set, JSON-LD, sitemap, robots).
- FR-32: The system MUST generate JSON-LD from the knowledge graph (entities, triples), with no orphans.
- FR-33: The system MUST implement hreflang reciprocity and self-referencing canonicals.
- FR-34: The system MUST provide programmatic SEO pages only where a real dataset exists (category pages, tag pages, author pages).

### PWA

- FR-35: The system MUST ship a PWA manifest + service worker + offline fallback for the catalog.

---

## Non-Functional Requirements

### Performance

- NFR-P1: LCP MUST be ≤ 2.0s on a content page (p75).
- NFR-P2: CLS MUST be ≤ 0.05.
- NFR-P3: INP MUST be ≤ 200ms.
- NFR-P4: JS bundle MUST be ≤ 90 KB gzip on a content page.
- NFR-P5: CSS MUST be ≤ 40 KB gzip.
- NFR-P6: Fonts MUST be ≤ 2 families, ≤ 2 weights, subset, font-display: swap.
- NFR-P7: Images MUST be AVIF/WebP with responsive srcset; no PNG over 200 KB.

### Security

- NFR-S1: All secrets MUST live in `.env` only; `.env.example` with empty values committed.
- NFR-S2: Secret scan MUST run as a build gate.
- NFR-S3: Dependency audit MUST run in CI; lockfile committed.
- NFR-S4: No floating ranges in CI dependencies.
- NFR-S5: Rate limits for free APIs (GitHub, VirusTotal) MUST be budgeted and documented.

### Accessibility

- NFR-A1: All pages MUST meet WCAG 2.1 AA.
- NFR-A2: Keyboard navigation MUST work for all interactive elements.
- NFR-A3: Screen reader announcements for dynamic content.

### Scalability / Reliability

- NFR-R1: Build MUST succeed with 5126+ plugins within 10 minutes.
- NFR-R2: Daily sync job MUST be idempotent.
- NFR-R3: Failed sync MUST not break the live site (keep last good build).

### i18n

- NFR-I1: Every declared alternate MUST point back (hreflang reciprocity).
- NFR-I2: `lang` attribute MUST match locale.
- NFR-I3: Root path serves `/` (en); others `/locale/`.

---

## Acceptance Criteria

### AC-1: Catalog list renders (FR-1, FR-3)
Given a synced catalog with 5126 plugins
When a user opens `/`
Then the first page of plugins is rendered with name, title, category, version, and install command
And pagination links work
And total count matches catalog

### AC-2: Filtering works (FR-2)
Given the catalog list
When a user selects category "security"
Then only security plugins are shown
And URL reflects filter (`?category=security`)
And count is correct

### AC-3: Search works (FR-4)
Given Pagefind index built
When a user types "memory" in search
Then relevant plugins appear within 300ms
And results include name/title/description matches

### AC-4: Plugin detail page (FR-5)
Given a plugin slug
When opening `/p/<slug>/`
Then all fields render (title, desc, category, version, repo, homepage, install cmd, security badge)
And JSON-LD SoftwareApplication (or similar) is present and valid
And canonical is self

### AC-5: Related plugins (FR-6)
Given a plugin detail page
When related section renders
Then at least 3 related plugins are shown
And they share category or tags or author
And no duplicates

### AC-6: Multilingual (FR-8, FR-9, FR-10)
Given locale ru
When opening `/ru/`
Then UI is in Russian
And hreflang includes all 7 locales pointing back
And canonical is `/ru/`

### AC-7: Security scan (FR-12, FR-13)
Given a plugin source
When scan runs
Then security status is assigned
And malicious plugins are marked and reported

### AC-8: Malicious handling (FR-14)
Given a plugin flagged malicious
When the site builds
Then the plugin page shows malicious badge + warning
And no install command is offered without warning
And a security report page exists

### AC-9: Daily sync (FR-17, FR-18)
Given GitHub Actions cron
When it runs daily
Then catalog is fetched, validated, count verified, site rebuilt and deployed
And drift is reported if count differs

### AC-10: Navigation (FR-20, FR-21)
Given any page
When rendered
Then header has dropdown nav working on mobile
And footer has ≥5 columns with working links

### AC-11: Theme (FR-23)
Given a user
When toggling theme
Then it switches and persists in localStorage
And respects prefers-color-scheme on first load

### AC-12: SEO (FR-31, FR-33)
Given any page
When crawled
Then title ≤60, meta desc 120-160, canonical self, OG image 1200x630, twitter card, favicon set, JSON-LD valid, sitemap entry, robots allowed

### AC-13: PWA (FR-35)
Given the site
When offline
Then service worker serves cached catalog pages

### AC-14: Performance (NFR-P1..P7)
Given Lighthouse run
When measured
Then all budgets pass

---

## Edge Cases

- EC-1: Plugin with missing/invalid engines.dsh → status unknown, still visible.
- EC-2: Plugin source unreachable → skip scan, mark unknown, log.
- EC-3: Catalog count mismatch → fail build, alert, keep last good.
- EC-4: Malformed plugin entry → skip with warning, don't break build.
- EC-5: Locale missing translation → fall back to EN, mark untranslated.
- EC-6: Search index empty → show "no results" + suggest categories.
- EC-7: Plugin removed from catalog → 410 or redirect to category, keep in history.
- EC-8: Concurrent sync runs → lock via GitHub Actions concurrency.

---

## API Contracts

See `03-API.md`. Public read-only JSON endpoints for catalog data (for API/data monetization later).

---

## Data Models

See `04-DATA-MODEL.md`. Core entities: Plugin, Category, Tag, Author, Version, SecurityReport, Locale, KnowledgeGraph.

---

## Out of Scope

- OS-1: User accounts / auth on the site (deferred; API/data monetization later).
- OS-2: In-app install (site links to dshmarket.com / in-app market; no install proxy).
- OS-3: Plugin hosting/mirroring binaries (only metadata + security status).
- OS-4: Paid checkout flow (reserved, not built now).
- OS-5: Comments (link to giscus thread on dshmarket.com; embed optional later).
- OS-6: Real-time sync (daily is enough).
