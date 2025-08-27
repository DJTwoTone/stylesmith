#!/usr/bin/env tsx
/**
 * Generates traceability matrix table between issues and development plan.
 * Scans docs/issues for files named GH-XXX-*.md and extracts title & epic mapping.
 * Replaces block between TRACEABILITY:START and TRACEABILITY:END in docs/DevelopmentPlan.md
 */
import { promises as fs } from 'fs';
import path from 'path';

const ISSUES_DIR = path.resolve('docs', 'issues');
const PLAN_FILE = path.resolve('docs', 'DevelopmentPlan.md');

interface IssueMeta { id: string; title: string; epic?: string; }

async function main() {
  const files = await fs.readdir(ISSUES_DIR);
  const issues: IssueMeta[] = [];
  for (const f of files) {
    if (!/^GH-\d{3}-/.test(f)) continue;
    const full = path.join(ISSUES_DIR, f);
    const content = await fs.readFile(full, 'utf8');
    const firstLine = content.split(/\r?\n/).find(l => l.startsWith('# ')) || '';
    const m = firstLine.match(/#\s+(GH-\d{3}):\s*(.+)/);
    if (!m) continue;
    const id = m[1];
    const title = m[2].trim();
    const epicLine = content.split(/\r?\n/).find(l => l.startsWith('Epics:')) || '';
    const epic = epicLine.replace('Epics:', '').trim() || undefined;
    issues.push({ id, title, epic });
  }
  issues.sort((a,b) => a.id.localeCompare(b.id));

  // Mapping helpers (manual mapping to WP + test IDs; could be external JSON later)
  const wpMap: Record<string,string> = {
    'GH-001':'WP-01','GH-002':'WP-02','GH-003':'WP-03','GH-004':'WP-04','GH-005':'WP-05','GH-006':'WP-06','GH-007':'WP-07','GH-008':'WP-09','GH-009':'WP-10','GH-010':'WP-11','GH-011':'WP-12','GH-012':'WP-12','GH-013':'WP-08/WP-19','GH-014':'WP-13','GH-015':'WP-14','GH-016':'WP-15','GH-017':'WP-18','GH-018':'WP-16','GH-019':'WP-17','GH-020':'WP-10','GH-021':'WP-01','GH-022':'WP-20','GH-023':'WP-22','GH-024':'WP-01','GH-025':'WP-12','GH-026':'WP-02','GH-027':'WP-21','GH-028':'WP-07','GH-029':'WP-17','GH-030':'WP-06/WP-19'
  };
  const testIdMap: Record<string,string> = {
    'GH-001':'tokens.crud.unit / tokens.validation.unit','GH-002':'typography.scale.unit','GH-003':'contrast.engine.unit','GH-004':'tokens.import.parser.unit','GH-005':'utilities.families.toggle.integration','GH-006':'utilities.variants.integration','GH-007':'determinism.double-build.integration','GH-008':'components.selection.unit','GH-009':'export.docs.integration','GH-010':'export.demo.script.unit','GH-011':'export.zip.contents.integration','GH-012':'export.clipboard.unit','GH-013':'size.indicator.ui.integration','GH-014':'size.purge.simulation.unit','GH-015':'persistence.basic.integration','GH-016':'migration.sequence.integration','GH-017':'analytics.optin.unit','GH-018':'a11y.axe.smoke.e2e','GH-019':'theming.blueprint.integration','GH-020':'export.app-only.filter.unit','GH-021':'tokens.error.feedback.unit','GH-022':'performance.utilities.benchmark','GH-023':'privacy.no-network.integration','GH-024':'tokens.naming.flex.unit','GH-025':'export.reset.toggle.unit','GH-026':'typography.headings.map.unit','GH-027':'utilities.prefix.application.unit','GH-028':'hashing.summary.unit','GH-029':'accessibility.motion.pref.integration','GH-030':'size.threshold.config.unit'
  };

  const header = '| Story | Title (Short) | Epic | Work Package | Primary Test (Planned ID) |';
  const rows = issues.map(issue => `| ${issue.id} | ${issue.title} | ${issue.epic || ''} | ${wpMap[issue.id] || ''} | ${testIdMap[issue.id] || ''} |`);
  const table = [header,'|-------|---------------|------|--------------|---------------------------|',...rows].join('\n');

  let plan = await fs.readFile(PLAN_FILE,'utf8');
  const startMarker = '<!-- TRACEABILITY:START';
  const endMarker = '<!-- TRACEABILITY:END -->';
  const startIdx = plan.indexOf(startMarker);
  const endIdx = plan.indexOf(endMarker);
  if (startIdx === -1 || endIdx === -1) {
    console.error('Markers not found in DevelopmentPlan.md');
    process.exit(1);
  }
  const before = plan.substring(0, plan.indexOf('\n', startIdx) + 1);
  const after = plan.substring(endIdx);
  const newBlock = `${before}${table}\n${endMarker}`;
  plan = newBlock + after.substring(endMarker.length);
  await fs.writeFile(PLAN_FILE, plan, 'utf8');
  console.log('Traceability matrix updated.');
}

main().catch(e => { console.error(e); process.exit(1); });
