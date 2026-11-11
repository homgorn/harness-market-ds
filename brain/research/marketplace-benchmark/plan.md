# Research Plan: AI-Agent/Plugin Marketplace Benchmark

## 1. Reframe & Falsifiable Hypotheses

**Core Question:** What patterns from existing AI-agent/plugin marketplaces should a new DSH catalog copy for traction, monetization, taxonomy, trust model, and SEO?

**Underlying Decision:** Design choices for dshmarket.com / dshget.com catalog architecture.

**Falsifiable Hypotheses:**
1. **H1:** Marketplaces with faceted, programmatic-SEO URL structures (e.g., `/category/tag/author/`) capture significantly more organic traffic than flat structures.
2. **H2:** Trust signals (malware scanning, permission manifests, verified publishers) correlate with higher install-to-view ratios and lower churn.
3. **H3:** Monetization models taking 15-30% of paid transactions + optional sponsorships generate sustainable revenue without alienating OSS contributors.
4. **H4:** Taxonomy depth of 3-4 levels (category → subcategory → tag → capability) optimizes discovery vs. cognitive load.
5. **H5:** Marketplaces indexing both "plugins" and "agents/bots" in a unified taxonomy see cross-pollination traffic gains of 20%+.

## 2. Genre & Building Blocks

**Genre:** Landscape analysis with decision-support framework.

**Building Blocks:**
- Comparison table (15-25 marketplaces)
- Pattern extraction (15 concrete patterns)
- Monetization model analysis with real numbers
- Gap analysis (unknowns, refresh targets)

## 3. Scope & Sourcing Strategy

**Target Marketplaces (25):**

| Tier | Marketplaces | Priority |
|------|-------------|----------|
| **Core IDE/Editor** | VS Code Marketplace, JetBrains Marketplace, Obsidian Community Plugins, Cursor Marketplace (if exists) | P0 |
| **Browser/Extension** | Chrome Web Store, Mozilla Add-ons, Firefox Add-ons | P0 |
| **Design/No-Code** | Figma Community, Figma Plugins, Dify Plugin Marketplace, Coze Bot Store, Poe Bot Store | P0 |
| **AI/ML Specific** | Hugging Face Spaces, smithery.ai (MCP), mcp.so, Glama, GitHub Marketplace | P0 |
| **General Package Registries** | npmjs.com, PyPI, Docker Hub, Homebrew, Flathub | P1 |
| **CMS/Platform** | WordPress.org Plugins, Shopify App Store (if accessible) | P1 |
| **DSH-specific** | dshmarket.com, dshget.com, awesome-dsh-plugin.com | P0 |
| **Curated Lists** | Awesome lists (GitHub), AlternativeTo, Product Hunt | P2 |

**Sourcing Strategy per Marketplace:**
1. **Primary:** Official docs, API docs, blog posts, engineering blogs, public metrics pages
2. **Secondary:** Third-party analyses, blog posts with traffic data (SimilarWeb, Ahrefs), earnings reports
3. **Tertiary:** Community discussions (Reddit, HN, Discord), GitHub issues

**Search Queries per Marketplace:**
- `[marketplace] item count statistics 2024 2025`
- `[marketplace] taxonomy categories tags structure`
- `[marketplace] trust model malware scanning permissions`
- `[marketplace] monetization revenue share commission`
- `[marketplace] SEO URL structure faceted search`
- `[marketplace] API documentation developer guide`

## 4. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Private metrics (no public numbers) | High | Medium | Use reported ranges, label clearly, triangulate with SimilarWeb |
| API rate limits / anti-scraping | Medium | Low | Use websearch + manual fetch, respect robots.txt |
| Outdated info (2023 vs 2025) | High | High | Always capture retrieval date, prefer 2024-2025 sources |
| DSH-specific sites may not exist / be private | Medium | High | If 404, document and infer from awesome lists |
| Conflicting reports | Medium | Medium | Triangulate ≥3 sources, flag discrepancies |

## 5. Stop Criteria

- Minimum 15 marketplaces with ≥3 independent sources each
- All 5 hypotheses confirmed/refuted/under-determined
- Comparison table complete with measured/reported/inferred labels
- 15 patterns extracted with source attribution
- Monetization data for ≥10 marketplaces with URLs + dates

## 6. Changelog

- 2026-11-11: Plan created, directories initialized