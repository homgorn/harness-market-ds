# Quiz / Brief — DSH Harness Plugin Catalog

Source of truth: `project.brief.json`.

## Decisions (from quiz)

- **Idea:** Astro + Cloudflare catalog of DeepSeek Harness (DSH) plugins, multilingual, SEO/GEO/AEO optimized, security-scanned, daily CDN sync.
- **Name / slug:** harness-market-ds
- **Domain:** harness-market-ds.refertur.net (subdomain of refertur.net; apex untouched)
- **Languages (7):** en (primary), ru, zh, es, de, fr, ja
- **Monetization (all 5):** ads/sponsorship, premium plugins, donations/subscription, affiliate links, API/data access
- **Theme:** auto (system) + manual toggle
- **Security mode:** scan + mark + rewrite (malicious → marked, code removed, rewritten as safe plugin)
- **Update frequency:** daily (GitHub Actions cron)
- **Visibility:** public repository
- **Original reference:** https://dshmarket.com/ (must be better)
- **CDN source:** https://cdn.jsdelivr.net/npm/dsh-plugin-catalog/index.json (5126 plugins, 23 categories)
- **Search:** Pagefind
- **Data:** Static JSON + Astro content collections
- **Security scanners:** Semgrep + npm audit + custom YARA (+ CodeQL/Trivy/Snyk optional)
- **Content:** catalog + changelog + news/blog
- **PWA:** yes

## Defaults applied

Recorded in `project.brief.json` under `defaults_applied`.

## Open questions

None at this stage. Revisit before P9 (verify) and P11 (deploy).
