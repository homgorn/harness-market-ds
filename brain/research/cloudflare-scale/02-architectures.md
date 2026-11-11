# Architecture Options for 72,576-Page Catalog Site on Cloudflare

**Site profile**: 10,368 plugins × 7 languages = 72,576 HTML pages + assets (CSS, JS, images). Estimated 6-9 GB total static content. SSR needed for dynamic plugin data, i18n routing, hreflang.

All options evaluated against:
- **File limit** (must accommodate 72,576+ files)
- **Request cost** (static free, dynamic billed)
- **Storage cost** (R2/KV/D1 pricing)
- **SEO integrity** (hreflang, crawlability, canonicals)
- **Operational complexity** (build, deploy, maintain)
- **Monthly cost** (Free vs Paid Workers + storage overages)

---

## Option A: Workers Paid + Static Assets (Single Worker)

**Architecture**: Deploy entire site as one Workers Static Assets project on Workers Paid plan ($5/mo). All 72,576 HTML files + assets uploaded as static assets. Worker script handles SSR/dynamic routes, i18n middleware, hreflang injection.

```
wrangler.jsonc
{
  "name": "catalog",
  "compatibility_date": "2026-11-01",
  "assets": { "directory": "./dist" },
  "main": "./dist/_worker.js"
}
```

### Pros
| Factor | Assessment |
|--------|------------|
| **File limit** | ✅ 100,000 files/version (72,576 < 100k) |
| **Static requests** | ✅ Free & unlimited (same as Pages) |
| **SSR support** | ✅ Native via `run_worker_first` or `binding: "ASSETS"` |
| **hreflang** | ✅ Single domain (e.g., `catalog.example.com/en/plugin/...`) — simplest valid structure |
| **Custom domains** | ✅ Multiple subdomains on one Worker (e.g., `en.catalog.example.com`, `de.catalog.example.com`) |
| **Deploy simplicity** | ✅ Single `wrangler deploy`, atomic versioning |
| **Cache** | ✅ Edge cache automatically for static assets; `Cache-Control` via `_headers` |
| **Cost predictability** | ✅ $5/mo base + negligible overages |

### Cons
| Factor | Assessment |
|--------|------------|
| **Worker script size** | ⚠️ Must stay <10 MB compressed (64 MB uncompressed) — SSR logic + i18n middleware must be lean |
| **Build output** | ⚠️ 72k+ files in `dist/` — build tools must handle (Astro/Next/11ty OK with proper config) |
| **Wrangler upload** | ⚠️ Requires Wrangler ≥4.34.0; large uploads may need chunking |
| **Single point of failure** | ⚠️ One Worker version = all languages; rollback affects all |
| **CPU on SSR routes** | ⚠️ 5 min/request limit; 375 vCPU-min/mo included — monitor dynamic routes |

### Request Count & Cost Model (Monthly)
| Traffic Pattern | Static Requests | Dynamic (SSR) Requests | KV/R2 Ops | Est. Cost |
|-----------------|-----------------|------------------------|-----------|-----------|
| 500k visits/mo, 10 pages/visit | 5M (free) | 500k (SSR) | 500k KV reads | **$5.00** (base) + ~$0.25 KV reads |
| 2M visits/mo, 8 pages/visit | 16M (free) | 2M (SSR) | 2M KV reads | **$5.00** + ~$1.00 KV reads + ~$0.60 CPU |

> **Static asset requests are free on both Free and Paid Workers plans.** (Pages Functions Pricing doc)

### SEO Impact
- ✅ Single domain with subdirectories (`/en/`, `/de/`) — Google's recommended default
- ✅ hreflang self-referential + bidirectional — trivial to implement in Worker middleware
- ✅ No cross-domain hreflang complexity
- ✅ Canonical URLs clean: `https://catalog.example.com/en/plugin/slug`

### Complexity: **Low** (1 Worker, 1 deploy, standard tooling)

---

## Option B: R2 + Worker (HTML in R2, Assets in Static Assets)

**Architecture**: Store 72,576 HTML pages in R2 bucket (keyed by path: `/en/plugin/slug.html`). Static assets (CSS, JS, images) in Workers Static Assets (under 100k limit). Worker fetches HTML from R2, injects dynamic data, returns response.

```
R2 Bucket: catalog-html
  /en/plugin/slug.html
  /de/plugin/slug.html
  ...

Worker Static Assets: ./dist/assets/  (CSS, JS, images, fonts)
```

### Pros
| Factor | Assessment |
|--------|------------|
| **File limit bypass** | ✅ R2 has no file count limit (100k buckets/account) |
| **Storage cost** | ✅ 10 GB free tier covers all HTML (~3.6 GB) + assets |
| **Egress** | ✅ **Free** from R2 (Workers API, S3 API, r2.dev) |
| **HTML updates** | ✅ Can update individual HTML files via R2 API without full rebuild/deploy |
| **Static assets** | ✅ Still free & unlimited requests via Workers Static Assets |
| **Multi-worker** | ✅ Can split by language: 7 Workers each with ~10k HTML files in R2 |

### Cons
| Factor | Assessment |
|--------|------------|
| **Class B operations** | ⚠️ Every HTML page view = 1 R2 GET (Class B). 10M free/mo, then $0.36/M |
| **Latency** | ⚠️ Extra R2 round-trip per HTML request (~5-15ms at edge) |
| **Cache control** | ⚠️ Must implement `Cache-Control` headers manually in Worker response |
| **No atomic deploy** | ⚠️ R2 updates not versioned with Worker; risk of HTML/Worker mismatch |
| **Worker complexity** | ⚠️ Custom routing, R2 fetch, error handling, fallback to static assets |
| **Build pipeline** | ⚠️ Two deploy targets: `wrangler deploy` + `wrangler r2 put` (or `rclone`) |

### Request Count & Cost Model (Monthly)
| Traffic | R2 Class B (HTML) | R2 Class A (writes) | Static Assets | KV (if used) | Est. Cost |
|---------|-------------------|---------------------|---------------|--------------|-----------|
| 500k visits, 10 pages | 5M GETs (free) | ~100k writes (deploy) | Free | — | **$5.00** (Workers Paid) |
| 2M visits, 8 pages | 16M GETs ($2.16) | ~100k writes | Free | — | **$7.16** |
| 10M visits, 5 pages | 50M GETs ($14.40) | ~100k writes | Free | — | **$19.40** |

> At 10M Class B free tier, overage = (50M - 10M) × $0.36/M = $14.40

### SEO Impact
- ✅ Same URL structures as Option A
- ⚠️ Must ensure `Cache-Control: public, max-age=..., stale-while-revalidate` for SEO crawl efficiency
- ⚠️ R2 `ETag`/`Last-Modified` support for conditional GETs (crawler optimization)

### Complexity: **Medium** (R2 integration, dual deploy, cache headers)

---

## Option C: KV-Backed SSR (HTML in KV, Dynamic Data in KV/D1)

**Architecture**: Store pre-rendered HTML in Workers KV (key = path, value = HTML string). Worker reads from KV, does string interpolation for dynamic slots (prices, availability), returns. Static assets in Workers Static Assets.

```
KV Namespace: CATALOG_HTML
  "en/plugin/slug" → "<html>...</html>"
  "de/plugin/slug" → "<html>...</html>"

D1: plugin metadata (prices, stats) for dynamic injection
```

### Pros
| Factor | Assessment |
|--------|------------|
| **File limit** | ✅ KV: unlimited keys/namespace, 1 GB free / 10 GB paid per namespace |
| **Read speed** | ✅ KV edge-cached (`cacheTtl`), sub-ms reads at edge |
| **Dynamic injection** | ✅ Worker can `HTMLRewriter` or template interpolation for live data |
| **Partial updates** | ✅ Update single plugin's HTML in KV without full rebuild |
| **Free tier reads** | ✅ 100k reads/day free — may suffice for low traffic |

### Cons
| Factor | Assessment |
|--------|------------|
| **Storage limit** | ❌ **Free: 1 GB total** — 72k × 50 KB = **3.6 GB** (exceeds free). Paid: $0.50/GB-mo |
| **Write limit** | ❌ **Free: 1,000 writes/day** — initial deploy 72k writes = **72 days** on free tier |
| **Value size** | ⚠️ 25 MiB/key — OK for HTML |
| **KV cost at scale** | ⚠️ Paid: $0.50/M reads + $5.00/M writes + $0.50/GB-mo storage |
| **Eventual consistency** | ⚠️ KV is eventually consistent (60s min cacheTtl) — stale HTML possible |
| **No atomic deploy** | ⚠️ Same as R2: KV updates not versioned with Worker |

### Request Count & Cost Model (Monthly)
| Traffic | KV Reads | KV Writes (deploy) | Storage | Est. Cost |
|---------|----------|-------------------|---------|-----------|
| 500k visits, 10 pages | 5M reads ($2.50) | 72k ($0.36) | 3.6 GB ($1.80) | **$9.66** |
| 2M visits, 8 pages | 16M reads ($8.00) | 72k ($0.36) | 3.6 GB ($1.80) | **$15.16** |
| Free tier | 100k/day = 3M/mo | 1k/day = 30k/mo | 1 GB | **Blocks at deploy** (72k > 30k writes) |

> **Free tier cannot handle initial deploy** (72k writes > 1k/day limit). Must use Paid Workers for KV.

### SEO Impact
- ✅ Same URL structures
- ⚠️ Eventual consistency: crawler may see stale HTML for up to `cacheTtl` (min 30s, default longer)
- ⚠️ Must purge KV cache on updates (`cacheTtl` honored per key)

### Complexity: **Medium-High** (KV ops, HTMLRewriter, consistency management)

---

## Option D: Multi-Worker Subdomain Split (7 Workers, 1 per Language)

**Architecture**: Deploy 7 separate Workers (one per language), each with ~10,368 HTML files + shared assets. Each Worker on its own subdomain: `en.catalog.example.com`, `de.catalog.example.com`, etc. Shared assets via single "assets" Worker or R2.

```
Workers:
  catalog-en  → en.catalog.example.com  (10,368 files)
  catalog-de  → de.catalog.example.com  (10,368 files)
  ...
  catalog-assets → assets.catalog.example.com (CSS, JS, images)
```

### Pros
| Factor | Assessment |
|--------|------------|
| **File limit per Worker** | ✅ 10,368 < 20,000 — **works on Workers Free plan** |
| **Isolation** | ✅ Deploy/rollback per language independently |
| **Team autonomy** | ✅ Different teams can own different language Workers |
| **Free plan viable** | ✅ 7 × Free Workers = $0/mo base (if requests < 100k/day each) |
| **Asset sharing** | ✅ Central assets Worker serves CSS/JS/images to all |

### Cons
| Factor | Assessment |
|--------|------------|
| **Request limit** | ❌ **Free: 100k requests/day per Worker** — 7 Workers = 700k/day aggregate, but **per-Worker cap** |
| **Cross-language hreflang** | ⚠️ Must generate hreflang across 7 subdomains — valid per Google but more complex |
| **Shared assets** | ⚠️ `assets.catalog.example.com` becomes single point; needs caching strategy |
| **Worker management** | ⚠️ 7× deploy, 7× config, 7× monitoring |
| **Custom domains** | ⚠️ 7 subdomains + 1 assets subdomain = 8 custom domains (well within 100/project limit) |
| **SEO authority split** | ⚠️ Subdomains treated as separate sites by Google — link equity not shared automatically |

### Request Count & Cost Model (Monthly)
| Plan | Workers | Requests/Worker/Day | Total Requests/Day | Base Cost |
|------|---------|---------------------|-------------------|-----------|
| **Free** | 7 | 100k each | 700k aggregate | **$0** (if each < 100k) |
| **Paid** | 7 | Unlimited | Unlimited | **$5/mo** (single account Paid plan covers all) |

> Workers Paid plan is **per account**, not per Worker. One $5/mo account covers up to 500 Workers.

### SEO Impact
| Structure | Google Treatment | hreflang Validity |
|-----------|------------------|-------------------|
| `en.catalog.example.com` | Separate site (subdomain) | ✅ Valid — "Alternate URLs do not need to be in the same domain" |
| `catalog.example.com/en/` | Single site (subdirectory) | ✅ Preferred by Google |
| `catalog.example.com` + `catalog.de` | Separate ccTLD/gTLD | ✅ Valid but expensive |

> **Subdirectories are Google's default recommendation** ("simpler to run and a good default"). Subdomains "fine when your setup calls for them." (ConveyThis, Google Multi-Regional docs)

### Complexity: **High** (7 Workers, cross-origin asset fetching, hreflang generation, deploy orchestration)

---

## Option E: External Static Host + Cloudflare CDN (GitHub Pages / Netlify / BunnyCDN)

**Architecture**: Build static site externally, host on GitHub Pages / Netlify / BunnyCDN Storage + CDN. Use Cloudflare only for DNS, WAF, caching layer. SSR via separate Workers API (headless).

| Host | File Limit | Bandwidth | Cost | SSR Support |
|------|------------|-----------|------|-------------|
| **GitHub Pages** | 1 GB published | 100 GB/mo soft | Free | ❌ No |
| **Netlify Free** | No file cap | ~15 GB (300 credits) | Free* | ✅ Functions (125k/mo) |
| **Vercel Hobby** | 15k source files | 100 GB | Free | ✅ Functions (1M invocations) |
| **BunnyCDN + Storage** | No limit | $0.01/GB (EU/NA) | ~$1-5/mo | ❌ No |

> *Netlify free sites **pause** when credits exhausted — no overage charges.

### Pros
| Factor | Assessment |
|--------|------------|
| **Simplicity** | ✅ Standard static hosting workflows |
| **GitHub Pages** | ✅ Zero cost, native Git integration |
| **Netlify/Vercel** | ✅ Built-in Functions for SSR/API |
| **BunnyCDN** | ✅ Cheapest bandwidth at scale ($0.005/GB Volume tier) |

### Cons
| Factor | Assessment |
|--------|------------|
| **GitHub Pages** | ❌ 1 GB site limit — **72k HTML + assets ≈ 6-9 GB** (EXCEEDS) |
| **Netlify Free** | ❌ 15 GB bandwidth — **insufficient for production traffic** |
| **Vercel Hobby** | ❌ 15k source file CLI limit — may block deploy (output files unlimited but build slow) |
| **No unified edge** | ❌ SSR on different platform = extra latency, no shared cache |
| **hreflang across hosts** | ⚠️ Possible but complex (different domains/subdomains) |
| **Cost at scale** | ⚠️ Netlify/Vercel paid plans expensive vs Cloudflare Workers Paid |

### SEO Impact
- ⚠️ GitHub Pages: `username.github.io` or custom domain — hreflang works but subdirectory structure harder
- ⚠️ Netlify/Vercel: Full control, but bandwidth caps force upgrade
- ❌ No single-edge SSR + static = worse Core Web Vitals (TTFB)

### Complexity: **Low-Medium** (familiar tools) but **Architectural Mismatch** for 70k pages

---

## Summary Comparison Matrix

| Criterion | A: Workers Paid Static Assets | B: R2 + Worker | C: KV-Backed SSR | D: 7× Free Workers | E: External Host |
|-----------|------------------------------|----------------|------------------|--------------------|------------------|
| **File limit OK?** | ✅ 100k | ✅ R2 unlimited | ⚠️ 1 GB free / paid | ✅ 10k each (Free) | ❌ GH Pages 1 GB |
| **Monthly cost (low traffic)** | **$5** | **$5** | **$5 + $5-10 KV** | **$0** (Free) | **$0-5** |
| **Monthly cost (high traffic)** | **$5-10** | **$7-20** | **$10-25** | **$5** (Paid) | **$20-100+** |
| **Static request cost** | Free | Free | Free | Free | Varies |
| **Dynamic/SSR cost** | CPU included | CPU + R2 Class B | CPU + KV reads | CPU (per Worker) | Function invocations |
| **Deploy atomicity** | ✅ Single version | ❌ R2 + Worker separate | ❌ KV + Worker separate | ❌ 7 versions | Varies |
| **hreflang simplicity** | ✅ Subdirectories | ✅ Subdirectories | ✅ Subdirectories | ⚠️ Cross-subdomain | ⚠️ Cross-domain |
| **SEO authority** | ✅ Single domain | ✅ Single domain | ✅ Single domain | ⚠️ Split subdomains | Varies |
| **Operational complexity** | **Low** | Medium | Medium-High | **High** | Low |
| **Rollback safety** | ✅ Instant | ⚠️ Manual sync | ⚠️ Manual sync | ⚠️ 7 rollbacks | Varies |
| **Free plan viable?** | ❌ (20k limit) | ❌ (20k static assets) | ❌ (1 GB KV, 1k writes) | ✅ (10k each) | ✅ (but limits) |

---

## What Breaks SEO in Each Option

| Option | SEO Risk | Mitigation |
|--------|----------|------------|
| **A** | None significant | Ensure `_headers` for `Cache-Control`, `X-Robots-Tag` |
| **B** | Stale HTML if R2/Worker out of sync | Versioned R2 keys (hash in path), atomic publish script |
| **C** | Eventual consistency → crawler sees old content | Short `cacheTtl` (60s), purge on publish, `Last-Modified` headers |
| **D** | Subdomain authority split; hreflang errors | Cross-subdomain hreflang + `x-default`, shared Search Console property |
| **E** | Bandwidth caps → site down; no edge SSR | Upgrade to paid, or use Cloudflare Workers for SSR only |

---

*End of architecture analysis. All costs in USD, 2026 pricing. Traffic estimates assume 50 KB avg HTML, 10 assets/page.*