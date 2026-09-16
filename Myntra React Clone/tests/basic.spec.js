import { test, expect } from "@playwright/test";

test("Myntra website opens successfully", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/.*/);

  console.log("Myntra React Clone opened successfully!");
});
