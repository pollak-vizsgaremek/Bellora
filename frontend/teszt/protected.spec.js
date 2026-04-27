import { test, expect } from "@playwright/test";

test.describe("Védett oldalak tesztelése", () => {
  test("Profil oldal átirányít bejelentkezés nélkül", async ({ page }) => {
    await page.goto("/profile");
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(/\/login/);
  });

  test("Új hirdetés oldal átirányít bejelentkezés nélkül", async ({ page }) => {
    await page.goto("/new-item");
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(/\/login/);
  });

  test("Kedvencek oldal átirányít bejelentkezés nélkül", async ({ page }) => {
    await page.goto("/favorites");
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(/\/login/);
  });
});
