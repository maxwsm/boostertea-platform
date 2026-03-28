-- Migration 0001: Add blog_posts table

CREATE TABLE IF NOT EXISTS blog_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title_uk TEXT NOT NULL,
  title_en TEXT,
  title_es TEXT,
  excerpt_uk TEXT,
  excerpt_en TEXT,
  excerpt_es TEXT,
  content_uk TEXT NOT NULL,
  content_en TEXT,
  content_es TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  tags TEXT DEFAULT '[]',
  image TEXT,
  author_name TEXT NOT NULL DEFAULT 'BoosterTea Team',
  is_published INTEGER NOT NULL DEFAULT 0,
  is_featured INTEGER NOT NULL DEFAULT 0,
  views INTEGER NOT NULL DEFAULT 0,
  reading_time INTEGER DEFAULT 5,
  meta_title_uk TEXT,
  meta_title_en TEXT,
  meta_description_uk TEXT,
  meta_description_en TEXT,
  published_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS blog_posts_slug_idx ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS blog_posts_category_idx ON blog_posts(category);
CREATE INDEX IF NOT EXISTS blog_posts_published_idx ON blog_posts(is_published, published_at);
