# Research Plan: DSH Ecosystem Marketplace UX & Data Model

## Scope
Design-grade research on unified marketplace cataloging heterogeneous entities: plugins, SaaS products, hosted sites, services, bots, themes, skills, desktop apps.

## Decision Being Informed
Architecture of entity model, faceted navigation, trust signals, related-item algorithms, SEO-safe URL patterns, and knowledge-graph integration for a multi-entity marketplace.

## Falsifiable Hypotheses
1. **H1**: Successful multi-entity marketplaces use a *shared base schema + type-specific extension* pattern (not lowest-common-denominator)
2. **H2**: Global facets (price, rating, publisher) + type-specific facets (runtime, language, platform) is the dominant pattern
3. **H3**: Trust signals are layered: platform-level (malware scan, publisher verification) + entity-type-specific (permissions, capabilities)
4. **H4**: Related-item computation combines explicit tags, implicit co-install/co-view data, and dependency graphs
5. **H5**: SEO-safe faceted URLs use query parameters with canonical tags, not path segments, to avoid duplicate content explosion
6. **H6**: Schema.org Product/Offer + type-specific extensions + JSON-LD entity linking is the citation-worthy standard

## Report Genre
Landscape + Decision: comparative analysis of 9+ marketplaces with concrete design recommendations.

## Building Blocks
- Entity model comparison table (sources: 9 marketplaces)
- Facet matrix: global vs type-specific per marketplace
- Trust signal inventory with presentation patterns
- Related-item algorithm mechanisms (documented + inferred)
- URL pattern analysis with canonical/hreflang handling
- Knowledge-graph / schema.org adoption audit

## Sourcing Strategy
Primary sources only:
- Official documentation (VS Code Marketplace API, Chrome Web Store Developer Docs, etc.)
- Engineering blog posts from platform teams
- API specifications (OpenAPI, GraphQL schemas)
- Public GitHub repos for marketplace frontends
- Web archive for UI pattern verification

Channels: websearch, webfetch, direct API docs

## Opposition Queries
- "Why lowest-common-denominator schema works better"
- "Faceted navigation path segments SEO benefits"
- "Trust signals that failed / were removed"
- "Related items via pure collaborative filtering without tags"

## Risk Register
| Risk | Mitigation |
|------|------------|
| Incomplete API docs for proprietary marketplaces | Use engineering blogs, third-party API wrappers, web archive |
| Conflicting patterns across marketplaces | Triangulate ≥3 sources per claim; note divergence |
| Stale documentation | Filter by date; prefer 2023+ sources; note retrieval date |
| SEO advice from non-Google sources | Cross-reference with Google Search Central docs |

## Stop Criteria
- ≥3 independent sources per major thesis
- All 6 research questions addressed with concrete examples
- Deliverables written to specified paths
- queries.log and data/ populated

## Changelog
- 2026-11-11: Plan created, research initiated