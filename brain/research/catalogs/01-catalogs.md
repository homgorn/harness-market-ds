# Catalog research: plugin and software catalogs

Retrieval date for all sources below: **2026-11-10**.  
Raw fetches are stored in `data/`. Query log is `queries.log`.

## Labels used

- **(measured)** = observed directly in a fetched page or raw file.
- **(reported)** = stated by the source, not independently verified.
- **(inferred)** = conclusion drawn from sources, not explicitly stated.

## Source set (24 named catalogs)

| # | Catalog | Primary URL | Type |
|---:|---|---|---|
| 1 | dsh-market (DeepSeek Harness plugin market) | https://dshmarket.com/ | In-host plugin market + web index |
| 2 | Awesome DSH Plugin | https://awesome-dsh-plugin.com/ | Curated DSH plugin list |
| 3 | DSH Get | https://www.dshget.com/plugins | DSH plugin directory |
| 4 | DSH Trust & Discovery Registry | https://www.dsh.so/ | Verified DSH plugin/market index |
| 5 | deepseek-plugin.org | https://deepseek-plugin.org/ | DSH community directory |
| 6 | dshbase catalog | https://dshbase.com/ | DSH plugin directory |
| 7 | npm | https://www.npmjs.com/ | JavaScript package registry |
| 8 | Visual Studio Marketplace | https://marketplace.visualstudio.com/ | VS Code/Visual Studio extensions |
| 9 | Obsidian Community Plugins | https://community.obsidian.md/plugins | Obsidian plugin directory |
| 10 | JetBrains Marketplace | https://plugins.jetbrains.com/ | IDE plugin marketplace |
| 11 | WordPress.org Plugin Directory | https://wordpress.org/plugins/ | WordPress plugin directory |
| 12 | Chrome Web Store | https://chromewebstore.google.com/ | Browser extension store |
| 13 | GitHub Marketplace | https://github.com/marketplace | Apps and GitHub Actions |
| 14 | Mozilla Add-ons (AMO) | https://addons.mozilla.org/ | Firefox add-ons |
| 15 | Shopify App Store | https://apps.shopify.com/ | E-commerce app store |
| 16 | Atlassian Marketplace | https://marketplace.atlassian.com/ | Atlassian app marketplace |
| 17 | Figma Community | https://www.figma.com/community/ | Plugins, widgets, files |
| 18 | Homebrew | https://brew.sh/ / https://formulae.brew.sh/ | macOS/Linux package manager catalog |
| 19 | Docker Hub | https://hub.docker.com/ | Container image catalog |
| 20 | PyPI | https://pypi.org/ | Python package index |
| 21 | Flathub | https://flathub.org/ | Linux app store |
| 22 | Apple App Store | https://developer.apple.com/app-store/ | Mobile/desktop app store |
| 23 | Steam Workshop | https://steamcommunity.com/workshop | Game mod catalog |
| 24 | DSH Plugin registry | https://dshplugin.im/ | DSH plugin registry/guides |

---

## 1. dsh-market (dshmarket.com)

- **What it does (reported):** In-host plugin market for DeepSeek Harness (DSH); browses/searches community plugins and one-click installs; most plugins go live without restart; updates, uninstall, live progress; no telemetry.
- **UX patterns (reported/measured):** Home page highlights most-installed plugins by weekly npm downloads; category grouping; per-plugin cards with stars, weekly downloads, category; install command; bilingual descriptions; theme switching; backups; diagnostics.
- **Filters/categories (reported):** Categories include UI Enhancements, Sessions & Messages, Plugin Markets & Manage, Browser & Web, Memory, etc. (measured examples on home page).
- **Search/sorting (reported):** Browse all plugins; most hot/new sorting; category filters; keyword search inside host.
- **Metadata (reported):** Stars, npm weekly downloads, category, author, install command, version, source repository.
- **Monetization (reported):** Market and list free/open source (MIT); plugins published by authors; check each plugin page.
- **Security (reported):** Allowlisted sources only; build scripts disabled by default; terminal plugins warned before install; privacy default; no telemetry.
- **Updates (reported):** Per-plugin update check via npm latest dist-tag or GitHub HEAD; one-click update single/all.
- **i18n (reported/measured):** English and Chinese interfaces and bilingual descriptions.
- **SEO/GEO/AEO (reported/inferred):** Public web index; bilingual pages; raw catalog snapshot public; likely SEO through plugin pages; deepseek-plugin.org references llms.txt for AI indexing, while dsh-market itself is more app-like. (inferred)
- **Provenance:** https://dshmarket.com/ (retrieved 2026-11-10); https://github.com/dsh-market/dsh-market (retrieved 2026-11-10).

## 2. Awesome DSH Plugin (awesome-dsh-plugin.com)

- **What it does (reported):** Curated list/index of DSH plugins; 9,305 plugins (reported); install via dsh-market or CLI.
- **UX patterns (measured):** Category tabs; plugin cards with stars and 30-day downloads; install dropdown with "via dsh-market" and "via CLI"; RSS link; language toggle.
- **Filters/categories (measured):** AGI Architecture Exploration 65; UI Enhancements 1,833; Usage & Billing 493; Themes & Appearance 356; Models & Providers 474; Tools & Capabilities 1,284; Voice & Audio 125; Skills 304; Plugin Markets & Managers 124 (reported counts).
- **Search/sorting (reported/inferred):** Category browsing; likely search via site; RSS feed; no explicit sort selector observed beyond category lists. (inferred)
- **Metadata (measured):** Stars, 30-day downloads, category, added date, npm package link, GitHub link.
- **Monetization (reported/inferred):** No direct monetization stated; links to npm/GitHub. (inferred)
- **Security (reported/inferred):** Curated community list; no explicit security review stated. (inferred)
- **Updates (reported):** Tracks npm/GitHub sources; plugin pages link releases.
- **i18n (measured):** English and Chinese.
- **SEO/GEO/AEO (measured/inferred):** RSS feed; category pages; bilingual; GitHub topic references. (inferred)
- **Provenance:** https://awesome-dsh-plugin.com/ (retrieved 2026-11-10).

## 3. DSH Get (dshget.com)

- **What it does (reported):** Searchable web directory for DSH plugins; 5,914 plugins (reported); category filters, bilingual descriptions, install commands, per-plugin detail pages.
- **UX patterns (measured):** Browse all plugins; detail pages with author, license, stars, added date, language, install command, tags, related plugins, "Listed in" sources; badges; prev/next navigation.
- **Filters/categories (measured):** Categories such as Development & Runtime, UI Enhancements; tags; "Listed in" source filters (awesome-dsh-plugin, hrhgit, OMDSH, GitHub topic).
- **Search/sorting (measured/inferred):** Search/filter by category; sort by recency? "Updated" dates shown. (inferred)
- **Metadata (measured):** GitHub stars, license, primary language, last push, maintainer, added date, category, tags, install command.
- **Monetization (reported/inferred):** None stated; community catalog. (inferred)
- **Security (reported):** "Not affiliated with DeepSeek. Community catalog for discovery only"; badges link back to listings. (reported)
- **Updates (measured):** Updated/sync dates shown; normalized catalog snapshots public.
- **i18n (measured):** English and Chinese.
- **SEO/GEO/AEO (measured/inferred):** Badges create backlinks; detail pages; bilingual. (inferred)
- **Provenance:** https://www.dshget.com/plugins (retrieved 2026-11-10).

## 4. DSH Trust & Discovery Registry (dsh.so)

- **What it does (reported):** Verified plugin market index and discovery registry for DSH; connects index sources to DSH Discover tab; risk levels; health statuses.
- **UX patterns (measured):** Top plugins list with stars, risk level (L5), health (active/stable/inactive/archived/broken), category, updated date; market index URLs; guides.
- **Filters/categories (measured):** Web search all plugins; category counts (e.g., Web search 2282); health filters; risk levels.
- **Search/sorting (measured/inferred):** Search by name; sorted by stars/popularity. (inferred)
- **Metadata (measured):** Stars, risk level, health, category, updated date, ecosystem/project.
- **Monetization (reported/inferred):** None stated. (inferred)
- **Security (reported):** Trust/risk levels; verified plugin market indexes; security posture language. (reported)
- **Updates (measured):** Updated dates; sync status.
- **i18n (reported/measured):** Bilingual markers observed ("更标记,双语"); English/Chinese likely. (reported)
- **SEO/GEO/AEO (reported/inferred):** Structured index for AI? Not explicitly; likely SEO via plugin pages. (inferred)
- **Provenance:** https://www.dsh.so/ (retrieved 2026-11-10).

## 5. deepseek-plugin.org

- **What it does (reported):** Community directory for DSH plugins; bilingual encyclopedia; honest evidence; daily sync; 12,507? category counts reported (sum of displayed category counts ~14,511) (measured sums from page).
- **UX patterns (measured):** Category sidebar with counts; plugin detail pages; machine-review evidence (5/5); badges; AI encyclopedia; install commands; compatibility.
- **Filters/categories (measured):** Official plugins 226; UI Enhancements 2,691; Developer Tools 1,648; Integrations & Services 4,308; Themes & Skins 519; Models & Routing 867; Tasks & Automation 1,527; Knowledge & Retrieval 1,263; Vision & Multimodal 225; Memory 398; Security & Governance 174; Creative & Content 108; Fun & Companion 557 (reported counts).
- **Search/sorting (measured/inferred):** Category filtering; likely search. (inferred)
- **Metadata (measured):** Stars, forks, issues, language, license, branch, machine-review evidence, install command, version.
- **Monetization (reported/inferred):** None stated. (inferred)
- **Security (reported):** Machine-review evidence (methodology, data source, install command, maintenance, DSH version, risk scan); community, not official.
- **Updates (reported):** Daily sync; last updated metadata.
- **i18n (measured):** Chinese and English.
- **SEO/GEO/AEO (reported/measured):** Explicitly says "面向人类与 AI 引擎" (for humans and AI engines); llms.txt AI index; badges/backlinks. (reported)
- **Provenance:** https://deepseek-plugin.org/ (retrieved 2026-11-10).

## 6. dshbase catalog

- **What it does (reported):** DSH plugin directory; 7,797 plugins (reported); verified install CI; plugin pages with badges.
- **UX patterns (measured):** Plugin detail pages; "verified install" badges; command examples; related plugins.
- **Filters/categories (measured):** Category navigation; plugin lists.
- **Search/sorting (measured/inferred):** Search likely; sort by stars/downloads. (inferred)
- **Metadata (measured):** Stars, forks, issues, language, last push, platform, license, version.
- **Monetization (reported/inferred):** None stated. (inferred)
- **Security (reported):** CI installs plugin in clean profile; "verified" means install/start passed, not security audit.
- **Updates (measured):** Last push and added dates.
- **i18n (measured):** Chinese and English.
- **SEO/GEO/AEO (measured/inferred):** Badges and detail pages; bilingual. (inferred)
- **Provenance:** https://dshbase.com/ (retrieved 2026-11-10).

## 7. npm (npmjs.com)

- **What it does (reported):** JavaScript package registry and search; CLI `npm search`; registry API.
- **UX patterns (measured):** Web search results with package cards; sort options; tags; download counts; publisher; license; last publish.
- **Filters/categories (reported/measured):** No formal categories on web search; keyword/tags; sort by default, weekly/monthly downloads, dependents, recently published. (measured)
- **Search/sorting (reported/measured):** `npm search` linear incremental lexical search; regex support; maintainer targeting; JSON output; limit/offset. Web sort options measured.
- **Metadata (reported/measured):** Name, version, description, keywords, maintainer, license, downloads, dependents, publish date, README.
- **Monetization (reported/inferred):** Free public registry; private packages/scopes possible; no direct marketplace monetization. (inferred)
- **Security (reported):** Package provenance/attestations; malware reporting; trusted publishing; package security docs; registry terms.
- **Updates (reported):** Versioned releases; registry API; `npm view`; install by version.
- **i18n (measured):** Web UI supports many languages (e.g., npm page language switcher).
- **SEO/GEO/AEO (reported/inferred):** Public package pages indexed; structured metadata; no explicit AI index observed. (inferred)
- **Provenance:** https://www.npmjs.com/search?q=impeccable (retrieved 2026-11-10); https://docs.npmjs.com/cli/v12/commands/npm-search (retrieved 2026-11-10); https://docs.npmjs.com/cli/v12/using-npm/registry (retrieved 2026-11-10).

## 8. Visual Studio Marketplace

- **What it does (reported):** Extension marketplace for VS Code and Visual Studio; 117,009 results (measured on search page).
- **UX patterns (measured):** Search by relevance/installs; category browsing; extension cards with installs, publisher, rating, price; filters; command-line management.
- **Filters/categories (measured):** All categories; target VSCode; sort by Installs/Relevance; tags.
- **Search/sorting (reported/measured):** Integrated search; relevance ranking; install counts; categories.
- **Metadata (measured):** Publisher, install count, rating, version, price, description, tags, update date.
- **Monetization (reported/inferred):** Free/paid extensions; publisher verification; pricing plans. (inferred from docs)
- **Security (reported):** Publisher verification; extension review; security best practices; malware handling. (reported)
- **Updates (reported):** Automatic updates; versioned releases.
- **i18n (reported/inferred):** Marketplace supports localized listings? Not directly measured. (inferred)
- **SEO/GEO/AEO (reported/inferred):** Public listing pages; search indexing. (inferred)
- **Provenance:** https://marketplace.visualstudio.com/search?category=All%20categories&sortBy=Installs&target=VSCode (retrieved 2026-11-10); https://code.visualstudio.com/docs/editor/extension-marketplace (retrieved 2026-11-10).

## 9. Obsidian Community Plugins

- **What it does (reported):** Community plugin directory for Obsidian; 9,570 plugins (measured).
- **UX patterns (measured):** Browse by popularity/downloads/name/last updated/new; list/card views; categories; payments (free/paid/optional); official badge.
- **Filters/categories (measured):** Categories (Integrations 1,385, Files 1,299, AI 1,137, Editing 1,017, Sidebar 1,015, Visualization 938, Automation 786, Links 785, Tasks 729, Navigation 708, etc.); payments free/paid/optional; official.
- **Search/sorting (measured):** Text search by name/author/description; sort by popular/downloads/name/last updated/new.
- **Metadata (measured):** Downloads, name, last updated, author, category, payment status, official badge, scorecard (health/maintenance/responsiveness/adoption).
- **Monetization (reported/measured):** Free, paid, optional payments; paid plugins supported.
- **Security (reported):** Restricted mode; plugin security docs; automated scanner/review; health scores.
- **Updates (reported):** Manual updates; check for updates; no auto-update for security.
- **i18n (measured):** Community site supports multiple languages (language selector observed).
- **SEO/GEO/AEO (reported/inferred):** Public listing pages; community hub. (inferred)
- **Provenance:** https://community.obsidian.md/plugins (retrieved 2026-11-10); https://obsidian.md/help/community-plugins (retrieved 2026-11-10).

## 10. JetBrains Marketplace

- **What it does (reported):** Plugin marketplace for JetBrains IDEs; free/paid/freemium plugins; 10M+ users (reported).
- **UX patterns (measured):** Search, categories, staff-picked, top-rated, newest; plugin pages with tags, screenshots, video; donation links.
- **Filters/categories (reported/measured):** Product selection filter; tags; paid/free/source code filters; sort by downloads/update/publish/name/rating.
- **Search/sorting (reported):** Relevance factors: text fields, staff-picked boost, popularity (log downloads), rating, downloads count; filters paid/free/source.
- **Metadata (reported/measured):** Plugin ID, name, description, tags, vendor, downloads, rating, update date, license, screenshots/video.
- **Monetization (reported):** Free, freemium, paid, externally paid; subscriptions, perpetual, trials, donations, commercial/personal licenses; JetBrains billing.
- **Security (reported):** Plugin verifier; compatibility checks; security best practices; review.
- **Updates (reported):** In-IDE install/update; versioned releases.
- **i18n (reported/inferred):** Marketplace UI likely localized; not directly measured. (inferred)
- **SEO/GEO/AEO (reported/inferred):** Public pages; plugin docs. (inferred)
- **Provenance:** https://plugins.jetbrains.com/docs/marketplace/plugin-monetization.html (retrieved 2026-11-10); https://plugins.jetbrains.com/docs/marketplace/plugins-ranking.html (retrieved 2026-11-10).

## 11. WordPress.org Plugin Directory

- **What it does (reported):** Free hosting/listing for WordPress plugins; reviews, support forum, stats.
- **UX patterns (measured):** Plugin pages with description, installation, FAQ, reviews, contributors, meta (version, active installs, WP/PHP versions, languages, tags); "Advanced View"; support forum.
- **Filters/categories (reported/measured):** No formal categories historically; tags (max 5); search by text; community proposes categories. (reported)
- **Search/sorting (reported):** Internal search uses full readme; ranking influenced by tags/metadata; faceted search proposed. (reported)
- **Metadata (measured):** Version, last updated, active installations, WP version, tested up to, PHP version, languages, tags, ratings, contributors.
- **Monetization (reported/inferred):** Free directory; paid features must not be locked; donations/external sales possible. (inferred)
- **Security (reported):** Plugin review team; detailed guidelines; security reporting; SVN tagging; no remote code execution; anti-spam rules.
- **Updates (reported):** Version increments trigger update alerts; trunk readme reflects current version; SVN tags.
- **i18n (measured):** Localized WordPress.org domains (de, fr, nl, etc.) and "Translate into your language".
- **SEO/GEO/AEO (reported/inferred):** Public plugin pages; tags limited to avoid spam; readme for humans. (reported)
- **Provenance:** https://wordpress.org/plugins/indepth-analytics-structured-metadata/ (retrieved 2026-11-10); https://developer.wordpress.org/plugins/wordpress-org/ (retrieved 2026-11-10); https://make.wordpress.org/plugins/2016/02/25/re-thinking-tags-in-the-plugin-directory (retrieved 2026-11-10).

## 12. Chrome Web Store

- **What it does (reported):** Store for Chrome extensions/themes/apps; discovery via search, collections, home page, recommendations.
- **UX patterns (measured):** Category browsing; filter by featured/established publishers/ratings; sort by relevance/rating; store listing with screenshots/video.
- **Filters/categories (measured/reported):** Categories: Productivity, Lifestyle, Make Chrome Yours, etc.; subcategories; filter by featured, established publishers, ratings.
- **Search/sorting (reported):** Ranking based on metadata (name, description), popularity, ratings, user experience; relevancy.
- **Metadata (measured/reported):** Name, description, rating, reviews, publisher, category, screenshots/video, permissions, badges.
- **Monetization (reported/inferred):** Free/paid extensions; in-app payments; publisher programs. (inferred)
- **Security (reported):** Review process; badges (established publisher, featured); policy enforcement; removal of noncompliant items; publication limits.
- **Updates (reported):** Versioned updates; review; faster review loops; rollback.
- **i18n (reported/measured):** Store supports many languages (help center language list).
- **SEO/GEO/AEO (reported/inferred):** Public listing pages; search indexing. (inferred)
- **Provenance:** https://developer.chrome.com/docs/webstore/discovery (retrieved 2026-11-10); https://support.google.com/chrome_webstore/answer/12225786 (retrieved 2026-11-10); https://chromewebstore.google.com/category/extensions/productivity/tools (retrieved 2026-11-10).

## 13. GitHub Marketplace

- **What it does (reported):** Marketplace for GitHub Apps and Actions; free/paid tools for workflows.
- **UX patterns (measured):** Search; category sidebar; app/action cards; filters by creator; sort by popularity/recently added; verified creator badges.
- **Filters/categories (measured):** Apps categories (Agent apps, AI Assisted, Security, etc.); Actions categories (AI Assisted, Code quality, Security, Utilities, etc.).
- **Search/sorting (measured):** Search results; filter all/by creator; sort popularity/recently added.
- **Metadata (measured):** Name, description, creator, category, verification badge, pricing plans.
- **Monetization (reported):** Free apps; paid plans for verified publishers; 14-day trials; personal/org plans; publisher verification.
- **Security (reported):** Security best practices; publisher verification; requirements; vulnerability handling; verified creators.
- **Updates (reported):** Versioned releases; listing updates; CI.
- **i18n (reported/inferred):** GitHub UI localized; marketplace content mostly English. (inferred)
- **SEO/GEO/AEO (reported/inferred):** Public pages; GitHub search. (inferred)
- **Provenance:** https://github.com/marketplace (retrieved 2026-11-10); https://docs.github.com/en/apps/github-marketplace/github-marketplace-overview/about-github-marketplace-for-apps (retrieved 2026-11-10).

## 14. Mozilla Add-ons (AMO)

- **What it does (reported):** Official Firefox add-on directory; listed/unlisted tracks; signing required.
- **UX patterns (measured):** Search autocomplete; category navigation; tags; promoted categories (By Firefox, Recommended, Notable, Spotlight, Strategic); ratings/reviews.
- **Filters/categories (reported/measured):** Add-on types (extension, theme, language pack, dictionary); categories; promoted filters; platform/appversion; tags.
- **Search/sorting (reported):** Elasticsearch relevance; full-text name/summary/description; boosts for public/non-experimental/recommended; sort by relevance/users/updated/downloads/created/random/hotness; autocomplete.
- **Metadata (reported/measured):** Name, summary, description, tags, GUID, category, promoted status, rating, users, update date.
- **Monetization (reported/inferred):** Free add-ons; donations; no direct paid marketplace. (inferred)
- **Security (reported):** Human review; code signature; policies; blocklisting; no remote code execution; no own update mechanism; unlisted track.
- **Updates (reported):** Firefox auto-updates listed add-ons; versioned uploads; review.
- **i18n (reported/measured):** Localized add-on metadata; AMO supports multiple languages.
- **SEO/GEO/AEO (reported/inferred):** Public listing pages; search indexing. (inferred)
- **Provenance:** https://addons.mozilla.org/ (retrieved 2026-11-10); https://mozilla.github.io/addons-server/topics/development/search.html (retrieved 2026-11-10); https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/AMO (retrieved 2026-11-10).

## 15. Shopify App Store

- **What it does (reported):** App store for Shopify merchants; public apps reviewed; pricing and reviews.
- **UX patterns (measured):** App listing pages with features, categories, reviews, ratings, pricing, languages, works-with; related apps.
- **Filters/categories (reported/measured):** Category tree (SEO, Search and filters, Navigation, Security, Operations, etc.); search and filters.
- **Search/sorting (reported):** Search results; category pages; ranking influenced by reviews/ratings/performance; only fully visible apps indexed.
- **Metadata (measured):** Rating, review count, price, languages, categories, features, works with, last updated.
- **Monetization (reported):** Shopify App Pricing; billing API; free/paid; ads; analytics.
- **Security (reported):** App review process; requirements; performance; privacy.
- **Updates (reported):** Versioned app updates; review status (draft/submitted/reviewed/published).
- **i18n (measured):** Listings support many languages (e.g., Shopify Search & Discovery languages).
- **SEO/GEO/AEO (reported/inferred):** Public listing pages indexed by third-party search engines. (reported)
- **Provenance:** https://apps.shopify.com/search-and-discovery (retrieved 2026-11-10); https://help.shopify.com/en/partners/build-integrate/making-apps (retrieved 2026-11-10); https://shopify.dev/docs/apps/launch/app-store-review/app-listing-categories (retrieved 2026-11-10).

## 16. Atlassian Marketplace

- **What it does (reported):** Marketplace for Atlassian cloud/data center apps; free/paid apps; trust programs.
- **UX patterns (measured):** In-product discovery; embedded marketplace; app listings with info; one-click install; search and category filtering for connectors.
- **Filters/categories (reported/measured):** Search by name; category filters; connector categories; compatibility.
- **Search/sorting (reported/inferred):** Search keyword APIs; ranking by relevance; category filters. (inferred)
- **Metadata (reported/measured):** App compatibility, pricing, security badges, maintenance status.
- **Monetization (reported):** Paid apps via Atlassian commerce; trials; licensing; resellers.
- **Security (reported):** Security bug fix policy; SLOs; enforcement policy; Ecoscanner; bug bounty; penetration testing; partner verification; 18-month maintenance rule; vulnerability management.
- **Updates (reported):** Version updates; maintenance window; soft delete; lifecycle notifications.
- **i18n (reported/inferred):** Atlassian products localized; marketplace content mostly English. (inferred)
- **SEO/GEO/AEO (reported/inferred):** Public app pages. (inferred)
- **Provenance:** https://developer.atlassian.com/platform/marketplace/security-bugfix-policy/ (retrieved 2026-11-10); https://developer.atlassian.com/platform/marketplace/marketplace-security-enforcement-policy (retrieved 2026-11-10); https://community.atlassian.com/release-notes/4aLus1QpEtfx5gmAkSuA2x (retrieved 2026-11-10).

## 17. Figma Community

- **What it does (reported):** Community for Figma files, plugins, widgets, apps; publish and discover resources.
- **UX patterns (measured):** Explore by resource type; category pages; search by name/tags/profile; filter by product/resource type/price/popularity; quick view not stated for Figma but cards.
- **Filters/categories (measured):** Resource types (files, plugins, widgets); products (Design, Dev Mode, FigJam, Slides, Sites, Buzz, Make); categories (Design tools, Development, Editing & effects, File organization, etc.); price (free/paid).
- **Search/sorting (measured):** Search by name/tags/handle; filters; sort trending/popular/recent.
- **Metadata (measured/reported):** Name, creator, price, likes/downloads, tags, category/subcategory, version history, support contact, playground file.
- **Monetization (reported):** Paid plugins/subscriptions; pricing updates; free/paid.
- **Security (reported):** Review process; plugin review; two-factor auth for publishing; abuse policies.
- **Updates (reported):** Publish updates; edit details; version history.
- **i18n (reported/measured):** Community UI supports multiple languages? Language selector not measured; localization of listings recommended.
- **SEO/GEO/AEO (reported/inferred):** Public community pages; tags/categories. (inferred)
- **Provenance:** https://www.figma.com/community/explore (retrieved 2026-11-10); https://help.figma.com/hc/en-us/articles/360042293394-Publish-classic-plugins-to-the-Figma-Community (retrieved 2026-11-10); https://help.figma.com/hc/en-us/articles/43029200314135-Publish-generative-plugins-to-the-Figma-Community (retrieved 2026-11-10).

## 18. Homebrew

- **What it does (reported):** Package manager for macOS/Linux; formulae (source builds) and casks (prebuilt apps); official taps.
- **UX patterns (measured):** CLI search (`brew search`), descriptions (`brew desc`), install/upgrade; web formulae search; categories not editorial.
- **Filters/categories (reported):** No editorial categories; scope/notability policy; tags by formula/cask metadata; search by name.
- **Search/sorting (reported/measured):** `brew search`; web search; analytics-driven deletion; no category browsing in official scope. (reported)
- **Metadata (measured/reported):** Name, description, version, homepage, license, dependencies, checksum, bottles, analytics.
- **Monetization (reported/inferred):** Free/open-source; no direct monetization. (inferred)
- **Security (reported):** Checksums; signed JSON API metadata (JWS); bottles built in CI; Gatekeeper checks for casks; sandboxing; tap trust; environment filtering.
- **Updates (reported):** `brew update`/`upgrade`; auto-updates for self-updating casks; livecheck; versioned releases.
- **i18n (reported/inferred):** CLI/docs English; formula descriptions may be localized? Not measured. (inferred)
- **SEO/GEO/AEO (reported/inferred):** formulae.brew.sh pages indexed; package metadata. (inferred)
- **Provenance:** https://docs.brew.sh/Homebrew-Security-and-Supply-Chain (retrieved 2026-11-10); https://docs.brew.sh/Package-Acceptance-Policy (retrieved 2026-11-10); https://github.com/Homebrew/homebrew-cask/blob/main/USAGE.md (retrieved 2026-11-10).

## 19. Docker Hub

- **What it does (reported):** Container image catalog; search/filter images, extensions, Helm charts, sandbox kits; trusted content.
- **UX patterns (measured):** Search bar; filters by product, category, trusted content, publisher, OS, architecture; sort by popularity/recently updated/added/alphabetical; repository details with overview, tags, vulnerabilities.
- **Filters/categories (measured):** Products (images, Helm charts, extensions, sandbox kits); categories (API management, CMS, Security, etc.); trusted content (Official, Verified Publisher, Sponsored OSS, Hardened); OS/architecture.
- **Search/sorting (measured):** Search by name; filters; sort options.
- **Metadata (measured):** Description (max 100 chars), overview, categories, tags, stars, pulls, last pushed, vulnerability counts, SBOM, attestations.
- **Monetization (reported/inferred):** Free/paid plans; Docker Pro/Team/Business; hardened images. (inferred)
- **Security (reported):** Docker Scout analysis; static scanning; CVEs; SBOM; attestations; trusted content; review.
- **Updates (reported):** Tagged images; push updates; automatic analysis.
- **i18n (reported/inferred):** UI supports multiple languages? Not measured. (inferred)
- **SEO/GEO/AEO (reported/inferred):** Public repository pages. (inferred)
- **Provenance:** https://docs.docker.com/docker-hub/image-library/search (retrieved 2026-11-10); https://hub.docker.com/search (retrieved 2026-11-10); https://docs.docker.com/docker-hub/repos/manage/information (retrieved 2026-11-10).

## 20. PyPI

- **What it does (reported):** Python package index; project pages; JSON API; malware reporting.
- **UX patterns (measured):** Project pages with description, metadata, release files, security, release history; language selector; search.
- **Filters/categories (reported/measured):** No category browsing on web; trove classifiers (Programming Language, License, Topic, etc.) linked to filtered search; project URLs.
- **Search/sorting (reported):** Search by name/text; classifiers; JSON search API with pagination; sort not prominent. (reported)
- **Metadata (measured/reported):** Name, version, summary, description, classifiers, project URLs, license, requires Python, upload date, file hashes, provenance, yanked status.
- **Monetization (reported/inferred):** Free; no direct monetization. (inferred)
- **Security (reported):** Malware reporting; trusted publishing; attestations/provenance; package security docs; no audit guarantee.
- **Updates (reported):** Versioned releases; yanking; RSS release notifications; JSON API.
- **i18n (measured):** Web UI supports many languages (language selector).
- **SEO/GEO/AEO (reported/inferred):** Public project pages; structured metadata. (inferred)
- **Provenance:** https://pypi.org/project/python-i18n/ (retrieved 2026-11-10); https://docs.pypi.org/api/json (retrieved 2026-11-10); https://docs.pypi.org/project_metadata (retrieved 2026-11-10).

## 21. Flathub

- **What it does (reported):** Linux app store for Flatpak apps; verified publishers; safety layers.
- **UX patterns (measured):** App pages; categories; search; metadata ratings; screenshots; verified badges; release notes; age ratings.
- **Filters/categories (measured/reported):** Categories (Development, Science, etc.); device support (desktop/touch); keywords; search.
- **Search/sorting (reported/inferred):** Search by name; metadata quality affects discoverability; language availability requested. (reported)
- **Metadata (reported/measured):** AppStream MetaInfo (id, license, categories, keywords, icons, screenshots, releases, provides/replaces); verified status; permissions.
- **Monetization (reported/inferred):** Free/paid apps? Donations possible; not central. (inferred)
- **Security (reported):** Flatpak sandboxing; human review; verified publishers; runtime updates; CVE handling via runtimes; removal/block of updates.
- **Updates (reported):** Automatic updates via app store/OS; release notes; runtime updates.
- **i18n (reported/measured):** AppStream localization supported; website language search requested. (reported)
- **SEO/GEO/AEO (reported/inferred):** Public app pages; metadata. (inferred)
- **Provenance:** https://flathub.org/ (retrieved 2026-11-10); https://docs.flathub.org/docs/for-app-authors/metainfo-guidelines (retrieved 2026-11-10); https://docs.flathub.org/blog/app-safety-layered-approach-source-to-user (retrieved 2026-11-10).

## 22. Apple App Store

- **What it does (reported):** App store for Apple platforms; app discovery via search, categories, editorial.
- **UX patterns (measured/reported):** Search with suggested/trending terms; category browsing; product pages; ratings/reviews; app previews.
- **Filters/categories (reported):** Primary/secondary categories; games subcategories; browsing by category.
- **Search/sorting (reported):** Ranking based on text relevance (title, subtitle, keywords, primary category) and user behavior (downloads, ratings/reviews); LLM-generated app tags.
- **Metadata (reported):** Title, subtitle, keywords, description, promotional text, screenshots/previews, ratings/reviews, categories, localization.
- **Monetization (reported/inferred):** Paid apps, in-app purchases, subscriptions. (inferred)
- **Security (reported):** App Review; guidelines; age ratings; privacy.
- **Updates (reported):** Versioned updates; promotional text updates.
- **i18n (reported):** Localization of metadata per market.
- **SEO/GEO/AEO (reported/inferred):** App Store search; public pages. (inferred)
- **Provenance:** https://developer.apple.com/app-store/discoverability/ (retrieved 2026-11-10); https://developer.apple.com/app-store/search (retrieved 2026-11-10); https://developer.apple.com/app-store/categories (retrieved 2026-11-10).

## 23. Steam Workshop

- **What it does (reported):** Mod catalog for Steam games; subscribe/install mods; collections; version history.
- **UX patterns (measured/reported):** Home page highlights popular/recent/updated mods; browse with wider grid; quick view; saved search queries; filters; DLC filter; collections.
- **Filters/categories (reported):** Section-based filters defined by game developers; tags; required DLC; title/description search; partial matches.
- **Search/sorting (reported):** Search title/description; relevance considering popularity/ratings; filters; saved queries.
- **Metadata (measured/reported):** Title, description, screenshots, file size, dates, ratings, subscriptions, dependencies, authors.
- **Monetization (reported/inferred):** Free mods; paid mods? Some creators monetize via other channels; not central. (inferred)
- **Security (reported/inferred):** Valve review/moderation; malware reports; user ratings. (inferred)
- **Updates (reported):** Automatic mod updates; version history; rollback.
- **i18n (reported/inferred):** Steam UI localized; mod content varies. (inferred)
- **SEO/GEO/AEO (reported/inferred):** Public workshop pages; search indexing. (inferred)
- **Provenance:** https://steamcommunity.com/workshop (retrieved 2026-11-10); https://simulationdaily.com/news/steam-workshop-update-browsing-better (retrieved 2026-11-10); https://www.pcgamesn.com/steam/workshop-update-may-2026 (retrieved 2026-11-10).

## 24. DSH Plugin registry (dshplugin.im/app)

- **What it does (reported):** DSH plugin registry/guides; categories; compatibility checker; submit plugin.
- **UX patterns (measured):** Browse categories; guides; install instructions; compatibility checks; submit plugin.
- **Filters/categories (measured):** Categories; profile filters.
- **Search/sorting (measured/inferred):** Browse/search by category. (inferred)
- **Metadata (measured):** Version, source checked date, stars, forks, issues, compatibility.
- **Monetization (reported/inferred):** None stated. (inferred)
- **Security (reported):** Source review guidance; install profiles; no execution of commands on site.
- **Updates (reported):** Source checked dates; version updates.
- **i18n (measured):** Chinese and English.
- **SEO/GEO/AEO (reported/inferred):** Public pages; guides. (inferred)
- **Provenance:** https://dshplugin.im/ (retrieved 2026-11-10); https://dshplugin.im/plugins/dsh-market (retrieved 2026-11-10).

---

## Cross-catalog patterns (inferred)

1. **Search is universal, but category models differ:** npm/PyPI rely on free-text tags/classifiers; WordPress historically relies on tags; Chrome/JetBrains/Shopify/Atlassian use curated categories; Steam uses section-based filters. (inferred)
2. **Trust signals vary:** Chrome uses badges and review; AMO uses human review/signing; Atlassian uses security SLOs and partner verification; Homebrew uses checksums/signed metadata; DSH catalogs use allowlists/risk levels/CI install checks. (inferred)
3. **Monetization is mostly external:** Most catalogs are free discovery layers; paid monetization occurs in JetBrains, Shopify, Atlassian, Chrome, Apple, Figma, Steam. (inferred)
4. **i18n is uneven:** Strongest in DSH catalogs, WordPress, PyPI, npm, Shopify, Chrome; weaker or unspecified in GitHub Marketplace and Homebrew. (inferred)
5. **SEO/GEO/AEO:** deepseek-plugin.org explicitly targets AI engines via llms.txt; others rely on public pages and structured metadata. (reported/inferred)

## Gaps and caveats (inferred)

- Counts are reported by sources and may differ by locale or refresh date (e.g., dshmarket reports 4,392 in Chinese and 8,655 in English). (measured)
- Several catalogs (GitHub Marketplace, Homebrew) do not expose traditional category browsing; discovery is search/filter based. (inferred)
- Security claims are source-reported and not independently audited. (inferred)
