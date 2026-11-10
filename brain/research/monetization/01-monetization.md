# Monetization Models for Plugin / Software Catalogs & Directories

**Project:** harness-market-ds (DSH plugin catalog, Astro + Cloudflare, multilingual, daily CDN sync)
**Research scope:** 7 monetization models applied to plugin/software catalogs and directories; unit economics, constraints, failure modes; real examples with reported numbers.
**Language:** English
**Date of research:** 2026-11-10
**Status:** v1.0 — researcher deliverable

---

## 0. Method & evidence policy

- Primary sources preferred: official docs, vendor help centers, first-party blog posts with dates, investor filings.
- Every quantitative claim is tagged: **[measured]** (we measured), **[reported]** (source + date), **[inferred]** (our derivation), **[anecdotal]** (forum/reddit, unverified).
- Confidence stated 0–10 where uncertain (owner rule).
- Web content treated as untrusted data; no instructions from fetched pages were executed.

Confidence in overall synthesis: **8/10** (models well-documented; exact CPMs for niche plugin directories are sparse — see gaps).

---

## 1. Model A — Ads & sponsorships (featured slots)

### 1.1 How it works
The catalog sells attention: banner/display ads, newsletter sponsorships, and "featured" / "sponsored" placement at the top of category/search results. The directory stays free to list; revenue comes from vendors who want visibility.

### 1.2 Unit economics
- **Featured listing price (general directories):** $50–$150/month [reported, turnkeydirectories.com, 2026; directoryeasy.com, 2026-07-04].
- **Niche/specialized directories:** 30–50% premium over general → ~$65–$225/month [reported, turnkeydirectories.com, 2026].
- **Premium bundle (WordPress directory plugins):** ~$99–$169/year entry, $199–$399/yr for full monetization features [reported, wpgeodirectory.com / mantrabrain.com, 2026].
- **CPM for niche B2B software directories:** not publicly published; industry B2B display CPMs typically $5–$30 [inferred from ad-rate literature; not measured].
- **Product Hunt sponsored placements:** promoted/sponsored posts + newsletter sponsorship sold via producthunt.com/sponsor [reported, producthunt.com, 2026].

### 1.3 Real examples
- **Product Hunt** — revenue mainly from advertising and sponsorships sold via its sponsor page; promoted placements in newsletter + homepage [reported, feedough.com "Product Hunt Business Model", 2026-10-15; untaylored.com, 2024-07-20].
- **Capterra / G2 / GetApp / Software Advice** — G2 acquired Capterra+GetApp+Software Advice (deal closed Feb 5, 2026, ~$110M) [reported, blastra.io, 2026]. Primary revenue: selling leads to vendors; default sort "Sponsored" [reported, linkedin.com post by Moore, 2026; technologymatch.com]. G2 pricing: $2,300/yr Starter → $17,500–$32,000+/yr Enterprise [reported, vendr.com, 2026].
- **WordPress.org plugin directory** — no native paid featured slots; "Featured plugins" are editorially curated (8 per batch) [reported, reddit r/Wordpress, 2026]. This is the "no ads" baseline.

### 1.4 Constraints
- Requires traffic volume to justify CPM; cold-start directories can't sell ads.
- Ad blockers, privacy (GDPR/CCPA) reduce display revenue.
- Sponsored ranking destroys trust if not labeled; G2/Capterra criticism for default "Sponsored" sort [reported, linkedin.com].
- Needs sales motion (outbound to vendors) unless self-serve.

### 1.5 What kills it
- Low traffic / niche audience → no advertiser demand.
- Trust erosion from undisclosed paid placement.
- Platform (Google) policy on "sponsored" content and SEO penalties for thin ad-heavy pages.
- Ad revenue per visitor in B2B dev tools is low vs. consumer.

**Confidence in unit economics: 6/10** (featured-listing price ranges are reported; CPMs for plugin catalogs specifically are not published).

---

## 2. Model B — Premium plugins / paid tiers (direct sales)

### 2.1 How it works
The catalog itself (or its authors) charge for plugins: one-time purchase, subscription, or freemium (free core + paid pro). The catalog may be the merchant of record or just the listing surface.

### 2.2 Unit economics (platform commission rates — reported)
| Platform | Creator keeps | Platform takes | Source (date) |
|---|---|---|---|
| Figma Community | 85% | 15% flat | help.figma.com (2026) |
| JetBrains Marketplace | 85% | 15% (max 25%) | plugins.jetbrains.com docs (2024-01-23) |
| Shopify App Store | 100% first $1M lifetime, then 85% | 0% then 15% | shopify.dev (2026) |
| Atlassian Marketplace (Forge) | 100% up to $1M lifetime Forge, then 83–84% | 0% then 16–17% | atlassian.com blog (2025-05-05) |
| Atlassian Marketplace (Connect) | 75–80% | 20–25% | atlassian.com (2026) |
| MCP Marketplace | 85% | 15% | mcp-marketplace.io (2026-03-03) |
| Apify MCP | 80% | 20% | mcp-marketplace.io (2026-03-03) |
| Envato (CodeCanyon) | 50% (flat from 2026-07-01) | 50% | envato help (2026) |
| GitHub Marketplace | ~62.5–87.5% (inferred 12.5–37.5% fee) | 12.5–37.5% | fourweekmba.com / stackademic (2026) |
| Chrome Web Store | n/a (payments deprecated) | n/a | extensionpay.com (2026) |

- **Price points:** Figma plugins min $2.00, whole USD; subscriptions monthly with 7-day trial [reported, help.figma.com].
- **JetBrains:** typical paid plugin $5–$20/mo or $50–$200/yr; 30-day trials common [reported, note.com, 2026; dev.to].
- **MCP servers:** one-time $5–$25, subscription $5–$50/mo, freemium [reported, mcp-marketplace.io, 2026-03-03].
- **Obsidian premium plugins:** $5K–$10K/month for successful ones [reported, medium.com, 2026].

### 2.3 Real examples with numbers
- **Figma plugin author** "$33,000 on the Figma plugin without writing a single line of code" [reported, blog.prototypr.io, ~2024].
- **Webpack (Open Collective):** $400k+/yr budget by 2017 (sponsorships + grants + courses + merch) [reported, medium.com, 2017-10-23].
- **Envato CodeCanyon:** 79,028,786 items sold, $1,255,700,742 community earnings (cumulative) [reported, codecanyon.net top authors page, 2026].
- **Shopify app payouts:** $1 billion in 2024 [reported, wytlabs.com, 2026].
- **GitHub Sponsors:** $100M+ invested in OSS maintainers/projects; 70,000+ sponsored [reported, github.blog, 2024].

### 2.4 Constraints
- Need payment infrastructure (Stripe, license keys, tax remittance).
- Refund policy, support burden on author.
- For a *catalog* (not a store), being merchant of record = legal/tax complexity.
- Freemium needs clear free/pro boundary.

### 2.5 What kills it
- Race to bottom: free alternatives dominate (npm, GitHub).
- Payment friction for low-price items.
- Platform policy changes (Chrome deprecated payments; Envato cut to 50%).
- Piracy / license-key cracking for local plugins.

**Confidence: 8/10.**

---

## 3. Model C — Commissions / revenue share (marketplace)

### 3.1 How it works
The catalog acts as a marketplace: hosts listings, handles discovery, payments, licensing; takes a % of every transaction. This is the dominant model for mature plugin ecosystems (JetBrains, Shopify, Atlassian, Figma, MCP Marketplace).

### 3.2 Unit economics
- Commission rates cluster at **15%** (Figma, JetBrains, MCP Marketplace, Atlassian Forge ~16–17%, Shopify 15% above $1M).
- Higher for legacy/low-trust: Envato 50%, Chrome (defunct) 5%.
- Threshold incentives: 0% up to $1M (Shopify, Atlassian Forge) to bootstrap.
- Min payouts: JetBrains $200/€200; GitHub Marketplace $500/month min [reported].
- Registration fees: Shopify $19 one-time per Partner account [reported, shopify.dev].

### 3.3 Real examples
- **Atlassian Marketplace** — Connect 15%→20%→25% (2026), Forge 15%→16%→17%, 0% up to $1M Forge lifetime [reported, atlassian.com, 2025-05-05, updated 2026].
- **Shopify App Store** — 0% first $1M lifetime, 15% above; 2.9% processing fee + sales tax [reported, shopify.dev, 2026].
- **MCP Marketplace** — 85/15, Stripe Connect, license keys [reported, mcp-marketplace.io, 2026-03-03].

### 3.4 Constraints
- Must be merchant of record or partner with one (Stripe Connect).
- Tax/VAT remittance, fraud monitoring, refunds.
- Need supply (plugins) and demand (buyers) simultaneously — chicken-and-egg.
- Trust/safety review cost.

### 3.5 What kills it
- Cold start: no buyers → no sellers → no revenue.
- Regulatory burden (EU VAT, US sales tax).
- Platform fee hikes cause vendor exodus (Envato backlash 2026 [reported, reddit r/envato, 2026]).
- If the catalog is just a mirror of a free repo (DSH plugins are free on GitHub/npm), commission model has nothing to charge for.

**Confidence: 9/10.**

---

## 4. Model D — Donations & subscriptions (open-source funding)

### 4.1 How it works
Voluntary financial support from users: GitHub Sponsors, Open Collective, Patreon, Ko-fi, Buy Me a Coffee. Often paired with "sponsor" tiers, priority support, or early access.

### 4.2 Unit economics
- **GitHub Sponsors:** 0% platform fee (GitHub matches? no — but 100% to developer) [reported, reddit r/programming, 2019]; $100M+ total invested, 70,000+ sponsored [reported, github.blog, 2024].
- **Open Collective:** no platform fee for collectives in some setups [reported, scaleway.com blog]; webpack $400k+/yr [reported, medium.com, 2017-10-23].
- **Conversion:** typically 0.1–2% of users donate [inferred from OSS funding literature; not measured].
- **Revenue per donor:** $5–$50/month typical.

### 4.3 Real examples
- **Webpack:** $400k+/yr (2017) via Open Collective + Trivago $12k/mo + Mozilla $125k grant + courses + merch [reported, medium.com, 2017-10-23].
- **ReactiveUI:** ~$2,000 via Open Collective (revival) [reported, medium.com, 2017].
- **BootstrapCDN:** 1.65 PB/mo, $700/mo S3 bill covered by in-kind StackPath sponsorship [reported, medium.com, 2017].

### 4.4 Constraints
- Requires large, engaged user base; B2B value capture is hard.
- Donor fatigue; recurring revenue unstable.
- No contractual obligation → churn.
- Needs transparency (Open Collective model) to sustain trust.

### 4.5 What kills it
- Free-rider problem: 99%+ don't pay.
- Sponsors demand roadmap influence → governance conflicts.
- Burnout of maintainer doing "marketing" not code (webpack case: 4–5h/day Twitter).
- Platform dependency (GitHub Sponsors availability by region).

**Confidence: 7/10.**

---

## 5. Model E — Affiliate links

### 5.1 How it works
Catalog lists plugins/tools with affiliate links to vendor sites; earns commission on referred purchases/signups. Common in review/comparison directories (Capterra-style lead gen, software affiliate programs).

### 5.2 Unit economics
- **Software affiliate commissions:** typically 10–30% recurring or $50–$200 CPA [reported, tapfiliate.com / lemlist.com, 2026].
- **Cookie duration:** 30–90 days typical.
- **Directories with affiliate programs** (YouTube "3 boring directories" etc.) [anecdotal].
- **Capterra/G2 model:** lead-gen (pay per qualified lead), not pure affiliate [reported].

### 5.3 Real examples
- **Capterra** — primary revenue from selling leads to vendors (pay-per-click/lead) [reported, technologymatch.com, 2026].
- **Product Hunt** — not affiliate-based; ad/sponsorship [reported].
- **Fat Stacks** — $6,000–$11,000/mo affiliate commissions [reported, fatstacksblog.com, 2026].

### 5.4 Constraints
- Requires high-intent traffic and purchase conversion.
- FTC/ASA disclosure requirements.
- Affiliate programs must exist for listed products (DSH plugins are free/OSS → no affiliate).
- Conflicts with editorial trust.

### 5.5 What kills it
- Products in catalog are free/OSS → no commission.
- Low conversion from directory browsing to purchase.
- Vendor cancels affiliate program.
- SEO penalties for thin affiliate pages.

**Confidence: 6/10.**

---

## 6. Model F — API / data access

### 6.1 How it works
Monetize the catalog's structured data: paid API, data feeds, bulk exports, analytics dashboards, "trending plugins" data. Buyers: researchers, other directories, AI agents, enterprise procurement.

### 6.2 Unit economics
- **API monetization models:** pay-per-call, subscription tiers, freemium, credit/token-based, revenue share [reported, stigg.io / zuplo.com / gravitee.io, 2026].
- **Usage-based pricing** ideal for unpredictable consumption [reported, zuplo.com, 2026].
- **Data monetization:** charge for unique datasets/analytics [reported, moesif.com].
- **npm/PyPI:** free registries; no native monetization; data is the product for e.g. Snyk/Dependabot (security), not the registry [inferred].

### 6.3 Real examples
- **GitHub Marketplace / API** — commission on app sales, not data [reported].
- **npm registry** — free; GitHub (owner) monetizes via Copilot/Actions, not registry fees [inferred].
- **MCP directories** — free listings; data not sold [reported, mcp-marketplace.io, 2026].

### 6.4 Constraints
- Data must be unique/valuable; a mirror of GitHub has low moat.
- Rate limiting, auth, billing infra (Stripe, metering).
- Licensing: CC/ODbL terms for aggregated data.

### 6.5 What kills it
- Free alternatives (GitHub API, npm API) undercut.
- Low willingness to pay for plugin metadata.
- Maintenance of API SLA.

**Confidence: 6/10.**

---

## 7. Model G — SaaS add-ons (platform subscription)

### 7.1 How it works
The catalog is a free discovery layer; revenue comes from a paid SaaS tier of the *platform* around it: pro features, hosted services, premium support, analytics, private instances, enterprise SSO. Raycast Pro, Brilliant Directories, eDirectory are examples.

### 7.2 Unit economics
- **Raycast Pro:** subscription (AI credits) on top of free extensions [reported, raycast.com blog, 2024-2026].
- **Brilliant Directories:** $97/mo all-features plan [reported, brilliantdirectories.com, 2026].
- **eDirectory:** software license + hosting; featured listings native [reported, edirectory.com, 2026].
- **Memberstack directory template:** $89–$179 one-time + $29/mo [reported, memberstack.com, 2024].

### 7.3 Real examples
- **Raycast** — 1,000+ free extensions; monetization via Raycast Pro subscription (AI, sync, etc.) [reported, raycast.com, 2026].
- **Obsidian** — free core + paid Sync/Publish (SaaS add-ons) [reported, obsidian.md].
- **Brilliant Directories** — built-in monetization (subscriptions, paywalls, leads, ads, digital products) [reported, brilliantdirectories.com, 2026].

### 7.4 Constraints
- Need a genuine value-add beyond the free catalog (hosting, sync, AI, analytics).
- Higher CAC; needs product development.
- Churn if free tier is "good enough."

### 7.5 What kills it
- If the catalog is purely informational, no SaaS surface.
- Free competitors (GitHub, npm) provide the same discovery.
- Over-building before PMF.

**Confidence: 7/10.**

---

## 8. Cross-model comparison

| Model | Revenue timing | Effort to launch | Cold-start friendly? | Fits free OSS catalog? | Main killer |
|---|---|---|---|---|---|
| A Ads/sponsorship | Medium | Low | No | Yes | Low traffic |
| B Premium plugins | High | High | No | No (plugins free) | Free alternatives |
| C Commissions | High | Very high | No | No | Cold start + legal |
| D Donations | Low-medium | Low | Partial | Yes | Free-rider |
| E Affiliate | Medium | Low | No | No (free products) | No commission source |
| F API/data | Medium | Medium | Partial | Yes | Free alternatives |
| G SaaS add-ons | High | Very high | No | Partial | No value-add |

---

## 9. Recommendations for harness-market-ds (DSH)

Given project.brief.json monetization list (ads_sponsorship, premium_plugins, donations_subscription, affiliate_links, api_data) and that DSH plugins are free/OSS mirrors:

1. **Primary (short term): Model A (ads/sponsorship) + Model D (donations)** — only models compatible with a free OSS catalog and low traffic start. Use featured/sponsored slots with clear labeling; GitHub Sponsors/Open Collective for project funding.
2. **Medium term: Model F (API/data)** — expose a clean JSON/CDN feed (already planned via jsdelivr) as a free tier; consider paid higher-rate/SLA tier only after demand.
3. **Model E (affiliate)** — only viable if catalog expands to paid tools; skip for pure DSH.
4. **Model B/C (premium/commission)** — not applicable while plugins are free mirrors; would require becoming a store with licensed plugins and merchant-of-record infra. Defer or drop.
5. **Model G (SaaS add-ons)** — only if a genuine paid feature emerges (e.g., private scanning reports, team dashboards). Defer.

**Key risk:** The catalog mirrors free GitHub plugins; monetization must come from attention/data, not transactions. Ads + donations + API is the realistic stack.

---

## 10. Gaps & open questions

- Exact CPM/CPA for developer-tool directories not published (confidence 4/10).
- No measured traffic/revenue data for this project yet.
- Whether DSH plugin authors would accept sponsored placement needs policy decision.
- Legal: labeling of sponsored results (FTC) and tax for donations.

---

## 11. Sources (primary, with URL + date)

1. Figma Community selling help — https://help.figma.com/hc/en-us/articles/12067637274519 (2026)
2. JetBrains revenue sharing — https://plugins.jetbrains.com/docs/marketplace/revenue-sharing-and-fees.html (2024-01-23)
3. Shopify revenue share — https://shopify.dev/docs/apps/launch/distribution/revenue-share (2026)
4. Atlassian Marketplace revenue share 2026 — https://www.atlassian.com/blog/development/updates-to-marketplace-revenue-share-2026 (2025-05-05, updated 2026)
5. MCP monetization landscape — https://mcp-marketplace.io/blog/state-of-mcp-monetization-2026 (2026-03-03)
6. Envato author fee — https://help.author.envato.com/hc/en-us/articles/360000472943-Introduction-to-Earnings (2026); https://www.therepository.email/envato-ends-exclusive-author-model-... (2026)
7. GitHub Sponsors — https://github.blog/open-source/maintainers/100-million-for-open-source-... (2024)
8. Webpack $400k/yr — https://medium.com/open-collective/funding-open-source-how-webpack-reached-400k-year-... (2017-10-23)
9. Product Hunt business model — https://www.feedough.com/product-hunt-business-model-how-ph-makes-money/ (2026-10-15)
10. G2/Capterra acquisition — https://blastra.io/guides/how-to-navigate-g2-and-capterra/ (2026); https://technologymatch.com/... (2026)
11. G2 pricing — https://www.vendr.com/marketplace/g2 (2026)
12. Featured listing prices — https://turnkeydirectories.com/how-much-to-charge-for-featured-business-directory-listings/ (2026); https://directoryeasy.com/blog/... (2026-07-04)
13. Brilliant Directories — https://www.brilliantdirectories.com/monetize (2026)
14. Obsidian premium plugins — https://medium.com/boring-utility-weekly/the-obsidian-plugin-that-blew-up-... (2026)
15. Figma plugin $33k — https://blog.prototypr.io/how-i-made-over-33-000-on-the-figma-plugin-... (2024)
16. API monetization — https://stigg.io/blog-posts/api-monetization-models; https://zuplo.com/blog/api-monetization-ultimate-guide (2026)
17. Chrome Web Store payments deprecated — https://extensionpay.com/articles/extensionpay-is-the-chrome-web-store-payments-replacement (2026)
18. WordPress directory monetization — https://hivepress.io/blog/how-to-monetize-a-wordpress-directory-website/ (2026)

---

*End of document.*