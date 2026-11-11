# Figma Plugin Monetization - Raw Fetch (Search Results)
URL: Multiple sources via search
Date: 2026-11-11

## Figma Community Payments (Official)
- 15% flat fee on Community sales
- Includes: payment processing, payouts, purchase support, refund management, tax collection/remittance, delivery, fraud monitoring
- Min price: $2.00 (whole numbers USD)
- One-time payments: price change anytime
- Subscriptions: price increase once per 30 days, max 50% at a time, 16-day notice
- Paid plugins (one-time): no free trial by default
- Paid plugins (subscriptions): 7-day free trial by default
- Widgets: no free trial by default; Payments API for custom trials

## Seller Approval Status (Critical)
- **PAUSED FOR NEW SELLERS** (2024-2026)
- "We are not approving new creators to sell paid files on Community at this time" - Figma Support (Aug 2026)
- Only plugins can be sold (not widgets/files) for new creators
- Requirement: Stripe account in Stripe-supported country
- Team vs Individual creator: only Individual creator can sell paid plugins

## External Payments (Allowed)
- "You can charge for your plugin using an external flow (Stripe, Lemon Squeezy), as long as you don't put payment form inside plugin UI" - Figma staff (2022, confirmed 2025)
- Must redirect to external page
- License key validation implemented by developer

## Revenue Data (GitHub Analysis - yuanqing/figma-plugins-monetization-stats)
- Total plugins analyzed: 1,079
- Free: 981 (90.92%) - 8,064,903 installs (85.29%), 77,220 likes (82.29%)
- Paid: 98 (9.08%) - 1,391,402 installs (14.71%), 16,615 likes (17.71%)
- Free with funding link: 51 plugins

## Case Studies (BalanceYZ)
- Figma to Code: 600,000+ installs, one developer, token-based $0.10-$0.50 per export
- AI Plugins (2024 wave): copywriting, image gen, component AI
- Pay-per-use token packs: 100/500/1000 tokens, fixed debit per action
- Subscription + token allowance model

## Platform Fee Comparison
| Platform | Fee | Model | Tax | Subscriptions | License Tools |
|----------|-----|-------|-----|---------------|---------------|
| Figma Payments | 15% | Community | Included | Included | Native |
| Gumroad | 10% + $0.50 | MoR | Included | Included | License keys |
| Lemon Squeezy | 5% + $0.50 | MoR | Included | Included | License keys + usage billing |