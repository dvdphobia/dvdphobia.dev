#!/usr/bin/env node
// Sync markdown posts from a GitHub repo tarball into the local posts/ folder.
// Env: POSTS_GITHUB_REPO=owner/repo, POSTS_GITHUB_REF=main, POSTS_GITHUB_DIR=posts

import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { Readable } from 'node:stream';
import * as tar from 'tar';

const REPO = process.env.POSTS_GITHUB_REPO;
const REF = process.env.POSTS_GITHUB_REF || 'main';
const DIR = (process.env.POSTS_GITHUB_DIR || 'posts').replace(/^\/+|\/+$/g, '');

async function ensureDir(p) {
  await fsp.mkdir(p, { recursive: true });
}

async function* walk(dir) {
  const entries = await fsp.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      yield* walk(full);
    } else if (e.isFile()) {
      yield full;
    }
  }
}

async function main() {
  if (!REPO) {
    console.log('[sync-posts] Skipping: POSTS_GITHUB_REPO not set.');
    return; // treat as no-op in local builds
  }
  const tarUrl = `https://codeload.github.com/${REPO}/tar.gz/${encodeURIComponent(REF)}`;
  console.log(`[sync-posts] Downloading ${tarUrl} ...`);
  const res = await fetch(tarUrl, { cache: 'no-store' });
  if (!res.ok) {
    console.error(`[sync-posts] Tarball fetch failed: ${res.status} ${res.statusText}`);
    process.exit(1);
  }
  const tmp = await fsp.mkdtemp(path.join(os.tmpdir(), 'posts-sync-'));
  const extractDir = path.join(tmp, 'extract');
  await ensureDir(extractDir);
  await new Promise((resolve, reject) => {
    const parser = tar.x({ cwd: extractDir, gzip: true });
    parser.on('error', reject);
    parser.on('end', resolve);
    const nodeStream = Readable.fromWeb(res.body);
    nodeStream.on('error', reject);
    nodeStream.pipe(parser);
  });
  // Find the root extracted folder (repo-ref/) and then the desired DIR within it
  const top = (await fsp.readdir(extractDir))[0];
  const repoRoot = path.join(extractDir, top || '');
  const contentRoot = path.join(repoRoot, DIR);
  const exists = fs.existsSync(contentRoot);
  if (!exists) {
    console.error(`[sync-posts] Directory not found in tarball: ${DIR}`);
    process.exit(1);
  }
  // Updated destination: src/content/posts
  const dest = path.join(process.cwd(), 'src', 'content', 'posts');
  await ensureDir(dest);
  let count = 0;
  for await (const file of walk(contentRoot)) {
    if (!/\.md$/i.test(file)) continue;
    const base = path.basename(file);
    const out = path.join(dest, base);
    await fsp.copyFile(file, out);
    count++;
  }
  console.log(`[sync-posts] Copied ${count} markdown file(s) to posts/`);
}

main().catch((e) => {
  console.error('[sync-posts] Error:', e?.stack || e?.message || e);
  process.exit(1);
});
