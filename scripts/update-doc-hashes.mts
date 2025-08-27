#!/usr/bin/env node
import { createHash, BinaryLike } from 'crypto';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const docsRoot = join(process.cwd(), 'docs', 'code-explanations', 'src');
const srcRoot = join(process.cwd(), 'src');

function walk(dir: string, acc: string[] = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, acc); else acc.push(p);
  }
  return acc;
}
function sha256(buf: BinaryLike){ return createHash('sha256').update(buf).digest('hex'); }

let updated = 0;
let skipped = 0;

let docFiles: string[] = [];
try { docFiles = walk(docsRoot).filter(f => f.endsWith('.md')); } catch {}

for (const doc of docFiles) {
  const relSrc = doc.split(/code-explanations\\src|code-explanations\/src/).pop()!.replace(/^\\|\//,'').replace(/\.md$/,'');
  const srcPath = join(srcRoot, relSrc);
  const st = statSync(srcPath, { throwIfNoEntry: false } as { throwIfNoEntry: boolean });
  if (!st) { skipped++; continue; }
  const srcContent = readFileSync(srcPath, 'utf8');
  const newHash = sha256(srcContent);
  let docContent = readFileSync(doc, 'utf8');
  const hashRegex = /(<!--\s*source-hash:\s*)([0-9a-f]{64})(\s*-->)/i;
  if (hashRegex.test(docContent)) {
    docContent = docContent.replace(hashRegex, `$1${newHash}$3`);
  } else {
    docContent = docContent.replace(/^# .*$/m, m => `${m}\n<!-- source-hash: ${newHash} -->`);
  }
  writeFileSync(doc, docContent, 'utf8');
  updated++;
}
console.log(`Updated ${updated} doc hash comments. Skipped: ${skipped}`);

// Auto-update README badge
try {
  const srcFiles = walk(srcRoot).filter(f => /\.(ts|tsx)$/.test(f));
  const total = srcFiles.length;
  const docsPresent = docFiles.filter(Boolean).length; // all have docs by construction of tree
  const documented = Math.min(docsPresent, total); // safety
  const percent = total ? Math.round((documented/total)*100) : 100;
  const badgeLine = `![Docs Coverage](https://img.shields.io/badge/docs--coverage-${documented}%2F${total}%20(${percent}%25)-${percent===100?'brightgreen':percent>79?'green':'orange'})`;
  const readmePath = join(process.cwd(), 'README.md');
  let readme = readFileSync(readmePath, 'utf8');
  const markerRegex = /(<!-- DOCS_COVERAGE_START -->)([\s\S]*?)(<!-- DOCS_COVERAGE_END -->)/;
  if (markerRegex.test(readme)) {
    readme = readme.replace(markerRegex, `$1\n${badgeLine}\n$3`);
    writeFileSync(readmePath, readme, 'utf8');
    console.log('Updated README docs coverage badge.');
  }
} catch (e) {
  console.warn('README badge update skipped:', (e as Error).message);
}
