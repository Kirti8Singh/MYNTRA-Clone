import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "fs";

test("SPA-A11Y-003 - Verify AI repair of missing search label", async ({ page }) => {
  const scenarioId = "SPA-A11Y-003";
  const scenarioName = "Static repair verification: search input missing accessible name";

  // Create required directories
  fs.mkdirSync("dataset/accessibility", { recursive: true });
  fs.mkdirSync("dataset/screenshots", { recursive: true });
  fs.mkdirSync("dataset/dom", { recursive: true });
  fs.mkdirSync("dataset/metadata", { recursive: true });
  fs.mkdirSync("dataset/defects/SPA-A11Y-003", { recursive: true });

  // --------------------------------------------------
  // 1. Load the BEFORE baseline — the evidence captured
  //    while the defect was still live. We can't re-capture
  //    "before" now that the fix is applied, so this archived
  //    result IS the before-state of record.
  // --------------------------------------------------

  const beforeAxe = JSON.parse(
    fs.readFileSync("dataset/evidence/SPA-A11Y-003/defective-accessibility.json", "utf8")
  );
  const beforeViolations = beforeAxe.violations || [];
  const beforeLabelViolation = beforeViolations.find((v) => v.id === "label");

  // --------------------------------------------------
  // 2. Open homepage (post-fix) and capture AFTER state
  // --------------------------------------------------

  await page.goto("/");
  await page.waitForSelector(".search_bar", { state: "visible", timeout: 10000 });

  const searchInput = page.locator("input.search_input");
  await expect(searchInput).toBeVisible();

  const afterScreenshot = "dataset/screenshots/scenario003_after.png";
  await page.screenshot({ path: afterScreenshot, fullPage: true });

  const afterDom = "dataset/dom/scenario003_after.html";
  fs.writeFileSync(afterDom, await page.content());

  const afterAxe = await new AxeBuilder({ page }).analyze();
  const afterLabelViolation = afterAxe.violations.find((v) => v.id === "label");

  // --------------------------------------------------
  // 3. Functional check — the repair must not have broken
  //    the search box itself, only added an accessible name
  // --------------------------------------------------

  await searchInput.fill("cleanser");
  const typedValue = await searchInput.inputValue();
  const functionalCheckPassed = typedValue === "cleanser";

  // --------------------------------------------------
  // 4. Extract & compare violations
  // --------------------------------------------------

  const extractViolations = (violations) =>
    violations.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      help: violation.help,
      affectedElements: violation.nodes.map((node) => ({
        html: node.html,
        target: node.target,
      })),
    }));

  const targetViolationResolved = Boolean(beforeLabelViolation) && !afterLabelViolation;
  const totalViolationsBefore = beforeViolations.length;
  const totalViolationsAfter = afterAxe.violations.length;
  // A regression is a NEW violation that wasn't there before, distinct from
  // the one we were fixing — not just "the count went down by one".
  const newViolationIds = afterAxe.violations
    .map((v) => v.id)
    .filter((id) => id !== "label" && !beforeViolations.some((bv) => bv.id === id));

  let outcome;
  if (!functionalCheckPassed) {
    outcome = "UNSAFE"; // fixed a11y but broke the search box — reject regardless
  } else if (newViolationIds.length > 0) {
    outcome = "REGRESSION";
  } else if (targetViolationResolved) {
    outcome = "REPAIRED";
  } else if (afterLabelViolation && afterLabelViolation.nodes.length < (beforeLabelViolation?.nodes.length || 0)) {
    outcome = "PARTIALLY_REPAIRED";
  } else {
    outcome = "FAILED";
  }

  // --------------------------------------------------
  // 5. Save verification.json (per the SPA-A11Y-XXX dataset schema)
  // --------------------------------------------------

  const verification = {
    scenarioId,
    outcome,
    targetRule: "label",
    targetViolationResolved,
    totalViolationsBefore,
    totalViolationsAfter,
    newViolationIds,
    functionalCheckPassed,
    checkedAt: new Date().toISOString(),
  };

  fs.writeFileSync(
    "dataset/defects/SPA-A11Y-003/verification.json",
    JSON.stringify(verification, null, 2)
  );

  // --------------------------------------------------
  // 6. Save accessibility + metadata, matching scenario001/002 convention
  // --------------------------------------------------

  const accessibilityData = {
    scenarioId,
    beforeInteraction: {
      violationsCount: totalViolationsBefore,
      violations: extractViolations(beforeViolations),
    },
    afterInteraction: {
      violationsCount: totalViolationsAfter,
      violations: extractViolations(afterAxe.violations),
    },
  };

  fs.writeFileSync(
    "dataset/accessibility/scenario003.json",
    JSON.stringify(accessibilityData, null, 2)
  );

  fs.writeFileSync(
    "dataset/metadata/scenario003.json",
    JSON.stringify(
      {
        scenarioId,
        scenarioName,
        application: {
          name: "Myntra React Clone",
          url: "http://localhost:5173/",
          framework: "React",
          stateManagement: "Redux",
        },
        scenarioType: "static",
        repair: { status: outcome.toLowerCase(), description: "AI-generated fix via Gemini repair agent" },
        verification,
        artifacts: {
          beforeAccessibility: "dataset/evidence/SPA-A11Y-003/defective-accessibility.json",
          beforeDom: "dataset/evidence/SPA-A11Y-003/defective-dom.html",
          afterScreenshot,
          afterDom,
          accessibilityResults: "dataset/accessibility/scenario003.json",
        },
      },
      null,
      2
    )
  );

  // --------------------------------------------------
  // 7. Print results
  // --------------------------------------------------

  console.log("\n========================================");
  console.log(`${scenarioId} - ${scenarioName}`);
  console.log("========================================");
  console.log(`Outcome: ${outcome}`);
  console.log(`Target ("label") violation resolved: ${targetViolationResolved}`);
  console.log(`Violations before: ${totalViolationsBefore} | after: ${totalViolationsAfter}`);
  console.log(`New violations introduced: ${newViolationIds.join(", ") || "none"}`);
  console.log(`Functional check (search still works): ${functionalCheckPassed}`);
  console.log("========================================\n");

  // --------------------------------------------------
  // 8. Actually fail the test on a bad outcome — this is the
  //    harness deciding, not a human eyeballing a diff
  // --------------------------------------------------

  expect(functionalCheckPassed, "Search input must still accept text after the fix").toBe(true);
  expect(newViolationIds, "Fix must not introduce new violations").toEqual([]);
  expect(targetViolationResolved, "The 'label' violation must be resolved").toBe(true);
});