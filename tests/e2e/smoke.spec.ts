import { expect, test } from "@playwright/test";

test("home loads and the canvas mounts", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Event Horizon/i);

  const canvas = page.locator("canvas#stage");
  await expect(canvas).toBeVisible();

  const box = await canvas.boundingBox();
  expect(box?.width ?? 0).toBeGreaterThan(0);
  expect(box?.height ?? 0).toBeGreaterThan(0);

  // Loop ticked at least once: the boot overlay should fade out.
  await expect(page.locator("[data-boot]")).toHaveAttribute("data-boot", "ready", {
    timeout: 10_000,
  });
});
