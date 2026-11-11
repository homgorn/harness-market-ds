# DSH Ecosystem — Machine-Readable Discovery Sources

All sources checked on **2026-11-11**.

---

## 1. npm Registry — @deepseek-ai/dsh-* (Core Framework)

| Endpoint | Description | Last checked | Notes |
|----------|-------------|--------------|-------|
| `https://registry.npmjs.org/-/v1/search?text=@deepseek-ai/dsh-&size=200` | Search API for all `@deepseek-ai/dsh-*` packages | 2026-11-11 | Returns ~95 core packages (seams, services, UI primitives, tools, profiles). Saved to `data/npm-deepseek-ai-dsh-packages.json` |
| `https://registry.npmjs.org/@deepseek-ai/dsh` | Core CLI package metadata + 60+ internal dependencies | 2026-11-11 | Version 0.2.2-rc.1 (2026-11-04) |
| `https://www.npmjs.com/search?q=@deepseek-ai/dsh` | Web search UI (403 for programmatic access) | 2026-11-11 | Blocked for scraping |

**Package categories observed** (from dependency list of `@deepseek-ai/dsh`):
- **Seams/Capability interfaces**: `dsh-fs`, `dsh-compaction`, `dsh-tools`, `dsh-session`, `dsh-workflow`, `dsh-spill`, `dsh-sandbox`, `dsh-storage`, `dsh-subprocess`, `dsh-bash`, `dsh-commands`, `dsh-workspace`, `dsh-shell-env`, `dsh-skill-filesystem`, `dsh-otel`, `dsh-sandbox-local`, `dsh-sandbox-windows-acl`, `dsh-session-persistence`, `dsh-storage-domain`, `dsh-scope`, `dsh-invariants`
- **Implementations (local)**: `dsh-sandbox-local`, `dsh-subprocess-local`, `dsh-bash-local`, `dsh-spill-local`, `dsh-ptc-runtime-node`, `dsh-pwsh-local`, `dsh-pwsh-sandbox`, `dsh-home-paths`, `dsh-http-proxy`, `dsh-jobs-local`
- **UI primitives (web)**: `dsh-client-ui-*` (15+ packages: settings, sidebar, conversation, tool, attachment, commands, goal, schedule, brand, shortcuts, slots, primitives, subagent, right-sidebar, etc.)
- **Agent/runtime**: `dsh-agent`, `dsh-agent-presets`, `dsh-agent-preset-registry`, `dsh-base`, `dsh-app-boot`, `dsh-headless`, `dsh-sdk-app`, `dsh-sdk-minimal`, `dsh-web-app`, `dsh-cmdline`, `dsh-goal`, `dsh-persona`, `dsh-plan-mode`, `dsh-hmr`
- **Tools**: `dsh-tool-*` (bash, pwsh, terminal, jobs, todo, goal, skill, cordis, ralph, workspace-dependencies, working-directory, web, fs, bash-persistent)
- **MCP/Protocol**: `dsh-mcp-client`, `dsh-mcp-resources`, `dsh-hooks-codex`
- **Utilities**: `dsh-util-values`, `dsh-util-time`, `dsh-util-workspace-path`, `dsh-output-retention`, `dsh-token-meter`, `dsh-atomic-write`, `dsh-command-goal`
- **Experimental**: `dsh-experimental-*` (auto-review, badge-skill-bundle, ralph-bundle, agent-team, harness-dev-context)
- **Client/Connection**: `dsh-client-connection`, `dsh-client-resources`, `dsh-api-workspace-files`, `dsh-client-product-analytics`
- **Plugin management**: `dsh-plugin-manager`, `dsh-plugin-market-index`

---

## 2. Plugin Market Index — Format-1 (`index.json`)

| URL | Source | Schema | Last checked | Notes |
|-----|--------|--------|--------------|-------|
| `https://cdn.jsdelivr.net/npm/dsh-plugin-catalog/index.json` | npm `dsh-plugin-catalog` via jsdelivr CDN | Format-1 (per dshmarket.com) | 2026-11-11 | **Fetch failed (0 bytes)** — likely large file or CDN config. Referenced by dshmarket.com as the canonical index. |
| `https://awesome-dsh-plugin.com/index.json` | GitHub Pages mirror | Format-1 | 2026-11-11 | Same document per dshmarket.com |
| `https://dshmarket.com/index.json` | dshmarket.com direct | Format-1 | 2026-11-11 | **Fetch failed** — same document |

**Format-1 spec** (inferred from dshmarket.com page):
- Consumed by DSH 0.2.1+ Discover tab → "Index sources"
- Consumed by `plugin_market` agent tool
- Fields: relative icon resolution, pinned install arguments, JSON validation
- Package: `@deepseek-ai/dsh-plugin-market-index` (v0.2.1-alpha.4) provides validation logic

---

## 3. Community Catalogs (Aggregators)

| Catalog | URL | Format | Entries (claimed) | Last sync | Notes |
|---------|-----|--------|-------------------|-----------|-------|
| **dshmarket.com** | `https://dshmarket.com/` | HTML + format-1 index | 10,119 plugins | 2026-11-10 (per footer) | 28 categories, weekly download ranks, install command copy |
| **dshget.com** | `https://dshget.com/` | Next.js app + JSON feeds | 11,646 plugins | 2026-11-10 (per footer) | Lists 4 upstream catalogs in footer; categories match dshmarket |
| **awesome-dsh-plugin.com** | `https://awesome-dsh-plugin.com/` | Astro static site + `catalog.json` | 10,365 plugins | 2026-11-10 (per footer) | `catalog.json` feed (v1d6ba5bd), Atom feed, 28 categories |
| **awesome-dsh-plugin.com/catalog.json** | `https://awesome-dsh-plugin.com/catalog.json` | JSON (large, >5MB) | 10,365 | 2026-11-10 | **Fetch failed (too large)** — primary machine-readable feed |
| **hrhgit catalog v2** | `https://raw.githubusercontent.com/hrhgit/deepseek-harness-plugin-manager/main/catalog/v2/catalog.json` | JSON (schema v2) | 1,000 | 2026-08-14 (generatedAt) | Saved to `data/hrhgit-catalog.json`. Fields: id, repository, packageName, version, displayName, summary, keywords, license, manifestUrl, availability, compatibility |
| **OMDSH Hub Workshop** | `https://raw.githubusercontent.com/omdsh-dev/dsh-hub-workshop/main/catalog.json` | JSON (custom workshop schema v0.4) | 889 listings | 2026-09-28 (updated) | Saved to `data/omdsh-hub-catalog.json`. Rich metadata: kinds (extension, mcp, skill, ui, toolkit, adapter, channel), categories, workshop manifest, admission state, install modes, discovery provenance |

---

## 4. GitHub Discovery

| Source | URL | Type | Count | Last checked |
|--------|-----|------|-------|--------------|
| GitHub topic `dsh-plugin` | `https://github.com/topics/dsh-plugin` | Topic page (HTML) | 499 repos | 2026-11-11 |
| GitHub search `deepseek-harness` | `https://github.com/search?q=deepseek-harness` | Search (not fetched) | Unknown | — |
| awesome-dsh-plugin repo | `https://github.com/awesome-dsh-plugin/awesome-dsh-plugin` | Curated list repo | 1 repo | 2026-11-11 |
| dsh-market repo | `https://github.com/dsh-market/dsh-market` | Market implementation | 1 repo | 2026-11-11 |

---

## 5. Desktop App Distribution Channels

| App | Website | Downloads | GitHub Releases | Package managers |
|-----|---------|-----------|-----------------|------------------|
| **DSH Desktop (Dataelem)** | `https://dshdesktop.com/` | `.exe`, `.dmg` (x64, arm64) | `https://github.com/dataelement/dsh-desktop/releases` | — |
| **DSH Tauri (dsh-tauri)** | — | — | `https://github.com/dsh-tauri/deepseek-harness-desktop/releases` | — |
| **Anywhere Labs DSH Desktop** | — | — | `https://github.com/anywhere-labs/dsh-desktop/releases` | — |
| **DSH App (RyensX)** | — | — | `https://github.com/RyensX/dsh-app/releases` | — |
| **Local DSH** | `https://localdsh.com/` | `.dmg`, `.exe` (lite) | `https://github.com/liangchen-harold/local-dsh/releases` | — |
| **MochiNek0 DSH Desktop** | — | — | `https://github.com/MochiNek0/dsh-desktop/releases` | — |

---

## 6. Official Core Repository

| Repo | URL | Purpose |
|------|-----|---------|
| deepseek-ai/deepseek-harness | `https://github.com/deepseek-ai/deepseek-harness` | Monorepo for all `@deepseek-ai/dsh-*` packages, CLI, web frontend, docs |

---

## 7. Plugin Installation Protocols (Machine-Actionable)

| Method | Command / Spec | Resolves from |
|--------|----------------|---------------|
| **CLI (market index)** | `dsh plugin --profile web add dshmarket` | `https://cdn.jsdelivr.net/npm/dsh-plugin-catalog/index.json` |
| **CLI (GitHub repo)** | `dsh plugin add owner/repo` | GitHub API |
| **CLI (npm package)** | `dsh plugin add pkg-name` | npm registry |
| **CLI (local path)** | `dsh plugin add ./path` | Filesystem |
| **Web UI (Discover tab)** | Add index source URL in Settings → Plugin Market → Index sources | Any format-1 `index.json` |
| **Agent tool** | `plugin_market` tool searches configured indices | Same as Discover tab |

---

## 8. Feeds for Automation

| Feed | URL | Format | Update frequency |
|------|-----|--------|------------------|
| awesome-dsh-plugin Atom | `https://awesome-dsh-plugin.com/feed.xml` | Atom 1.0 | On new plugin |
| dshmarket.com sitemap | `https://dshmarket.com/sitemap.xml` | XML sitemap | Build-time |
| hrhgit catalog | `https://raw.githubusercontent.com/hrhgit/deepseek-harness-plugin-manager/main/catalog/v2/catalog.json` | JSON (schema v2) | On repo update |
| OMDSH Hub | `https://raw.githubusercontent.com/omdsh-dev/dsh-hub-workshop/main/catalog.json` | JSON (workshop v0.4) | On repo update |

---

## 9. Schema References

| Schema | Location | Version |
|--------|----------|---------|
| Plugin market index format-1 | `@deepseek-ai/dsh-plugin-market-index` package | 0.2.1-alpha.4 |
| hrhgit catalog | `catalog/v2/catalog.json` | v2 (schemaVersion: 2) |
| OMDSH Hub workshop | `catalog.json` | dsh-hub-index/v0.4 |
| OMDSH workshop package manifest | `package.json#dshWorkshop` | omdsh-workshop-package/v1 |
| MCP server manifest | `server.json` (per MCP) | MCP 2025-12-11 / 2026-07-28 |
| Skill manifest | `SKILL.md` (per skill) | DSH skill format |