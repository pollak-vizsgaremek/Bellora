import { test, expect } from "@playwright/test";

test.describe("Bejelentkezési funkció tesztelése (Auth)", () => {
  test("Helytelen adatokkal hibaüzenetet kell mutatnia", async ({ page }) => {
    await page.goto("/login");

    await page.fill('input[type="email"]', "nemletezo@teszt.hu");
    await page.fill('input[type="password"]', "rosszjelszo");

    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/login/);
  });
});
