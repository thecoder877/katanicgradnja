import { expect, test } from "@playwright/test";

test("homepage vodi posetioca ka pozivu i krovovima", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("link", { name: /Pozovite za dogovor/i }).first()).toHaveAttribute(
    "href",
    /^tel:/,
  );
  await expect(page.getByRole("link", { name: /Krovovi/i }).first()).toBeVisible();
  await expect(page.getByText(/Ruma i okolina/i).first()).toBeVisible();
});

test("stranica krovova zadržava telefon kao glavni CTA", async ({ page }) => {
  await page.goto("/usluge/krovovi");

  await expect(page.getByRole("heading", { name: "Krovovi", level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: /Pozovite/i }).first()).toHaveAttribute("href", /^tel:/);
});

test("galerija čuva scroll lock, radi tastaturom i vraća fokus", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.startsWith("mobile"), "Tastaturna provera je desktop scenario.");
  await page.goto("/projekti/izgradnja-kuce-jazak");

  const thumbnail = page.getByRole("button", { name: /Otvori fotografiju 1 u galeriji/i });
  await thumbnail.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(page.getByRole("button", { name: /Zatvori galeriju/i })).toBeFocused();
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe("hidden");

  await page.keyboard.press("ArrowRight");
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe("hidden");
  await page.keyboard.press("Escape");

  await expect(dialog).toBeHidden();
  await expect(thumbnail).toBeFocused();
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe("");
});

test("mobilni prikaz nema horizontalno prelivanje", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith("mobile"), "Mobilna provera.");
  await page.goto("/");

  await expect(page.getByRole("link", { name: /Pozovite za dogovor/i }).first()).toBeVisible();
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
});
