# Contributing

## How to contribute

1. Fork the repository.
2. Create a feature branch: `git checkout -b feat/your-feature`.
3. Follow the spec-driven workflow: update specs before code.
4. Run gates: `node scripts/forge/gates.mjs --all` (when available).
5. Open a PR with a clear description.

## Code style

- TypeScript strict mode.
- ESLint + Prettier.
- Conventional commits.

## Reporting bugs

Use GitHub Issues. Attach the site's exported log if applicable.

## Adding a plugin to the catalog

This repository is the catalog site, not the plugin list. To get a plugin listed, open a PR in the `awesome-dsh-plugin` registry. This site picks it up automatically via daily sync.

## License

By contributing, you agree your contributions are licensed under MIT.
