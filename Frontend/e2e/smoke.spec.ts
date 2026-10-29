/**
 * Critical smoke: pages respond; readiness seam stays blocked.
 */
import { expect, test } from "@playwright/test";

test("home page loads", async ({ page }) => {
  const res = await page.goto("/");
  expect(res?.ok()).toBeTruthy();
  await expect(page.getByRole("main").first()).toBeVisible();
});

test("windows product page loads", async ({ page }) => {
  const res = await page.goto("/products/windows");
  expect(res?.ok()).toBeTruthy();
  await expect(page.locator("main.phPage")).toBeVisible();
});

test("about page loads", async ({ page }) => {
  const res = await page.goto("/about");
  expect(res?.ok()).toBeTruthy();
  await expect(page.locator(".aboutPage")).toBeVisible();
});

test("pricing page loads", async ({ page }) => {
  const res = await page.goto("/pricing");
  expect(res?.ok()).toBeTruthy();
  await expect(page.locator("#pricing-plans")).toBeVisible();
});

test("blog article detail page loads", async ({ page }) => {
  const res = await page.goto("/blog/choosing-vps-resources-for-production");
  expect(res?.ok()).toBeTruthy();
  await expect(page.locator(".articlePage")).toBeVisible();
});

test("health is ok", async ({ request }) => {
  const res = await request.get("/api/health");
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.ok).toBe(true);
  expect(body.data?.status).toBe("ok");
});

test("ready stays NOT_CONFIGURED", async ({ request }) => {
  const res = await request.get("/api/v1/ready");
  expect(res.status()).toBe(503);
  const body = await res.json();
  expect(body.ok).toBe(false);
  expect(body.error?.code).toBe("NOT_CONFIGURED");
});
