# 01 Entity Model — DSH Ecosystem Marketplace

## Research Basis
Primary sources from 9 marketplaces (see `data/` and `queries.log`). Claims labeled: **measured** (directly observed in source), **reported** (stated in official docs), **inferred** (derived from UI behavior or secondary analysis).

---

## 1.1 Shared Base Schema (All Entity Types)

| Field | Type | Required | Source | Notes |
|-------|------|----------|--------|-------|
| `id` | string (UUID or namespaced) | ✅ | All 9 | npm: `name`+`version`; VS Code: `publisher.extension`; Docker: `owner/repo:tag`; HF: `author/space`; Homebrew: `token`; MCP: UUID |
| `name` | string | ✅ | All 9 | Display name; max 75 chars (Chrome) to 214 (npm) |
| `displayName` | string | optional | VS Code, Figma, HF | Localized via i18n keys |
| `description` | string | ✅ | All 9 | Max 132 (Chrome) to unlimited; supports Markdown |
| `shortDescription` | string | optional | Chrome, HF | 132 char limit (Chrome) |
| `version` | semver string | ✅ | All 9 | npm/VS Code/Homebrew enforce semver; Docker uses tags |
| `publisher` | object | ✅ | All 9 | `{ id, displayName, verified: bool, domain?, url? }` |
| `license` | SPDX identifier | optional | npm, Docker, Homebrew, MCP | npm: SPDX expression; Docker: license in manifest labels |
| `repository` | object | optional | VS Code, npm, HF, MCP, Figma | `{ url, type: git/github/gitlab, directory? }` |
| `homepage` | URL | optional | npm, Chrome, HF, Homebrew | |
| `icon` | URL | optional | VS Code, Chrome, Figma, HF | VS Code: ≥128×128 PNG; Chrome: 16/32/48/128 |
| `banner` | URL | optional | VS Code | `galleryBanner.color` + image |
| `tags` / `keywords` | string[] | optional | All 9 | VS Code: max 30; npm: unlimited; HF: task tags |
| `categories` | enum[] | optional | VS Code, Chrome, Figma, HF, Docker | Controlled vocabularies per platform |
| `createdAt` | ISO8601 | ✅ | All 9 | |
| `updatedAt` | ISO8601 | ✅ | All 9 | |
| `metrics` | object | reported | VS Code, Chrome, npm, Docker, HF, Homebrew | `{ installCount, ratingCount, ratingAvg, dependentCount, pullCount, starCount }` |
| `pricing` | enum | optional | VS Code, Chrome, Figma | `Free` | `Trial` | `Paid` | `Freemium` |
| `visibility` | enum | ✅ | HF, Docker, MCP | `public` | `private` | `protected` |
| `deprecation` | object | optional | VS Code, npm | `{ deprecated: bool, reason?, replacementId?, date? }` |
| `platforms` | string[] | optional | VS Code, Docker, Homebrew, OBS | `win32-x64`, `linux-arm64`, `darwin-arm64`, `web`, `universal` |
| `maturity` | enum | inferred | VS Code, HF | `alpha` | `beta` | `stable` | `deprecated` |

**Evidence**: VS Code Extension Manifest (measured); Chrome Manifest V3 keys (measured); npm package.json fields (measured); HF Spaces metadata (measured); Docker manifest labels (measured); Homebrew API JSON (measured); OBS plugin info struct (measured); MCP Registry server schema (measured).

---

## 1.2 Type-Specific Extension Schemas

### 1.2.1 Plugin / Extension (VS Code, Chrome, Figma, JetBrains, OBS)

| Field | Type | Required | Source | Notes |
|-------|------|----------|--------|-------|
| `type` | enum | ✅ | All | `plugin` |
| `subtype` | enum | ✅ | VS Code, Figma, OBS | VS Code: `extension`; Figma: `plugin` \| `widget`; OBS: `source` \| `output` \| `encoder` \| `service` \| `filter` \| `transition` |
| `runtime` | object | ✅ | VS Code, Chrome, Figma | `{ engine: "vscode"\|"chrome"\|"figma", version: "^1.80.0", platform?: string[] }` |
| `activationEvents` | string[] | VS Code | VS Code | `onCommand:*`, `onLanguage:*`, `workspaceContains:*` |
| `contributes` | object | VS Code | VS Code | Contribution points: commands, views, languages, themes, etc. |
| `permissions` | string[] | ✅ | Chrome, Figma | Chrome MV3: `permissions`, `host_permissions`, `optional_permissions` |
| `capabilities` | string[] | Figma, OBS | Figma widget API; OBS `obs_source_info.output_flags` |
| `entryPoint` | string | ✅ | All | Main script / service worker / binary |
| `configurationSchema` | JSONSchema | optional | VS Code, Chrome | Settings UI definition |
| `minimumHostVersion` | string | ✅ | VS Code, Chrome, OBS | `engines.vscode`, `minimum_chrome_version`, OBS version |
| `nativeModules` | boolean | VS Code, OBS | VS Code platform-specific VSIX; OBS native plugins |
| `apiVersion` | string | Figma, OBS | Figma plugin API version; OBS plugin API version |

**Evidence**: VS Code Extension Manifest reference (measured); Chrome Manifest V3 keys (measured); Figma plugin/widget configuration (measured); OBS `obs_source_info` struct (measured).

---

### 1.2.2 SaaS Product / Hosted Service

| Field | Type | Required | Source | Notes |
|-------|------|----------|--------|-------|
| `type` | enum | ✅ | inferred | `saas` |
| `subtype` | enum | ✅ | inferred | `web-app` \| `api` \| `integration` \| `platform` |
| `deploymentModel` | enum | ✅ | HF, Docker | `hosted` \| `self-hosted` \| `hybrid` |
| `authentication` | object | optional | MCP, HF | `{ type: "oauth2"\|"api-key"\|"none", scopes?: string[], providerUrl? }` |
| `apiSpec` | object | optional | MCP | `{ format: "openapi"\|"graphql"\|"mcp", url?, version? }` |
| `pricingModel` | object | ✅ | VS Code, Chrome | `{ type: "free"\|"freemium"\|"subscription"\|"usage-based"\|"per-seat", tiers?: Tier[], currency: "USD" }` |
| `sla` | object | optional | inferred | `{ uptime: "99.9%", supportTier: "community"\|"business"\|"enterprise", responseTime? }` |
| `dataResidency` | string[] | optional | inferred | `["US", "EU", "APAC"]` |
| `compliance` | string[] | optional | inferred | `["SOC2", "GDPR", "HIPAA", "ISO27001"]` |
| `integrations` | string[] | optional | MCP, Figma | List of connected services/platforms |

**Evidence**: HF Spaces OAuth + secrets (measured); MCP Registry packages + env vars (measured); VS Code pricing label (measured); Docker Hub official images (measured).

---

### 1.2.3 Hosted Site / Static App (HF Static Spaces, Docker static, Netlify/Vercel-style)

| Field | Type | Required | Source | Notes |
|-------|------|----------|--------|-------|
| `type` | enum | ✅ | inferred | `hosted-site` |
| `subtype` | enum | ✅ | HF | `static` \| `spa` \| `ssr` \| `edge` |
| `framework` | string | optional | HF | `nextjs`, `astro`, `vite`, `hugo`, `jekyll` |
| `buildCommand` | string | optional | HF, Docker | `npm run build`, `hugo` |
| `outputDirectory` | string | optional | HF | `dist`, `public`, `out` |
| `customDomain` | boolean | optional | HF | Custom domain support |
| `edgeRuntime` | boolean | optional | inferred | Edge function support |
| `cdn` | object | optional | inferred | `{ provider: "cloudflare"\|"vercel"\|"netlify", regions?: string[] }` |

**Evidence**: HF Static Spaces SDK (measured); Docker static HTML SDK (measured).

---

### 1.2.4 Bot / AI Agent / MCP Server

| Field | Type | Required | Source | Notes |
|-------|------|----------|--------|-------|
| `type` | enum | ✅ | MCP, HF | `bot` \| `mcp-server` \| `ai-agent` |
| `subtype` | enum | ✅ | MCP | `mcp-server` \| `chatbot` \| `workflow-agent` \| `voice-agent` |
| `protocol` | enum | ✅ | MCP | `mcp` \| `a2a` \| `custom` |
| `transport` | enum | ✅ | MCP | `stdio` \| `sse` \| `websocket` \| `http` |
| `capabilities` | string[] | ✅ | MCP | `["tools", "resources", "prompts", "sampling", "roots"]` |
| `tools` | object[] | optional | MCP | `{ name, description, inputSchema }` |
| `resources` | object[] | optional | MCP | `{ uri, name, description, mimeType }` |
| `prompts` | object[] | optional | MCP | `{ name, description, arguments }` |
| `runtime` | object | ✅ | MCP, HF | `{ type: "docker"\|"npm"\|"python"\|"binary", image?, command?, args?, env? }` |
| `packageArguments` | object[] | MCP | MCP | Positional/named args with hints, defaults, required |
| `environmentVariables` | object[] | MCP, HF | MCP + HF | Secrets vs variables distinction |
| `hardwareRequirements` | object | optional | HF | `{ cpu: "2 vCPU", memory: "16GB", gpu?: "T4"\|"A10G"\|"A100", accelerator?: string }` |
| `zeroGpuEligible` | boolean | HF | HF | Free tier for personal accounts |

**Evidence**: MCP Registry server schema with packages, runtime, capabilities (measured); HF Spaces hardware + secrets (measured).

---

### 1.2.5 Theme / Design System / UI Kit

| Field | Type | Required | Source | Notes |
|-------|------|----------|--------|-------|
| `type` | enum | ✅ | VS Code, Figma, Chrome | `theme` |
| `subtype` | enum | ✅ | VS Code, Figma, Chrome | `color-theme` \| `file-icon-theme` \| `product-icon-theme` \| `ui-kit` \| `design-system` \| `component-library` |
| `targetPlatform` | string[] | ✅ | VS Code, Figma, Chrome | `["vscode"]`, `["figma"]`, `["chrome"]`, `["web"]` |
| `themeData` | object | ✅ | VS Code | VS Code: `colors`, `tokenColors`, `semanticHighlighting`; Figma: variables, styles, components |
| `supportsDarkMode` | boolean | VS Code, Figma | VS Code: separate dark/light variants |
| `supportsHighContrast` | boolean | VS Code | VS Code: `hcBlack`, `hcLight` variants |
| `baseTheme` | enum | VS Code | VS Code: `vs`, `vs-dark`, `hc-black` |

**Evidence**: VS Code theme contribution points (measured); Figma design tokens/variables (measured); Chrome theme manifest (measured).

---

### 1.2.6 Skill / Template / Workflow (Figma templates, HF Spaces templates, n8n/OpenClaw workflows)

| Field | Type | Required | Source | Notes |
|-------|------|----------|--------|-------|
| `type` | enum | ✅ | Figma, HF, n8n | `skill` \| `template` \| `workflow` |
| `subtype` | enum | ✅ | Figma, HF | `file-template` \| `plugin-template` \| `widget-template` \| `space-template` \| `workflow-template` |
| `targetTool` | string | ✅ | Figma, HF, n8n | `figma`, `vscode`, `n8n`, `opencode`, `claude` |
| `parameters` | object[] | optional | Figma, n8n | Template parameters with types, defaults, validation |
| `variables` | object | optional | Figma | Design system variables (colors, spacing, typography) |
| `instructions` | string | optional | all | Markdown usage instructions |

**Evidence**: Figma Community file types + template parameters (measured); HF Space duplication with variable overrides (measured).

---

### 1.2.7 Desktop App / CLI Tool / Binary (Homebrew cask/formula, Docker Desktop, OBS)

| Field | Type | Required | Source | Notes |
|-------|------|----------|--------|-------|
| `type` | enum | ✅ | Homebrew, Docker, OBS | `desktop-app` \| `cli-tool` \| `binary` |
| `subtype` | enum | ✅ | Homebrew | `formula` (source-build) \| `cask` (prebuilt binary) |
| `installMethod` | enum | ✅ | Homebrew, Docker | `brew` \| `docker` \| `installer` \| `portable` \| `app-store` |
| `artifacts` | object[] | ✅ | Homebrew cask | `{ type: "app"\|"binary"\|"service"\|"font"\|"plugin"\|"zap", target?, source?, uninstall? }` |
| `dependencies` | string[] | Homebrew formula | Homebrew | Build + runtime dependencies |
| `conflictsWith` | string[] | Homebrew | Homebrew | Mutually exclusive packages |
| `caveats` | string | Homebrew | Homebrew | Post-install notes |
| `service` | object | optional | Homebrew | `{ run: "brew services start x", runType: "launchd"\|"systemd" }` |
| `autoUpdates` | boolean | Homebrew cask | Homebrew | `auto_updates: true` |
| `requiresArch` | string[] | Homebrew, Docker | Homebrew variations; Docker manifest platforms |
| `requiresOS` | string[] | Homebrew, Docker | Homebrew `depends_on.macos`; Docker `os/arch` |
| `checksum` | string | Homebrew, Docker | SHA256 for source/binary verification |

**Evidence**: Homebrew formula/cask JSON API (measured); Docker manifest multi-arch (measured); OBS plugin binary distribution (measured).

---

## 1.3 Facet Matrix: Global vs Type-Specific

| Facet | Global (all types) | Plugin | SaaS | Hosted Site | Bot/MCP | Theme | Skill/Template | Desktop/CLI |
|-------|-------------------|--------|------|-------------|---------|-------|----------------|-------------|
| **publisher** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **verifiedPublisher** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **rating** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **installCount** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **dependentCount** | ✅ | ✅ | | | | | | ✅ |
| **price** | ✅ | ✅ | ✅ | | | ✅ | | |
| **pricingModel** | | | ✅ | | | ✅ | | |
| **license** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **category** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **tags/keywords** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **recency** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **platform/OS** | | ✅ | | ✅ | ✅ | ✅ | ✅ | ✅ |
| **architecture** | | ✅ | | | ✅ | | | ✅ |
| **runtime/SDK** | | ✅ | | ✅ | ✅ | | ✅ | |
| **hostVersion** | | ✅ | | | | ✅ | ✅ | |
| **permissions** | | ✅ | | | | | | |
| **capabilities** | | ✅ | | | ✅ | | | |
| **hardwareTier** | | | | | ✅ | | | |
| **gpu** | | | | | ✅ | | | |
| **framework** | | | | ✅ | | | ✅ | |
| **protocol** | | | | | ✅ | | | |
| **deploymentModel** | | | ✅ | ✅ | | | | |
| **authType** | | | ✅ | | ✅ | | | |
| **compliance** | | | ✅ | | | | | |
| **themeType** | | | | | | ✅ | | |
| **targetPlatform** | | | | | | ✅ | ✅ | |
| **installMethod** | | | | | | | | ✅ |
| **formulaVsCask** | | | | | | | | ✅ |

**Evidence**: VS Code Marketplace filters (reported: category, tag, publisher, rating, installs); Chrome Web Store filters (reported: category, item type, features, ratings); npm search sorts (reported: relevance, downloads, dependents, maintenance, quality); Figma Community tabs (measured: Files, Plugins, Widgets, Creators); HF Spaces filters (reported: SDK, hardware, tags); Docker Hub filters (reported: stars, architecture, OS); Homebrew analytics (reported: install_on_request, 30/90/365d).

---

## 1.4 DSH Entity Type Taxonomy (Proposed)

```
EntityType (discriminator: type)
├── plugin
│   ├── vscode-extension
│   ├── chrome-extension
│   ├── figma-plugin
│   ├── figma-widget
│   ├── jetbrains-plugin
│   ├── obs-plugin (source/output/encoder/service/filter/transition)
│   └── generic-plugin
├── saas
│   ├── web-app
│   ├── api-service
│   ├── integration
│   └── platform
├── hosted-site
│   ├── static-site
│   ├── spa
│   ├── ssr-app
│   └── edge-app
├── bot
│   ├── mcp-server
│   ├── chatbot
│   ├── workflow-agent
│   └── voice-agent
├── theme
│   ├── color-theme
│   ├── icon-theme
│   ├── ui-kit
│   ├── design-system
│   └── component-library
├── skill-template
│   ├── file-template
│   ├── plugin-template
│   ├── workflow-template
│   └── space-template
└── desktop-tool
    ├── formula (source-build)
    ├── cask (prebuilt)
    ├── docker-image
    ├── installer
    └── portable-binary
```

**Inferred** from cross-marketplace pattern analysis. Each leaf type gets its own extension schema (Section 1.2) while sharing the base schema (Section 1.1).

---

## 1.5 Schema Implementation Recommendation

```typescript
// Base interface all entities share
interface MarketplaceEntity {
  id: string;
  type: EntityType;
  name: string;
  displayName?: string;
  description: string;
  shortDescription?: string;
  version: string;
  publisher: Publisher;
  license?: string;
  repository?: Repository;
  homepage?: string;
  icon?: string;
  banner?: string;
  tags: string[];
  categories: string[];
  createdAt: string;
  updatedAt: string;
  metrics: EntityMetrics;
  pricing?: PricingLabel;
  visibility: Visibility;
  deprecation?: DeprecationInfo;
  platforms?: string[];
  maturity?: MaturityLevel;
  // Type-specific extension (one of):
  extension: PluginExtension | SaaSExtension | HostedSiteExtension 
           | BotExtension | ThemeExtension | SkillTemplateExtension 
           | DesktopToolExtension;
}
```

**Inferred**: This discriminated union pattern is used by HF (models/datasets/spaces), Docker (images/manifests), Homebrew (formula/cask), MCP (servers), and VS Code (extensions/themes).

---

## Sources Index

| # | Source | Type | Retrieval Date |
|---|--------|------|----------------|
| 1 | VS Code Extension Manifest Reference | Official docs | 2026-11-11 |
| 2 | Chrome Manifest V3 Documentation | Official docs | 2026-11-11 |
| 3 | npm package.json Documentation | Official docs | 2026-11-11 |
| 4 | Figma Community / Plugin Config | Official site | 2026-11-11 |
| 5 | Hugging Face Spaces Overview | Official docs | 2026-11-11 |
| 6 | Docker Registry HTTP API V2 | Official API docs | 2026-11-11 |
| 7 | Homebrew JSON API Documentation | Official API docs | 2026-11-11 |
| 8 | OBS Studio Plugin API Reference | Official docs | 2026-11-11 |
| 9 | MCP Registry (mozilla-ai fork) | GitHub repo | 2026-11-11 |
| 10 | VS Code Marketplace Publishing Guide | Official docs | 2026-11-11 |
| 11 | Chrome Web Store Review Process | Official docs | 2026-11-11 |
| 12 | JetBrains Marketplace Approval Guidelines | Official docs | 2026-11-11 |
| 13 | npm Audit Documentation | Official docs | 2026-11-11 |
| 14 | Docker Hub Search Filters | Official CLI docs | 2026-11-11 |
| 15 | Homebrew Formula/Cask Cookbooks | Official docs | 2026-11-11 |

See `data/01-09_*.md` for raw fetches, `queries.log` for search queries.