# Gaps & Unknowns — Marketplace Benchmark

Items that could not be resolved from primary sources within the research window. Each includes: what's missing, why it matters, and how to resolve.

---

## 1. Hard Numbers Missing (Critical)

| Gap | Marketplace | Why It Matters | Resolution Path |
|-----|-------------|----------------|-----------------|
| **Exact item count** | Figma Community (plugins only) | Benchmarking catalog size vs. discovery quality | Use FigStats API or scrape `/community/plugins` pagination; Figma REST API does not expose counts ([Figma Forum](https://forum.figma.com/ask-the-community-7/does-the-figma-rest-api-provide-any-way-to-view-plugin-metadata-stats-like-install-count-etc-9824), 2025-05-17) |
| **Revenue share % for paid apps** | GitHub Marketplace | If DSH considers paid app billing, need real rates | Contact GitHub Marketplace team; not in public docs |
| **Poe creator payout rates** | Poe (Quora) | Price-per-message model unique; informs agent monetization | Wait for Poe creator dashboard public docs; currently opaque |
| **Coze/ Dify monetization cuts** | Coze Bot Store, Dify Marketplace | Emerging AI-agent marketplaces; may set precedents | Monitor Dify Marketplace Agreement updates; Coze creator docs |
| **Chrome Web Store current listing count** | Chrome Web Store | Baseline for browser extension market size | Scrape sitemap or use Chrome Web Store API (requires dev account) |
| **Mozilla Add-ons exact count** | AMO | Firefox counterpart benchmark | AMO API: `https://addons.mozilla.org/api/v5/addons/search/?type=extension&page_size=1` → `count` field |
| **Docker Hub public image count** | Docker Hub | Container registry scale | Docker Hub API `/v2/repositories/?page_size=1` → `count` |
| **GitHub Marketplace app count** | GitHub Marketplace | CI/CD/Action marketplace scale | GitHub GraphQL: `marketplaceListingCount` |

---

## 2. Trust Model Details (High)

| Gap | Marketplace | Why It Matters | Resolution Path |
|-----|-------------|----------------|-----------------|
| **Malware scanning specifics** | VS Code Marketplace, Chrome Web Store, npm, PyPI | DSH needs to decide: build scanner vs. integrate third-party | Request vendor security whitepapers; check GitHub Advisory DB integration docs |
| **Verified publisher criteria** | JetBrains, Figma, GitHub Marketplace | Standardize DSH verification flow | Document each vendor's process; adopt DNS TXT (VS Code) as minimum |
| **Permission manifest schema** | MCP (tools/resources/prompts), Chrome (permissions), Flatpak (sandbox) | DSH needs its own capability taxonomy | Synthesize from MCP + Chrome + Flatpak; propose DSH Capability Spec v1 |
| **Quality grade algorithm** | Glama (A–F license/quality/maintenance), mcp.so | Replicable trust signal for DSH | Reverse-engineer from public data; publish DSH grading rubric |
| **Obsidian BRAT trust model** | Obsidian (beta plugin installer) | Alternative to central review | Study BRAT source; consider for DSH "experimental" tier |

---

## 3. SEO / Programmatic Patterns (High)

| Gap | Marketplace | Why It Matters | Resolution Path |
|-----|-------------|----------------|-----------------|
| **VS Code Marketplace URL structure for facets** | VS Code | `@category:` `@tag:` filters — are they crawlable URLs? | Test: `marketplace.visualstudio.com/search?term=@category:linters` — check if static HTML served |
| **npm keyword page indexation** | npm | `/search?q=keywords:gulpplugin` — are these indexed? | `site:npmjs.com "keywords:"` in Google; check robots.txt |
| **Glama attribute URL canonicalization** | Glama | Faceted URLs → self-referencing canonical? | View source on `/mcp/servers?attributes=...`; check `<link rel="canonical">` |
| **WordPress.org tag archive traffic** | WordPress.org | Do `/plugins/tag/seo/` pages rank? | Ahrefs/SEMrush on wordpress.org/plugins/tag/; check sitemap inclusion |
| **Hugging Face task page SEO** | Hugging Face | `/tasks/text-generation` — traffic share? | SimilarWeb on huggingface.co/tasks/; check JSON-LD schema |

---

## 4. Monetization Reality Checks (High)

| Gap | Marketplace | Why It Matters | Resolution Path |
|-----|-------------|----------------|-----------------|
| **Figma paid plugin actual revenue** | Figma | 15% commission only works if GMV exists; seller approval paused | Survey Figma plugin devs; check Stripe revenue estimates via public payout tweets |
| **VS Code external licensing adoption rate** | VS Code | How many of 60k extensions actually monetize? | Scan manifests for `sponsor` field; check code-checkout/Freemius user counts |
| **Chrome extension freemium conversion rates** | Chrome Web Store | 3–5% cited but unverified | Partner with ExtensionPay/Lemon Squeezy for anonymized aggregate data |
| **mcp.so / Glama ad revenue** | mcp.so, Glama | Advertising model viability for dev directories | Direct inquiry to sales@; check job postings for "ad sales" roles |
| **npm Pro/Teams revenue share** | npm | What % of revenue from private registries? | GitHub financial filings (Microsoft 10-K) |

---

## 5. Taxonomy & Discovery UX (Medium)

| Gap | Marketplace | Why It Matters | Resolution Path |
|-----|-------------|----------------|-----------------|
| **Obsidian category hierarchy** | Obsidian | Flat categories added 2024; community wants nested | Monitor Obsidian 1.8+ releases; forum thread #38812 |
| **Figma plugin tag taxonomy** | Figma | Tags free-form; no controlled vocabulary | Analyze tag co-occurrence from FigStats data |
| **MCP capability vs. category overlap** | Glama, mcp.so | Capability (tools/resources/prompts) × Category matrix | Export Glama attribute list; build cross-tab |
| **Dify plugin category list** | Dify | Official/Partner/Community tiers + categories | Scrape marketplace.dify.ai categories |
| **Coze agent vs. plugin distinction** | Coze | Store mixes agents + plugins; different discovery needs | Test Coze Store UI; document filter options |

---

## 6. DSH-Specific Unknowns (Critical for Execution)

| Gap | Why It Matters | Resolution Path |
|-----|----------------|-----------------|
| **DSH plugin manifest schema v1** | All patterns depend on structured metadata | Draft JSON Schema from Patterns 5, 10, 12; validate with 10 real plugins |
| **DSH install telemetry design** | Ranking, trending, creator analytics need install events | Design opt-in anonymous telemetry; privacy review; implement in `dsh-market` plugin |
| **DSH capability taxonomy v1** | Primary discovery axis (Pattern 8) | Workshop with DSH core team: list 20–30 atomic capabilities; map to existing plugins |
| **DSH publisher verification flow** | Trust signal (Pattern 4) | Implement DNS TXT check in publish CI; add "Verified" badge UI |
| **DSH external license validation API** | Freemium enabler (Pattern 7) | Spec: `GET /api/v1/license/validate?plugin_id=...&key=...` → `{valid: true, tier: "pro", expires: "..."}` |
| **DSH programmatic SEO infrastructure** | Static page generation for facets (Pattern 13) | Choose SSG (Astro/Next.js); define template + JSON-LD schema; CI pipeline |
| **DSH ad server integration** | Monetization (Pattern 15) | Evaluate Kevel, Google Ad Manager, or custom; start with manual sponsorships |

---

## 7. Competitive Intelligence Gaps (Medium)

| Gap | Why It Matters | Resolution Path |
|-----|----------------|-----------------|
| **Cursor Marketplace (if exists)** | Direct competitor; same audience | Search `cursor.com/marketplace` `cursor.sh/plugins`; check Cursor docs |
| **Windsurf/Codeium plugin ecosystem** | Emerging AI IDE competitors | Monitor Windsurf blog; check `windsurf.com/plugins` |
| **Continue.dev plugin registry** | Open-source AI IDE extension point | Check Continue.dev docs for "extensions" "marketplace" |
| **Sourcegraph Cody extensions** | Enterprise AI code assistant | Sourcegraph blog; Cody extension API |

---

## 8. Refresh Targets (For Future Updates)

| Entity | Metric | Current Value (2026-11-11) | Refresh Cadence | Trigger for Delta Report |
|--------|--------|----------------------------|-----------------|--------------------------|
| VS Code Marketplace | Extension count | ~60k–120k | Quarterly | >10% change |
| JetBrains Marketplace | Plugin count | ~10k | Quarterly | New category launch |
| Obsidian Plugins | Count with stats | 7,893 | Monthly (obsidianstats.com) | New taxonomy release |
| Chrome Web Store | AI extension count | 18,000+ | Quarterly | Policy change |
| npm | Package count | 2M+ | Monthly | Milestone announcements |
| PyPI | Package count | 889,796 | Monthly | pypistats.org |
| Glama | MCP server count | 119,173 | Weekly (auto-updated) | >5% weekly growth |
| mcp.so | Server count | "Tens of thousands" | Weekly | Feature launch |
| Dify Marketplace | Plugin count | ~1,050 | Monthly | 2x growth |
| dshmarket.com | Plugin count | 10,119 | Weekly (in-app) | 2x growth |
| Hugging Face | Models/Datasets/Spaces | 3M/1M/2M | Quarterly | Milestone blog posts |

---

## 9. Methodology Limitations

1. **Websearch vs. Primary Source**: ~30% of data points from secondary summaries (blogs, press) rather than direct API/page measurement. Flagged as "reported" not "measured."
2. **Chinese/Russian Marketplaces Excluded**: No coverage of Gitee, Huawei AppGallery, Yandex, VK — may have different patterns.
3. **Enterprise/Private Marketplaces**: GitHub Enterprise, JetBrains Space, VS Code Private Registries — not accessible.
4. **Mobile App Stores**: Apple App Store, Google Play — different scale/model; excluded by scope.
5. **Time Window**: All retrievals 2026-11-11; marketplace metrics shift fast (MCP grew 100x in 2025).
6. **Language Bias**: English-only sources; non-English developer communities (Chinese, Japanese, Korean, Portuguese) not represented.

---

## 10. Recommended Next Research Sprint (2 weeks)

| Sprint Goal | Tasks | Owner |
|-------------|-------|-------|
| **Resolve Top 5 Critical Gaps** | 1. Scrape Glama/mcp.so attribute URLs for canonical tags<br>2. Query AMO/Docker Hub/Chrome APIs for exact counts<br>3. Draft DSH Capability Taxonomy v1 (20 caps)<br>4. Design DSH Manifest Schema v1 (JSON Schema)<br>5. Build install telemetry spec (privacy-first) | Research agent |
| **Validate Monetization Assumptions** | 1. Interview 3 Figma plugin devs on revenue<br>2. Interview 2 VS Code ext devs on external licensing<br>3. Contact mcp.so/Glama for ad rate cards<br>4. Model DSH ad revenue at 10k/50k/100k MAU | Research agent |
| **Competitive Recon** | 1. Deep dive Cursor/Windsurf/Continue extension systems<br>2. Map DSH plugin compatibility vs. VS Code/Obsidian<br>3. Identify "killer capability" gaps in current DSH plugins | Research agent |

---

**Last Updated:** 2026-11-11  
**Next Scheduled Refresh:** 2026-12-11 (or on DSH catalog v0.1 spec freeze)