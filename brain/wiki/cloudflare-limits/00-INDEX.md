# Cloudflare limits and how the catalog fits

## Summary
Cloudflare Workers allows 20,000 static asset files per Worker version on the
Free plan and 100,000 on Paid; individual assets are capped at 25 MiB; static
asset requests are free and unlimited, while Worker script invocations are
capped at 100,000/day with a 10 ms CPU budget. The catalog's ~74,000 pages
across seven locales do not fit the Free file cap, so the site is built and
deployed per locale (~15,400 files each) under path prefixes of one hostname.
Pagefind was removed because it emitted ~72,000 index files on its own.

## Measured (2026-11-11)

| Limit | Free | Paid | Source |
|---|---|---|---|
| Static asset files / version | 20,000 | 100,000 | platform limits; live API error 10304 reproduced |
| Individual asset size | 25 MiB | 25 MiB | platform limits; live error on 30.4 MiB sitemap |
| Requests/day (Worker) | 100,000 | 10,000,000 | platform limits |
| CPU per request | 10 ms | 5 min | platform limits |
| Memory | 128 MB | 128 MB | platform limits |
| Static asset requests | free, unlimited | free, unlimited | billing page |

## What the corpus costs

| Item | Count |
|---|---|
| Artifacts | 10,620 |
| Detail pages per locale | 10,620 |
| Listing pages per locale (categories, types, tags, capabilities, authors, pagination) | ~4,760 |
| Total per locale | ~15,400 files |
| Total, seven locales | ~108,000 files → over the Free cap, under the Paid cap |

## Mitigations applied

1. **Pagefind removed** — it emitted one fragment per page (~72,000 files).
   Replaced by a compact client-side index (`scripts/build-listing-index.mjs`).
2. **CSS externalised** — inline CSS cost 560 MB of HTML across 15,382 pages.
3. **Sitemap chunked** — a single sitemap for the corpus would exceed 25 MiB;
   the sitemap index is split into chunks.
4. **Per-locale builds** (`BUILD_LOCALES`) — each deployment stays under the cap.

## Sources
- `brain/research/cloudflare-scale/01-limits.md`
- `brain/research/cloudflare-scale/02-architectures.md`
- `brain/research/cloudflare-scale/03-verdict.md`
- `docs/adr/0001-static-per-locale.md`
