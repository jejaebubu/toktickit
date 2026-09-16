import { test, expect, Page } from "@playwright/test";
import * as path from "path";

function screenshotDir() {
  return path.join(__dirname, "..", "..", "artifacts", "lab-03", "screenshots");
}

function shot(project: string, sub: string, name: string): string {
  return path.join(screenshotDir(), sub, `${name}-${project}.png`);
}

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => {
    const doc = document.documentElement;
    return doc.scrollWidth - doc.clientWidth;
  });
  expect(overflow, "page should not have horizontal scroll").toBeLessThanOrEqual(1);
}

test.describe("E2E-04: Admin user creation, search, & password reset (AC-06)", () => {
  test("admin searches users, creates a user, sees duplicate & self-deactivation blocks, and resets a password", async ({
    page,
  }, testInfo) => {
    const project = testInfo.project.name;
    const isMobile = project === "mobile";

    // --- 1. Login as Administrator -> role dashboard is User Management ---
    await page.goto("/");
    await page.getByTestId("login-email").fill("admin@toktickit.com");
    await page.getByTestId("login-password").fill("Password123!");
    await page.getByTestId("login-submit").click();
    await expect(page.getByTestId("user-mgmt-card")).toBeVisible();
    await expect(page.getByTestId("header-role-badge")).toContainText(/Admin/);

    // --- 2. Search the user list (server-backed query) ---
    const userLocator = (email: string) =>
      page
        .locator(isMobile ? '[data-testid^="user-card-"]' : '[data-testid^="user-row-"]')
        .filter({ hasText: email })
        .first();
    // Always type the query and click search first: keeps rows deterministic
    // (server-backed result) instead of guessing which page they appear on.
    const searchAndFind = async (email: string) => {
      await page.getByTestId("user-search-input").fill(email);
      await page.getByTestId("user-search-btn").click();
      return userLocator(email);
    };
    const jenniferRow = await searchAndFind("jennifer@toktickit.com");
    await expect(jenniferRow).toBeVisible({ timeout: 15_000 });
    await page.screenshot({ path: shot(project, "user-admin", "user-search"), fullPage: true });
    await page.getByTestId("user-clear-filters").click();
    // Clearing filters restores the full list (jennifer is included again).
    await expect(jenniferRow).toBeVisible({ timeout: 15_000 });

    // --- 3. Create a user with a unique email ---
    const email = `e2e.user.${Date.now()}@toktickit.com`;
    await page.getByTestId("user-mgmt-add-btn").click();
    await expect(page.getByTestId("user-mgmt-modal")).toBeVisible();
    await page.getByTestId("user-name-input").fill("E2E Created User");
    await page.getByTestId("user-email-input").fill(email);
    await page.selectOption('[data-testid="user-role-input"]', "REQUESTER");
    await page.getByTestId("user-password-input").fill("E2EUser123!");
    await page.getByTestId("user-modal-save").click();
    await expect(page.getByTestId("user-mgmt-notice")).toContainText(/created successfully/i);

    // New user appears after search
    const createdRow = await searchAndFind(email);
    await expect(createdRow).toBeVisible({ timeout: 15_000 });
    await page.getByTestId("user-clear-filters").click();

    // --- 4. Duplicate email is blocked server-side ---
    await page.getByTestId("user-mgmt-add-btn").click();
    await page.getByTestId("user-name-input").fill("Duplicate User");
    await page.getByTestId("user-email-input").fill("jennifer@toktickit.com");
    await page.getByTestId("user-password-input").fill("E2EUser123!");
    await page.getByTestId("user-modal-save").click();
    await expect(page.getByTestId("user-form-error")).toContainText(/already exists/i);
    await page.screenshot({ path: shot(project, "user-admin", "duplicate-email-block"), fullPage: true });
    await page.getByTestId("user-modal-cancel").click();

    // --- 5. Self-deactivation is blocked server-side ---
    const adminRow = await searchAndFind("admin@toktickit.com");
    await adminRow.getByTestId(/user-toggle/).click();
    await expect(page.getByTestId("user-mgmt-error")).toContainText(/cannot deactivate their own account/i);

    // --- 6. Reset the newly created user's initial password ---
    // The self-deactivation failure replaces the list with an error banner;
    // clear the filters to reload the list before targeting the created user.
    await page.getByTestId("user-clear-filters").click();
    const resetTarget = await searchAndFind(email);
    await expect(resetTarget).toBeVisible({ timeout: 15_000 });
    await resetTarget.getByTestId(/user-reset/).click();
    await expect(page.getByTestId("user-reset-modal")).toBeVisible();
    await page.getByTestId("user-reset-password-input").fill("NewPass456!");
    await page.getByTestId("user-reset-save").click();
    await expect(page.getByTestId("user-mgmt-notice")).toContainText(/has been reset/i);
    await page.screenshot({ path: shot(project, "user-admin", "password-reset"), fullPage: true });
    await expectNoHorizontalOverflow(page);
  });
});