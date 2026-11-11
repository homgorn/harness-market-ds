# 04 Related / Similar Items — DSH Ecosystem Marketplace

## Research Basis
Primary sources: VS Code Marketplace, npm, Chrome Web Store, Figma Community, Hugging Face, Docker Hub, Homebrew, OBS, MCP Registry. **No marketplace publicly documents their related-item algorithm.** All mechanisms below are **inferred** from UI behavior, API responses, and data model analysis. Claims labeled: **measured** (observed in API/UI), **reported** (stated in docs), **inferred** (derived).

---

## 4.1 Documented / Observable Mechanisms by Marketplace

### 4.1.1 VS Code Marketplace

**Observed UI**: "More Extensions" sidebar on detail page; "Similar Extensions" carousel.

**Inferred Signals** (from data model):
| Signal | Weight (Inferred) | Evidence |
|--------|-------------------|----------|
| Shared `categories` | High | Category filter is primary nav |
| Shared `tags`/`keywords` | High | Tag search is explicit facet |
| Same `publisher` | Medium | Publisher profile pages aggregate |
| `activationEvents` overlap | Medium | Technical compatibility signal |
| `contributes` overlap (commands, views, languages) | Low-Medium | Structural similarity |
| Co-install (telemetry) | High (if available) | MS has install telemetry; not exposed via API |
| Dependency/dependent | N/A | Extensions don't depend on each other |

**API**: No public "related" endpoint. `vsce` CLI only supports search.

---

### 4.1.2 npm Registry

**Observed UI**: "Similar packages" on package page (npmjs.com); "Dependents" tab.

**Measured API Signals**:
| Signal | Source | Weight |
|--------|--------|--------|
| `dependents` count + list | `GET /v1/search?q=...` returns `dependentsCount` | High |
| `dependencies` overlap | `package.json` `dependencies`/`peerDependencies` | High |
| `keywords` overlap | `package.json` `keywords` array | Medium |
| `github.com` repo topic overlap | GitHub API topics | Low-Medium |
| Download velocity correlation | `npm view <pkg> --json` time-series | Inferred |
| Same `author`/`maintainer` | `package.json` `author`/`maintainers` | Low |

**Algorithm Inference**: npm's search relevance (default sort) uses: `quality` (0.3) + `maintenance` (0.35) + `popularity` (0.35) — **deprecated Dec 2024**. Current "similar" likely blends dependents graph + keyword Jaccard + download co-occurrence.

---

### 4.1.3 Chrome Web Store

**Observed UI**: "Related" carousel on detail page.

**Inferred Signals** (no public API):
| Signal | Weight (Inferred) |
|--------|-------------------|
| Same `category` | High |
| `permissions` overlap | Medium |
| Same `developer` | Low |
| Co-install (Chrome telemetry) | High (if available) |
| User review text similarity | Low |

---

### 4.1.4 Figma Community

**Observed UI**: "More like this" on plugin/widget/file pages.

**Measured Structure**:
| Signal | Weight (Inferred) |
|--------|-------------------|
| Same `type` (plugin/widget/template) | High (hard filter) |
| Shared `tags` (community tags) | High |
| Same `creator` | Medium |
| File `dependencies` (plugin uses widget) | Medium |
| Community "duplicate" count | Low |

**Evidence**: Figma Community tabs separate by type (measured); tags visible on items (measured).

---

### 4.1.5 Hugging Face Hub (Models/Datasets/Spaces)

**Observed UI**: "Similar models" / "Related spaces" sidebars.

**Measured Structure**:
| Signal | Weight (Inferred) |
|--------|-------------------|
| Same `task` tag (text-generation, image-classification, etc.) | High |
| Same `library` tag (transformers, diffusers, gradio, streamlit) | High |
| `model-index` / `tags` overlap | High |
| Same `author`/`organization` | Medium |
| Architecture similarity (BERT vs RoBERTa) | Medium (inferred from model card) |
| Dataset overlap (model trained on X) | High for models |
| Space `sdk` + `hardware` overlap | Medium for Spaces |

**Evidence**: HF model card metadata (measured); task/library tags (measured); Spaces SDK/hardware (measured).

---

### 4.1.6 Docker Hub

**Observed UI**: "Similar images" on repo page.

**Measured Signals**:
| Signal | Weight (Inferred) |
|--------|-------------------|
| Same `base image` (FROM line) | High |
| Shared `labels` (org.opencontainers.image.*) | Medium |
| Same `architecture`/`OS` variants | High (hard filter) |
| Star/pull correlation | Medium |
| Official image → community variants | High |

**Evidence**: Docker manifest labels (measured); multi-arch (measured); official images program (reported).

---

### 4.1.7 Homebrew

**Observed UI**: "Dependents" / "Dependencies" on formula page; `brew uses` CLI.

**Measured Signals**:
| Signal | Weight (Inferred) |
|--------|-------------------|
| Direct dependency (`depends_on`) | High |
| Reverse dependency (`brew uses --installed`) | High |
| Same `tap` (homebrew/core vs homebrew/cask) | Low |
| `requirements` overlap (macOS version, Xcode) | Low |
| Analytics co-install (30d) | Medium (if opted-in) |

**Evidence**: JSON API `dependencies` + `installed` as dependent (measured); `brew uses` CLI (measured).

---

### 4.1.8 OBS Studio

**Observed UI**: No centralized marketplace; plugins on GitHub/forums.

**Inferred Signals** (from plugin model):
| Signal | Weight (Inferred) |
|--------|-------------------|
| Same `plugin type` (source/output/encoder/filter) | High |
| Shared `dependencies` (FFmpeg, Qt version) | Medium |
| Same `author` | Low |
| Compatible `OBS version` range overlap | High |

---

### 4.1.9 MCP Registry

**Observed UI**: List endpoint only; no related-items API.

**Inferred Signals** (from schema):
| Signal | Weight (Inferred) |
|--------|-------------------|
| Same `protocol` (MCP) | High (hard filter) |
| `capabilities` overlap (tools/resources/prompts) | High |
| `packages.registry_name` overlap (npm/docker) | Medium |
| Same `repository.source` (GitHub) | Low |
| `package_arguments` pattern similarity | Low |

---

## 4.2 Cross-Marketplace Pattern Synthesis

### Universal Signals (Available for All DSH Types)
| Signal | Applicability | Computation |
|--------|---------------|-------------|
| **Tag/Keyword Jaccard** | All types | `intersection(tags_a, tags_b) / union(tags_a, tags_b)` |
| **Category Overlap** | All types | Count shared categories; weight by category specificity |
| **Publisher/Author Overlap** | All types | Binary (same publisher) + publisher reputation score |
| **Recency Correlation** | All types | `exp(-|updatedAt_a - updatedAt_b| / half_life)` |
| **Popularity Correlation** | All types | `log(installs_a) * log(installs_b)` normalized |

### Type-Pair Specific Signals

| Type A | Type B | Signal | Computation |
|--------|--------|--------|-------------|
| Plugin | Plugin | Dependency/Dependent | Direct: A requires B; Reverse: B used by A |
| Plugin | Theme | Capability match | Plugin contributes `themes` → Theme |
| Plugin | Skill/Template | Template generates plugin | Template `targetTool` matches plugin `runtime` |
| SaaS | Bot/MCP | Integration | SaaS `integrations` includes Bot name |
| Bot/MCP | Bot/MCP | Capability composition | Bot A's tools consumed by Bot B's prompts |
| Desktop/CLI | Plugin | Host runtime | Desktop tool provides runtime (e.g., Docker → VS Code Dev Containers) |
| Hosted Site | SaaS | Deployment target | Site `framework` matches SaaS `deploymentModel` |
| Theme | Theme | Base theme inheritance | Theme `baseTheme` matches |

---

## 4.3 Recommended Algorithm for DSH Marketplace

### 4.3.1 Two-Stage Architecture

```
Stage 1: Candidate Generation (Recall) — Fast, approximate
  └─ For item X, retrieve top-K candidates via:
      • Tag Jaccard > 0.3 (inverted index)
      • Category overlap ≥ 2
      • Same publisher
      • Dependency graph neighbors (1-hop)
      • Co-install cluster (if telemetry exists)
      → Union → deduplicate → ~500 candidates

Stage 2: Ranking (Precision) — Rich features, learned/heuristic
  └─ Score each candidate with weighted features:
```

### 4.3.2 Ranking Features & Weights (Heuristic Starting Point)

| Feature | Weight | Type | Notes |
|---------|--------|------|-------|
| `tag_jaccard` | 0.25 | Global | Primary semantic signal |
| `category_overlap` | 0.15 | Global | Normalized by category depth |
| `publisher_match` | 0.10 | Global | Binary × publisher trust score |
| `dependency_edge` | 0.20 | Type-pair | Direct or reverse dependency |
| `capability_overlap` | 0.15 | Plugin/Bot | Jaccard on declared capabilities |
| `co_install_pmi` | 0.10 | Telemetry | Pointwise Mutual Information if available |
| `recency_similarity` | 0.05 | Global | Exponential decay (half-life 180d) |

**Total = 1.0**

### 4.3.3 Telemetry-Enhanced Version (When Data Available)

If platform has install telemetry (VS Code, Chrome, npm via download logs):

```
co_install_pmi(a, b) = log( P(a,b) / (P(a) * P(b)) )
  where P(a) = installs(a) / total_installs
        P(a,b) = co_installs(a,b) / total_installs
```

**Privacy**: Aggregate only; no user-level data. Minimum threshold: 100 co-installs.

### 4.3.4 Cold-Start for New Items

| Strategy | Implementation |
|----------|----------------|
| Content-based only | Tag/category/publisher features (no telemetry) |
| Publisher boost | New items from verified publishers get +0.1 base score |
| Category default | Show category top-rated until 50 installs |
| Explicit "similar to" field | Publisher can declare 3-5 related items on publish |

---

## 4.4 API Design

### 4.4.1 Related Items Endpoint

```
GET /api/v1/marketplace/items/{item_id}/related
  ?limit=10
  &types=plugin,theme,skill    # optional type filter
  &include_telemetry=false     # opt-in for PMI
  &seed=abc123                 # for deterministic shuffle

Response:
{
  "item_id": "vscode-ext-ms-python-python-2026.1.0",
  "related": [
    {
      "item_id": "vscode-ext-ms-python-vscode-pylance-2026.1.0",
      "score": 0.87,
      "signals": {
        "tag_jaccard": 0.82,
        "category_overlap": 1.0,
        "publisher_match": 1.0,
        "dependency_edge": 0.0,
        "capability_overlap": 0.65
      },
      "reason": "Same publisher • Shared tags: python, language, debugging • Both in 'Linters' category"
    },
    ...
  ]
}
```

### 4.4.2 "Because You Installed X" (Personalized)

```
GET /api/v1/marketplace/recommendations/for-user
  ?user_id=... (or session token)
  &limit=20
  &exclude_installed=true

Response: Same format, ranked by:
  • Co-install PMI with user's installed items
  • Category affinity from user's history
  • Publisher affinity
  • Trending in user's categories
```

---

## 4.5 Evaluation Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Click-through Rate (CTR)** | > 5% | Impressions → clicks on related items |
| **Install Conversion** | > 1% | Clicks → successful installs |
| **Diversity (ILD)** | > 0.6 | Intra-list diversity: 1 - mean pairwise similarity |
| **Novelty** | > 30% | % of recommendations not in user's install history |
| **Coverage** | > 80% | % of catalog items appearing in ≥1 recommendation list |

---

## 4.6 Implementation Roadmap

| Phase | Scope | Effort |
|-------|-------|--------|
| **Phase 1** (Launch) | Tag/category/publisher/content-based only. No telemetry. Heuristic weights. | 2 weeks |
| **Phase 2** (Month 2) | Add dependency graph edges (explicit `depends_on` in schemas). | 1 week |
| **Phase 3** (Month 3) | Co-install PMI from anonymized telemetry (opt-in). | 3 weeks |
| **Phase 4** (Month 6) | Learn-to-rank (LambdaMART) on install conversion. | 4 weeks |
| **Phase 5** (Ongoing) | A/B test: personalized vs global; diversity constraints. | Continuous |

---

## 4.7 Gaps & Unknowns

| Gap | Impact | Mitigation |
|-----|--------|------------|
| No public marketplace documents their algorithm | Cannot validate weight assumptions | Start with heuristic; A/B test aggressively |
| Co-install data requires telemetry opt-in | Cold-start for privacy-conscious users | Content-based fallback; publisher/category defaults |
| Cross-type related (Plugin → SaaS) has no ground truth | Hard to evaluate | Manual curation for high-value pairs; measure click-through |
| Tag quality varies (spam, noise) | Jaccard unreliable for noisy tags | TF-IDF weighting; tag quality score from usage |
| Real-time updates needed for trending | Batch recomputation lag | Streaming feature store; daily full recompute + hourly delta |

---

## Sources Index

| # | Source | Type | Retrieval Date |
|---|--------|------|----------------|
| 1 | VS Code Marketplace UI (observed) | Measured | 2026-11-11 |
| 2 | npmjs.com Package Page UI (observed) | Measured | 2026-11-11 |
| 3 | npm Search API / Download Counts | Measured | 2026-11-11 |
| 4 | Chrome Web Store UI (observed) | Measured | 2026-11-11 |
| 5 | Figma Community UI (observed) | Measured | 2026-11-11 |
| 6 | Hugging Face Hub UI (observed) | Measured | 2026-11-11 |
| 7 | Docker Hub UI (observed) | Measured | 2026-11-11 |
| 8 | Homebrew JSON API / `brew uses` | Measured | 2026-11-11 |
| 9 | OBS Plugin Model (API docs) | Measured | 2026-11-11 |
| 10 | MCP Registry API Spec | Measured | 2026-11-11 |
| 11 | Socket.dev Blog: npm Scores Deprecated | Industry blog | 2026-11-11 |
| 12 | ITNEXT: Increasing NPM Package Search Score (2018) | Historical blog | 2026-11-11 |

**Note**: All algorithm weights are **inferred** — no marketplace publishes their related-item ranking function. The recommended algorithm is a synthesis of observable signals, not a copy of any production system.