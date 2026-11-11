# Research Gaps & Unknowns — Cloudflare Scale for 72k+ Pages

**Status**: Open questions requiring validation before production commit. Each gap labeled with **blocker risk** (HIGH/MEDIUM/LOW) and **validation method**.

---

## G-01: Actual Compressed Build Size vs 10 MB Worker Limit
**Risk**: HIGH — If `dist/_worker.js` + dependencies > 10 MB compressed, deploy fails.

| Detail | Value |
|--------|-------|
| **Limit** | 10 MB compressed (Workers Paid) / 3 MB (Free) |
| **Current estimate** | Unknown — depends on framework (Astro/Next/11ty), SSR runtime, i18n libs |
| **Validation** | `wrangler deploy --outdir bundled/ --dry-run` → check `gzip:` output |
| **Mitigation** | Move heavy deps to R2/D1; use `nodejs_compat` selectively; split into multiple Workers via Service Bindings |

> **Source**: [Workers Limits](https://developers.cloudflare.com/workers/platform/limits) — "Worker size: 10 MB (Paid) after compression"

---

## G-02: Wrangler Upload Performance at 85k+ Files
**Risk**: MEDIUM — Large asset uploads may timeout, chunk incorrectly, or exceed API limits.

| Detail | Value |
|--------|-------|
| **Observed behavior** | Wrangler ≥4.34.0 uploads in chunks; 100k files documented as supported |
| **Unknowns** | Upload time for 85k files; retry behavior on partial failure; CI/CD timeout (GitHub Actions 6h) |
| **Validation** | Test deploy in staging with full build output; measure `wrangler deploy` duration |
| **Mitigation** | Use `--minify`; exclude dev files; consider R2 for infrequently accessed assets |

> **Source**: [Changelog 2025-09-02](https://developers.cloudflare.com/changelog/post/2025-09-02-increased-static-asset-limits) — "Wrangler version 4.34.0 or higher required"

---

## G-03: Static Asset Cache Behavior at Scale
**Risk**: MEDIUM — Cache eviction, `Cache-Control` inheritance, and purge propagation for 85k files.

| Question | Status |
|----------|--------|
| Does `_headers` apply to all 85k files correctly? | Untested at this scale |
| Cache key includes query string? | Default: yes — may fragment cache |
| Purge-by-tag / purge-by-prefix for language folders? | Supported via Cache API / Purge API |
| Edge TTL vs `max-age` interaction? | `Cache-Control` respected; edge may hold shorter |
| `stale-while-revalidate` behavior on 72k HTML files? | Untested |

> **Validation**: Deploy test subset (10k files), measure `cf-cache-status` headers, trigger purges, verify propagation < 30s globally.

---

## G-04: SSR Cold Start Latency with 7-Language Routing
**Risk**: MEDIUM — Worker startup must parse i18n routes, load dictionaries, initialize HTMLRewriter < 1s.

| Metric | Target | Unknown |
|--------|--------|---------|
| **Startup time limit** | 1 second (hard) | Actual with full route tree |
| **Cold start p99** | < 200 ms | Depends on bundle size, `nodejs_compat` |
| **Per-request CPU (SSR)** | < 10 ms typical | HTMLRewriter + template interpolation cost |
| **Memory per isolate** | < 128 MB | i18n dictionaries (7 × ~500 strings) |

> **Validation**: Load test with `hey` or `wrk` against staging; profile with `wrangler tail --format=json` for CPU/memory.

---

## G-05: hreflang Implementation Correctness at Scale
**Risk**: HIGH — 72,576 pages × 7 languages = 507k hreflang links. One error = cluster break.

| Requirement | Validation Needed |
|-------------|-------------------|
| **Bidirectional** (A→B and B→A) | Automated check: crawl all pages, verify return links |
| **Self-referential** (each page lists itself) | Same crawl |
| **x-default** present on all | Same crawl |
| **Fully qualified URLs** (https://) | Same crawl |
| **No redirect chains** in hreflang targets | Same crawl |
| **Language codes** ISO 639-1 + ISO 3166-1 | Unit test |
| **Sitemap hreflang** (XML alternative) | Generate + validate in Search Console |

> **Validation**: Build hreflang test suite; run against staging; submit test sitemap to GSC; monitor "International Targeting" report.

---

## G-06: R2 Class B Cost at High Traffic (If Option B Considered)
**Risk**: LOW (Option A chosen) — But relevant if pivot needed.

| Traffic | Monthly Class B | Cost (after 10M free) |
|---------|-----------------|----------------------|
| 5M visits × 10 pages | 50M GETs | $14.40 |
| 20M visits × 8 pages | 160M GETs | $54.00 |
| 100M visits × 5 pages | 500M GETs | $176.40 |

> **Unknown**: Cache hit rate from Cloudflare CDN in front of R2 (public bucket + custom domain). If 90% cache hit, effective Class B = 10% of above.

> **Validation**: Enable R2 public bucket + custom domain; measure `cf-cache-status` hit rate over 1 week.

---

## G-07: KV Consistency Window for HTML (If Option C Considered)
**Risk**: LOW (Option A chosen) — Documented for completeness.

| Parameter | Value | Impact |
|-----------|-------|--------|
| **Min `cacheTtl`** | 30 seconds | Stale reads possible for 30s+ |
| **Actual propagation** | Typically 1-60s globally | Crawler may see old version |
| **Purge API** | Not available for KV | Must wait TTL expiry |

> **Validation**: Write → immediate read from different region; measure staleness.

---

## G-08: Workers Paid Plan Request Counting — Static vs Dynamic
**Risk**: MEDIUM — Billing distinction critical for cost model.

| Claim | Source | Needs Verification |
|-------|--------|-------------------|
| "Static asset requests free on both Free and Paid" | [Pages Functions Pricing](https://developers.cloudflare.com/pages/functions/pricing) | ✅ Confirmed in multiple docs |
| "Workers Paid includes 1M requests/mo" | [Workers Pricing](https://developers.cloudflare.com/workers/platform/pricing) | ❓ Does this count ONLY dynamic (Function) requests? |
| Static assets served via `ASSETS.fetch()` = free? | Inferred from Pages parity | ❓ Need billing dashboard confirmation |

> **Validation**: Deploy test Worker with static assets; generate 2M static requests; check Workers dashboard "Requests" metric vs bill.

---

## G-09: Custom Domain Limits per Worker vs per Account
**Risk**: LOW — Well documented but verify for 8 domains (7 lang + assets).

| Limit | Value | Source |
|-------|-------|--------|
| Custom domains / Worker | Unlimited (practically) | [Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains) |
| Custom domains / Pages project | 100 (Free) / 250 (Pro) / 500 (Biz/Ent) | [Pages Limits](https://developers.cloudflare.com/pages/platform/limits) |
| Custom domains / zone (account) | 100 (Free) / 250 (Pro) / 500 (Biz) / 500 (Ent) | [Pages Limits](https://developers.cloudflare.com/pages/platform/limits) |

> **Verification**: Option A uses **1 Worker + 1 custom domain** (e.g., `catalog.example.com`) with subdirectories — only 1 custom domain needed. Option D would need 8.

---

## G-10: D1 / Durable Objects as Alternative State Stores
**Risk**: LOW — For future dynamic features (plugin ratings, user collections).

| Product | Free Limit | Paid Cost | Use Case |
|---------|------------|-----------|----------|
| **D1** | 5M rows read/day, 5 GB | $0.001/M reads, $0.75/GB-mo | Plugin metadata, search index |
| **Durable Objects (SQLite)** | 5 GB storage, 100 classes | $0.001/M rows, $0.20/GB-mo | Per-plugin state, real-time features |
| **KV** | 100k reads/day, 1 GB | $0.50/M reads, $0.50/GB-mo | Config, feature flags, session |

> **Unknown**: D1 read replication (GA 2025?) latency for global reads. DO SQLite 10 GB/object limit for large plugin catalogs.

> **Validation**: Prototype plugin search in D1; measure p99 latency from Worker.

---

## G-11: Build Tool Compatibility (Astro / Next.js / 11ty / Vite)
**Risk**: MEDIUM — Framework must output to `dist/` with correct structure for Workers Static Assets.

| Framework | Workers Adapter | Static Export | i18n Support | Status |
|-----------|-----------------|---------------|--------------|--------|
| **Astro** | `@astrojs/cloudflare` | ✅ `output: 'static'` | ✅ Built-in | ✅ Recommended |
| **Next.js** | `@cloudflare/next-on-pages` / `opennextjs-cloudflare` | ⚠️ Limited | ✅ | ⚠️ Complex |
| **11ty** | Custom (Wrangler assets) | ✅ Native | ✅ Plugins | ✅ Simple |
| **Vite + Hono** | Native `assets` binding | ✅ Manual | ✅ Manual | ✅ Full control |

> **Validation**: Proof-of-concept with chosen framework; verify `dist/` structure, `_worker.js` generation, asset hashing.

---

## G-12: Analytics / Observability Gaps
**Risk**: LOW — Operational visibility.

| Need | Current Coverage | Gap |
|------|------------------|-----|
| **Request logs** | Workers Logs (Paid: 20M/mo included) | Sampling? Retention 7 days |
| **Real-user metrics (Core Web Vitals)** | Cloudflare Web Analytics (free) | Requires script inject |
| **SSR performance tracing** | `wrangler tail` + custom spans | No distributed tracing native |
| **Cache hit/miss ratios** | Cache Analytics (dash) | Per-URL granularity? |
| **hreflang error detection** | None native | Custom crawl required |

> **Validation**: Enable Workers Logs + Web Analytics on staging; verify data quality.

---

## G-13: Legal / Compliance — Data Residency
**Risk**: LOW — But required for EU traffic.

| Question | Answer | Source |
|----------|--------|--------|
| Workers data processing regions? | Global (200+ cities) — no regional restriction on Free/Paid | [Workers FAQ](https://developers.cloudflare.com/workers/platform/faq) |
| R2 data residency? | Bucket location hint (jurisdictional restrictions beta) | [R2 Jurisdictional Restrictions](https://developers.cloudflare.com/r2/data-location/jurisdictional-restrictions/) |
| KV data residency? | Global replication — no control | [KV FAQ](https://developers.cloudflare.com/kv/reference/faq) |
| D1 data residency? | Regional databases (alpha) | [D1 Read Replication](https://developers.cloudflare.com/d1/best-practices/read-replication/) |

> **Action**: If GDPR Art. 28 DPA needed, use Cloudflare EU-only Workers (Enterprise) or R2 jurisdictional restrictions.

---

## G-14: Migration Path from Current Host (If Any)
**Risk**: MEDIUM — Depends on existing infrastructure.

| Unknown | Validation |
|---------|------------|
| Current CMS / SSG? | Inventory |
| Content migration strategy? | Script: old URLs → new `dist/` structure |
| DNS cutover plan? | TTL reduction → CNAME to Workers custom domain |
| Rollback procedure? | `wrangler rollback` + DNS revert |

---

## G-15: Cost at Extreme Scale (100M+ visits/month)
**Risk**: LOW — But good to model.

| Component | 100M visits (5 pages) | Cost |
|-----------|----------------------|------|
| Workers Paid base | — | $5 |
| Dynamic requests (SSR) | 20M | ~$6 (CPU) |
| KV reads (config) | 50M | $25 |
| R2 Class B (if used) | 500M | $176 |
| **Total** | — | **~$212/mo** |

> **Comparison**: Vercel Pro at 100M visits ≈ $500-2000+/mo; Netlify ≈ $300-1000+/mo; AWS CloudFront + S3 ≈ $400+/mo.

---

## Priority Validation Order (Before Production)

| # | Gap | Method | Owner | Target Date |
|---|-----|--------|-------|-------------|
| 1 | G-01: Worker bundle size | `wrangler deploy --dry-run` | Dev | Week 1 |
| 2 | G-05: hreflang correctness | Automated crawl + GSC test | SEO | Week 1 |
| 3 | G-02: Wrangler upload 85k files | Staging deploy full build | DevOps | Week 1 |
| 4 | G-03: Cache behavior | `cf-cache-status` audit | DevOps | Week 2 |
| 5 | G-04: SSR cold start | Load test + `wrangler tail` | Dev | Week 2 |
| 6 | G-08: Request counting | Billing dashboard audit | Finance | Week 2 |
| 7 | G-11: Framework POC | Build + deploy test site | Dev | Week 1 |
| 8 | G-14: Migration plan | Document + dry run | PM | Week 3 |

---

*Gaps document — update as validated. All items must be GREEN before production deploy.*