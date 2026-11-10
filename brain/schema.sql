-- Schema for build-time catalog database (SQLite)
CREATE TABLE IF NOT EXISTS plugins (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  security_status TEXT,
  compat_status TEXT,
  version TEXT,
  homepage TEXT,
  repository_url TEXT,
  added_at INTEGER,
  updated_at INTEGER
);

CREATE TABLE IF NOT EXISTS plugin_locales (
  plugin_slug TEXT,
  locale TEXT,
  title TEXT,
  description TEXT,
  PRIMARY KEY (plugin_slug, locale),
  FOREIGN KEY (plugin_slug) REFERENCES plugins(slug)
);

CREATE TABLE IF NOT EXISTS plugin_tags (
  plugin_slug TEXT,
  tag TEXT,
  PRIMARY KEY (plugin_slug, tag),
  FOREIGN KEY (plugin_slug) REFERENCES plugins(slug)
);

CREATE TABLE IF NOT EXISTS categories (
  slug TEXT PRIMARY KEY,
  title_en TEXT,
  title_ru TEXT,
  plugin_count INTEGER DEFAULT 0,
  parent TEXT
);

CREATE TABLE IF NOT EXISTS tags (
  slug TEXT PRIMARY KEY,
  plugin_count INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS authors (
  slug TEXT PRIMARY KEY,
  name TEXT,
  url TEXT,
  plugin_count INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS security_reports (
  plugin_slug TEXT PRIMARY KEY,
  status TEXT,
  findings_json TEXT,
  scanned_at TEXT,
  rewritten INTEGER DEFAULT 0,
  FOREIGN KEY (plugin_slug) REFERENCES plugins(slug)
);

CREATE TABLE IF NOT EXISTS triples (
  subject TEXT,
  predicate TEXT,
  object TEXT,
  source TEXT
);

CREATE INDEX IF NOT EXISTS idx_plugins_category ON plugins(category);
CREATE INDEX IF NOT EXISTS idx_plugins_security ON plugins(security_status);
CREATE INDEX IF NOT EXISTS idx_plugin_tags_tag ON plugin_tags(tag);
CREATE INDEX IF NOT EXISTS idx_triples_subject ON triples(subject);
