import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "fs";

test("SPA-A11Y-001 - Accessibility scan of homepage", async ({ page }) => {
  const scenarioId = "SPA-A11Y-001";
  const scenarioName = "Homepage accessibility baseline";

  // Create required directories if they don't exist
  fs.mkdirSync("dataset/accessibility", { recursive: true });
  fs.mkdirSync("dataset/screenshots", { recursive: true });
  fs.mkdirSync("dataset/dom", { recursive: true });
  fs.mkdirSync("dataset/metadata", { recursive: true });

  // 1. Open homepage
  await page.goto("/");

  // 2. Wait until products have actually rendered
  await page.waitForSelector(".item-container", {
    state: "visible",
    timeout: 10000,
  });

  // 3. Capture screenshot
  const screenshotPath = "dataset/screenshots/scenario001_home.png";

  await page.screenshot({
    path: screenshotPath,
    fullPage: true,
  });

  // 4. Capture DOM
  const domPath = "dataset/dom/scenario001_home.html";

  const html = await page.content();

  fs.writeFileSync(domPath, html);

  // 5. Run axe-core
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

  // 6. Save accessibility results
  const accessibilityPath = "dataset/accessibility/scenario001.json";

  fs.writeFileSync(
    accessibilityPath,
    JSON.stringify(accessibilityScanResults, null, 2)
  );

  // 7. Extract useful violation information for metadata
  const violations = accessibilityScanResults.violations.map((violation) => ({
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

  // 8. Create metadata
  const metadata = {
    scenarioId,
    scenarioName,

    application: {
      name: "Myntra React Clone",
      url: "http://localhost:5173/",
      framework: "React",
      stateManagement: "Redux",
    },

    scenarioType: "static",

    userAction: {
      action: "Open homepage",
      description:
        "User navigates to the homepage and waits for product cards to render.",
    },

    capturedState: {
      url: page.url(),
      title: await page.title(),
    },

    artifacts: {
      screenshot: screenshotPath,
      dom: domPath,
      accessibilityResults: accessibilityPath,
    },

    accessibility: {
      tool: "axe-core",
      violationsCount: accessibilityScanResults.violations.length,
      violations,
    },

    repair: {
      status: "not-repaired",
      description: null,
    },

    verification: {
      status: "baseline-captured",
      violationsBefore: accessibilityScanResults.violations.length,
      violationsAfter: null,
    },
  };

  // 9. Save metadata
  fs.writeFileSync(
    "dataset/metadata/scenario001.json",
    JSON.stringify(metadata, null, 2)
  );

  // 10. Print summary
  console.log("\n========================================");
  console.log(`${scenarioId} - ${scenarioName}`);
  console.log("========================================");
  console.log(`URL: ${page.url()}`);
  console.log(
    `Violations found: ${accessibilityScanResults.violations.length}`
  );

  for (const violation of accessibilityScanResults.violations) {
    console.log(
      `- ${violation.id} | ${violation.impact} | ${violation.nodes.length} element(s)`
    );
  }

  console.log("\nArtifacts:");
  console.log(`- ${screenshotPath}`);
  console.log(`- ${domPath}`);
  console.log(`- ${accessibilityPath}`);
  console.log("- dataset/metadata/scenario001.json");

  console.log("========================================\n");
});
