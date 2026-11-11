# 03 Trust & Security Signals — DSH Ecosystem Marketplace

## Research Basis
Primary sources: VS Code Marketplace docs, Chrome Web Store review process, npm audit/security, JetBrains Marketplace guidelines, Docker Hub official images, Homebrew verification, Hugging Face secrets scanning, MCP Registry. Claims labeled: **measured** (observed in source), **reported** (stated in docs), **inferred** (derived).

---

## 3.1 Trust Signal Taxonomy

### Layer 1: Platform-Level Guarantees (Applied by Marketplace Operator)

| Signal | Visual Presentation | Verification Method | Marketplaces |
|--------|---------------------|---------------------|--------------|
| **Malware Scan Passed** | ✅ Green shield badge on item card + detail page | Automated multi-engine AV scan on every publish/update | VS Code (reported), Chrome (reported), npm (reported: Socket.dev integration), JetBrains (reported) |
| **Publisher Verified** | ✅ Blue checkmark badge on publisher name + item | DNS TXT record ownership proof + 6-month track record + manual review | VS Code (measured), Chrome (inferred: developer verification), JetBrains (reported: trader verification), MCP (inferred: GitHub auth) |
| **Supply Chain Provenance** | 📋 "Verified build" badge + link to build logs | Reproducible builds + SLSA provenance + sigstore signatures | npm (reported: ECDSA registry signatures, trusted publishing OIDC), Docker (measured: official images have provenance), Homebrew (measured: formula checksums + bottle SHA256) |
| **Trusted Publishing (OIDC)** | 🔐 "Published via GitHub Actions" badge | GitHub OIDC token exchange, no long-lived PATs | VS Code (measured), npm (reported), GitHub-backed |
| **Secrets Scanning** | 🚫 Warning banner if secrets detected | Automated regex/entropy scanning on publish | HF Spaces (measured: Secrets Scanner), npm (reported: Socket.dev), GitHub (measured: secret scanning) |

### Layer 2: Entity-Type-Specific Signals (Declared by Publisher, Verified by Platform)

| Signal | Plugin/Extension | SaaS/Hosted | Bot/MCP | Desktop/CLI |
|--------|------------------|-------------|---------|-------------|
| **Permission Manifest** | Chrome MV3 `permissions`/`host_permissions` (measured); VS Code `capabilities` (measured); Figma `permissions` (measured) | OAuth scopes declared (HF, MCP measured) | MCP `capabilities` array: tools/resources/prompts (measured) | Homebrew `artifacts` declare install actions (measured) |
| **Capability Declaration** | VS Code `contributes` points (measured); OBS `output_flags` (measured) | API spec (OpenAPI/GraphQL/MCP) linked (MCP measured) | MCP `tools`/`resources`/`prompts` schemas (measured) | — |
| **Runtime Sandbox** | VS Code extension host isolation (reported); Chrome MV3 service worker (measured); Figma plugin iframe (measured) | HF Spaces container isolation (measured); Docker container (measured) | MCP stdio/SSE transport isolation (inferred) | Homebrew sandbox build (measured) |
| **Minimum Host Version** | VS Code `engines.vscode` (measured); Chrome `minimum_chrome_version` (measured) | — | MCP runtime hint (measured) | Homebrew `depends_on.macos` (measured) |
| **Platform Compatibility** | VS Code `platforms` (win32-x64, linux-arm64, darwin-arm64, web) (measured) | — | HF hardware tiers (CPU Basic → 8×A100) (measured) | Homebrew `variations` per OS/arch (measured); Docker multi-arch manifests (measured) |

### Layer 3: Community & Usage Signals (Aggregated from Users)

| Signal | Visual Presentation | Source | Marketplaces |
|--------|---------------------|--------|--------------|
| **Install Count** | "1.2M installs" on card + trend sparkline | Platform telemetry | VS Code (measured), Chrome (inferred: ~140:1 install:rating ratio), npm (measured: download counts), Docker (measured: pull counts), Homebrew (measured: analytics API) |
| **Rating + Review Count** | ★★★★☆ 4.7 (12.4K reviews) | User submissions | VS Code (measured), Chrome (measured), npm (measured), Figma (measured), HF (measured), Docker (measured) |
| **Dependent Count** | "Used by 45K packages" | Dependency graph analysis | npm (measured: `dependents`), Homebrew (measured: `installed` as dependency) |
| **GitHub Stars/Forks** | ⭐ 12.3K 🍴 2.1K (if repo linked) | GitHub API | VS Code (measured: repo link), npm (measured: repo field), HF (measured), MCP (measured), Docker (measured) |
| **Recent Activity** | "Updated 3 days ago" + commit frequency badge | Git history + publish dates | All 9 (measured) |
| **Maintenance Score** | 🟢 Actively maintained / 🟡 Low maintenance / 🔴 Archived | Algorithmic (commit freq, issue response, release cadence) | npm (reported: quality/maintenance/popularity scores deprecated 2024; Socket.dev provides), HF (inferred: Space activity) |
| **Security Advisories** | ⚠️ "2 moderate vulnerabilities" banner + link to advisory | CVE/GHSA database sync | npm (measured: `npm audit`), GitHub (measured: Dependabot), Docker (inferred: Scout) |

---

## 3.2 Detailed Marketplace Trust Implementations

### 3.2.1 VS Code Marketplace (Most Comprehensive)

**Measured from**: Publishing Extensions docs, Security blog (2025-06-11), Extension Runtime Security docs

| Mechanism | Detail |
|-----------|--------|
| **Malware Scan** | Every `.vsix` scanned with multiple AV engines before publish. Blocks known malware signatures. |
| **Publisher Verification** | Requires: 6+ months on marketplace, domain registered 6+ months, DNS TXT proof, manual review by MS team. Badge revoked on ToS violation or name change. |
| **Trusted Publishing** | GitHub Actions OIDC → Azure DevOps federated identity. No PATs stored. Mandatory after Dec 2026. |
| **Runtime Security** | Extensions run in separate Extension Host process. `workspaceTrust` limits access to untrusted folders. |
| **Deprecation UI** | Strikethrough dimmed tile, yellow warning icon, hover shows reason + migration button to alternative. |
| **Removal Policy** | Unpublish preserves stats; Remove deletes stats + permanently reserves name (anti-impersonation). |
| **Version Removal** | Can delete specific versions (not latest). Cannot reuse version number. |

**Evidence**: VS Code Publishing Extensions doc (measured); "Security and Trust in Visual Studio Marketplace" blog 2025-06-11 (reported); Extension Runtime Security doc (reported).

---

### 3.2.2 Chrome Web Store

**Measured from**: Chrome Web Store Review Process docs, Manifest V3 reference

| Mechanism | Detail |
|-----------|--------|
| **Review Process** | Automated static analysis + human review for sensitive permissions. New developers: extended review. Updates: incremental review. |
| **Safe Browsing Integration** | Google Safe Browsing scans all submissions. Extensions flagged by Safe Browsing blocked/removed. |
| **Permission Minimization** | MV3 requires `host_permissions` for cross-origin access; `optional_permissions` for runtime requests. |
| **Developer Verification** | One-time $5 fee + identity verification for new developers (since 2021). |
| **Metrics** | Install count (active users, weekly), rating, review count. Total installs not publicly shown (inferred ~140:1 ratio). |
| **Removal** | Google can remotely disable malicious extensions on user browsers. |

**Evidence**: Chrome Web Store Review Process (reported); Manifest V3 permissions (measured); Developer verification policy (reported).

---

### 3.2.3 npm Registry

**Measured from**: npm Audit docs, Security policies, Trusted Publishing docs

| Mechanism | Detail |
|-----------|--------|
| **npm audit** | Submits dependency tree to GitHub Advisory Database. Returns vulnerabilities with severity, patched versions. |
| **Trusted Publishing (OIDC)** | GitHub Actions/GitLab CI/CircleCI → OIDC token → short-lived npm token. No long-lived tokens. |
| **ECDSA Registry Signatures** | All packages signed by npm registry key. `npm install` verifies signatures (since 2023). |
| **Provenance Statements** | SLSA-compliant build provenance via `npm attest` + sigstore. Links package to source repo + build. |
| **2FA for Publishing** | Mandatory for top 500 packages; optional for others. TOTP or WebAuthn. |
| **Malware Reporting** | `npm report-malware <pkg>` → security team investigation. Takedown within hours for confirmed malware. |
| **Deprecation** | `npm deprecate <pkg>@<version> "message"` → warning on install. |
| **Quality/ Maintenance/ Popularity Scores** | **Deprecated Dec 2024** — replaced by Socket.dev integration for deeper analysis. |

**Evidence**: npm Audit docs (measured); Trusted Publishing (reported); Registry Signatures (reported); Security policies (reported); Socket.dev blog Dec 2024 (reported).

---

### 3.2.4 JetBrains Marketplace

**Measured from**: Understanding Plugin Security docs, Approval Guidelines (2026-03-31), Trader Verification blog (2025-05-26)

| Mechanism | Detail |
|-----------|--------|
| **Moderation Process** | 1) Automated checks (structure, signatures, malware scan) 2) Human review (security, privacy, functionality). 2 business days SLA. |
| **Plugin Verifier** | Static analysis tool runs on every submission. Checks: API usage, restricted APIs, security patterns, compatibility. |
| **Trader Verification** | EU/UK consumer law compliance: verified legal entity, address, contact info displayed. Mandatory for paid plugins. |
| **Security Requirements** | No arbitrary code execution, no credential harvesting, no unauthorized network access, privacy policy for data collection. |
| **Verification Time** | Typically 2 business days; automated checks instant. |
| **Malicious Plugin Response** | 15 malicious plugins removed June 2026 (AI API key theft). Remote disable capability. |

**Evidence**: JetBrains Marketplace Approval Guidelines (measured); Understanding Plugin Security (measured); Trader Verification blog (reported); StepSecurity blog June 2026 (reported).

---

### 3.2.5 Docker Hub

**Measured from**: Registry API V2, Official Images program, Docker Scout

| Mechanism | Detail |
|-----------|--------|
| **Official Images** | Curated by Docker + upstream maintainers. Reproducible builds, security scanning, timely updates. Badge: "Docker Official Image". |
| **Verified Publisher** | Blue badge for organizations with verified domain + Docker partnership. |
| **Image Scanning** | Docker Scout (CLI + Hub UI) scans for CVEs in base images + dependencies. Free tier: 10 scans/mo. |
| **Multi-Arch Manifests** | Single tag resolves to platform-specific digest. `docker pull` auto-selects correct arch. |
| **Content Trust (DCT)** | Optional: sign images with Notary. `DOCKER_CONTENT_TRUST=1` enforces signed pulls. |
| **SBOM Export** | `docker sbom` generates SPDX/CycloneDX SBOM for any image. |

**Evidence**: Registry API V2 (measured); Official Images docs (reported); Docker Scout (reported).

---

### 3.2.6 Homebrew

**Measured from**: Formula/Cask Cookbooks, JSON API, Security model

| Mechanism | Detail |
|-----------|--------|
| **Checksum Verification** | Every formula/cask declares `sha256` for source/binary. Build fails on mismatch. |
| **Bottle (Binary) Signing** | Bottles built on GitHub Actions macOS/Linux runners. SHA256 in JSON API. |
| **Audit Trail** | `brew audit` checks: homepage reachable, license SPDX, stable URL version match, no deprecated APIs. |
| **Livecheck** | Automated version detection via `livecheck` block. `brew bump-formula-pr` auto-updates. |
| **Analytics** | Opt-in `brew analytics` publishes install counts (30/90/365d) per formula/cask. Public JSON API. |
| **No Central Malware Scan** | Relies on checksum + source availability + community reporting. |

**Evidence**: Formula/Cask Cookbooks (measured); JSON API (measured); Security model (inferred from docs).

---

### 3.2.7 Hugging Face Spaces

**Measured from**: Spaces Overview, Secrets Scanner, OAuth docs

| Mechanism | Detail |
|-----------|--------|
| **Secrets Scanner** | Automated scan on every commit. Detects API keys, tokens, passwords. Warns owner + blocks public exposure. |
| **OAuth Integration** | Built-in OAuth 2.0 for Spaces. `OAUTH_CLIENT_ID/SECRET` injected as secrets. |
| **Hardware Isolation** | Each Space runs in dedicated container with resource limits (CPU/RAM/GPU). No shared tenancy. |
| **Visibility Controls** | Public / Protected (code private, app public) / Private. Protected requires PRO/Team plan. |
| **ZeroGPU Free Tier** | Personal accounts: 2 free Gradio Spaces on shared GPU pool. Fair-use scheduling. |
| **Custom Domains** | CNAME verification + TLS termination by HF. |

**Evidence**: Spaces Overview (measured); Secrets Scanner (reported); OAuth docs (reported).

---

### 3.2.8 MCP Registry

**Measured from**: mozilla-ai/mcp-registry GitHub repo, API spec

| Mechanism | Detail |
|-----------|--------|
| **GitHub Auth** | Publishing requires GitHub OAuth. Server identity tied to GitHub repo. |
| **Package Verification** | Registry stores package metadata (npm, docker) with arguments + env vars. Runtime hint (docker/npm/python). |
| **Versioning** | `version_detail` with `is_latest` flag. Multiple package registries per server. |
| **No Central Malware Scan** | Community-driven; relies on package registry scanning (npm, Docker). |

**Evidence**: MCP Registry API spec (measured); GitHub repo structure (measured).

---

### 3.2.9 OBS Studio

**Measured from**: Plugin API reference, Module loading docs

| Mechanism | Detail |
|-----------|--------|
| **Module Signing** | No central marketplace; plugins distributed via GitHub/forums. `obs_module_load` entry point. |
| **Safe Module List** | `obs_add_safe_module()` allowslist for auto-loading. Unlisted modules require user confirmation. |
| **Plugin Verifier** | No automated scanner; relies on open source audit + community. |
| **API Stability** | `obs_module_t` versioning; backward compatibility guaranteed within major version. |

**Evidence**: OBS Module API (measured); Plugin docs (measured).

---

## 3.3 Recommended Trust UI for DSH Marketplace

### 3.3.1 Item Card (List View)

```
┌─────────────────────────────────────────────────────────────┐
│ [Icon]  Python                                              │
│       Microsoft  ✅ Verified Publisher                       │
│       ★★★★★ 4.8 (12.4K)    1.2M installs   Updated 3d ago  │
│       [Free]  [VS Code]  [Plugin]  🟢 Actively Maintained   │
│       🛡️ Malware Scanned  🔐 Trusted Publishing (GitHub)    │
└─────────────────────────────────────────────────────────────┘
```

### 3.3.2 Detail Page — Trust Section (Above Fold)

```
┌─ Trust & Security ──────────────────────────────────────────┐
│ ✅ Verified Publisher: Microsoft (microsoft.com)            │
│    Domain verified via DNS TXT • 6+ years on marketplace    │
│                                                              │
│ 🛡️ Platform Guarantees                                       │
│    ✅ Malware scanned (multi-engine) • 2026-10-28           │
│    ✅ Trusted publishing via GitHub Actions OIDC            │
│    ✅ ECDSA registry signature verified                     │
│                                                              │
│ 🔐 Permissions & Capabilities                                │
│    File System: Read/Write (workspace)                      │
│    Terminal: Execute commands                               │
│    Network: *.python.org, pypi.org                          │
│    [View full manifest ▼]                                   │
│                                                              │
│ 📦 Supply Chain                                              │
│    Source: github.com/microsoft/vscode-python               │
│    Build: GitHub Actions • SLSA Level 2 provenance          │
│    [View provenance ▼]                                       │
│                                                              │
│ ⚠️ Security Advisories                                       │
│    0 active • Last scan: 2026-10-28                         │
│    [Run npm audit ▼]                                         │
│                                                              │
│ 📊 Usage & Maintenance                                       │
│    1.2M installs • 45K dependents • 12.4K reviews           │
│    🟢 Active: weekly commits • 2.1K closed issues (90d)     │
│    GitHub: ⭐ 8.2K 🍴 1.1K                                   │
└─────────────────────────────────────────────────────────────┘
```

### 3.3.3 Type-Specific Trust Panels

| Type | Additional Panel Content |
|------|-------------------------|
| **Plugin** | Activation events, contribution points, minimum host version, platform-specific builds |
| **SaaS** | OAuth scopes, API spec link, SLA, compliance badges, data residency regions |
| **Bot/MCP** | Protocol (MCP/A2A), transport (stdio/SSE), declared tools/resources/prompts, hardware tier |
| **Desktop/CLI** | Install method, artifacts (app/binary/service), checksums, auto-update status, conflicts |
| **Hosted Site** | Framework, build command, edge runtime, custom domain status, CDN provider |

---

## 3.4 Trust Signal Implementation Priority

| Priority | Signal | Effort | Rationale |
|----------|--------|--------|-----------|
| P0 | Malware scan on publish | High | Table stakes; all major marketplaces do it |
| P0 | Publisher verification (DNS + track record) | Medium | High impact on user trust; VS Code model proven |
| P0 | Permission/capability manifest display | Low | Data already in schema; critical for plugins/bots |
| P0 | Install count + rating + recency | Low | Telemetry aggregation; standard |
| P1 | Trusted publishing (OIDC) | Medium | Supply chain security; npm/VS Code mandate |
| P1 | Provenance statements (SLSA/sigstore) | High | Emerging standard; npm/Docker adopting |
| P1 | Security advisory banner (CVE/GHSA sync) | Medium | npm audit + GitHub Advisory DB integration |
| P2 | Maintenance score algorithm | Medium | Differentiator; npm deprecated simple scores |
| P2 | Deprecation/migration UI | Low | VS Code pattern reduces fragmentation |
| P3 | Trader verification (paid items) | Medium | Legal compliance for commercial items |
| P3 | Community security audit badges | Low | Opt-in; leverages open source ecosystem |

---

## 3.5 Anti-Patterns to Avoid

| Anti-Pattern | Why It Fails | Better Approach |
|--------------|--------------|-----------------|
| Single "Verified" badge without tiers | Users can't distinguish malware-scan vs publisher-identity vs supply-chain | Layered badges with tooltips explaining each |
| Hide permission details behind "Advanced" | Users install over-privileged extensions | Show permissions prominently; group by risk level |
| Show only aggregate rating | Hides review distribution, recency, fake reviews | Show histogram, "Verified Purchase" style tags, time-decay weighting |
| No deprecation path | Orphaned users, security risk | VS Code model: strikethrough + migration button + alternative link |
| Trust signals only on detail page | List view drives most decisions | Mini badges on cards: verified, malware-scanned, install count |

---

## Sources Index

| # | Source | Type | Retrieval Date |
|---|--------|------|----------------|
| 1 | VS Code Publishing Extensions | Official docs | 2026-11-11 |
| 2 | VS Code Security & Trust Blog (2025-06-11) | Official blog | 2026-11-11 |
| 3 | VS Code Extension Runtime Security | Official docs | 2026-11-11 |
| 4 | Chrome Web Store Review Process | Official docs | 2026-11-11 |
| 5 | Chrome Manifest V3 Permissions | Official docs | 2026-11-11 |
| 6 | npm Audit Documentation | Official docs | 2026-11-11 |
| 7 | npm Trusted Publishing (OIDC) | Official docs | 2026-11-11 |
| 8 | npm Security Policies | Official docs | 2026-11-11 |
| 9 | Socket.dev Blog: npm Scores Deprecated (2024-12-05) | Industry blog | 2026-11-11 |
| 10 | JetBrains Understanding Plugin Security | Official docs | 2026-11-11 |
| 11 | JetBrains Marketplace Approval Guidelines (2026-03-31) | Official docs | 2026-11-11 |
| 12 | JetBrains Trader Verification Blog (2025-05-26) | Official blog | 2026-11-11 |
| 13 | StepSecurity Blog: 15 Malicious JetBrains Plugins (2026-06-16) | Security blog | 2026-11-11 |
| 14 | Docker Registry API V2 | Official API docs | 2026-11-11 |
| 15 | Docker Official Images / Scout | Official docs | 2026-11-11 |
| 16 | Homebrew Formula/Cask Cookbooks | Official docs | 2026-11-11 |
| 17 | Homebrew JSON API | Official API | 2026-11-11 |
| 18 | Hugging Face Spaces Overview | Official docs | 2026-11-11 |
| 19 | Hugging Face Secrets Scanner | Official docs | 2026-11-11 |
| 20 | MCP Registry (mozilla-ai) API Spec | GitHub repo | 2026-11-11 |
| 21 | OBS Studio Module/Plugin API | Official docs | 2026-11-11 |

See `data/01-09_*.md` for raw fetches, `queries.log` for search queries.