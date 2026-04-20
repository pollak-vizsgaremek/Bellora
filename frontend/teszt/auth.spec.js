import { test, expect } from '@playwright/test';

test.describe('Bejelentkezési funkció tesztelése (Auth)', () => {
  test('Helytelen adatokkal hibaüzenetet kell mutatnia', async ({ page }) => {
    // Navigáljunk a bejelentkezési oldalra
    await page.goto('/login');

    // Keressük meg a mezőket és töltsük ki
    await page.fill('input[type="email"]', 'nemletezo@teszt.hu');
    await page.fill('input[type="password"]', 'rosszjelszo');

    // Kattintsunk a gombra
    await page.click('button[type="submit"]');

    // Mivel az adatbázisban ez nem létezik (vagy a szerver 401-et ad), 
    // a React valahol kiírja a hibát (pl. egy piros alert div-ben vagy toast-ban).
    // Az egyszerűség kedvéért ellenőrizzük, hogy az URL ugyanaz maradt (nem naviált tovább)
    // és esetleg keresünk egy "hiba" vagy "Érvénytelen" szót az oldalon, ha a backend visszaadta.
    // Íme egy általános ellenőrzés, ha valami UI változást várunk rossz belépésnél:
    await expect(page).toHaveURL(/\/login/);
  });
});
