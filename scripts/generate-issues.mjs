#!/usr/bin/env node
/**
 * Generates markdown stubs for issues (private repo fallback) under /docs/issues.
 * In GitHub cloud you'd call the REST API; here we create files to copy/paste or push.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const catalogPath = path.join(root, 'scripts', 'issues-catalog.json');
const outDir = path.join(root, 'docs', 'issues');

if (!fs.existsSync(catalogPath)) {
  console.error('Catalog not found:', catalogPath); process.exit(1);
}
const items = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
fs.mkdirSync(outDir, { recursive: true });

const labelMap = (item) => [
  `story:${item.id}`,
  `epic:${item.epic}`,
  `priority:${item.priority}`,
  'status:ready',
  'type:feature'
];

for (const it of items) {
  const filename = `${it.id}-${it.title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}.md`;
  const filePath = path.join(outDir, filename);
  if (fs.existsSync(filePath)) continue;
  const body = `# ${it.id}: ${it.title}\n\n` +
`Epics: ${it.epic}\nPriority: ${it.priority}\nLabels: ${labelMap(it).join(', ')}\n\n` +
`## Description\n${it.description}\n\n` +
`## Acceptance Criteria (see PRD for full details)\n- Refer to PRD story ${it.id}.\n- Implement tests per DevelopmentPlan DoD.\n\n` +
`## Definition of Done\n- Code + types + tests\n- Lint/typecheck clean\n- Determinism unaffected unless story requires\n- Update docs if public surface changes\n`;
  fs.writeFileSync(filePath, body, 'utf8');
  console.log('Created', filePath);
}

console.log('Issue stubs generated in', outDir);
