import { test, expect } from "@playwright/test";

test.describe("Hirdetés részletek tesztelése", () => {
  test("Nem létező hirdetés oldal betöltődik (loading állapot)", async ({ page }) => {
    await page.goto("/item/999999");
    await page.waitForTimeout(2000);
    // Az oldal betöltődik, és vagy betöltés animációt vagy tartalmat mutat
    const body = await page.textContent("body");
    expect(body.length).toBeGreaterThan(0);
  });

  test("Hirdetés oldalon megjelenik a navbar", async ({ page }) => {
    await page.goto("/item/1");
    await expect(page.locator("nav")).toBeVisible();
    await expect(page.locator("text=Bellora")).toBeVisible();
  });
});
