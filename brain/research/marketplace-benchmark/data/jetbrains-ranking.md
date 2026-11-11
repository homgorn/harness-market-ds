# JetBrains Marketplace Plugin Ranking - Raw Fetch
URL: https://plugins.jetbrains.com/docs/marketplace/plugins-ranking.html
Date: 2026-11-11

[Full ranking algorithm documentation]

## Plugin Categories
- Staff-picked plugins (product teams select based on usefulness + popularity)
- Top downloaded plugins (ranked by total downloads)
- New plugins (ranked by last update date)
- Top-rated plugins (ranked by rating)

## Search Results Ranking Factors
1. Relevance of search term (plugin ID, name, description, tags, vendor name) - scored with declensions/conjugations
2. Staff picks boost (coefficient added)
3. Popularity coefficient: `log10(1 + 5 * downloads_count)`
4. Rating coefficient: `sqrt(rating)` where rating formula documented separately

## Sort Options
- Downloads, update date, publish date, name, rating

## Filters
- Paid/Free
- Plugins with source code
- Product-specific (via product selection filter)

## Revenue Sharing
15% commission (capped at 25%), reseller fee from JetBrains share