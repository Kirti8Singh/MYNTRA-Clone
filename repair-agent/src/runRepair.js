const fs = require('fs');
const path = require('path');
const config = require('./config');
const { requestRepair } = require('./repairAgent');
const { applyFix } = require('./applyFix');

/**
 * Reads one scenario's evidence off disk (per defect.json) and shapes it into
 * the agent input contract. defect.json is the one file you add per scenario;
 * everything else is read from wherever it points.
 *
 * Two defect.json shapes are supported, matching the plan's static/dynamic split:
 *
 * STATIC (axe caught it directly) — detection_method omitted or "axe":
 * {
 *   "state": "homepage",
 *   "axe_rule_id": "label",
 *   "accessibility_path": "evidence/SPA-A11Y-003/defective-accessibility.json",
 *   "dom_path": "evidence/SPA-A11Y-003/defective-dom.html",
 *   "source_files": ["Myntra React Clone/src/components/Header.jsx"]
 * }
 *
 * DYNAMIC (axe found nothing — a runtime state-change problem we identified
 * ourselves) — detection_method: "manual":
 * {
 *   "state": "homepage",
 *   "detection_method": "manual",
 *   "interaction": { "action": "...", "target": "..." },
 *   "accessibility_path": "accessibility/scenario002.json",
 *   "before_dom_path": "dom/scenario002_before.html",
 *   "after_dom_path": "dom/scenario002_after.html",
 *   "violation": { "id": "...", "impact": "...", "target": [...], "help": "...", "html": "..." },
 *   "source_files": ["Myntra React Clone/src/components/Header.jsx"]
 * }
 *
 * All *_path fields are relative to config.datasetDir. source_files are
 * relative to the git repo root (repoRoot argument) — for this project
 * that's "Skincare", since "Myntra React Clone" is a subdirectory of the
 * same repo, not its own.
 */
function loadScenarioAsAgentInput(scenarioId, repoRoot) {
  const scenarioDir = path.join(config.datasetDir, 'defects', scenarioId);
  const defect = JSON.parse(fs.readFileSync(path.join(scenarioDir, 'defect.json'), 'utf8'));

  const sourceFiles = defect.source_files.map((relPath) => ({
    path: relPath,
    content: fs.readFileSync(path.join(repoRoot, relPath), 'utf8'),
  }));

  const truncate = (text) => (text.length > 20000 ? text.slice(0, 20000) + '\n<!-- truncated -->' : text);

  if (defect.detection_method === 'manual') {
    // Dynamic case: axe saw no violation across the interaction, so the
    // violation description is hand-authored, and evidence is a before/after
    // pair spanning the state transition rather than one snapshot.
    const accessibilityRaw = JSON.parse(
      fs.readFileSync(path.join(config.datasetDir, defect.accessibility_path), 'utf8')
    );
    const beforeDom = fs.readFileSync(path.join(config.datasetDir, defect.before_dom_path), 'utf8');
    const afterDom = fs.readFileSync(path.join(config.datasetDir, defect.after_dom_path), 'utf8');

    return {
      scenario_id: scenarioId,
      state: defect.state,
      interaction: defect.interaction,
      violation: defect.violation,
      note: 'This defect was NOT caught by axe-core — axe reported the same violation count before and after the interaction. The problem is that a runtime state change is not exposed to assistive technology, which static rule-checking cannot detect. Diagnose from the aria snapshots and DOM below.',
      dynamic_context: {
        before_aria_snapshot: (accessibilityRaw.beforeInteraction || {}).ariaSnapshot || null,
        after_aria_snapshot: (accessibilityRaw.afterInteraction || {}).ariaSnapshot || null,
        before_dom_excerpt: truncate(beforeDom),
        after_dom_excerpt: truncate(afterDom),
      },
      source_files: sourceFiles,
    };
  }

  // Static case: axe flagged a violation directly on a single snapshot.
  const accessibilityRaw = JSON.parse(
    fs.readFileSync(path.join(config.datasetDir, defect.accessibility_path), 'utf8')
  );
  const dom = fs.readFileSync(path.join(config.datasetDir, defect.dom_path), 'utf8');

  const violationsPool = accessibilityRaw.violations
    ? accessibilityRaw.violations
    : (accessibilityRaw.afterInteraction || accessibilityRaw.beforeInteraction || {}).violations || [];

  const violation = violationsPool.find((v) => v.id === defect.axe_rule_id) || violationsPool[0];
  if (!violation) {
    throw new Error(`No violation matching "${defect.axe_rule_id}" found for ${scenarioId}`);
  }

  return {
    scenario_id: scenarioId,
    state: defect.state,
    interaction: defect.interaction || null,
    violation: {
      id: violation.id,
      impact: violation.impact,
      target: violation.target || (violation.nodes && violation.nodes[0] && violation.nodes[0].target),
      help: violation.help,
      html: violation.html || (violation.nodes && violation.nodes[0] && violation.nodes[0].html),
    },
    dom_excerpt: truncate(dom),
    source_files: sourceFiles,
  };
}

async function runRepairOnScenario(scenarioId, repoRoot) {
  const agentInput = loadScenarioAsAgentInput(scenarioId, repoRoot);

  console.log(`[${scenarioId}] requesting repair from ${config.model}...`);
  const repair = await requestRepair(agentInput);

  const agentDir = path.join(config.datasetDir, 'defects', scenarioId, 'agent');
  fs.mkdirSync(agentDir, { recursive: true });
  fs.writeFileSync(path.join(agentDir, 'diagnosis.json'), JSON.stringify(repair, null, 2));

  if (repair.unrepairable) {
    console.log(`[${scenarioId}] agent declined to repair: ${repair.risk_notes}`);
    return { scenarioId, applied: false, repair };
  }

  const diff = applyFix(repair.modified_files, repoRoot);
  fs.writeFileSync(path.join(agentDir, 'patch.diff'), diff);
  console.log(`[${scenarioId}] fix applied to ${repoRoot}. Next: re-run the Playwright scenario + axe for verification.`);
  return { scenarioId, applied: true, repair, diff };
}

if (require.main === module) {
  const scenarioId = process.argv[2];
  const repoRoot = process.argv[3] || path.join(process.cwd(), '..'); // default: repair-agent/.. == Skincare/
  if (!scenarioId) {
    console.error('Usage: node src/runRepair.js <scenario_id> [repoRoot]');
    console.error('Example: node src/runRepair.js SPA-A11Y-003 ../');
    process.exit(1);
  }
  runRepairOnScenario(scenarioId, repoRoot).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { runRepairOnScenario, loadScenarioAsAgentInput };