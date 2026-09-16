import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "fs";

test("SPA-A11Y-002 - Dynamic Add to Bag state update", async ({ page }) => {
  const scenarioId = "SPA-A11Y-002";
  const scenarioName = "Dynamic bag-count update after Add to Bag";

  // Create required directories
  fs.mkdirSync("dataset/accessibility", { recursive: true });
  fs.mkdirSync("dataset/screenshots", { recursive: true });
  fs.mkdirSync("dataset/dom", { recursive: true });
  fs.mkdirSync("dataset/metadata", { recursive: true });

  // --------------------------------------------------
  // 1. Open homepage
  // --------------------------------------------------

  await page.goto("/");

  // Wait until products have actually rendered
  await page.waitForSelector(".item-container", {
    state: "visible",
    timeout: 10000,
  });

  // --------------------------------------------------
  // 2. Locate the Bag control
  // --------------------------------------------------

  const bagLink = page.getByRole("link", {
    name: /Bag/i,
  });

  await expect(bagLink).toBeVisible();

  // --------------------------------------------------
  // 3. Capture BEFORE state
  // --------------------------------------------------

  const beforeBagCount = await page.locator(".bag-item-count").count();

  const beforeBagText = await bagLink.innerText();

  const beforeAriaSnapshot = await bagLink.ariaSnapshot();

  const beforeScreenshot = "dataset/screenshots/scenario002_before.png";

  await page.screenshot({
    path: beforeScreenshot,
    fullPage: true,
  });

  const beforeDom = "dataset/dom/scenario002_before.html";

  fs.writeFileSync(beforeDom, await page.content());

  // --------------------------------------------------
  // 4. Run axe BEFORE interaction
  // --------------------------------------------------

  const beforeAxe = await new AxeBuilder({ page }).analyze();

  // --------------------------------------------------
  // 5. Click Add to Bag
  // --------------------------------------------------

  const addToBagButton = page
    .locator(".item-container")
    .first()
    .getByRole("button", {
      name: /Add to Bag/i,
    });

  await expect(addToBagButton).toBeVisible();

  await addToBagButton.click();

  // --------------------------------------------------
  // 6. Wait for dynamic bag count
  // --------------------------------------------------

  const bagCount = page.locator(".bag-item-count");

  await expect(bagCount).toHaveText("1");

  // --------------------------------------------------
  // 7. Capture AFTER state
  // --------------------------------------------------

  const afterBagCount = await bagCount.count();

  const afterBagText = await bagLink.innerText();

  const afterAriaSnapshot = await bagLink.ariaSnapshot();

  const afterScreenshot = "dataset/screenshots/scenario002_after.png";

  await page.screenshot({
    path: afterScreenshot,
    fullPage: true,
  });

  const afterDom = "dataset/dom/scenario002_after.html";

  fs.writeFileSync(afterDom, await page.content());

  // --------------------------------------------------
  // 8. Run axe AFTER interaction
  // --------------------------------------------------

  const afterAxe = await new AxeBuilder({ page }).analyze();

  // --------------------------------------------------
  // 9. Extract accessibility violations
  // --------------------------------------------------

  const extractViolations = (results) =>
    results.violations.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      description: violation.description,
      help: violation.help,
      helpUrl: violation.helpUrl,
      tags: violation.tags,

      affectedElements: violation.nodes.map((node) => ({
        html: node.html,
        target: node.target,
        failureSummary: node.failureSummary,
      })),
    }));

  // --------------------------------------------------
  // 10. Save accessibility results
  // --------------------------------------------------

  const accessibilityData = {
    scenarioId,

    beforeInteraction: {
      bagCountElements: beforeBagCount,
      bagText: beforeBagText,
      ariaSnapshot: beforeAriaSnapshot,

      violationsCount: beforeAxe.violations.length,
      violations: extractViolations(beforeAxe),
    },

    afterInteraction: {
      bagCountElements: afterBagCount,
      bagText: afterBagText,
      ariaSnapshot: afterAriaSnapshot,

      violationsCount: afterAxe.violations.length,
      violations: extractViolations(afterAxe),
    },

    dynamicChange: {
      bagCountChanged: beforeBagCount !== afterBagCount,

      bagTextChanged: beforeBagText !== afterBagText,

      ariaSnapshotChanged: beforeAriaSnapshot !== afterAriaSnapshot,

      axeViolationCountChanged:
        beforeAxe.violations.length !== afterAxe.violations.length,
    },
  };

  const accessibilityPath = "dataset/accessibility/scenario002.json";

  fs.writeFileSync(
    accessibilityPath,
    JSON.stringify(accessibilityData, null, 2)
  );

  // --------------------------------------------------
  // 11. Create metadata
  // --------------------------------------------------

  const metadata = {
    scenarioId,
    scenarioName,

    application: {
      name: "Myntra React Clone",
      url: "http://localhost:5173/",
      framework: "React",
      stateManagement: "Redux",
    },

    scenarioType: "dynamic",

    userAction: {
      action: "Click Add to Bag",
      target: ".item-container:first button",
      description:
        "User clicks the Add to Bag button for the first visible product.",
    },

    stateTransition: {
      before: {
        bagCount: 0,
        bagCountElementPresent: beforeBagCount > 0,
      },

      after: {
        bagCount: 1,
        bagCountElementPresent: afterBagCount > 0,
      },
    },

    accessibilityObservation: {
      axeViolationsBefore: beforeAxe.violations.length,

      axeViolationsAfter: afterAxe.violations.length,

      accessibilityTreeChanged: beforeAriaSnapshot !== afterAriaSnapshot,
    },

    artifacts: {
      beforeScreenshot,
      afterScreenshot,
      beforeDom,
      afterDom,
      accessibilityResults: accessibilityPath,
    },

    repair: {
      status: "not-repaired",
      description: null,
    },

    verification: {
      status: "dynamic-state-captured",

      bagCountUpdated: beforeBagCount !== afterBagCount,

      axeViolationsBefore: beforeAxe.violations.length,

      axeViolationsAfter: afterAxe.violations.length,
    },
  };

  // --------------------------------------------------
  // 12. Save metadata
  // --------------------------------------------------

  fs.writeFileSync(
    "dataset/metadata/scenario002.json",
    JSON.stringify(metadata, null, 2)
  );

  // --------------------------------------------------
  // 13. Print results
  // --------------------------------------------------

  console.log("\n========================================");
  console.log(`${scenarioId} - ${scenarioName}`);
  console.log("========================================");

  console.log(`Before Bag text: ${JSON.stringify(beforeBagText)}`);

  console.log(`After Bag text: ${JSON.stringify(afterBagText)}`);

  console.log(`Before Bag count elements: ${beforeBagCount}`);

  console.log(`After Bag count elements: ${afterBagCount}`);

  console.log(
    `Accessibility tree changed: ${beforeAriaSnapshot !== afterAriaSnapshot}`
  );

  console.log(`Axe violations before: ${beforeAxe.violations.length}`);

  console.log(`Axe violations after: ${afterAxe.violations.length}`);

  console.log("\n--- BEFORE ACCESSIBILITY SNAPSHOT ---");
  console.log(beforeAriaSnapshot);

  console.log("\n--- AFTER ACCESSIBILITY SNAPSHOT ---");
  console.log(afterAriaSnapshot);

  console.log("\nArtifacts:");
  console.log(`- ${beforeScreenshot}`);
  console.log(`- ${afterScreenshot}`);
  console.log(`- ${beforeDom}`);
  console.log(`- ${afterDom}`);
  console.log(`- ${accessibilityPath}`);
  console.log("- dataset/metadata/scenario002.json");

  console.log("========================================\n");
});
