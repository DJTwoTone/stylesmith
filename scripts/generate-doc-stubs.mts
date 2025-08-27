#!/usr/bin/env node
import { createHash } from 'crypto';
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'fs';
import { dirname, join, relative } from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const root = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(root, '..');
const SRC_GLOB = 'src/**/*.{ts,tsx}';

function sha256(buf: Buffer | string) {
  return createHash('sha256').update(buf).digest('hex');
}

const files = glob.sync(SRC_GLOB, { cwd: projectRoot, nodir: true, ignore: ['**/*.d.ts'] });

for (const file of files) {
  const docPath = join(projectRoot, 'docs', 'code-explanations', file + '.md');
  if (existsSync(docPath)) continue;
  const source = readFileSync(join(projectRoot, file), 'utf8');
  const hash = sha256(source);
  mkdirSync(dirname(docPath), { recursive: true });
  const rel = 'src/' + relative(join(projectRoot, 'src'), join(projectRoot, file)).replace(/\\/g, '/');
  const content = `# ${rel}\n<!-- source-hash: ${hash} -->\n\n## Purpose\n(TODO) Concise intent.\n\n## High-Level Role\n- (TODO)\n\n## Imports\n(TODO) Table: Import | Source | Why\n\n## Exports\n(TODO) List each exported symbol.\n\n## Internal Elements\n(TODO)\n\n## Edge Cases\n(TODO)\n\n## Change Risk\nLow | Medium | High (choose one).\n\n## Future Ideas\n- (optional)\n`;
  writeFileSync(docPath, content, 'utf8');
  console.log('Created stub', docPath);
}
