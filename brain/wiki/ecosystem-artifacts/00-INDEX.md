# Ecosystem artifacts — beyond plugins

## Summary
The DSH ecosystem is larger than its npm plugin list. Beyond the 5,126 npm
plugins in the DSH format-1 index, the community registry lists 10,365
artifacts spanning seven kinds: plugins, MCP servers, skills, themes, presets,
desktop apps, and hosted services. Two more registries add coverage. The
catalog now models all of them with one shared shape plus a kind
discriminator, and carries upstream security signals (capability red lines)
and OSV advisories.

## Kinds and where they come from

| Kind | Source | Distribution |
|---|---|---|
| plugin | awesome-dsh-plugin + dsh-plugin-catalog | npm, GitHub releases |
| mcp | OMDSH Hub (`kind: mcp`, 23) | npm, GitHub, Docker |
| skill | OMDSH Hub (`kind: skill`, 41), registry "Skills" category (360) | npm, GitHub `skills/` dirs |
| theme | registry "Themes & Appearance" (376) | npm, GitHub releases |
| preset | npm `@deepseek-ai/dsh-agent-presets`, plugin bundles | npm |
| desktop | 6 known clients (dataelement, hairyf, anywhere-labs, RyensX, MochiNek0, local-dsh) | GitHub releases, installers |
| bot | registry "Notifications & Integrations" (339) + IM connectors | npm, GitHub releases |
| service | hosted DSH instances, relay tunnels, workshop registries | web |
| marketplace | dshmarket, awesome-dsh-plugin, dshget, OMDSH Hub, hrhgit catalog | web, GitHub |
| site | documentation and gallery sites | static hosting |

## Machine-readable registries

| Registry | Entries | Fields |
|---|---|---|
| `awesome-dsh-plugin.com/plugins.json` | 10,365 | stars, downloads, capabilities, red lines, install, icon, screenshots |
| `cdn.jsdelivr.net/npm/dsh-plugin-catalog/index.json` | 5,126 | npm-published only, format-1 index consumed by DSH Discover |
| `github.com/bobby-sheng/dshget-data` | 2,460 | tags, license, verification, featured |
| `github.com/hrhgit/.../catalog/v2` | 1,000 | keywords, license, availability, compatibility |
| `github.com/omdsh-dev/dsh-hub-workshop` | 896 packages | kind, admission state, install modes, failure isolation |
| `registry.npmjs.org` | 5,123 DSH packages | keywords, license, maintainers, versions |
| `api.osv.dev` | batch | published vulnerability advisories |

## Security signals carried into the catalog

- **Capability red lines** (upstream): 778 plugins read credentials AND have
  network access; 29 run code at install time (postinstall); plus plaintext
  HTTP egress and literal-IP egress findings.
- **Capabilities** (upstream): fs-read, fs-write, shell, network, env,
  credentials, llm, dynamic-code, host-runtime, subagent.
- **OSV advisories** (measured independently): queried for every npm package.
- **Own scan pipeline**: Semgrep + npm audit + YARA on plugin sources
  (scripts/security-scan.mjs, wired into CI).

## Sources
- `brain/research/ecosystem-artifacts/01-taxonomy.md`
- `brain/research/ecosystem-artifacts/02-discovery.md`
- `docs/adr/0002-data-sources.md`
