# Faceted Navigation SEO Best Practices - Raw Fetch (Search Results)
URL: Multiple sources via search
Date: 2026-11-11

## Core Principles (Lumar, Scandiweb, StudioHawk, ClickRank, Sitebulb, Google)

### URL Structure
- **Clean, static URLs**: `/shoes/running/nike/black/` not `?category=running&brand=nike&color=black`
- **Deterministic facet order**: Enforce strict alphabetical/hierarchical order to prevent duplicate variations
- **Hyphens for separation**: Not underscores
- **UTF-8 encoding**: For non-ASCII characters
- **Avoid**: long ID numbers, fragments, underscores, complex params, session IDs, dynamic calendars

### Canonical Tags
- **Self-referencing canonical** for indexable facet pages
- **Canonical to parent category** for near-duplicate variants
- **Never combine** `noindex` with canonical to another URL (opposite signals)
- **robots.txt disallow** for sort orders, infinite combinations, worthless parameters

### Indexation Strategy
- **Indexable facets**: High search volume, distinct intent, enough products, stable page with unique title/copy
- **Non-indexable**: Low-value, sort orders, pagination beyond page 1, filter combinations with no demand
- **noindex, follow** for filtered pages you want crawled for link discovery but not indexed
- **robots.txt** for worthless parameters (session IDs)

### Content Requirements for Indexable Facets
- Unique title tag
- Single descriptive H1
- Concise introductory paragraph tailored to query
- Integrated into site architecture (linked from parent category, related facets, XML sitemap)

### Google's URL Best Practices
- Simple, descriptive words in audience's language
- Hyphens separate words
- Key-value pairs use `=` and `&`, commas for multiple values
- Avoid long IDs, fragments, underscores
- Complex URLs, excessive params, session IDs, dynamic calendars → indexing problems

### E-commerce URL Structure (Google Search Central)
- Crawlable URL structure requirements
- Use robots.txt to block problematic URLs (dynamic search results, infinite spaces)
- Manage faceted navigation crawling
- Optional query params → canonical URL without params
- Unique URLs per variant → canonical link on all variants
- Sitemap files
- Links via `<a href>` with meaningful text (not "click here")
- Noindex empty categories
- Pagination/incremental loading considerations

### Programmatic SEO (SEOProfy, SearchAtlas, TheBCMS, AMW, SingleGrain, SEOClarity, SEOMatic, Prismic)
- **Template + Database = Thousands of pages**
- **Structural uniqueness** = primary governing attribute for long-term indexation
- **Semantic vector collapse** = fatal mistake (boilerplate text across pages)
- **Unified @graph JSON-LD**: WebPage + About Entity + ItemPage/SoftwareApplication
- **Internal linking automation**: by categories, tags, keywords
- **HTML sitemap + dynamic navigation**
- **Meta tags template**: dynamic titles/descriptions with placeholders
- **Pillar-cluster model**: core pillars + auto-generated cluster pages
- **Link equity management**: canonical tags prevent duplication
- **Hierarchy reflection in URLs**: `/real-estate/california/los-angeles/3-bedroom/`
- **Keyword inclusion in URLs**: primary keywords near beginning
- **Content database** = structured data source
- **Quality over quantity**: avoid "too big now too thin"

### Tools for Programmatic SEO
- Custom SSG (Astro, Next.js) = maximum control
- Screaming Frog for technical audits
- Platforms: Byword, Prismic, SEOMatic (handle canonicals, sitemaps, internal linking automatically)