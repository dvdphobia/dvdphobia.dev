#!/usr/bin/env node
// Validate markdown frontmatter is at the top of each post.
import fs from 'node:fs';
import path from 'node:path';

// Updated path: posts are now under src/content/posts
const postsDir = path.join(process.cwd(), 'src', 'content', 'posts');
if (!fs.existsSync(postsDir)) {
  console.error('No posts directory found.');
  process.exit(1);
}

const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'));
let bad = 0;
for (const f of files) {
  const full = path.join(postsDir, f);
  const txt = fs.readFileSync(full, 'utf8');
  const firstLine = txt.split(/\r?\n/, 1)[0].trim();
  if (firstLine !== '---') {
    // check if there is a frontmatter-looking block later
    const idx = txt.indexOf('\n---\n');
    if (idx !== -1) {
      console.warn(`[WARN] ${f}: frontmatter block not at start (found later in file).`);
      bad++;
    } else {
      console.warn(`[WARN] ${f}: missing frontmatter block.`);
      bad++;
    }
  }
}
if (bad === 0) {
  console.log('All markdown files have frontmatter at top.');
} else {
  console.log(`${bad} file(s) need attention.`);
  process.exitCode = 2;
}
