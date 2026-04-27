import { test, expect } from "@playwright/test";

test.describe("Regisztrációs oldal tesztelése", () => {
  test("A regisztrációs form megjelenik az összes mezővel", async ({ page }) => {
    await page.goto("/register");
    await expect(page.locator('input[type="text"]').first()).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("Üres form beküldése nem navigál el", async ({ page }) => {
    await page.goto("/register");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/register/);
  });
});
