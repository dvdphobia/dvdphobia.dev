# Portfolio & Blog (Next.js)

Clean white & black theme using JetBrains Mono across the site. Blog uses markdown files with gray-matter, remark, and reading-time. SEO includes metadata, OpenGraph, JSON-LD, sitemap, robots.txt, and responsive design.

## Run Locally

```powershell
npm install
npm run dev
```

Open http://localhost:3000

## Build & Sitemap

```powershell
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

```powershell
$env:POSTS_GITHUB_REPO = "owner/repo"
$env:POSTS_GITHUB_DIR = "posts"         # optional
$env:POSTS_GITHUB_REF = "main"          # optional
$env:POSTS_GITHUB_TOKEN = "ghp_xxx"     # optional (needed for private repos)
$env:POSTS_REMOTE_ONLY = "true"         # optional; force remote-only
$env:POSTS_CACHE_TTL_SECONDS = "15"     # optional; fresher listing
npm run dev
```

Or, avoid runtime GitHub calls entirely with build-time sync:

```powershell
$env:POSTS_GITHUB_REPO = "owner/repo"
$env:POSTS_GITHUB_DIR = "posts"
$env:POSTS_GITHUB_REF = "main"
npm run sync:posts   # copies .md files into local posts/
npm run dev          # now reads from local files (no rate limits)
```

### Validate Frontmatter

Ensure all posts have their YAML frontmatter at the top:

```powershell
npm run validate:posts
```

Auto-fix misplaced (trailing) frontmatter blocks (creates .bak backups):

```powershell
npm run fix:frontmatter
```

## Conventions

- **Imports:** Use absolute aliases per `jsconfig.json` (e.g., `@/components/...`).
- **Naming:** Components in `PascalCase.jsx`; pages in `page.js` per Next App Router.
- **Formatting:** Run `npm run format` before commits; ESLint warnings are okay for `console.warn/error`.
- **Images:** Prefer Next `Image` component; `@next/next/no-img-element` is disabled where needed.

## Customize

- Update site name, DVDphobia, and links in `app/layout.js` and `app/page.js`.
- Adjust styling in `app/globals.css`.
- Add projects to `app/portfolio/page.js`.
- To enable AdSense only on blog posts:
  1.  Add `NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX` to `.env.local`.
  2.  In `app/blog/[slug]/page.js`, uncomment the top/bottom ad placeholders and set real slot IDs.
  3.  Leave them commented to keep the site minimal.

```powershell
$env:POSTS_GITHUB_REPO = "DVDphobia/blog_post"
$env:POSTS_GITHUB_DIR = "posts"
$env:POSTS_GITHUB_REF = "main"
$env:POSTS_REMOTE_ONLY = "true"
$env:POSTS_CACHE_TTL_SECONDS = "15"
npm run dev
```
