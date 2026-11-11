# 15 Patterns Worth Copying for the DSH Catalog

Each pattern includes the source marketplace, why it works, and how to adapt it for a free OSS catalog.

---

## 1. Faceted Attribute URLs with Deterministic Ordering
**Source:** Glama (`/mcp/servers?attributes=category:developer-tools+hosting:remote-capable+language:python`), mcp.so, npm (keyword search)
**Why it works:** Clean, crawlable URLs for every filter combination; Google can index high-intent long-tail pages (e.g., "remote Python MCP servers for databases"); deterministic facet ordering (`category → capability → hosting → language`) prevents duplicate content from parameter permutations.
**Adaptation for DSH:** `/catalog?capability=web-search+runtime=local+language=python` — expose every metadata field as a filterable attribute; generate static HTML for top 1,000 combinations; canonical to parent for low-traffic combos.

---

## 2. Author/Publisher Profile Pages as SEO Pillars
**Source:** npm (`/~username` — full portfolio with package counts, descriptions, links), Glama (`/mcp/servers?query=author:FortripEngineering`), mcp.so (author pages with server counts)
**Why it works:** Creates compounding internal link equity — every new item links back to author page; author pages rank for "publisher name + tools"; users browse by trust entity, not just item; enables "follow publisher" notifications.
**Adaptation for DSH:** `/publisher/dsh-market` showing all plugins by that publisher with install counts, categories, last update; link from every plugin card; add `rel="author"` markup.

---

## 3. Quality/Maintenance Grades as Trust Signals
**Source:** Glama (license A–F, quality A–D, maintenance A–D), mcp.so (same), Eclipse Bazaar MCP (certification verdicts + scorecards)
**Why it works:** Instant heuristic for users — "A license + A quality + B maintenance" beats reading 50 READMEs; grades are computable from objective signals (license SPDX, release frequency, issue response time, test coverage); creates quality floor without gatekeeping.
**Adaptation for DSH:** Compute nightly: License grade (SPDX), Freshness (days since release), Responsiveness (issue close rate), Test presence (CI badge), Docs completeness. Show as badges on plugin cards.

---

## 4. Verified Publisher Badge via Domain Ownership
**Source:** VS Code Marketplace (publisher verification via DNS TXT record), JetBrains (verified vendor), Figma (Stripe-verified sellers), GitHub Marketplace (Verified Creator)
**Why it works:** Cryptographically proves identity without central authority; prevents typosquatting/impersonation; low friction (one DNS record); visible trust signal that correlates with higher installs.
**Adaptation for DSH:** Require DNS TXT record `_dsh-publisher=pubkey` on publisher domain; show "Verified" badge on all their plugins; auto-verify on publish.

---

## 5. Permission/Capability Manifest as Install-Time Contract
**Source:** MCP registries (tools/resources/prompts declared in manifest), Chrome Web Store (permission warnings), Flathub (Flatpak sandbox permissions), Figma (plugin API access scopes)
**Why it works:** Users see exactly what the plugin/agent can do before install; enables automated policy enforcement (orgs can block "filesystem:write" plugins); reduces malware surface; builds trust for agent-to-agent installs.
**Adaptation for DSH:** Require `dsh.manifest.json` declaring: `capabilities: ["fs:read", "net:http", "shell:exec"]`, `dataAccess: ["local", "remote"]`, `runtime: "local|remote"`; show at install prompt; filter by capability in catalog.

---

## 6. Zero Platform Fees + Optional Sponsorship Badges
**Source:** VS Code (no fees, `sponsor` field in manifest), Obsidian (funding links in manifest, 51 plugins), WordPress.org (zero fees, freemium off-platform), npm (zero fees on public), PyPI, Homebrew, Flathub
**Why it works:** Removes barrier for volunteer maintainers; avoids payment infrastructure complexity; sponsorship badges (OpenCollective, GitHub Sponsors, Ko-fi) convert 1–3% of active users; aligns with OSS ethos.
**Adaptation for DSH:** `sponsor: { "url": "https://github.com/sponsors/author", "label": "Sponsor" }` in manifest; render badge on plugin page; take 0%; optionally highlight "Sponsored" plugins in search (opt-in, labeled).

---

## 7. Freemium via External Licensing (Not Platform Billing)
**Source:** VS Code (code-checkout 10%, Freemius, custom license servers), Figma (external payments allowed, 15% only if using Figma Payments), Chrome Web Store (ExtensionPay, Lemon Squeezy, Stripe direct), JetBrains (externally-paid model)
**Why it works:** Platform avoids merchant-of-record complexity (tax, refunds, disputes); developers keep customer relationship; platform still gets discovery value; 15% commission only worth it if platform provides licensing + billing + fraud.
**Adaptation for DSH:** Document "External Licensing Pattern" — license key validation via DSH API endpoint (`GET /api/license/validate?key=...`); show "Pro features unlocked" badge; no platform fee.

---

## 8. Task/Capability Taxonomy Over Category Taxonomy
**Source:** Hugging Face (task tags: `text-generation`, `image-classification`, `token-classification`), Glama (capability: `tools`, `resources`, `prompts`), mcp.so (capability filters), VS Code (categories fixed but keywords flexible)
**Why it works:** Users search by *what it does* not *what bucket it's in*; "web search" cuts across categories; enables cross-category discovery; task tags are more stable than marketing categories.
**Adaptation for DSH:** Primary taxonomy = capabilities (`web-search`, `code-gen`, `data-extraction`, `file-ops`, `api-wrapper`); secondary = domain tags (`finance`, `healthcare`, `devops`); allow multiple capabilities per plugin.

---

## 9. Install/Usage Counts as Primary Ranking Signal
**Source:** VS Code (`@sort:installs`), JetBrains (popularity coefficient `log10(1+5*downloads)`), Chrome Web Store (user count), npm (download stats via API), Obsidian (obsidianstats.com), Glama (npm/PyPI download counts)
**Why it works:** Revealed preference — actual usage beats ratings (gamed) or recency (spam); logarithmic scaling prevents rich-get-richer runaway; enables "Trending" (velocity) vs "Popular" (cumulative) views.
**Adaptation for DSH:** Track anonymous install events (opt-in telemetry); expose `/api/stats/install-count/:pluginId`; ranking = `log10(1 + installs) * freshnessFactor * qualityGrade`; show "Trending this week" (velocity) separately.

---

## 10. Structured Metadata in Manifest (Machine-Readable)
**Source:** VS Code (`package.json` with `categories`, `keywords`, `engines`, `activationEvents`, `contributes`), Figma (manifest.json with `relaunchButtons`, `editorType`), MCP (manifest with `tools`, `resources`, `prompts`), npm (`package.json` standard)
**Why it works:** Enables automated catalog indexing, compatibility checking, dependency resolution, and rich search facets without manual curation; CI can validate schema on publish.
**Adaptation for DSH:** Require `dsh-plugin.json` with: `name`, `version`, `publisher`, `capabilities[]`, `tags[]`, `runtime`, `minDSHVersion`, `dependencies[]`, `license (SPDX)`, `repository`, `sponsor`, `pricing: "free|freemium|paid"`, `entryPoint`. Validate via JSON Schema on submit.

---

## 11. Author Analytics Dashboard (Creator Center)
**Source:** Dify (Creator Center with install counts, performance data), Figma (weekly engagement notifications), Chrome Web Store (GA4 integration, store listing metrics), JetBrains (Sales/Analytics tabs), Glama (claimed author badge + stats)
**Why it works:** Retains creators by showing ROI; enables data-driven iteration; "claimed" badge incentivizes ownership; platform gets better metadata (creators fix their own tags).
**Adaptation for DSH:** `/publisher/dashboard` showing: installs (30d/90d/365d), active users, version adoption, capability usage, geographic distribution; email digest weekly; "Claim this plugin" flow via GitHub OAuth.

---

## 12. Version Compatibility Matrix (Engine/Platform Versioning)
**Source:** VS Code (`engines: { "vscode": "^1.0.0" }`), JetBrains (product versions in use statistics), Obsidian (minObsidianVersion in manifest), WordPress ("Tested up to: 6.7"), npm (`engines.node`), Homebrew (formula version history)
**Why it works:** Prevents broken installs; enables catalog to filter "compatible with your version"; reduces support burden; data drives "update available" notifications.
**Adaptation for DSH:** `minDSHVersion`, `maxDSHVersion` (optional); catalog shows green/yellow/red compatibility badge per user's DSH version; auto-hide incompatible plugins.

---

## 13. Programmatic SEO: Static Pages for High-Intent Facets
**Source:** Glama (attribute URLs indexable), npm (package/author/scope pages = 75% of traffic), WordPress.org (tag/author archives in sitemap), Hugging Face (task/tag pages), mcp.so (category/tag/author pages)
**Why it works:** Captures long-tail search at scale without content team; each facet combination = landing page for specific intent; internal linking from item pages passes equity; self-referencing canonicals prevent duplication.
**Adaptation for DSH:** Pre-render static HTML for: `/capability/web-search`, `/capability/web-search+runtime/local`, `/tag/finance`, `/publisher/author-name`; inject JSON-LD `SoftwareApplication` schema; submit sitemap to GSC.

---

## 14. "Official/Partner/Community" Tiering
**Source:** Dify (Official / Partner / Community), Figma (Official badge for Figma-built), JetBrains (Staff Picks), VS Code (Microsoft extensions), Glama (Official/Verified badges), Chrome Web Store (Featured/Editor's Picks)
**Why it works:** Signals quality floor without excluding community; "Official" = maintained by platform team (high trust); "Partner" = vetted integrators; "Community" = open submission; users can filter by tier.
**Adaptation for DSH:** `tier: "core|partner|community"` in manifest; Core = DSH team maintained; Partner = approved integrators (verified publisher + SLA); Community = open; filter UI: "Show only Core/Partner".

---

## 15. Advertising/Sponsorship as Primary Monetization (Not Revenue Share)
**Source:** mcp.so ("Advertise" in nav, homepage featured slots), Glama ("Advertise" + paid products: Gateway/Hosting/Inspector), Chrome Web Store (no ads but could), npm (Pro/Teams for private, not public)
**Why it works:** Aligns with free OSS catalog — no commission friction; advertisers pay for *visibility* not *transactions*; scales with traffic not GMV; preserves trust (no incentive to push paid over free).
**Adaptation for DSH:** Sell "Featured in Category" (weekly), "Top of Search" (CPC), "Newsletter Sponsor" (CPM); keep organic ranking pure; label clearly "Sponsored"; revenue funds catalog ops.

---

## Cross-Cutting Implementation Notes

| Pattern | Implementation Effort | Prerequisite |
|---------|----------------------|--------------|
| Faceted URLs | Medium (routing + static gen) | Structured metadata (Pattern 10) |
| Author Pages | Low (template + query) | Publisher verification (Pattern 4) |
| Quality Grades | Medium (nightly job) | Manifest schema + GitHub API access |
| Verified Publisher | Low (DNS check) | Manifest `publisher.domain` field |
| Permission Manifest | Medium (schema + UI) | Capability taxonomy (Pattern 8) |
| Zero Fees + Sponsor | Trivial (manifest field) | None |
| External Licensing | Medium (API spec) | License validation endpoint |
| Task Taxonomy | Low (controlled vocab) | Curated capability list |
| Install Tracking | Medium (telemetry opt-in) | Privacy policy + anon ID |
| Structured Manifest | High (schema + validation) | JSON Schema + CI gate |
| Creator Dashboard | High (auth + analytics) | Publisher verification |
| Version Matrix | Low (manifest fields) | DSH version API |
| Programmatic SEO | Medium (SSG + schema) | Faceted URLs + structured data |
| Tiering | Low (manifest enum) | Partner onboarding process |
| Ad Monetization | Medium (ad server) | Traffic threshold (~10k MAU) |