import { test, expect } from "@playwright/test";

test.describe("Admin oldal tesztelése", () => {
  test("Admin oldal átirányít bejelentkezés nélkül", async ({ page }) => {
    await page.goto("/admin");
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(/\/login/);
  });
});
