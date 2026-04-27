import { test, expect } from "@playwright/test";

test.describe("Navigáció tesztelése", () => {
  test("A navbar megjelenik és tartalmazza a fő linkeket", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("nav")).toBeVisible();
    await expect(page.locator("nav").getByText("Bellora")).toBeVisible();
  });

  test("A bejelentkezés oldalra navigálás működik", async ({ page }) => {
    await page.goto("/login");
    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test("A regisztráció oldalra navigálás működik", async ({ page }) => {
    await page.goto("/register");
    await expect(page).toHaveURL(/\/register/);
  });
});
