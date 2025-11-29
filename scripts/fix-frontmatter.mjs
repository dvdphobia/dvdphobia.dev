#!/usr/bin/env node
// Attempt to move a trailing frontmatter block (at end) to the top of the file.
// Use with caution; creates a .bak file per modified post.
import fs from 'node:fs';
import path from 'node:path';

// Updated path: posts are now under src/content/posts
const postsDir = path.join(process.cwd(), 'src', 'content', 'posts');
if (!fs.existsSync(postsDir)) {
  console.error('No posts directory found.');
  process.exit(1);
}

const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'));
let fixed = 0;
for (const f of files) {
  const full = path.join(postsDir, f);
  const txt = fs.readFileSync(full, 'utf8');
  const lines = txt.split(/\r?\n/);
  if (lines[0].trim() === '---') continue; // already fine
  // Look for a block that starts with --- and ends with --- near the bottom.
  const startIdx = lines.findIndex((l, i) => l.trim() === '---' && i > 0);
  if (startIdx === -1) continue;
  const endIdx = lines.findIndex((l, i) => i > startIdx && l.trim() === '---');
  if (endIdx === -1) continue;
  // Extract block
  const block = lines.slice(startIdx, endIdx + 1).join('\n');
  // Remove block from original location
  const remaining = [...lines.slice(0, startIdx), ...lines.slice(endIdx + 1)];
  const content = remaining.join('\n').replace(/^\n+/, '');
  if (/^---\n/.test(content)) continue; // something odd
  const newTxt = block + '\n\n' + content; // move block to top
  fs.copyFileSync(full, full + '.bak');
  fs.writeFileSync(full, newTxt, 'utf8');
  console.log(`Fixed frontmatter position in ${f}`);
  fixed++;
}
console.log(`Done. Fixed ${fixed} file(s). Backups created with .bak extension.`);
