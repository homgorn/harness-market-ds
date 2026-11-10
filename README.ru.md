# Каталог плагинов DSH Harness

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Многоязычный, SEO/GEO/AEO-оптимизированный веб-каталог плагинов **DeepSeek Harness (DSH)**. Просмотр, поиск, фильтрация и сравнение 5000+ community-плагинов с указанием статуса безопасности, совместимости и локализованными описаниями. Сделано на Astro + Cloudflare Pages.

**Сайт:** https://harness-market-ds.refertur.net (ожидает DNS)
**Оригинал:** https://dshmarket.com (мы стремимся быть лучше)

## Возможности

- 🌐 **7 языков:** английский, русский, китайский, испанский, немецкий, французский, японский
- 🔍 **Полнотекстовый поиск** через Pagefind (на клиенте, быстро)
- 🏷️ **Фильтры:** категория, подкатегория, теги, статус безопасности, совместимость, сортировка
- 🛡️ **Сканирование безопасности:** Semgrep + npm audit + YARA; вредоносные помечаются и получают отчёт
- 📱 **PWA:** офлайн-доступ к каталогу
- ⚡ **Быстро:** статический HTML, LCP ≤ 2.0s, JS ≤ 90 KB
- 🤖 **Готово для AEO:** JSON-LD граф знаний, llms.txt, .md-двойники страниц
- 🔄 **Ежедневная синхронизация** с CDN с проверкой количества
- 💰 **Монетизация:** спонсорские слоты, донаты, партнёрские ссылки, API/данные (в будущем)

## Быстрый старт

```bash
npm install
npm run sync      # загрузить каталог
npm run dev       # http://localhost:4321
npm run build     # статика в dist/
```

## Структура проекта

См. `docs/specs/` (спеки SDD), `docs/architecture/` (архитектура), `brain/` (LLM-вики).

## Участие

См. [CONTRIBUTING.md](CONTRIBUTING.md). Чтобы добавить плагин в каталог, откройте PR в реестре [awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin).

## Лицензия

MIT — см. [LICENSE](LICENSE).
