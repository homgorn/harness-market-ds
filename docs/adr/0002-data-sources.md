# ADR-0002: Data sources and the unified artifact model

**Date:** 2026-11-11
**Status:** Accepted

## Context

The original brief pointed at the DSH plugin index on jsDelivr
(`https://cdn.jsdelivr.net/npm/dsh-plugin-catalog/index.json`). Fetching it on
2026-11-10 showed **5,126 plugins**, npm-only, with no ratings, no downloads,
no capabilities and no safety signals.

Research (`brain/research/ecosystem-artifacts/`) found a richer primary source:
`https://awesome-dsh-plugin.com/plugins.json` — the registry behind
awesome-dsh-plugin.com — with **10,365 entries** including GitHub-only plugins,
and per-entry:

- `owner`, `stars`, `downloads`, `added`, `install` command, `icon`, `screenshots`
- `capabilities[]` — declared surface: `fs-read`, `fs-write`, `shell`, `network`,
  `env`, `credentials`, `llm`, `dynamic-code`, `host-runtime`, `subagent`
- `capabilityRedLines[]` — upstream-declared risk signals, e.g. *"reads
  credentials/secrets AND has network access"* (778 plugins), *"runs code at
  install time (postinstall)"* (29), plaintext HTTP and literal-IP egress

Two further registries were found and are merged in for extra coverage:
`bobby-sheng/dshget-data` (2,460) and `hrhgit/…/catalog/v2` (1,000, with
`keywords`, `license`, `availability`, `compatibility`).

## Decision

1. **Merge** the community registry with the DSH format-1 index into one
   normalized dataset (10,620 items) — `scripts/sync-catalog-v2.mjs`.
2. **Enrich** npm packages from the registry: keywords become tags, plus
   license and maintainers — `scripts/enrich-npm.mjs`.
3. **Scan** for known vulnerabilities through OSV.dev — `scripts/scan-osv.mjs`.
4. **Model every artifact with one shape** plus a `kind` discriminator
   (`plugin`, `mcp`, `skill`, `theme`, `preset`, `desktop`, `bot`, `service`,
   `marketplace`, `site`), following the shared-base-plus-type-extensions
   pattern measured across nine marketplaces
   (`brain/research/marketplace-ux/01-entity-model.md`).
5. **Derive security status** from upstream capability red lines plus OSV
   advisories, and show it on every card and detail page.

## Consequences

- The catalog is no longer a plugin list but an **ecosystem catalog**: plugins
  plus the desktop apps, hosted services, bots and marketplaces around them.
- Security status is inherited from the upstream registry's own red-line
  declarations plus an independent advisory feed — two independent sources.
- Machine translation covers the five locales with no source translations and
  is labelled as such in the UI; a half-translated sentence is never presented
  as a verified translation.
