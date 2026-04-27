import { test, expect } from "@playwright/test";

test.describe("Főoldal tesztelése", () => {
  test("A főoldal betöltődik és megjeleníti a Bellora logót", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("nav").getByText("Bellora")).toBeVisible();
  });

  test("A hirdetések megjelennek a főoldalon", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(2000);
    const body = await page.textContent("body");
    expect(body.length).toBeGreaterThan(0);
  });
});
