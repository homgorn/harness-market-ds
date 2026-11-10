# Data Model — DSH Harness Plugin Catalog

## Entities

### Plugin
| Field | Type | Constraints |
|-------|------|-------------|
| slug | string | PK, derived from name |
| name | string | npm package name (unique) |
| title | object | {en, zh, ...} localized |
| description | object | {en, zh, ...} localized |
| homepage | string (url) | nullable |
| repository.url | string (url) | nullable |
| repository.directory | string | nullable (monorepo) |
| category | string | FK → Category.slug |
| tags | string[] | |
| author | string | FK → Author.slug (nullable) |
| versions | Version[] | at least 1 |
| security.status | enum | clean/warning/malicious/unknown/rewritten |
| security.report | string (url) | nullable |
| security.scannedAt | datetime | nullable |
| compatibility.enginesDsh | string | nullable (semver range) |
| compatibility.status | enum | compatible/incompatible/unknown |
| metadata.keywords | string[] | |
| metadata.labels | string[] | |
| sortKeys | object | |
| featured | boolean | default false |
| sponsored | boolean | default false |
| addedAt | datetime | from catalog publishTimestamp |
| updatedAt | datetime | last sync |

### Category
| Field | Type | Constraints |
|-------|------|-------------|
| slug | string | PK (agi, ui, usage, theme, model, identity, session, memory, tools, wsl, browser, vision, voice, docs, skill, workflow, git, notify, dev, security, remote, market, fun) |
| title | object | {en, ru, zh, es, de, fr, ja} |
| description | object | localized, nullable |
| parent | string | FK → Category.slug, nullable (for subcategories) |
| pluginCount | number | derived |
| order | number | display order |

### Subcategory (optional, derived)
| Field | Type |
|-------|------|
| slug | string |
| parentCategory | string |
| title | object |
| pluginCount | number |

### Tag
| Field | Type |
|-------|------|
| slug | string | PK |
| title | object | localized |
| pluginCount | number | derived |

### Author
| Field | Type |
|-------|------|
| slug | string | PK (derived from github user or npm author) |
| name | string |
| url | string (url) | nullable |
| pluginCount | number | derived |

### Version
| Field | Type |
|-------|------|
| version | string | semver |
| publishTimestamp | number | epoch |
| source.type | enum | npm/github-release/archive |
| source.url | string | nullable |
| engines | object | {dsh, node, ...} |

### SecurityReport
| Field | Type |
|-------|------|
| pluginSlug | string | FK |
| status | enum |
| findings | Finding[] |
| scannedAt | datetime |
| scannerVersions | object |
| maliciousCodeRemoved | boolean |
| rewritten | boolean |
| rewriteNotes | string | nullable |

### Finding
| Field | Type |
|-------|------|
| rule | string |
| severity | enum | info/low/medium/high/critical |
| file | string |
| line | number |
| message | string |
| cwe | string | nullable |

### Knowledge Graph Triple
| Field | Type |
|-------|------|
| subject | string |
| predicate | string |
| object | string |
| source | string |

### Locale
| Field | Type |
|-------|------|
| code | string | PK (en, ru, zh, es, de, fr, ja) |
| name | string |
| nativeName | string |
| direction | enum | ltr/rtl |
| complete | boolean |

## Storage

- Build-time: SQLite (`brain/data/catalog.db`) generated from JSON for queries/aggregations.
- Runtime (static): JSON files in `public/data/` for client-side filtering (chunked by category for size).
- Source of truth: `data/catalog.json` (latest sync) + snapshots `data/snapshots/YYYY-MM-DD.json`.

## Validation

- Zod schemas in `src/lib/schema.ts` for catalog JSON, plugin, version, category.
- Build fails on schema validation error (after reporting).
