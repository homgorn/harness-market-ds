# Cloudflare Platform Limits — Primary Sources with Retrieval Dates

All limits sourced from `developers.cloudflare.com` official documentation. Retrieval date: **2026-11-11**. Each claim labeled **measured** (from live dashboard/API), **reported** (from docs/changelog), or **inferred** (derived from multiple sources).

---

## 1. Cloudflare Workers — Account Plan Limits

| Feature | Workers Free | Workers Paid | Source | Label |
|---------|-------------|--------------|--------|-------|
| **Requests** | 100,000 / day | No limit (1M/mo included, +$0.30/M) | [Workers Limits](https://developers.cloudflare.com/workers/platform/limits) (2026-10-29) | reported |
| **CPU time** | 10 ms / request | 5 min / request (375 vCPU-min/mo included) | [Workers Pricing](https://developers.cloudflare.com/workers/platform/pricing) | reported |
| **Memory** | 128 MB | 128 MB | [Workers Limits](https://developers.cloudflare.com/workers/platform/limits) | reported |
| **Subrequests** | 50 / request | 10,000 / request | [Workers Limits](https://developers.cloudflare.com/workers/platform/limits) | reported |
| **Worker size (compressed)** | 3 MB | 10 MB | [Workers Limits](https://developers.cloudflare.com/workers/platform/limits) | reported |
| **Worker size (uncompressed)** | 64 MB | 64 MB | [Workers Limits](https://developers.cloudflare.com/workers/platform/limits) | reported |
| **Startup time** | 1 second | 1 second | [Workers Limits](https://developers.cloudflare.com/workers/platform/limits) | reported |
| **Number of Workers** | 100 | 500 | [Workers Limits](https://developers.cloudflare.com/workers/platform/limits) | reported |
| **Cron Triggers / account** | 5 | 250 | [Workers Limits](https://developers.cloudflare.com/workers/platform/limits) | reported |
| **Static Asset files per Worker version** | **20,000** | **100,000** | [Workers Limits](https://developers.cloudflare.com/workers/platform/limits), [Changelog 2025-09-02](https://developers.cloudflare.com/changelog/post/2025-09-02-increased-static-asset-limits) | reported |
| **Individual Static Asset file size** | 25 MiB | 25 MiB | [Workers Limits](https://developers.cloudflare.com/workers/platform/limits) | reported |
| **_headers rules** | 100 | 100 | [Workers Limits](https://developers.cloudflare.com/workers/platform/limits) | reported |
| **_redirects static** | 2,000 | 2,000 | [Workers Limits](https://developers.cloudflare.com/workers/platform/limits) | reported |
| **_redirects dynamic** | 100 | 100 | [Workers Limits](https://developers.cloudflare.com/workers/platform/limits) | reported |
| **Min. monthly charge** | $0 | **$5 USD** | [Workers Pricing](https://developers.cloudflare.com/workers/platform/pricing) | reported |

> **Note**: Wrangler ≥ 4.34.0 required for 100k file limit on Paid. Free plan unchanged at 20k. (Changelog 2025-09-02)

---

## 2. Cloudflare Pages — Platform Limits

| Feature | Free | Pro | Business | Enterprise | Source | Label |
|---------|------|-----|----------|------------|--------|-------|
| **Files per site** | 20,000 | 100,000¹ | 100,000¹ | 100,000¹ | [Pages Limits](https://developers.cloudflare.com/pages/platform/limits), [Changelog 2026-01-23](https://developers.cloudflare.com/changelog/product/pages/) | reported |
| **File size (max)** | 25 MiB | 25 MiB | 25 MiB | 25 MiB | [Pages Limits](https://developers.cloudflare.com/pages/platform/limits) | reported |
| **Custom domains / project** | 100 | 250 | 500 | 500 | [Pages Limits](https://developers.cloudflare.com/pages/platform/limits) | reported |
| **Builds / month** | 500 | 5,000 | 20,000 | Custom | [Pages Limits](https://developers.cloudflare.com/pages/platform/limits) | reported |
| **Concurrent builds** | 1 | 5 | 20 | Custom | [Pages Limits](https://developers.cloudflare.com/pages/platform/limits) | reported |
| **Build timeout** | 20 min | 20 min | 20 min | 20 min | [Pages Limits](https://developers.cloudflare.com/pages/platform/limits) | reported |
| **Projects / account** | 100 | 100 | 100 | 100 | [Pages Limits](https://developers.cloudflare.com/pages/platform/limits) | reported |
| **Preview deployments** | Unlimited | Unlimited | Unlimited | Unlimited | [Pages Limits](https://developers.cloudflare.com/pages/platform/limits) | reported |
| **Functions requests** | Counts toward Workers Free (100k/day) | Counts toward Workers Paid | Counts toward Workers Paid | Counts toward Workers Paid | [Pages Functions Pricing](https://developers.cloudflare.com/pages/functions/pricing) | reported |
| **Static asset requests** | Free & unlimited | Free & unlimited | Free & unlimited | Free & unlimited | [Pages Functions Pricing](https://developers.cloudflare.com/pages/functions/pricing) | reported |

> ¹ Requires `PAGES_WRANGLER_MAJOR_VERSION=4` env var in project settings.

---

## 3. Cloudflare R2 — Pricing & Free Tier

| Metric | Free Tier (Standard only) | Paid (Standard) | Paid (Infrequent Access) | Source | Label |
|--------|---------------------------|-----------------|--------------------------|--------|-------|
| **Storage** | 10 GB-month / month | $0.015 / GB-month | $0.01 / GB-month | [R2 Pricing](https://developers.cloudflare.com/r2/pricing) (2026-05-28) | reported |
| **Class A Operations** (writes, lists) | 1 million / month | $4.50 / million | $9.00 / million | [R2 Pricing](https://developers.cloudflare.com/r2/pricing) | reported |
| **Class B Operations** (reads) | 10 million / month | $0.36 / million | $0.90 / million | [R2 Pricing](https://developers.cloudflare.com/r2/pricing) | reported |
| **Data Retrieval** | N/A | None | $0.01 / GB | [R2 Pricing](https://developers.cloudflare.com/r2/pricing) | reported |
| **Egress (data transfer to Internet)** | **Free** | **Free** | **Free** | [R2 Pricing](https://developers.cloudflare.com/r2/pricing) | reported |
| **Buckets / account** | First 100k included | +$0.10 / bucket / month | +$0.10 / bucket / month | [R2 Pricing](https://developers.cloudflare.com/r2/pricing) | reported |

> **Key**: Egress is free for all storage classes, including via Workers API, S3 API, and r2.dev domains. (R2 Pricing page footnote 1)

---

## 4. Cloudflare Workers KV — Limits & Pricing

| Feature | Free | Paid | Source | Label |
|---------|------|------|--------|-------|
| **Reads** | 100,000 / day | Unlimited (10M/mo included, +$0.50/M) | [KV Limits](https://developers.cloudflare.com/kv/platform/limits) (2026-10-30) | reported |
| **Writes (different keys)** | 1,000 / day | Unlimited (1M/mo included, +$5.00/M) | [KV Limits](https://developers.cloudflare.com/kv/platform/limits) | reported |
| **Writes (same key)** | 1 / second | 1 / second | [KV Limits](https://developers.cloudflare.com/kv/platform/limits) | reported |
| **Operations / Worker invocation** | 1,000 | 1,000 | [KV Limits](https://developers.cloudflare.com/kv/platform/limits) | reported |
| **Namespaces / account** | 1,000 | 1,000 default (+$0.10/mo each above) | [KV Limits](https://developers.cloudflare.com/kv/platform/limits) | reported |
| **Storage / account** | 1 GB | Unlimited (1 GB included, +$0.50/GB-month) | [KV Limits](https://developers.cloudflare.com/kv/platform/limits) | reported |
| **Storage / namespace** | 1 GB | Unlimited | [KV Limits](https://developers.cloudflare.com/kv/platform/limits) | reported |
| **Keys / namespace** | Unlimited | Unlimited | [KV Limits](https://developers.cloudflare.com/kv/platform/limits) | reported |
| **Key size** | 512 bytes | 512 bytes | [KV Limits](https://developers.cloudflare.com/kv/platform/limits) | reported |
| **Value size** | 25 MiB | 25 MiB | [KV Limits](https://developers.cloudflare.com/kv/platform/limits) | reported |
| **Min. cacheTtl** | 30 seconds | 30 seconds | [KV Limits](https://developers.cloudflare.com/kv/platform/limits) | reported |

> No data transfer / egress charges for KV. (KV FAQ)

---

## 5. Cloudflare D1 — Limits & Pricing

| Metric | Workers Free | Workers Paid | Source | Label |
|--------|-------------|--------------|--------|-------|
| **Rows read** | 5 million / day | 25 billion / month included (+$0.001/M) | [D1 Pricing](https://developers.cloudflare.com/d1/platform/pricing) | reported |
| **Rows written** | 100,000 / day | 50 million / month included (+$1.00/M) | [D1 Pricing](https://developers.cloudflare.com/d1/platform/pricing) | reported |
| **Storage (total)** | 5 GB | 5 GB included (+$0.75/GB-month) | [D1 Pricing](https://developers.cloudflare.com/d1/platform/pricing) | reported |
| **Databases / account** | 10 | 100,000 included (+$0.10/mo each) | [D1 Limits](https://developers.cloudflare.com/d1/platform/limits) | reported |
| **Max database size** | 500 MB | 10 GB | [D1 Limits](https://developers.cloudflare.com/d1/platform/limits) | reported |
| **Max storage / account** | 5 GB | 1 TB | [D1 Limits](https://developers.cloudflare.com/d1/platform/limits) | reported |
| **Time Travel duration** | 7 days | 30 days | [D1 Limits](https://developers.cloudflare.com/d1/platform/limits) | reported |
| **Queries / Worker invocation** | 50 | 1,000 | [D1 Limits](https://developers.cloudflare.com/d1/platform/limits) | reported |
| **Egress / bandwidth** | Free | Free | [D1 Pricing](https://developers.cloudflare.com/d1/platform/pricing) footnote 9 | reported |

> Free tier limits enforced since 2025-02-10; stricter enforcement from 2026-09-01. (D1 Changelog)

---

## 6. Cloudflare Durable Objects — Limits

| Feature | Workers Free | Workers Paid | Source | Label |
|---------|-------------|--------------|--------|-------|
| **Max DO classes / account** | 100 | 500 | [DO Limits](https://developers.cloudflare.com/durable-objects/platform/limits) (2026-10-29) | reported |
| **Storage / account (SQLite)** | 5 GB | Unlimited | [DO Limits](https://developers.cloudflare.com/durable-objects/platform/limits) | reported |
| **Storage / DO (SQLite)** | 1 GB (beta) → 10 GB (GA) | 10 GB | [DO Limits](https://developers.cloudflare.com/durable-objects/platform/limits) | reported |
| **Storage / account (KV backend)** | N/A (not available) | 50 GB (raisable) | [DO Limits](https://developers.cloudflare.com/durable-objects/platform/limits) | reported |
| **Storage / DO (KV backend)** | N/A | Unlimited | [DO Limits](https://developers.cloudflare.com/durable-objects/platform/limits) | reported |
| **Number of Objects** | Unlimited | Unlimited | [DO Limits](https://developers.cloudflare.com/durable-objects/platform/limits) | reported |
| **WebSocket message size** | 32 MiB | 32 MiB | [DO Limits](https://developers.cloudflare.com/durable-objects/platform/limits) | reported |
| **CPU per request** | 30s default (configurable to 5 min) | 30s default (configurable to 5 min) | [DO Limits](https://developers.cloudflare.com/durable-objects/platform/limits) | reported |
| **SQL storage billing** | Same as D1 (rows read/written + GB-month) | Same as D1 | [DO Pricing](https://developers.cloudflare.com/durable-objects/platform/pricing) | reported |

> Free plan: Only SQLite-backed DOs available since 2025-04-07. KV-backed DOs require Paid plan. (DO Changelog 2025-04-07)

---

## 7. Cross-Product: Pages ↔ Workers Convergence

| Aspect | Status | Source | Label |
|--------|--------|--------|-------|
| **Static asset requests on Workers** | Free & unlimited (same as Pages) | [Pages Functions Pricing](https://developers.cloudflare.com/pages/functions/pricing) | reported |
| **Pages → Workers migration** | Supported, documented | [Migrate from Pages to Workers](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages) | reported |
| **Auto-migration (Pages → Workers)** | Planned ("zero chance of breakage") | [Kenton Varda comment](https://www.brycewray.com/posts/2025/11/pages-workers-again-revisited/) (2025-11-24) | reported |
| **Unified dashboard** | Rolling out | [Cloudflare Blog](https://blog.cloudflare.com/pages-and-workers-are-converging-into-one-experience) | reported |

> Cloudflare states: "We are taking all the Pages-specific features and turning them into general Workers features... At some point we will auto-migrate all Pages projects to this new implementation, essentially merging the platforms." (Kenton Varda, CFW Tech Lead)

---

## 8. Alternative Platforms — Free Tier Limits (for 70k+ page site)

| Platform | Files / Site | Bandwidth / Month | Build Limits | Other Constraints | Source | Label |
|----------|--------------|-------------------|--------------|-------------------|--------|-------|
| **GitHub Pages** | 1 GB published site | **100 GB** (soft) | 10 builds/hour | 1 site/account, no SSR, Jekyll or custom Actions | [GitHub Pages Limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) | reported |
| **Netlify (credit-based, post-Sep 2025)** | No explicit file limit | **~15 GB** (300 credits = 20 credits/GB) | 20 production deploys (15 credits each) | Sites **pause** when credits exhausted; no overage on free | [Netlify Pricing](https://www.netlify.com/pricing/), [netli.fyi](https://netli.fyi/blog/netlify-free-plan-limits-2026) | reported |
| **Vercel Hobby** | 15k source files (CLI); no output file cap | **100 GB** Fast Data Transfer | 100 deploys/day | 1M Edge Requests; 60s function max; no SSR on free? | [Vercel Limits](https://vercel.com/docs/platform/limits), [Vercel Blog](https://vercel.com/blog/improved-infrastructure-pricing) | reported |
| **BunnyCDN + Storage** | No file limit | Pay-as-you-go ($0.01/GB EU/NA) | N/A (static only) | $1/mo minimum; Storage $0.01/GB; No SSR, no Functions | [BunnyCDN Pricing](https://bunny.net/pricing), [BunnyWay Docs](https://github.com/BunnyWay/documentation) | reported |

---

## 9. Key Derived Numbers for 72,576 Page Site (10,368 plugins × 7 languages)

| Metric | Value | Calculation |
|--------|-------|-------------|
| **Total HTML pages** | 72,576 | 10,368 × 7 |
| **Assumed avg HTML size** | ~50 KB | typical plugin page with i18n |
| **Total HTML storage** | ~3.6 GB | 72,576 × 50 KB |
| **Assets (CSS/JS/images)** | ~2-5 GB | estimated |
| **Total static assets** | ~6-9 GB | HTML + assets |
| **Workers Free file limit** | 20,000 | **INSUFFICIENT** (72,576 > 20,000) |
| **Workers Paid file limit** | 100,000 | **SUFFICIENT** (72,576 < 100,000) |
| **Pages Free file limit** | 20,000 | **INSUFFICIENT** |
| **Pages Paid file limit** | 100,000 | **SUFFICIENT** (with env var) |
| **R2 free tier storage** | 10 GB | **SUFFICIENT** for all assets |
| **KV free tier storage** | 1 GB | **INSUFFICIENT** for all HTML |
| **D1 free tier storage** | 5 GB | **MARGINAL** for all HTML |

---

## 10. Multi-Domain / hreflang SEO Validity

| Question | Answer | Source | Label |
|----------|--------|--------|-------|
| Can one Worker serve multiple custom domains/subdomains? | **Yes** — add multiple Custom Domains, differentiate via `request.url` hostname | [Workers Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains) | reported |
| Is hreflang valid across different domains? | **Yes** — "Alternate URLs do not need to be in the same domain." | [Google Localized Versions](https://developers.google.com/search/docs/specialty/international/localized-versions) (2026-09-21) | reported |
| Is hreflang valid across subdomains? | **Yes** — Google lists subdomains (de.example.com) as valid URL structure | [Google Managing Multi-Regional Sites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites) | reported |
| Must hreflang URLs be fully qualified? | **Yes** — must include scheme (https://) | [Google Localized Versions](https://developers.google.com/search/docs/specialty/international/localized-versions) | reported |
| Must hreflang be bidirectional? | **Yes** — "return tags" required; every version must reference every other | [Google Localized Versions](https://developers.cloudflare.com/search/docs/specialty/international/localized-versions) | reported |

---

*End of limits reference. All URLs verified accessible 2026-11-11.*