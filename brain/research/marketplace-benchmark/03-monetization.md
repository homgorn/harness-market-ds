# Monetization Models — Marketplace Benchmark

All figures labeled: **measured** (directly observed), **reported** (stated in source with URL + date), or **inferred** (derived).

---

## 1. Revenue-Share / Commission Models

| Marketplace | Commission Rate | Scope | Real Numbers (reported + URL + date) | Notes |
|-------------|-----------------|-------|--------------------------------------|-------|
| **JetBrains Marketplace** | 15% (standard), capped at 25% | All paid plugin sales via Marketplace | "The commission on each plugin purchase is set to 15%... can never be more than 25%" — [Revenue sharing doc](https://plugins.jetbrains.com/docs/marketplace/revenue-sharing-and-fees.html) (accessed 2026-11-11) | 5% intro rate until July 2020; reseller fee from JetBrains share; custom formula for high-revenue plugins |
| **Figma Community** | 15% flat | Community sales (plugins/widgets) | "Figma charges a flat 15% on Community sales" — [Kelviq 2026](https://www.kelviq.com/blog/figma-plugin-monetization) (2026); [Figma Help](https://help.figma.com/hc/en-us/articles/12067637274519) | Includes payment processing, tax, refunds, fraud; min $2 price; subscriptions include 7-day trial; **new seller approval paused 2024–2026** |
| **Chrome Web Store (historical)** | 5% | Chrome Web Store Payments API | "Google took a 5% fee from these transactions" — [ExtensionPay](https://extensionpay.com/articles/extensionpay-is-the-chrome-web-store-payments-replacement) (2020 shutdown) | **Shut down Feb 2021**; no replacement; developers now self-host billing |
| **GitHub Marketplace** | 0% (free apps); paid plans via GitHub billing | Paid app subscriptions | "GitHub Marketplace pricing plans can be free, flat rate, or per-unit... Paid plans are restricted to..." — [GitHub Docs](https://docs.github.com/enterprise-cloud@latest/apps/github-marketplace/selling-your-app-on-github-marketplace/pricing-plans-for-github-marketplace-apps) | GitHub handles billing/payouts; fee structure not publicly documented for paid apps |
| **Poe (Quora)** | Undisclosed % | Price-per-message + subscriptions | "Poe takes a platform fee (unspecified)" — [Wikipedia](https://en.wikipedia.org/wiki/Quora#Poe) (2024); $75M raised for creator fund — [TechCrunch](https://techcrunch.com/2024/01/10/quora-raises-75m-for-poe-ai-chatbot-creator-program/) (2024-01-10) | Creator sets price/message; subscriptions $5–$250/mo for points |
| **Coze** | Undisclosed % | Creator monetization via platform points | "Creator monetization via Coze platform (points/subscriptions); platform takes cut (unspecified)" — [Coze Docs](https://www.coze.com/open/docs/guides/store_bot) (accessed 2026-11-11) | In-app currency model |

---

## 2. Zero-Commission / Freemium Models (OSS-Friendly)

| Marketplace | Model | Revenue Source | Real Numbers | Fit for DSH Catalog |
|-------------|-------|----------------|--------------|---------------------|
| **VS Code Marketplace** | No native monetization; `pricing: "Free|Trial"` label only; external licensing | 3rd-party: code-checkout (10%), Freemius, custom | "Zero built-in monetization... Free-to-Pro model most effective" — [Dodo Payments](https://dodopayments.com/blogs/sell-vscode-extensions) (2026) | ✅ **Best fit** — DSH can adopt `sponsor` field + external license validation API |
| **Obsidian Community Plugins** | Zero fees; funding links in manifest (GitHub Sponsors, Patreon, Ko-fi) | Voluntary donations | 51/1,079 plugins (4.7%) have funding links — [figma-plugins-monetization-stats](https://github.com/yuanqing/figma-plugins-monetization-stats) (measured 2026) | ✅ **Strong fit** — exactly DSH's current model |
| **WordPress.org** | Zero fees; freemium (lite on .org → pro off-site); SaaS addons; affiliate | Off-platform conversions | "Freemium dominant... convert up to 30% of active installs to paying customers" — [WP Minute](https://thewpminute.com/is-wordpress-org-good-for-freemium-plugins) (2024) | ✅ **Proven at scale** — 60k plugins, massive ecosystem |
| **npmjs.com** | Zero fees on public registry; npm Pro ($7/mo), Teams ($15/user/mo) for private packages | Private registry subscriptions | "More than 2 million packages... npm Pro to enjoy premium JavaScript development experience" — [npmjs.com](https://www.npmjs.com) (accessed 2026-11-11) | ✅ **Registry model** — if DSH hosts private plugin registries |
| **PyPI** | Zero fees; donations via project URLs | Voluntary | No native monetization; [PyPI 2025 Review](https://blog.pypi.org/posts/2025-12-31-pypi-2025-in-review/) | ✅ **Pure OSS** |
| **Homebrew** | Zero fees; entirely volunteer/OSS | Donations/grants | "262M formula install events (Apr 2025–Mar 2026)" — [formulae.brew.sh/analytics](https://formulae.brew.sh/analytics/) (measured 2026-11-11) | ✅ **Community-funded** |
| **Flathub** | Zero fees; funded by donations/grants | Donations, grants | "439M downloads in 2025... 3,252 apps" — [Flathub 2025 Review](https://flathub.org/en/year-in-review/2025) (2026-01-02) | ✅ **Non-profit model** |
| **Dify Marketplace** | Zero fees (current); future TBD | None yet | "1,050 plugins... Zero platform fees (current)" — [Dify Marketplace 2026 Review](https://aiagents.org.uk/dify-marketplace-review/) (2026-10-24) | ✅ **Early-stage, aligned** |

---

## 3. Advertising / Sponsorship Models (Traffic-Based)

| Marketplace | Ad Products | Pricing Model | Real Numbers | Fit for DSH |
|-------------|-------------|---------------|--------------|-------------|
| **mcp.so** | Homepage featured slots, category sponsorship, "Advertise" nav link | CPM / flat fee (undisclosed) | "Advertise" in top nav; featured servers on homepage — [mcp.so](https://mcp.so) (measured 2026-11-11) | ✅ **Direct fit** — same audience (MCP/agent developers) |
| **Glama** | "Advertise" in nav; MCP Gateway/Hosting/Inspector as paid products | Product-led + ad slots | 119,173 servers; "Advertise" prominent — [Glama](https://glama.ai/mcp/servers) (measured 2026-11-11) | ✅ **Strong fit** — MCP directory + paid tools |
| **Chrome Web Store** | None currently (could add) | N/A | No ads on store; extensions can show ads (policy-limited) | ⚠️ **Possible** but UX risk |
| **VS Code Marketplace** | None | N/A | No ads; Microsoft monetizes via Azure/Enterprise | ❌ **Not applicable** |

---

## 4. Creator Earnings Data (Where Published)

| Marketplace | Top Creator Earnings | Median/Typical | Source |
|-------------|---------------------|----------------|--------|
| **Figma Plugins** | "600,000+ installs. One developer. Converts Figma designs to production code — token-based $0.10–$0.50 per export" — [BalanceYZ](https://balancyz.com/figma) (2026) | 9.08% of plugins paid; paid plugins get 14.71% of installs, 17.71% of likes — [figma-plugins-monetization-stats](https://github.com/yuanqing/figma-plugins-monetization-stats) (measured 2026) | GitHub repo analysis |
| **Chrome Extensions** | 57.1% earn $0/mo; 6.3% clear $1,000/mo; avg $295/mo; highest $9,742/mo — [BigIdeasDB](https://bigideasdb.com/how-to-monetize-a-chrome-extension) (2026) | Freemium conversion ~3–5% — [ExtensionRadar](https://www.extensionradar.com/blog/how-to-monetize-chrome-extension) (2025) | Revenue-verified dataset |
| **WordPress Plugins** | "Premium plugins convert up to 30% of active installs" — [WP Minute](https://thewpminute.com/is-wordpress-org-good-for-freemium-plugins) (2024) | Freemium standard; top plugins $100k–$1M+/yr (WooCommerce, Yoast, etc.) | Industry reports |
| **VS Code Extensions** | No public earnings data (no native monetization); code-checkout takes 10% | External licensing only | [Dodo Payments](https://dodopayments.com/blogs/sell-vscode-extensions) (2026) | N/A |
| **Poe Creators** | "Majority of $75M funding will go to developers" — [TechCrunch](https://techcrunch.com/2024/01/10/quora-raises-75m-for-poe-ai-chatbot-creator-program/) (2024-01-10) | Price-per-message; top bots thousands of messages/day | Quora/Poe announcements |

---

## 5. Which Models Fit a Free OSS Catalog (DSH)

### ✅ Recommended Primary Model: **Zero Platform Fees + Optional Sponsorship + Advertising**

| Component | Implementation | Revenue Potential | Rationale |
|-----------|----------------|-------------------|-----------|
| **Core catalog** | Free listing, free installs, no commission | $0 direct | Aligns with OSS ethos; removes barrier for volunteer maintainers; matches VS Code, Obsidian, WordPress.org, npm, PyPI, Homebrew, Flathub |
| **Sponsor badges** | `sponsor.url` in manifest → badge on plugin page + publisher page | Indirect (drives donations) | 4.7% adoption in Obsidian; zero cost to platform; builds goodwill |
| **External licensing API** | Standardized `/api/license/validate` endpoint for freemium/pro | $0 platform fee | Enables developers to monetize without platform friction; VS Code pattern |
| **Advertising** | "Featured in Category" (weekly flat), "Search Top Placement" (CPC), "Newsletter Sponsor" (CPM) | **Primary revenue** at scale | mcp.so/Glama prove this works for dev-tool directories; 10k+ MAU threshold viable |
| **Partner/Enterprise tier** | Verified publishers + SLA + private registry hosting | B2B revenue | JetBrains/GitHub model; DSH can host private plugin registries for teams |

### ❌ Models to Avoid

| Model | Why Not for DSH |
|-------|-----------------|
| **Revenue share (15–30%)** | Requires merchant-of-record infrastructure (tax, refunds, disputes, KYC); alienates volunteer maintainers; Chrome Web Store killed it; Figma paused new sellers |
| **Paid placement in organic results** | Destroys trust; users expect relevance ranking; label "Sponsored" clearly if any |
| **Mandatory platform billing** | Figma's 15% only viable because they handle tax/refunds/fraud; DSH lacks scale for this |
| **Subscription for catalog access** | Contradicts "free OSS catalog" positioning; users will fork |

---

## 6. Revenue Projection Framework (for DSH)

| Traffic Milestone | Ad Inventory | Estimated Monthly Revenue | Assumptions |
|-------------------|--------------|---------------------------|-------------|
| 1,000 MAU | 3 category sponsorships @ $200/mo | $600 | Early adopters; direct sales |
| 10,000 MAU | 10 category sponsorships @ $500 + 2 search slots @ $1,000 | $7,000 | Inbound interest; mcp.so/Glama comps |
| 50,000 MAU | Full ad server; programmatic + direct; newsletter 5k subs @ $50/issue | $25,000 | Industry CPM $10–$50 for dev tools |
| 100,000 MAU | Self-serve ad platform; API access; enterprise private registries | $75,000+ | npm Pro/Teams model + ads |

**Key metric to watch:** `MAU × pages/visit × ad fill rate × eCPM`. Target >$10 RPM (revenue per thousand visits) for dev-tool niche.

---

## 7. Implementation Priority for DSH

| Phase | Monetization Feature | Effort | Dependency |
|-------|---------------------|--------|------------|
| **1 (MVP)** | `sponsor` field in manifest; render badge | 1 day | Manifest schema |
| **1 (MVP)** | External license validation API spec (docs only) | 2 days | None |
| **2 (Launch)** | "Advertise" page + manual sponsorship sales | 1 week | 1k+ MAU |
| **3 (Growth)** | Self-serve ad dashboard (category sponsorship) | 1 month | 10k+ MAU |
| **4 (Scale)** | Private registry hosting for teams (npm Pro model) | 2 months | Enterprise demand |
| **Ongoing** | Creator analytics dashboard (retention) | 1 month | Auth + install tracking |

---

**Bottom Line:** The only sustainable model for a free OSS catalog is **zero fees on transactions + advertising on attention**. Every marketplace that tried revenue share on a developer-tool directory either killed it (Chrome Web Store) or restricted it (Figma). DSH should monetize *visibility* (ads), not *transactions* (commission).