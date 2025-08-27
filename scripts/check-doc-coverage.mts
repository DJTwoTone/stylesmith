#!/usr/bin/env node
import { createHash } from 'crypto';
import { readFileSync, existsSync } from 'fs';
import { glob } from 'glob';

const srcFiles = glob.sync('src/**/*.{ts,tsx}', { ignore: ['**/*.d.ts'] });
const missing: string[] = [];
const hashMismatch: string[] = [];
const missingSections: Record<string,string[]> = {};

const requiredSections = [
  '## Purpose',
  '## High-Level Role',
  '## Imports',
  '## Exports',
  '## Edge Cases',
  '## Change Risk'
];

function sha256(buf: string){ return createHash('sha256').update(buf).digest('hex'); }

for (const file of srcFiles) {
  const docPath = `docs/code-explanations/${file}.md`;
  if (!existsSync(docPath)) { missing.push(file); continue; }
  const doc = readFileSync(docPath, 'utf8');
  const m = doc.match(/<!--\s*source-hash:\s*([0-9a-f]{64})\s*-->/i);
  if (m) {
    const current = m[1];
    const srcContent = readFileSync(file, 'utf8');
    const actual = sha256(srcContent);
    if (current !== actual) hashMismatch.push(file);
  } else {
    hashMismatch.push(file + ' (no hash comment)');
  }
  const missingReq = requiredSections.filter(s => !doc.includes(s));
  if (missingReq.length) missingSections[file] = missingReq;
}

const total = srcFiles.length;
const documented = total - missing.length;
// Emit machine-readable coverage for README badge updates
console.log(`COVERAGE_SUMMARY ${documented}/${total}`);

if (missing.length || hashMismatch.length || Object.keys(missingSections).length) {
  console.error('Documentation check failed.');
  if (missing.length) {
    console.error('\nMissing docs for:');
    missing.forEach(f => console.error(' -', f));
  }
  if (hashMismatch.length) {
    console.error('\nHash mismatches:');
    hashMismatch.forEach(f => console.error(' -', f));
  }
  if (Object.keys(missingSections).length) {
    console.error('\nDocs missing required sections:');
    for (const [f, secs] of Object.entries(missingSections)) {
      console.error(` - ${f}: ${secs.join(', ')}`);
    }
  }
  process.exit(1);
}
console.log('Documentation coverage & hashes OK.');
