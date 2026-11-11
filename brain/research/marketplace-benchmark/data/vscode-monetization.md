# VS Code Marketplace Monetization - Raw Fetch (Search Results)
URL: Multiple sources via search
Date: 2026-11-11

## Official Position
- **Zero built-in monetization** in VS Code Marketplace
- No paid extensions, no native subscription prompts, no tip jars
- Pricing label in manifest: `pricing: "Free"` or `pricing: "Trial"` (case-sensitive)
- Default: `Free`
- `sponsor` field in manifest: `{ "url": "..." }` for sponsorship links

## Paid Extensions History
- Visual Studio Marketplace (not VS Code) had paid extensions since 2016
- 30-day free trial, per-user monthly licensing
- Sold in groups (1, 5, 10, 20, 50, 100, 500, 1000, 10000)
- Assigned via Team Services account
- First paid non-Microsoft extensions: Agile Cards, TFS TimeTracker (Berichthaus, Spartez)
- **VS Code Marketplace specifically: no paid extensions ever launched**

## Third-Party Monetization Solutions
1. **code-checkout** (Dodo Payments blog)
   - 10% transaction fee
   - "Free to use, platform doesn't make money unless developers do"
   - 2 lines of code integration
   - License key validation via API

2. **Freemius** - WordPress-style platform for VS Code
3. **Custom license servers** - build your own

## "Free-to-Pro" Model (Recommended)
- Marketplace as distribution/discovery channel
- Third-party platform handles commercial side
- Most effective for sustainable business in VS Code ecosystem
- Microsoft has not added commerce to VS Code Marketplace

## Verified Publisher
- Verify ownership of eligible domain
- Adds verified badge to extension details
- DNS TXT record verification

## Extension Packs
- Bundle extensions via `extensionPack` in package.json
- Categorized as "Extension Packs"
- No functional dependencies between bundled extensions