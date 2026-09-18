import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "fs";

test("SPA-A11Y-004 - Verify AI repair of unannounced bag-count update", async ({ page }) => {
  const scenarioId = "SPA-A11Y-004";
  const scenarioName = "Dynamic repair verification: bag item count not exposed to assistive tech";

  fs.mkdirSync("dataset/accessibility", { recursive: true });
  fs.mkdirSync("dataset/screenshots", { recursive: true });
  fs.mkdirSync("dataset/dom", { recursive: true });
  fs.mkdirSync("dataset/metadata", { recursive: true });
  fs.mkdirSync("dataset/defects/SPA-A11Y-004", { recursive: true });

  // Note on methodology: unlike D03, there is no "before" committed defect
  // state to toggle back to here — the dynamic problem was never caught by
  // axe in the first place (see dataset/accessibility/scenario002.json,
  // referenced in defect.json), so there's no violation to diff away. What
  // we verify instead: (1) a valid live region now exists structurally,
  // (2) the count still updates correctly across repeated interactions,
  // (3) no NEW axe violations appear relative to a fresh baseline taken at
  // the top of this same run.

  // --------------------------------------------------
  // 1. Load homepage, wait for real content (not mid-spinner —
  //    see the race condition fixed in scenario003.spec.js)
  // --------------------------------------------------

  await page.goto("/");
  await page.waitForSelector(".search_bar", { state: "visible", timeout: 10000 });
  await page.waitForSelector("main .items-container", { state: "visible", timeout: 15000 });

  const beforeDom = "dataset/dom/scenario004_before.html";
  fs.writeFileSync(beforeDom, await page.content());
  const beforeAxe = await new AxeBuilder({ page }).analyze();

  // --------------------------------------------------
  // 2. Interact: add the first product to the bag
  // --------------------------------------------------

  const bagLink = page.locator("a[href='/bag']");
  const firstAddButton = page.locator(".item-container").first().locator("button");

  await firstAddButton.click();

  const bagCount = bagLink.locator(".bag-item-count");
  await expect(bagCount).toBeVisible({ timeout: 5000 });
  await expect(bagCount).toHaveText("1");

  const afterScreenshot = "dataset/screenshots/scenario004_after.png";
  await page.screenshot({ path: afterScreenshot, fullPage: true });
  const afterDom = "dataset/dom/scenario004_after.html";
  fs.writeFileSync(afterDom, await page.content());
  const afterAxe = await new AxeBuilder({ page }).analyze();

  // --------------------------------------------------
  // 3. Structural check: is the count actually a live region now?
  // --------------------------------------------------

  const ariaLive = await bagCount.getAttribute("aria-live");
  const ariaHidden = await bagCount.getAttribute("aria-hidden");
  const liveRegionValid = (ariaLive === "polite" || ariaLive === "assertive") && ariaHidden !== "true";

  // Quality note (doesn't fail the test, but worth recording): a bare "1"
  // with no surrounding context is a weak announcement on its own — a
  // screen reader user hearing just "one" with no noun attached may not
  // know what changed. Not a structural failure, but worth flagging.
  const announcedTextIsBareNumber = /^\d+$/.test((await bagCount.textContent()).trim());

  // --------------------------------------------------
  // 4. Functional check across a SECOND state transition —
  //    the plan specifically calls out "preserving behavior across
  //    state transitions," not just the first one
  // --------------------------------------------------

  const secondAddButton = page.locator(".item-container").nth(1).locator("button");
  await secondAddButton.click();
  await expect(bagCount).toHaveText("2", { timeout: 5000 });
  const ariaLiveStillPresentAfterSecondUpdate = (await bagCount.getAttribute("aria-live")) === ariaLive;
  const functionalCheckPassed = ariaLiveStillPresentAfterSecondUpdate;

  // --------------------------------------------------
  // 5. Regression check against the fresh same-run baseline
  // --------------------------------------------------

  const newViolationIds = afterAxe.violations
    .map((v) => v.id)
    .filter((id) => !beforeAxe.violations.some((bv) => bv.id === id));

  let outcome;
  if (!functionalCheckPassed) {
    outcome = "UNSAFE";
  } else if (newViolationIds.length > 0) {
    outcome = "REGRESSION";
  } else if (liveRegionValid) {
    outcome = "REPAIRED";
  } else {
    outcome = "FAILED";
  }

  // --------------------------------------------------
  // 6. Save artifacts
  // --------------------------------------------------

  const verification = {
    scenarioId,
    outcome,
    detectionMethod: "manual", // axe never flagged this defect, before or after
    liveRegionValid,
    ariaLiveValue: ariaLive,
    announcedTextIsBareNumber,
    functionalCheckPassed,
    totalViolationsBefore: beforeAxe.violations.length,
    totalViolationsAfter: afterAxe.violations.length,
    newViolationIds,
    checkedAt: new Date().toISOString(),
  };

  fs.writeFileSync(
    "dataset/defects/SPA-A11Y-004/verification.json",
    JSON.stringify(verification, null, 2)
  );

  const extractViolations = (violations) =>
    violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      help: v.help,
      affectedElements: v.nodes.map((n) => ({ html: n.html, target: n.target })),
    }));

  fs.writeFileSync(
    "dataset/accessibility/scenario004.json",
    JSON.stringify(
      {
        scenarioId,
        beforeInteraction: { violationsCount: beforeAxe.violations.length, violations: extractViolations(beforeAxe.violations) },
        afterInteraction: { violationsCount: afterAxe.violations.length, violations: extractViolations(afterAxe.violations) },
      },
      null,
      2
    )
  );

  fs.writeFileSync(
    "dataset/metadata/scenario004.json",
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
        scenarioType: "dynamic",
        repair: { status: outcome.toLowerCase(), description: "AI-generated fix (Gemini) adding aria-live to bag item count" },
        verification,
        artifacts: {
          beforeDom,
          afterDom,
          afterScreenshot,
          accessibilityResults: "dataset/accessibility/scenario004.json",
        },
      },
      null,
      2
    )
  );

  // --------------------------------------------------
  // 7. Print + assert
  // --------------------------------------------------

  console.log("\n========================================");
  console.log(`${scenarioId} - ${scenarioName}`);
  console.log("========================================");
  console.log(`Outcome: ${outcome}`);
  console.log(`Live region valid (aria-live="${ariaLive}"): ${liveRegionValid}`);
  console.log(`Announced text is a bare number (weak context): ${announcedTextIsBareNumber}`);
  console.log(`Functional across repeated interaction (1 -> 2): ${functionalCheckPassed}`);
  console.log(`Violations before: ${beforeAxe.violations.length} | after: ${afterAxe.violations.length}`);
  console.log(`New violations introduced: ${newViolationIds.join(", ") || "none"}`);
  console.log("========================================\n");

  expect(functionalCheckPassed, "Bag count and its live region must survive a second update").toBe(true);
  expect(newViolationIds, "Fix must not introduce new axe violations").toEqual([]);
  expect(liveRegionValid, "Bag count must be exposed via a valid aria-live region").toBe(true);
});