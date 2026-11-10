# Monetization — Summary

**Project:** harness-market-ds (DSH plugin catalog)
**Full research:** `01-monetization.md`
**Date:** 2026-11-10

## TL;DR
Seven models evaluated. For a free/OSS plugin catalog, only **ads/sponsorship + donations + (later) API/data** are realistically compatible. Premium plugins, commissions, affiliate links, and SaaS add-ons require either paid products or a store surface that DSH does not have.

## Models & verdicts
| Model | Fit for DSH | Key numbers |
|---|---|---|
| Ads/sponsorship (featured slots) | **Yes (primary)** | $50–$225/mo per featured slot; G2 $2.3k–$32k/yr |
| Premium plugins / paid tiers | No (plugins free) | Figma 15%, JetBrains 15%, MCP 15% commission |
| Commissions (marketplace) | No (no transactions) | 0% up to $1M (Shopify/Atlassian) then 15–25% |
| Donations/subscriptions | **Yes** | GitHub Sponsors $100M+ total; webpack $400k/yr |
| Affiliate links | No (free products) | 10–30% / $50–$200 CPA software affiliates |
| API/data access | **Yes (later)** | Usage-based / tiered API pricing |
| SaaS add-ons | Defer | Raycast Pro, Brilliant Directories $97/mo |

## Recommended stack (phased)
1. **Now:** featured/sponsored slots (clearly labeled) + GitHub Sponsors/Open Collective.
2. **Next:** clean JSON/CDN feed as free API; paid higher-rate tier only on demand.
3. **Later/optional:** SaaS add-ons if a real paid feature emerges; premium/commission only if catalog becomes a licensed store.

## Top risks
- Low traffic → no ad demand; free-rider → low donation conversion (0.1–2%).
- Platform fee hikes cause vendor exodus (Envato 50% backlash, 2026).
- Trust erosion from undisclosed paid placement (G2/Capterra criticism).

## Confidence
- Commission rates & platform examples: 9/10 (primary sources).
- Featured-listing CPMs for dev-tool catalogs: 6/10 (sparse published data).

## Sources
See `01-monetization.md` §11 (18 primary sources with URL + date). Queries logged in `queries.log`.