# Astro Templates Research — Summary

**Project:** harness-market-ds (Astro + Cloudflare catalog of DeepSeek Harness plugins, 7 locales: en/ru/zh/es/de/fr/ja, SEO+GEO+AEO).
**Date:** 2026-11-10
**Full report:** `01-templates.md` · **Query log:** `queries.log`

## Bottom line

No single starter ships "directory + filters + categories + search + i18n + SEO" together. Best is a composition:

1. **Base shell:** hansmartensdev/Astro-Rocket (Astro 7, Lighthouse 100/100/100/100 reported, opt-in i18n with locale routes/content collections/hreflang, Pagefind search, 44 accessible TS components, Cloudflare deploy, tests/CI).
2. **Directory domain layer:** masterkram/minted-directory-astro (purpose-built directory: multi-source loaders MD/JSON/CSV/Sheets/Notion/Airtable, tags + search, sponsored slots, per-listing OG images, programmatic SEO).
3. **Multilingual/AEO reference:** skyboundropship-code/tradingaihub (production Astro directory in 13 langs: i18n routing at scale, a11y widget, llms.txt/locale sitemaps/JSON-LD). Reference only — not a starter.

## Top 3 (with links)

| # | Repo | Stars | Role | Link |
|---|---|---|---|---|
| 1 | masterkram/minted-directory-astro | 165 | Directory-first template | https://github.com/masterkram/minted-directory-astro |
| 2 | hansmartensdev/astro-rocket | 124 | Optimized i18n foundation | https://github.com/hansmartensdev/astro-rocket |
| 3 | skyboundropship-code/tradingaihub | 0 | Multilingual directory reference | https://github.com/skyboundropship-code/tradingaihub |

## Key gaps to close (inferred effort: 2–4 weeks)

- Port directory domain model onto Astro-Rocket's Astro 7 + i18n base (upgrade minted's Astro 5 components).
- Replace client-side nanostores filtering with Pagefind (locale-scoped) for 7 locales × growing catalog.
- Add i18n to minted: Astro native i18n, locale content folders, hreflang, switcher, fallback.
- a11y audit of Vue Select; add reduced-motion + contrast tokens (Astro-Rocket already has these).
- Add llms.txt + locale sitemaps + JSON-LD for GEO/AEO (from tradingaihub patterns).
- Confirm listing translation strategy (full translation vs localized UI only) before scaffolding collections.

## Risks

- No candidate has categories+filters+search+i18n together → integration work expected.
- tradingaihub license unverified; ever-works template is AGPL-3.0 (avoid unless acceptable).
- Client-side filtering scales poorly with catalog size and 7 locales.

## Next steps

1. Scaffold base from Astro-Rocket (`DEPLOY_TARGET=cloudflare pnpm build`).
2. Define `listings`/`categories` content collections with `locale` field (mirror Astro-Rocket's blog/projects pattern).
3. Port minted loaders/cards/sponsored slots; adapt to Astro 7.
4. Add Pagefind filters + llms.txt/locale sitemaps.
5. Run Lighthouse/a11y validation before declaring done (per blueprint-verify-gates).
