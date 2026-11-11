# 05 GAPS — Unknowns & Research Debt

## 5.1 Critical Gaps (Block Design Decisions)

| Gap | Why It Matters | Current Workaround | Research Needed |
|-----|----------------|-------------------|-----------------|
| **No public related-item algorithm from any marketplace** | Cannot validate weight assumptions; risk of copying anti-patterns | Heuristic synthesis + aggressive A/B testing | Run controlled experiments on live traffic; publish learnings |
| **Co-install/co-view telemetry availability unknown** | PMI features need minimum 100 co-occurrences; privacy regulations (GDPR/CCPA) | Content-only fallback; publisher/category defaults | Legal review on telemetry collection; opt-in design; synthetic data generation |
| **Cross-type relatedness ground truth missing** | Plugin→SaaS, Bot→Hosted Site have no labeled pairs | Manual curation for top 100 pairs; measure CTR | Human evaluation study (n≥50); active learning loop |
| **Tag quality distribution unknown** | Jaccard fails with spam/noise tags (e.g., "best", "free", "vscode") | TF-IDF weighting; tag quality score from usage frequency | Analyze tag entropy across 9 marketplaces; build tag cleaner |
| **Real-time trending vs batch recompute tradeoff** | Viral items need hours-not-days visibility | Daily full recompute + hourly delta for top 10% | Benchmark streaming feature store (Feast/Redis) vs batch (Spark) |

---

## 5.2 High-Impact Gaps (Degrade Quality)

| Gap | Impact | Mitigation |
|-----|--------|------------|
| **Schema.org type mapping for 8 DSH types** | AI citation readiness; rich results | Draft mapping in 02-facets-and-urls.md; validate with Google Rich Results Test |
| **Publisher verification at scale** | VS Code model requires 6-month wait + manual review | Automate DNS + track record checks; human review only for edge cases |
| **Malware scanning pipeline for heterogeneous artifacts** | Plugins (VSIX), Docker images, binaries, MCP packages need different scanners | Multi-engine: ClamAV + YARA + custom rules per type; sandbox execution for plugins |
| **Deprecation/migration across types** | SaaS deprecation ≠ Plugin deprecation (data export, API sunset) | Type-specific deprecation workflows; unified UI pattern |
| **Pricing model normalization** | Free/Trial/Paid/Freemium/Usage-based/Per-seat across types | Canonical pricing enum + type-specific tier schema; Stripe/Paddle integration for paid |

---

## 5.3 Medium Gaps (Nice to Have)

| Gap | Notes |
|-----|-------|
| **Multi-locale facet translation** | Category/tag taxonomies need i18n; machine translation + human review |
| **Accessibility of trust badges** | Screen reader labels for layered badges; color-blind safe palette |
| **Offline/installable catalog export** | Air-gapped environments need signed catalog snapshots (like `npm pack` for marketplace) |
| **Version resolution for dependencies** | Plugin A v2 requires Plugin B v1.x; semver resolution across types |
| **Monetization: revenue split, payouts, tax** | Only relevant if DSH takes commission; Stripe Connect / Paddle B2B |
| **Enterprise: private registry, SSO, policy engine** | OPA/Rego policies for allowed types/publishers/permissions |
| **Analytics: funnel, cohort, retention** | PostHog / Mixpanel / custom; GDPR-compliant |
| **API rate limiting & abuse prevention** | Token buckets per publisher/IP; GraphQL cost analysis |

---

## 5.4 Entity Model Gaps (From 01-entity-model.md)

| Gap | Entity Types Affected | Resolution |
|-----|----------------------|------------|
| **MCP server runtime compatibility matrix** | Bot/MCP | Define `runtime_hint` enum: `docker` \| `npx` \| `uvx` \| `python` \| `binary`; validate against client capabilities |
| **SaaS integration taxonomy** | SaaS, Bot/MCP | Standardized `integration_type`: `oauth` \| `webhook` \| `api_key` \| `mcp` \| `a2a`; registry of known integrations |
| **Theme token format standardization** | Theme | Design Tokens Format (W3C) vs Figma variables vs VS Code theme JSON; propose DSH Theme Token Schema |
| **Desktop tool uninstall/revert semantics** | Desktop/CLI | Homebrew `zap` is aggressive; need safe uninstall + rollback spec per install method |
| **Hosted site build reproducibility** | Hosted Site | Lockfile + buildpack + SBOM; verify reproducible builds for static sites |

---

## 5.5 Facets & SEO Gaps (From 02-facets-and-urls.md)

| Gap | Risk | Resolution |
|-----|------|------------|
| **Facet value explosion for tags** | 10K+ unique tags → 2^10K filter combos | Tag autocomplete only; no tag filter facet in UI; tags only for search/related |
| **Category taxonomy depth** | 3+ levels → deep facet URLs | Max 2 levels; flatten to `parent:child` single facet |
| **Dynamic facet values (hardware tiers, GPU types)** | HF adds new GPUs quarterly | Facet values from entity data, not hardcoded; admin UI to promote/hide |
| **Canonical URL for "type=plugin&category=linters&sort=rating"** | Multiple valid canonical candidates | Rule: canonical = base + type + category (if type filtered); sort/tags → noindex |

---

## 5.6 Trust & Security Gaps (From 03-trust-ui.md)

| Gap | Blocker | Resolution |
|-----|---------|------------|
| **Supply chain provenance for non-npm artifacts** | Docker, PyPI, Homebrew, GitHub Releases have different provenance formats | Adopt SLSA + in-toto attestations universally; build `dsh-attest` CLI |
| **Real-time malware scan for large binaries** | Docker images >1GB; VSIX ~50MB; timeout budgets | Async scan queue; "Scan pending" badge; block install until clean |
| **Publisher verification for individuals (no domain)** | Many OSS maintainers lack verified domains | GitHub verified email + 2FA + contribution history = "Individual Verified" tier |
| **Revocation propagation** | Malicious extension published → how fast to disable globally? | Push notification to clients (VS Code style) + CDN cache purge <5 min |
| **Audit logging for trust decisions** | Who approved publisher X? When? Why? | Immutable audit log (append-only); WORM storage |

---

## 5.7 Related Items Gaps (From 04-related-ranking.md)

| Gap | Experiment Design |
|-----|-------------------|
| **Optimal tag Jaccard threshold for candidate generation** | A/B test: 0.2 vs 0.3 vs 0.4; measure recall@500 |
| **Dependency edge weight vs tag Jaccard** | A/B test: 0.20 vs 0.15 vs 0.25; measure install conversion |
| **Personalization lift over global** | Holdout: 10% users get global only; measure CTR/install delta |
| **Diversity constraint impact on CTR** | MMR (Maximal Marginal Relevance) λ=0.5 vs 0.7 vs none |
| **Cold-start: publisher boost vs category default** | New items (<50 installs): randomize boost strategy; measure time-to-first-install |

---

## 5.8 Refresh Triggers (From Deep Research Protocol)

| Entity / Metric | Refresh Cadence | Trigger |
|-----------------|-----------------|---------|
| Marketplace algorithm changes (VS Code, npm, Chrome) | Quarterly | Monitor engineering blogs; RSS feeds |
| New entity types added to DSH | Per release | Schema version bump |
| Tag vocabulary drift | Monthly | Tag entropy > threshold → reprocess |
| Malware signature updates | Daily | ClamAV/YARA auto-update |
| Publisher verification criteria | Bi-annual | Legal/regulatory changes |
| SEO canonical rules | Quarterly | Google Search Central updates |
| Schema.org vocabulary | Bi-annual | Schema.org releases |

---

## 5.9 Decision Log (For Future Reference)

| Date | Decision | Rationale | Revisit Trigger |
|------|----------|-----------|-----------------|
| 2026-11-11 | Shared base + type-specific extension schema | 9/9 marketplaces use this pattern | If new type doesn't fit |
| 2026-11-11 | Query params for facets (not path segments) | SEO best practice; all 9 marketplaces do it | If Google changes guidance |
| 2026-11-11 | Heuristic related-item weights (tag Jaccard 0.25) | No ground truth; synthesis of observable signals | When A/B test data available |
| 2026-11-11 | Layered trust badges (not single "verified") | Anti-pattern: single badge loses signal | If user testing shows confusion |
| 2026-11-11 | Schema.org SoftwareApplication + additionalType | Citation-worthy for AI engines | When schema.org adds MarketplaceItem type |

---

## 5.10 Recommended Next Research Sprint (2 Weeks)

| Task | Owner | Deliverable |
|------|-------|-------------|
| Legal review: telemetry collection for co-install PMI | Legal | Memo: GDPR/CCPA compliance for anonymized aggregate |
| Tag quality analysis across 9 marketplaces | Data Eng | Report: tag entropy, spam rate, TF-IDF weights |
| Schema.org mapping validation | SEO | Rich Results Test screenshots for all 8 DSH types |
| Malware scanner POC for VSIX + Docker + binary | Security | Scan pipeline design doc + latency benchmarks |
| Publisher verification automation design | Backend | Flowchart: DNS check → track record → human review queue |
| A/B test framework for related items | Platform | Experiment config: randomization, metrics, guardrails |

---

## Sources Index

All gaps derived from synthesis of primary sources in `data/01-09_*.md` and search queries in `queries.log`. No external sources for gaps — they are **inferred** from absence of evidence in primary sources.