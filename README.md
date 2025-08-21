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

## Customize

- Update site name, DVDphobia, and links in `app/layout.js` and `app/page.js`.
- Adjust styling in `app/globals.css`.
- Add projects to `app/portfolio/page.js`.


export POSTS_GITHUB_REPO="DVDphobia/blog_post"
export POSTS_GITHUB_DIR="posts"
export POSTS_GITHUB_REF="main" 
export POSTS_REMOTE_ONLY="true" 
export POSTS_CACHE_TTL_SECONDS="15"
npm run dev