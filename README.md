# Portfolio & Blog (Next.js, JavaScript)

Clean black & white theme using JetBrains Mono across the site. Blog uses markdown files with gray-matter, remark, and reading-time. SEO includes metadata, OpenGraph, JSON-LD, sitemap, robots.txt, and responsive design.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Build & export sitemap

```bash
npm run build
```

Sitemap and robots are created by `next-sitemap` at build time.

## Content

- Add posts as markdown files in `posts/*.md` with frontmatter:

```md
---
title: My Post Title
date: 2025-08-20
excerpt: Short description.
---

Post content in markdown...
```

## Customize

- Update site name, your name, and links in `app/layout.js` and `app/page.js`.
- Adjust styling in `app/globals.css`.
- Add projects to `app/portfolio/page.js`.
