# Software/digital marketplaces for synthesizing & selling

*Retrieval 2026-11-11. Claims labeled measured/reported/inferred.*

## Lemon Squeezy (measured 2026-11-11, docs.lemonsqueezy.com + lemonsqueezy.com/pricing)
- REST API JSON:API — list/retrieve products, variants, prices, files, orders,
  subscriptions, discounts, license keys, checkouts, webhooks, affiliates.
- **Products are NOT created via API** (files/upload and product create are
  dashboard-only; API is mostly read-side + checkout + license ops).
- Rate limit 300 calls/min. SDKs JS/Python.
- Fees: **5% + 50¢** per transaction, merchant of record (handles VAT/sales
  tax), 200+ countries payouts, no monthly fee, 500 free email subs tier.

## Paddle (measured 2026-11-11, paddle.com/pricing + developer.paddle.com)
- Merchant of record, same fee class: **5% + 50¢**,
- Full API: create products, prices, checkouts, subscriptions, invoices — more
  "developer-first" than Lemon Squeezy; sandbox, docs MCP.
- Stronger for B2B SaaS/subscriptions; less focus on one-off downloads.

## Gumroad (reported 2026-11-11; direct docs blocked/unreachable)
- Product CRUD via API (documented, `https://help.gumroad.com/article/...` and
  method docs at `/api` under "products"), license keys, file delivery with
  signed links, payout to PayPal/bank.
- Fee ~10% + 30¢ flat (reported), cheaper than LS/Paddle at volume? No — higher.
- Simpler marketplace surface (Gumroad Explore traffic), less B2B tooling.

## Envato Market / CodeCanyon (reported; help center unreachable 2026-11-11)
- Review-gated submissions; exclusivity affects fee (~12.5%–62.5% author share
  depending on exclusivity level). Strong demand for **themes, plugins, code,
  scripts** — but heavy human moderation, no meaningful publish API.
- Same-or-similar applies to ThemeForest/Envato Elements with custom licensing.

## Amazon KDP / books (not confirmed this session; reported)
- Requires AI-content disclosure; AI-generated text allowed with disclosure
  (KDP Content Guidelines). No royalty difference but you must declare usage.
- 35% or 70% royalty bands by price/territories; print on demand possible.

## Etsy digital downloads
- 6.5% transaction + listing/payment processing; strong for **templates,
  printables, wall art, planners**; code templates allowed if mostly original
  work; reselling third-party plugins as-is is against policy.

## GitHub Sponsors / OpenCollective / npm + releases
- Free distribution channel + trust funnels; cannot market paid binaries
  directly, ideal for open-core; Lemon/Paddle checkout links in README.

## MCP / agent-market channels
- Official MCP registry + mcp.so/Glama/Smithery are free listings and drive
  installs; they are not payment rails. Pair free registry listing with a paid
  Lemon/Paddle product (premium bundle).

## Verdict (recommended stack)
1. **Lemon Squeezy (or Paddle) as the payment rail** — MoR, license keys,
  5% + 50¢, global tax handled; Paddle if we lean to subscriptions/B2B.
2. **Envato/ThemeForest** only for original themes/code; no API automation.
3. **Etsy/KDP** only if we build original digital/book products; not for
  re-selling third-party plugins.
4. **npm + GitHub releases + MCP registries** for distribution/trust; plus our
  own catalog site (the asset we own).

## Open questions
- Gumroad/KDP/Envato exact current fees/TOS — fetch directly before committing.
- AI-generated book royalties/portfolio risk on KDP — needs manual check.
- Whether Lemon Squeezy will sell "plugins for DeepSeek Harness" bundle of
  third-party MIT codes (needs attribution — legal safe, ToS borderline).
