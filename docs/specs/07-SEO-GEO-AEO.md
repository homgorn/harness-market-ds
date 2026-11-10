# SEO / GEO / AEO Plan — DSH Harness Plugin Catalog

## SEO (technical)

- Unique title ≤60 chars, keyword-bearing, per page.
- Meta description 120-160 chars, unique.
- Canonical self, correct locale.
- OG image 1200×630 + og:title/description/url/type/image.
- twitter:card summary_large_image.
- Favicon set: favicon.ico, 16/32/180, apple-touch-icon, manifest.
- JSON-LD valid, matches visible content.
- One H1, semantic heading order, no skipped levels.
- Images: descriptive alt, width/height, lazy below fold.
- Internal links resolve; no empty anchors.
- Footer multi-column, every page reachable.
- Header dropdown nav, mobile-friendly.
- PWA manifest + service worker + offline fallback.
- sitemap.xml + robots.txt consistent with real routes.
- /llms.txt + per-page .md twins.

## GEO (generative engine optimization)

- Long-form blocks with measurements, cited, per locale.
- Entity disambiguation inline.
- Internal linking from knowledge graph.
- Programmatic SEO only with real dataset (category/tag/author pages).
- .md twins for agent consumption.

## AEO (answer engine optimization)

- Q&A blocks from real query data (People Also Ask, autocomplete, competitor headings).
- FAQ schema where appropriate.
- Concise answer-first paragraphs.
- Structured data (JSON-LD) for SoftwareApplication, BreadcrumbList, Organization, WebSite.

## hreflang matrix

- Fully reciprocal. Every declared alternate points back.
- canonical self inside language.
- lang on html correct.
- Root `/` = en, x-default → root.
- Other locales `/<locale>/`.

## JSON-LD knowledge layer

- Generated from knowledge graph (entities, intents, ontology, triples).
- Required per page: BreadcrumbList. Root: WebSite + Organization (once).
- Per plugin detail: SoftwareApplication (or CreativeWork) with name, description, url, applicationCategory, operatingSystem, offers (only if transactable — here no price, so omit Offer), author.
- No invented PostalAddress; omit if no real address.
- No Service/Offer on non-selling pages.
- Every node has @id; no orphans.

## Performance budget (gate)

- LCP ≤ 2.0s, CLS ≤ 0.05, INP ≤ 200ms.
- JS ≤ 90 KB gzip (content page), CSS ≤ 40 KB gzip.
- Fonts ≤ 2 families, ≤ 2 weights, subset, font-display: swap.
- Images AVIF/WebP + srcset, no PNG > 200 KB.

## i18n SEO

- Per-locale sitemap sections or single sitemap with hreflang.
- robots.txt allows all locales.
- Meta tags localized.

## Content SEO

- Blog posts: unique title/desc, OG image, JSON-LD Article, author, datePublished.
- Category/tag pages: unique intro text (not thin), item counts, pagination.
- Author pages: bio (if available), plugin list.

## Monitoring

- Google Search Console (submit sitemap).
- Bing Webmaster Tools.
- Cloudflare Web Analytics.
- Lighthouse CI in GitHub Actions (budget gate).
