# API Contracts — DSH Harness Plugin Catalog

## Public read-only endpoints (Cloudflare Pages Functions)

Base: `https://harness-market-ds.refertur.net/api/v1`

### GET /plugins
Query params:
- `q` (string) — full-text search (delegated to Pagefind client-side; server returns filtered list)
- `category` (string)
- `tag` (string)
- `security` (enum: clean|warning|malicious|unknown|rewritten)
- `locale` (enum)
- `sort` (enum: newest|popular|top|name|updated)
- `page` (number, default 1)
- `perPage` (number, default 24, max 100)
- `compat` (string) — host version range

Response 200:
```json
{
  "total": 5126,
  "page": 1,
  "perPage": 24,
  "plugins": [ { "slug": "...", "name": "...", "title": {...}, "description": {...}, "category": "ui", "tags": [], "version": "1.0.0", "security": { "status": "clean" }, "compatibility": { "status": "unknown" }, "homepage": "...", "repository": "..." } ]
}
```

### GET /plugins/:slug
Response 200: full Plugin object (all versions, security report link, related).
Response 404: `{ "error": "not_found" }`.

### GET /categories
Response 200: list of categories with pluginCount.

### GET /tags
Response 200: list of tags with pluginCount (top 200).

### GET /search (Pagefind proxy)
Not needed; Pagefind is client-side. This endpoint returns 410 with link to Pagefind index.

### GET /feed/:locale.xml
RSS/Atom feed for blog/changelog/news (static generated, not function).

### GET /data/catalog.json
Full catalog JSON (for API/data monetization; rate-limited; CORS open).

### Error responses
- 400 `{ "error": "bad_request", "details": [...] }`
- 401 `{ "error": "unauthorized" }` (for gated endpoints)
- 404 `{ "error": "not_found" }`
- 429 `{ "error": "rate_limited", "retryAfter": 60 }`
- 500 `{ "error": "internal" }`

### Rate limits
- Public endpoints: 60 req/min per IP (Cloudflare).
- /data/catalog.json: 10 req/min per IP (heavy).

### Future (gated)
- POST /export (paid): full dataset export, requires API key.
- GET /plugins/:slug/security-report (full findings): requires API key for non-public details.
