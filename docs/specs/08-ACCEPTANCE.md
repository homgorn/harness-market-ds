# Acceptance / Gates — DSH Harness Plugin Catalog

## Gate definitions

Run via `node scripts/forge/gates.mjs --all` (to be implemented). Each gate must pass before deploy.

### G1: secret-scan
- No secrets in repo history or working tree.
- `.env` gitignored; `.env.example` present with empty values.

### G2: factcheck
- Every number in docs/README/site matches `site.facts.json` (source artifact).
- site.facts.json populated from measurements.

### G3: links
- All internal links resolve.
- No empty anchors.
- External links return 200 (or documented exception).

### G4: build
- `astro build` exits 0.
- Build output size reported.
- No TypeScript errors.

### G5: tests
- Unit tests (Vitest) pass.
- E2E smoke (Playwright) pass.

### G6: visual
- Playwright screenshots of key pages (home, detail, category, search) captured.
- No layout breakage on mobile (375px) and desktop (1280px).

### G7: performance
- Lighthouse: LCP ≤2.0, CLS ≤0.05, INP ≤200, perf score ≥90.
- JS ≤90KB gzip, CSS ≤40KB gzip.

### G8: a11y
- axe-core: no critical/serious violations on key pages.

### G9: seo
- All SEO checklist items present (title, meta, canonical, OG, twitter, favicon, JSON-LD, sitemap, robots).
- hreflang reciprocity validated.
- JSON-LD validates (schema.org validator).

### G10: identity
- No invented address/price/Service/Offer on non-selling pages.
- Every JSON-LD node has @id; no orphans.

### G11: no-placeholder
- No placeholder text ("Lorem ipsum", "TODO", "XXX") in published copy.
- No client/owner names in public copy.

### G12: security
- Semgrep on site source: no critical/high.
- npm audit: no high/critical.
- Secret scan clean.

### G13: i18n-parity
- Locale files parity check passes (all keys present or explicitly marked untranslated).

### G14: self-critique
- Structured self-critique pass completed and logged.
- Second gate run after fixes.

## Acceptance (project-level)

- AC-P1: Site deployed to harness-market-ds.refertur.net, HTTP 200 + marker in body.
- AC-P2: Daily sync cron runs and succeeds.
- AC-P3: Security scan runs weekly and updates statuses.
- AC-P4: Cold-agent test passes (HANDOFF.md + INDEX.md sufficient).
- AC-P5: GitHub repo classic packaging complete (README 7 locales, topics, license, etc.).
