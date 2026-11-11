# DSH Ecosystem Research — Gaps & Undetermined Items

All gaps as of **2026-11-11**.

---

## 1. Plugin Market Index (format-1) — Could Not Fetch

| Item | Status | Impact |
|------|--------|--------|
| `https://cdn.jsdelivr.net/npm/dsh-plugin-catalog/index.json` | **Failed** (0 bytes returned) | Cannot inspect actual schema, field names, entry count, or validate against format-1 spec |
| `https://awesome-dsh-plugin.com/index.json` | **Not attempted directly** (assumed same as jsdelivr per dshmarket.com) | Same as above |
| `https://dshmarket.com/index.json` | **Failed** (0 bytes) | Same as above |

**Mitigation**: The `@deepseek-ai/dsh-plugin-market-index` package (v0.2.1-alpha.4) exists on npm and contains validation logic — could be inspected by downloading the tarball.

---

## 2. Awesome-DSH-Plugin catalog.json — Too Large to Fetch

| Item | Status | Impact |
|------|--------|--------|
| `https://awesome-dsh-plugin.com/catalog.json` | **Failed** (>5MB, exceeds tool limit) | Cannot analyze full entry structure, category mapping, or cross-reference with other catalogs |

**Mitigation**: The hrhgit and OMDSH Hub catalogs were successfully fetched and provide structured alternatives.

---

## 3. npm @deepseek-ai/dsh-* — Incomplete Enumeration

| Gap | Detail |
|-----|--------|
| Search API pagination | `size=200` returned ~95 packages but `total: 199647` suggests the search index includes many non-dsh packages. True count of `@deepseek-ai/dsh-*` packages unknown. |
| Scoped vs unscoped community plugins | Community plugins use unscoped names (e.g., `dsh-context`, `billion-context`) or user scopes (`@anionex/dsh-vision-toolkit`). No programmatic way to distinguish "DSH plugin" from arbitrary npm package without catalog curation. |
| `@deepseek-ai/dsh-plugin-catalog` package | Exists but not fetched — contains the format-1 index generation logic. |

---

## 4. Desktop App Distribution — Unverified Channels

| App | Missing info |
|-----|--------------|
| All 6 desktop apps | **Auto-update mechanism** (GitHub Releases only? Custom updater? Code signing details?) |
| Dataelem DSH Desktop | **Enterprise edition** — pricing, licensing, feature matrix not public |
| Local DSH | **llama.cpp / GGUF model bundling** — which models shipped, update mechanism for models |
| MochiNek0 / RyensX / Anywhere Labs | **Plugin preset lists** — which community plugins bundled by default |
| Cross-app compatibility | **Profile portability** — can a profile from Dataelem Desktop run on Tauri desktop? |

---

## 5. Cloud / Hosted Services — Opacity

| Service | Unknowns |
|---------|----------|
| Dataelem Enterprise | Pricing, SLA, data residency, API access, self-host option |
| dsh-mobile-plugin relay tunnel | Infrastructure provider, authentication, rate limits, data logging |
| session-teleport (PostgreSQL) | Hosted offering? Self-host only? |
| dshdesktop.cn | **Fetch failed** (transport error) — Chinese mirror? Separate deployment? |

---

## 6. Plugin Categorization — Multiple Taxonomies

| Catalog | Categories | Inconsistency |
|---------|------------|---------------|
| dshmarket.com | 28 categories (AGI, UI, Usage, Theme, Model, Identity, Session, Memory, Tools, WSL, Browser, Vision, Voice, Docs, Skill, Workflow, Git, Notify, Dev, Security, Remote, Market, Fun) | Human-curated, matches awesome-dsh-plugin |
| awesome-dsh-plugin.com | Same 28 categories | Appears synced from same source |
| OMDSH Hub | 7 categories (channels, developer-tools, fun, interface, memory, platform, safety) + 7 kinds (adapter, channel, extension, mcp, skill, toolkit, ui) | Different taxonomy — more technical |
| hrhgit catalog | No category field in entries (only keywords) | Requires keyword-based classification |

**Gap**: No canonical machine-readable category taxonomy. OMDSH's `kind` + `category` is the most structured but covers only 889 curated entries.

---

## 7. Plugin Installation — Unverified Protocols

| Protocol | Unverified |
|----------|------------|
| `dsh plugin add <spec>` | Exact spec grammar (GitHub shorthand? npm name? URL? local path? version constraints?) |
| `dsh plugin --profile web add dshmarket` | What profile names are valid? (`web`, `cli`, `headless`, `sdk`, custom?) |
| Hot reload / seamless update | Which plugin kinds support hot reload? OMDSH Hub declares `seamless.state` but many are `unsupported` or `unknown` |
| Rollback / failure isolation | OMDSH Hub declares `failureIsolation.policy` (generation-rollback, discard-process, manual) but most community plugins untested |

---

## 8. MCP Server Distribution — Fragmented

| Gap | Detail |
|-----|--------|
| MCP registry | No central MCP registry for DSH. Servers distributed as: npm packages (`@anionex/...`), GitHub repos with `server.json`, bundled in toybox collections, standalone binaries |
| Protocol versioning | OMDSH Hub shows `protocolVersions: ["2026-07-28"]` and `registrySchema: "2025-12-11"` — two versions in play |
| Discovery | MCP servers only discoverable via plugin catalogs (tagged as MCP) or GitHub topic search |

---

## 9. Skills — Format Ambiguity

| Gap | Detail |
|-----|--------|
| Skill manifest | `SKILL.md` files (per OMDSH Hub) but no formal schema published. Some skills in `skills/` dir, some at repo root. |
| Skill bundles vs single skills | `dsh-skills-manager` manages local skills; `dsh-agency-agents` provides agent roster; `ai-plugins#alibaba-java-guidelines` ships skill in monorepo. No standard packaging. |
| Cross-agent skill sharing | `dsh-agent-teams`, `dsh-experimental-agent-team` imply shared skills but mechanism undocumented. |

---

## 10. Themes/Skins — No Registry

| Gap | Detail |
|-----|--------|
| Theme format | CSS custom properties (design tokens) + optional DOM overrides. No schema. |
| Theme marketplace | 376 themes on dshmarket but no dedicated theme index — mixed with plugins. |
| Theme compatibility | `dsh-wallpaper-engine` requires `dsh-better-sidebar >= 0.19.0` and DSH `>= 0.1.5-rc.1` — version coupling undocumented in catalog. |

---

## 11. Model Providers — Core vs Community Blur

| Gap | Detail |
|-----|--------|
| Core providers | `@deepseek-ai/dsh-web-search-deepseek` (search), but LLM provider adapters not clearly separated in `@deepseek-ai/dsh-*` packages |
| Community providers | `dsh-connect-workbuddy`, `dsh-codex-connect`, `dsh-agy`, `dsh-llm-codebuddy` — all unscoped npm packages |
| Provider capability matrix | Which providers support: streaming, tools, vision, reasoning, caching? Not in catalogs. |

---

## 12. IM/Chat Connectors — Protocol Coverage

| Platform | Connector(s) found | Gaps |
|----------|-------------------|------|
| Feishu / Lark | `dsh-im`, `dsh-im-connect` | — |
| WeChat / WeCom | `dsh-im`, `dsh-im-connect`, `dsh-onebot` (via NapCat) | WeCom vs WeChat distinction? |
| DingTalk | `dsh-im`, `dsh-im-connect` | — |
| QQ | `dsh-onebot` (NapCat), `dsh-im` | OneBot 11 only? |
| Slack | `dsh-im` | — |
| Telegram | `dsh-im`, `dsh-im-connect` | — |
| Discord | `dsh-im` | — |
| WhatsApp | `dsh-im` | — |
| **Matrix / Element** | **None found** | Gap |
| **Discord threads / forum** | **Unknown** | Gap |

---

## 13. Metrics / Telemetry — Opt-in Only

| Gap | Detail |
|-----|--------|
| Download counts | dshmarket.com shows "weekly downloads" per plugin — source unclear (npm? custom tracker?) |
| Active installs | No telemetry by design (dshmarket.com: "No telemetry, ever") |
| Plugin health | No automated compatibility testing visible in catalogs (OMDSH Hub has `compatibility` field but mostly `verification-passed-review-pending` or `needs-package-manifest`) |

---

## 14. Legal / Licensing — Unaggregated

| Gap | Detail |
|-----|--------|
| License distribution | Catalogs include `license` field (MIT, BSD-3-Clause, Apache-2.0, CC0-1.0, MIT-0, etc.) but no aggregate view |
| Copyleft risk | No scan for GPL/AGPL in community plugins |
| Trademark | "DeepSeek Harness" / "DSH" usage in plugin names — no policy published |

---

## 15. Internationalization — Chinese-Dominant

| Gap | Detail |
|-----|--------|
| Catalog languages | dshmarket.com, awesome-dsh-plugin.com, dshget.com all have `/zh/` routes; English secondary |
| Plugin metadata | `displayName`, `summary` in hrhgit/OMDSH catalogs have `zh-CN` and `en` — but many community plugins only Chinese |
| Docs / tutorials | dshdesktop.com has 7 languages (zh, en, ja, ru, es, pt); others English-only or Chinese-only |

---

## 16. Version Compatibility Matrix — Missing

| Gap | Detail |
|-----|--------|
| DSH core ↔ plugin | No `peerDependencies` convention enforced. `dsh-wallpaper-engine` documents hard requirements but catalogs don't surface this. |
| Plugin ↔ plugin | `dsh-worktable` conflicts (two packages same name) — no conflict detection in catalogs |
| Desktop app ↔ plugin | Bundled plugins in desktop apps may lag/lead npm versions — no sync status |

---

## 17. Security / Supply Chain — Unverified

| Gap | Detail |
|-----|--------|
| Plugin signing | No npm provenance / sigstore adoption visible |
| Malware scanning | No automated static analysis in catalogs |
| Permission model | `dsh-permission-presets` exists but community plugins' permission needs not declared in catalogs |

---

## 18. Historical / Archived Artifacts

| Gap | Detail |
|-----|--------|
| Deprecated plugins | `dsh-git-graph` (retired by author) still installable — catalogs don't flag |
| Archived repos | OMDSH Hub tracks `archived: false` but no archive view |
| Format migrations | Format-1 index spec versioning — no v2 seen yet |

---

## Summary of Actionable Next Steps

1. **Download `@deepseek-ai/dsh-plugin-market-index` tarball** to extract format-1 schema
2. **Stream `awesome-dsh-plugin.com/catalog.json` in chunks** or use GitHub raw with range requests
3. **Query npm registry with prefix search** (`@deepseek-ai/dsh-` exact prefix) for accurate core package count
4. **Contact desktop app maintainers** for auto-update, code signing, bundled plugin manifests
5. **Build unified category mapping** across the 4 catalog taxonomies
6. **Request format-1 spec document** from deepseek-ai/deepseek-harness repo (may be in docs/)