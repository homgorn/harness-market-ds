# Homebrew Formulae Analytics - Raw Fetch
URL: https://formulae.brew.sh/analytics/
Date: 2026-11-11

## Reports
- Repository analytics: Current and annual PR, issue, security advisory, contributor, release and catalogue counts from 2009 onwards
- Homebrew release analytics: Release history and commits, PR references and contributors per release from Git
- Package download analytics: GitHub download counts compared with 30-day install events
- Package history analytics: Formula version updates, revisions and bottle rebuilds, plus formula and cask catalogue history
- Package security analytics: The advisory database and findings for current formula versions

## Events (with JSON API endpoints)
- Formula Install Events: 30d, 90d, 365d
- Formula Install On Request Events: 30d, 90d, 365d
- Cask Install Events: 30d, 90d, 365d
- Formula Build Error Events: 30d, 90d, 365d
- OS Versions for Events: 30d, 90d, 365d
- Homebrew Developer Configuration for Events: 30d, 90d, 365d
- Homebrew Environment Configuration Events: 30d, 90d, 365d
- OS/Architecture/CI for Events: 30d, 90d, 365d
- Homebrew Prefixes for Events: 30d, 90d, 365d
- Homebrew Versions for Events: 30d, 90d, 365d
- Homebrew Command Events: 30d, 90d, 365d
- Homebrew Command and Options Events: 30d, 90d, 365d
- Homebrew Core Test Bot Events: 30d, 90d, 365d

## JSON API Endpoints
- `/api/analytics/install/homebrew-core/${DAYS}.json`
- `/api/analytics/install-on-request/homebrew-core/${DAYS}.json`
- `/api/analytics/cask-install/homebrew-cask/${DAYS}.json`
- `/api/analytics/build-error/homebrew-core/${DAYS}.json`

Fork me on GitHub link