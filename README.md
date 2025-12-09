# Portfolio & Blog (Next.js, JavaScript)

Clean white & black theme using JetBrains Mono across the site. Blog uses markdown files with gray-matter, remark, and reading-time. SEO includes metadata, OpenGraph, JSON-LD, sitemap, robots.txt, and responsive design.

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
image: https://your-image-url.com/image.jpg  # Optional: Featured image for hero section
tags: [javascript, tutorial, web-development]  # Optional: Post tags
---

Post content in markdown...
```

### Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Post title displayed in hero section |
| `date` | Yes | Publication date (YYYY-MM-DD) |
| `excerpt` | Yes | Short description for SEO and listings |
| `image` | No | Featured image URL (displayed in hero section) |
| `tags` | No | Array of tags for categorization |

### Hero Section

Each blog post displays a hero section after the navbar:
- **With image**: Title on the left, featured image on the right (2-column layout)
- **Without image**: Centered title with metadata
- Tags are displayed below the date and reading time

### Option: Pull posts from another GitHub repo

You can source posts from a separate repository instead of local files. Set these environment variables:

- `POSTS_GITHUB_REPO` — required to enable remote posts. Format: `owner/repo` (e.g., `DVDphobia/my-posts`).
- `POSTS_GITHUB_DIR` — directory path in that repo containing markdown files. Default: `posts`.
- `POSTS_GITHUB_REF` — branch or tag to read from. Default: `main`.
- `POSTS_GITHUB_TOKEN` — optional token to access private repos or increase rate limits.
- `POSTS_REMOTE_ONLY` — set to `true` to disable local fallback and use only the remote repo.
- `POSTS_CACHE_TTL_SECONDS` — optional; cache TTL for remote fetches. Default 60. Set to 0 to disable caching.

Behavior:

- If `POSTS_GITHUB_REPO` is set, the app fetches `.md` files from that repo/dir at runtime/build.
- If remote fetch fails for any reason, it falls back to local `posts/*.md`.
- Minimal in-memory caching avoids repeated API calls; TTL is ~5 minutes in dev and ~1 hour in prod.
- When unauthenticated, the app falls back to listing via a repo tarball to avoid GitHub API rate limits.

In a local dev shell (runtime fetch):

```bash
export POSTS_GITHUB_REPO="owner/repo"
export POSTS_GITHUB_DIR="posts"         # optional
export POSTS_GITHUB_REF="main"          # optional
export POSTS_GITHUB_TOKEN="ghp_xxx"     # optional (needed for private repos)
export POSTS_REMOTE_ONLY="true"         # optional; force remote-only
export POSTS_CACHE_TTL_SECONDS="15"     # optional; fresher listing
npm run dev
```

Or, avoid runtime GitHub calls entirely with build-time sync:

```bash
export POSTS_GITHUB_REPO="owner/repo"
export POSTS_GITHUB_DIR="posts"
export POSTS_GITHUB_REF="main"
npm run sync:posts   # copies .md files into local posts/
npm run dev          # now reads from local files (no rate limits)
```

### Validate frontmatter

Ensure all posts have their YAML frontmatter at the top:

```bash
npm run validate:posts
```

Auto-fix misplaced (trailing) frontmatter blocks (creates .bak backups):

```bash
npm run fix:frontmatter
```

## Customize

- Update site name, DVDphobia, and links in `app/layout.js` and `app/page.js`.
- Adjust styling in `app/globals.css`.
- Add projects to `app/portfolio/page.js`.
- To enable AdSense only on blog posts:
	1. Add `NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX` to `.env.local`.
	2. In `app/blog/[slug]/page.js`, uncomment the top/bottom ad placeholders and set real slot IDs.
	3. Leave them commented to keep the site minimal.

## Ads

All ad components are in `src/components/ads/Ads.jsx`. Set `NEXT_PUBLIC_DISABLE_ADS=1` to disable all ads globally.

### Components

| Component | Description |
|-----------|-------------|
| `AdSense` | Google AdSense slot |
| `AdSlot` | HighPerformanceFormat ad (300x250 default) |
| `MonetagScripts` | Loads Monetag tag script |
| `MonetagOptIn` | User opt-in gate for Monetag ads |

### Usage

```jsx
import { AdSense, AdSlot, MonetagOptIn } from '@/components/ads/Ads';

// Google AdSense (requires NEXT_PUBLIC_ADSENSE_CLIENT env var)
<AdSense slot="1234567890" />

// HighPerformanceFormat
<AdSlot width={300} height={250} adKey="your-ad-key" />

// Monetag with user opt-in
<MonetagOptIn position="sidebar" />
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_ADSENSE_CLIENT` | Google AdSense client ID (e.g., `ca-pub-XXX`) |
| `NEXT_PUBLIC_DISABLE_ADS` | Set to `1` to disable all ads |
| `NEXT_PUBLIC_MONETAG_AUTO` | Set to `1` to auto-load Monetag without opt-in |



export POSTS_GITHUB_REPO="DVDphobia/blog_post"
export POSTS_GITHUB_DIR="posts"
export POSTS_GITHUB_REF="main" 
export POSTS_REMOTE_ONLY="true" 
export POSTS_CACHE_TTL_SECONDS="15"
npm run dev
