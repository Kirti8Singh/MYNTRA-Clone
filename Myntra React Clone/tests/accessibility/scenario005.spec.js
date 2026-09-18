import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "fs";

test("SPA-A11Y-005 - Verify AI repair adds an accessible add-to-bag toast", async ({ page }) => {
  const scenarioId = "SPA-A11Y-005";
  const scenarioName = "Refinement verification: bag-count feedback replaced with an accessible toast";

  fs.mkdirSync("dataset/accessibility", { recursive: true });
  fs.mkdirSync("dataset/screenshots", { recursive: true });
  fs.mkdirSync("dataset/dom", { recursive: true });
  fs.mkdirSync("dataset/metadata", { recursive: true });
  fs.mkdirSync("dataset/defects/SPA-A11Y-005", { recursive: true });

  // --------------------------------------------------
  // 1. Load homepage, wait for real content
  // --------------------------------------------------

  await page.goto("/");
  await page.waitForSelector(".search_bar", { state: "visible", timeout: 10000 });
  await page.waitForSelector("main .items-container", { state: "visible", timeout: 15000 });

  const beforeAxe = await new AxeBuilder({ page }).analyze();

  const firstItem = page.locator(".item-container").first();
  const itemName = (await firstItem.locator(".item-name").textContent()).trim();
  const addButton = firstItem.locator("button");

  // --------------------------------------------------
  // 2. Click "Add to Bag" and check the toast
  // --------------------------------------------------

  await addButton.click();

  const toast = page.locator(".toast");
  await expect(toast).toBeVisible({ timeout: 5000 });

  const toastText = (await toast.textContent()).trim();
  const toastRole = await toast.getAttribute("role");
  const toastAriaLive = await toast.getAttribute("aria-live");

  const mentionsItemName = toastText.includes(itemName);
  const mentionsAdd = /add/i.test(toastText);
  const hasValidLiveRegionRole =
    toastRole === "status" || toastRole === "alert" || toastAriaLive === "polite" || toastAriaLive === "assertive";

  const screenshotWithToast = "dataset/screenshots/scenario005_toast_visible.png";
  await page.screenshot({ path: screenshotWithToast });

  const midAxe = await new AxeBuilder({ page }).analyze(); // catches contrast/role issues on the toast itself

  // --------------------------------------------------
  // 3. Confirm auto-dismiss actually clears it (no stray DOM/state left behind)
  // --------------------------------------------------

  await expect(toast).toBeHidden({ timeout: 4500 });

  // --------------------------------------------------
  // 4. Click "Remove from Bag" (same button, now toggled) and re-check
  // --------------------------------------------------

  await addButton.click(); // now labeled Remove from Bag
  await expect(toast).toBeVisible({ timeout: 5000 });
  const removeToastText = (await toast.textContent()).trim();
  const mentionsRemove = /remove/i.test(removeToastText);
  const removeMentionsItemName = removeToastText.includes(itemName);

  const afterAxe = await new AxeBuilder({ page }).analyze();

  // --------------------------------------------------
  // 5. Classify
  // --------------------------------------------------

  const newViolationIds = [...midAxe.violations, ...afterAxe.violations]
    .map((v) => v.id)
    .filter((id, i, arr) => arr.indexOf(id) === i) // dedupe
    .filter((id) => !beforeAxe.violations.some((bv) => bv.id === id));

  const functionalCheckPassed = mentionsAdd && mentionsItemName && mentionsRemove && removeMentionsItemName;

  let outcome;
  if (!functionalCheckPassed) {
    outcome = "FAILED";
  } else if (newViolationIds.length > 0) {
    outcome = "REGRESSION";
  } else if (hasValidLiveRegionRole) {
    outcome = "REPAIRED";
  } else {
    outcome = "PARTIALLY_REPAIRED"; // toast works and reads fine, but isn't structurally announced
  }

  // --------------------------------------------------
  // 6. Save artifacts
  // --------------------------------------------------

  const verification = {
    scenarioId,
    outcome,
    detectionMethod: "manual",
    toastTextOnAdd: toastText,
    toastTextOnRemove: removeToastText,
    hasValidLiveRegionRole,
    toastRole,
    toastAriaLive,
    functionalCheckPassed,
    totalViolationsBefore: beforeAxe.violations.length,
    newViolationIds,
    checkedAt: new Date().toISOString(),
  };

  fs.writeFileSync(
    "dataset/defects/SPA-A11Y-005/verification.json",
    JSON.stringify(verification, null, 2)
  );

  fs.writeFileSync(
    "dataset/metadata/scenario005.json",
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
        repair: { status: outcome.toLowerCase(), description: "AI-generated fix (Gemini) wiring HomeItem.jsx to an accessible Toast component" },
        verification,
        artifacts: { screenshotWithToast },
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
  console.log(`Toast on add: "${toastText}" (role=${toastRole}, aria-live=${toastAriaLive})`);
  console.log(`Toast on remove: "${removeToastText}"`);
  console.log(`Valid live-region role: ${hasValidLiveRegionRole}`);
  console.log(`New violations introduced: ${newViolationIds.join(", ") || "none"}`);
  console.log("========================================\n");

  expect(functionalCheckPassed, "Toast must mention the item name and correct action on both add and remove").toBe(true);
  expect(newViolationIds, "Toast must not introduce new axe violations").toEqual([]);
  expect(hasValidLiveRegionRole, "Toast must have role=status/alert or a valid aria-live value").toBe(true);
});