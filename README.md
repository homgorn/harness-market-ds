# DSH Harness Plugin Catalog

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A multilingual, SEO/GEO/AEO-optimized web catalog of **DeepSeek Harness (DSH)** plugins. Browse, search, filter, and compare 5000+ community plugins with security status, compatibility info, and localized descriptions. Built with Astro + Cloudflare Pages.

**Live:** https://harness-market-ds.refertur.net (pending DNS)
**Reference:** https://dshmarket.com (we aim to be better)

## Features

- 🌐 **7 languages:** English, Russian, Chinese, Spanish, German, French, Japanese
- 🔍 **Full-text search** via Pagefind (client-side, fast)
- 🏷️ **Filters:** category, subcategory, tags, security status, compatibility, sort
- 🛡️ **Security scanning:** Semgrep + npm audit + YARA; malicious plugins marked & reported
- 📱 **PWA:** offline access to the catalog
- ⚡ **Fast:** static HTML, LCP ≤ 2.0s, JS ≤ 90 KB
- 🤖 **AEO-ready:** JSON-LD knowledge graph, llms.txt, per-page .md twins
- 🔄 **Daily sync** from CDN with count verification
- 💰 **Monetization:** sponsored slots, donations, affiliate links, API/data (future)

## Quick start

```bash
npm install
npm run sync      # fetch catalog
npm run dev       # http://localhost:4321
npm run build     # static output in dist/
```

## Project structure

See `docs/specs/` for SDD specs, `docs/architecture/` for architecture, `brain/` for LLM wiki.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). To get a plugin listed, open a PR in the [awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) registry.

## License

MIT — see [LICENSE](LICENSE).
