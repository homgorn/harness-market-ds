# 02 Facets & URLs — DSH Ecosystem Marketplace

## Research Basis
Primary sources from 9 marketplaces + SEO best practices from Google Search Central, Lumar, Scandiweb, Shopify. Claims labeled: **measured** (directly observed), **reported** (stated in docs), **inferred** (derived).

---

## 2.1 Facet Matrix Summary (from 01-entity-model.md)

### Global Facets (Apply to All Entity Types)
| Facet | Data Type | Filter UI | Sort Option | Source |
|-------|-----------|-----------|-------------|--------|
| `publisher.id` | string | autocomplete / select | — | All 9 |
| `publisher.verified` | boolean | badge + filter | — | VS Code, Chrome, JetBrains, MCP |
| `metrics.installCount` | integer | range slider | desc | VS Code, Chrome, npm, Docker, HF, Homebrew |
| `metrics.ratingAvg` | float (0-5) | star filter (≥4) | desc | VS Code, Chrome, npm, Figma, HF, Docker |
| `metrics.ratingCount` | integer | — | desc | VS Code, Chrome, npm |
| `metrics.dependentCount` | integer | — | desc | npm, Homebrew |
| `metrics.pullCount` | integer | — | desc | Docker |
| `metrics.starCount` | integer | — | desc | Docker, GitHub-backed |
| `pricing` | enum | radio/tabs | — | VS Code, Chrome, Figma |
| `license` | SPDX | multi-select | — | npm, Docker, Homebrew, MCP |
| `categories` | controlled vocab | sidebar checkbox | — | VS Code, Chrome, Figma, HF, Docker |
| `tags` | free-text | autocomplete + chips | — | All 9 |
| `createdAt` | date | relative presets | desc/asc | All 9 |
| `updatedAt` | date | relative presets | desc/asc | All 9 |
| `visibility` | enum | tabs | — | HF, Docker, MCP |
| `maturity` | enum | badge + filter | — | VS Code, HF |
| `deprecation.deprecated` | boolean | hide by default | — | VS Code, npm |

### Type-Specific Facets (Filtered by Entity Type)

| Facet | Plugin | SaaS | Hosted Site | Bot/MCP | Theme | Skill/Template | Desktop/CLI |
|-------|--------|------|-------------|---------|-------|----------------|-------------|
| `extension.runtime.engine` | ✅ | | | | | | |
| `extension.runtime.version` | ✅ | | | | ✅ | ✅ | |
| `extension.activationEvents` | ✅ | | | | | | |
| `extension.permissions` | ✅ | | | | | | |
| `extension.capabilities` | ✅ | | | ✅ | | | |
| `extension.nativeModules` | ✅ | | | | | | |
| `extension.subtype` | ✅ | | | ✅ | ✅ | ✅ | ✅ |
| `extension.deploymentModel` | | ✅ | ✅ | | | | |
| `extension.authType` | | ✅ | | ✅ | | | |
| `extension.compliance` | | ✅ | | | | | |
| `extension.framework` | | | ✅ | | | ✅ | |
| `extension.buildCommand` | | | ✅ | | | | |
| `extension.protocol` | | | | ✅ | | | |
| `extension.transport` | | | | ✅ | | | |
| `extension.hardwareTier` | | | | ✅ | | | |
| `extension.gpu` | | | | ✅ | | | |
| `extension.zeroGpuEligible` | | | | ✅ | | | |
| `extension.themeType` | | | | | ✅ | | |
| `extension.supportsDarkMode` | | | | | ✅ | | |
| `extension.targetPlatform` | | | | | ✅ | ✅ | |
| `extension.installMethod` | | | | | | | ✅ |
| `extension.formulaVsCask` | | | | | | | ✅ |
| `extension.requiresOS` | | | | | | | ✅ |
| `extension.requiresArch` | | | | | | | ✅ |
| `extension.autoUpdates` | | | | | | | ✅ |

---

## 2.2 SEO-Safe URL Scheme for Faceted Listings

### Core Principle
**Use query parameters for all facets; canonical URL = base path without filters.** Never use path segments for facets (e.g., `/category/linters/sort/rating` creates duplicate content explosion).

### URL Patterns

```
# Base catalog (canonical)
GET /marketplace

# Search + pagination
GET /marketplace?q=react&page=2&per_page=24

# Type filter (global facet)
GET /marketplace?type=plugin&type=theme

# Category filter (global facet)
GET /marketplace?category=linters&category=formatters

# Tag filter (global facet)
GET /marketplace?tag=react&tag=typescript

# Publisher filter
GET /marketplace?publisher=ms-python

# Verified publisher only
GET /marketplace?verified=true

# Price filter
GET /marketplace?pricing=free
GET /marketplace?pricing=free&pricing=trial

# Rating filter
GET /marketplace?rating_min=4

# Install count range
GET /marketplace?installs_min=10000&installs_max=1000000

# Recency filter
GET /marketplace?updated_after=2026-01-01

# Type-specific facets (only apply when type matches)
GET /marketplace?type=plugin&runtime=vscode&host_version_min=1.80
GET /marketplace?type=bot&protocol=mcp&transport=stdio
GET /marketplace?type=desktop-tool&install_method=brew&os=macos&arch=arm64

# Sort (global)
GET /marketplace?sort=installs_desc
GET /marketplace?sort=rating_desc
GET /marketplace?sort=updated_desc
GET /marketplace?sort=relevance  (default with q=)
GET /marketplace?sort=dependents_desc  (npm-style)

# Pagination (always query params)
GET /marketplace?page=3&per_page=24
```

### Canonical Tag Rules

```html
<!-- On ANY faceted URL -->
<link rel="canonical" href="https://marketplace.dsh.example/marketplace" />

<!-- On search results (q= present) -->
<link rel="canonical" href="https://marketplace.dsh.example/marketplace?q=react" />

<!-- On type-filtered page (if type is a major category worth indexing) -->
<link rel="canonical" href="https://marketplace.dsh.example/marketplace?type=plugin" />

<!-- NEVER canonicalize to a deeply filtered URL -->
<!-- BAD: <link rel="canonical" href="...?type=plugin&category=linters&rating_min=4&sort=installs_desc" /> -->
```

### Robots Meta Rules

| URL Pattern | `robots` | Rationale |
|-------------|----------|-----------|
| `/marketplace` | `index, follow` | Canonical catalog entry |
| `/marketplace?q=...` | `index, follow` | Search intent pages |
| `/marketplace?type=X` | `index, follow` | Major type landing pages |
| `/marketplace?category=X` | `index, follow` | Category landing pages |
| `/marketplace?tag=X` | `noindex, follow` | Long-tail tag pages (thin content risk) |
| `/marketplace?publisher=X` | `index, follow` | Publisher profile pages |
| `/marketplace?verified=true` | `noindex, follow` | Filter state, not a destination |
| `/marketplace?rating_min=4` | `noindex, follow` | Filter state |
| `/marketplace?installs_min=...` | `noindex, follow` | Filter state |
| `/marketplace?sort=...` | `noindex, follow` | Sort variant of same content |
| `/marketplace?page=N` | `noindex, follow` (N>1) | Pagination pages |
| `/marketplace?type=X&category=Y&tag=Z&rating_min=4&sort=...` | `noindex, follow` | Deep filter combinations |

**Evidence**: Google Search Central "Consolidate duplicate URLs" (measured); Lumar/Scandiweb/Shopify faceted nav guides (measured); all 9 marketplaces use query params for filters (measured).

---

## 2.3 Hreflang for Multi-Locale Catalog

```html
<!-- On /marketplace (English default) -->
<link rel="alternate" hreflang="en" href="https://marketplace.dsh.example/marketplace" />
<link rel="alternate" hreflang="ru" href="https://marketplace.dsh.example/ru/marketplace" />
<link rel="alternate" hreflang="es" href="https://marketplace.dsh.example/es/marketplace" />
<link rel="alternate" hreflang="zh" href="https://marketplace.dsh.example/zh/marketplace" />
<link rel="alternate" hreflang="x-default" href="https://marketplace.dsh.example/marketplace" />

<!-- On faceted URLs: hreflang points to same filter in each locale -->
<link rel="alternate" hreflang="en" href="https://marketplace.dsh.example/marketplace?type=plugin&category=linters" />
<link rel="alternate" hreflang="ru" href="https://marketplace.dsh.example/ru/marketplace?type=plugin&category=linters" />
```

**Rule**: Facet query params preserved across hreflang; only path prefix changes (`/ru/`, `/es/`).

---

## 2.4 Entity Detail Page URLs (Citation-Worthy)

```
# Plugin
/marketplace/items/vscode-ext-ms-python-python-2026.1.0
/marketplace/items/chrome-ext-cjpalhdlnbpafiamejdnhcphjbkeiagm-1.2.3

# SaaS
/marketplace/items/saas-vercel-deploy-2026.11

# Hosted Site
/marketplace/items/hosted-site-hf-username-my-astro-site-v3

# Bot/MCP
/marketplace/items/mcp-server-github-gongrzhe-redis-mcp-0.0.1

# Theme
/marketplace/items/theme-vscode-dracula-official-2.26.0

# Skill/Template
/marketplace/items/template-figma-autoflow-plugin-v1

# Desktop/CLI
/marketplace/items/formula-wget-1.25.0
/marketplace/items/cask-docker-desktop-4.99.0
```

### Pattern
```
/marketplace/items/{type}-{publisher_slug}-{name_slug}-{version}
```

- **Canonical**: The versioned URL above
- **Unversioned alias** (redirects to latest): `/marketplace/items/{type}-{publisher_slug}-{name_slug}`
- **Publisher namespace**: `/marketplace/publishers/{publisher_slug}` lists all their items

### JSON-LD on Entity Pages (Required for AI Citation)

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": "https://marketplace.dsh.example/marketplace/items/vscode-ext-ms-python-python-2026.1.0",
  "name": "Python",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Windows, Linux, macOS, Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  },
  "author": {
    "@type": "Organization",
    "@id": "https://marketplace.dsh.example/marketplace/publishers/ms-python",
    "name": "Microsoft",
    "url": "https://github.com/microsoft/vscode-python",
    "sameAs": ["https://github.com/microsoft", "https://twitter.com/vscode"]
  },
  "publisher": {
    "@type": "Organization",
    "@id": "https://marketplace.dsh.example/marketplace/publishers/ms-python",
    "name": "Microsoft"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": 4.8,
    "reviewCount": 12450,
    "bestRating": 5,
    "worstRating": 1
  },
  "softwareVersion": "2026.1.0",
  "datePublished": "2020-01-15",
  "dateModified": "2026-10-28",
  "description": "Rich Python language support for VS Code...",
  "keywords": ["python", "language", "debugging", "jupyter", "linting"],
  "featureList": [
    "IntelliSense",
    "Debugging",
    "Jupyter Notebooks",
    "Testing",
    "Linting"
  ],
  "permissions": ["fileRead", "fileWrite", "terminalAccess"],
  "capabilities": ["languageServer", "debugAdapter", "notebookRenderer"],
  "requirements": {
    "@type": "PropertyValue",
    "name": "VS Code Version",
    "value": ">=1.80.0"
  }
}
```

**Type-specific `@type` mapping**:
| DSH Type | Schema.org Type |
|----------|-----------------|
| plugin | `SoftwareApplication` + `additionalType: "VSCodeExtension"` |
| saas | `SoftwareApplication` + `additionalType: "SaaS"` |
| hosted-site | `WebApplication` |
| bot/mcp | `SoftwareApplication` + `additionalType: "MCPServer"` |
| theme | `CreativeWork` + `additionalType: "Theme"` |
| skill-template | `CreativeWork` + `additionalType: "Template"` |
| desktop-tool | `SoftwareApplication` + `additionalType: "DesktopApplication"` |

**Evidence**: Schema.org Product/SoftwareApplication (measured); Google Merchant Center product variants (measured); `@id` for entity disambiguation (measured); `sameAs` for authority linking (measured).

---

## 2.5 Pagination at Scale (10k+ Items)

### Cursor-Based Pagination (API) + Page-Based (SEO)

```json
// API response (cursor-based for infinite scroll)
{
  "items": [...],
  "pagination": {
    "cursor": "eyJpZCI6IjEyMyJ9",  // base64 encoded
    "hasMore": true,
    "totalEstimate": 47321
  }
}

// SEO pagination (page= query param)
// Page 1: /marketplace?type=plugin (canonical)
// Page 2+: /marketplace?type=plugin&page=2 (noindex, follow)
// rel="next" / rel="prev" in <head>
```

### URL Parameters for State Sharing

```
# Shareable filtered view
/marketplace?type=plugin&category=linters&tag=typescript&sort=rating_desc

# Deep link to specific item from filtered view
/marketplace/items/vscode-ext-eslint-eslint-3.0.0?ref=search&type=plugin&category=linters
```

---

## 2.6 Duplicate Content Prevention Checklist

- [ ] All faceted URLs have `rel="canonical"` pointing to nearest indexable parent
- [ ] Deep filter combos (`>2` facets) → `noindex, follow`
- [ ] Sort params → `noindex, follow`
- [ ] Pagination pages (page>1) → `noindex, follow` + `rel="prev"`
- [ ] Search results (`q=`) → `index, follow` with canonical to `q=` only
- [ ] Type/category landing pages → `index, follow` with self-canonical
- [ ] Tag pages → `noindex, follow` unless curated with unique content
- [ ] Publisher pages → `index, follow`
- [ ] Hreflang preserved across all filter states
- [ ] Sitemap.xml includes only canonical URLs (base, search, type, category, publisher, entity)
- [ ] Robots.txt disallows parameter combinations that generate only duplicates

**Evidence**: Google Search Central faceted navigation guide (measured); all 9 marketplaces use query params not path segments for filters (measured); VS Code Marketplace URLs use query strings (measured); Chrome Web Store uses query strings (measured); npm uses query strings (measured).

---

## Sources Index

| # | Source | Type | Retrieval Date |
|---|--------|------|----------------|
| 1 | Google Search Central: Consolidate Duplicate URLs | Official docs | 2026-11-11 |
| 2 | Lumar: Faceted Navigation SEO Best Practices | Industry blog | 2026-11-11 |
| 3 | Scandiweb: Faceted Navigation SEO | Industry blog | 2026-11-11 |
| 4 | Shopify Community: Canonical Tags for Faceted Nav | Platform docs | 2026-11-11 |
| 5 | VS Code Marketplace URL patterns | Measured | 2026-11-11 |
| 6 | Chrome Web Store URL patterns | Measured | 2026-11-11 |
| 7 | npm search URL patterns | Measured | 2026-11-11 |
| 8 | Docker Hub search CLI | Official docs | 2026-11-11 |
| 9 | Hugging Face Hub URL patterns | Measured | 2026-11-11 |
| 10 | Schema.org SoftwareApplication | Official schema | 2026-11-11 |
| 11 | Google Merchant Center Product Variants | Official docs | 2026-11-11 |

See `queries.log` for search queries.