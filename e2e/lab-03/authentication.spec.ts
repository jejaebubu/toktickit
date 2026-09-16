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

async function login(page: Page, email: string, password: string) {
  await page.goto("/");
  await page.getByTestId("login-email").fill(email);
  await page.getByTestId("login-password").fill(password);
  await page.getByTestId("login-submit").click();
}

test.describe("E2E-01: Login & Logout full flow (AC-01)", () => {
  test("invalid password shows an error; valid login opens the role dashboard; logout blocks direct access", async ({
    page,
  }, testInfo) => {
    const project = testInfo.project.name;

    // --- 1. Login screen is the only reachable page without a session ---
    await page.goto("/");
    await expect(page.getByTestId("login-card")).toBeVisible();
    await expectNoHorizontalOverflow(page);

    // --- 2. Wrong password -> inline error (no dashboard leak) ---
    await login(page, "admin@toktickit.com", "WrongPass123!");
    await expect(page.getByTestId("login-error")).toBeVisible();

    // --- 3. Valid login -> app shell with role-aware dashboard ---
    await page.getByTestId("login-password").fill("Password123!");
    await page.getByTestId("login-submit").click();
    await expect(page.getByTestId("header-user-name")).toContainText("John Smith");
    await expect(page.getByTestId("header-role-badge")).toContainText(/Admin/);
    await expect(page.getByTestId("user-mgmt-card")).toBeVisible();
    // Desktop shows the inline nav; tablet/mobile use the collapsible nav toggle.
    if (project === "desktop") {
      await expect(page.getByTestId("header-nav-user-management")).toBeVisible();
    } else {
      await expect(page.getByTestId("header-nav-toggle")).toBeVisible();
      await page.getByTestId("header-nav-toggle").click();
      await expect(page.getByTestId("header-mobile-nav-user-management")).toBeVisible();
      await page.getByTestId("header-nav-toggle").click();
    }
    await page.screenshot({ path: shot(project, "authentication", "logged-in-dashboard"), fullPage: true });
    await expectNoHorizontalOverflow(page);

    // --- 4. Logout via the user menu ---
    await page.getByTestId("header-user-menu").click();
    await page.getByTestId("header-logout").click();
    await expect(page.getByTestId("login-card")).toBeVisible();

    // --- 5. Direct access after logout is blocked (redirect to login) ---
    await page.goto("/");
    await expect(page.getByTestId("login-card")).toBeVisible();
    await expect(page.getByTestId("header-user-name")).not.toBeVisible();
    await expectNoHorizontalOverflow(page);
  });
});

test.describe("E2E-02: Initial password login & mandatory password change (AC-02)", () => {
  test("administrator resets an initial password; first-login user is forced to change it, then signs in with the new one", async ({
    page,
  }, testInfo) => {
    const project = testInfo.project.name;
    const isMobile = project === "mobile";

    // Distinct testid prefixes: desktop rows are user-row-<id>, tablet/mobile are user-card-<id>.
    const findUser = (email: string) =>
      page
        .locator(isMobile ? '[data-testid^="user-card-"]' : '[data-testid^="user-row-"]')
        .filter({ hasText: email })
        .first();

    // --- 0. As Administrator, reset newuser's initial password so the flow below is deterministic ---
    await login(page, "admin@toktickit.com", "Password123!");
    await expect(page.getByTestId("user-mgmt-card")).toBeVisible();
    await findUser("newuser@toktickit.com").getByTestId(/user-reset/).click();
    await expect(page.getByTestId("user-reset-modal")).toBeVisible();
    await page.getByTestId("user-reset-password-input").fill("Password123!");
    await page.getByTestId("user-reset-save").click();
    await expect(page.getByTestId("user-mgmt-notice")).toContainText(/has been reset/i);
    await page.getByTestId("header-user-menu").click();
    await page.getByTestId("header-logout").click();
    await expect(page.getByTestId("login-card")).toBeVisible();

    // --- 1. First login with the seeded initial password lands on ChangePassword ---
    await login(page, "newuser@toktickit.com", "Password123!");
    await expect(page.getByTestId("change-password-card")).toBeVisible();
    await expect(page.getByTestId("change-password-warning")).toBeVisible();
    await expect(page.getByTestId("change-password-logout")).toBeVisible();
    await page.screenshot({ path: shot(project, "authentication", "mandatory-change"), fullPage: true });
    await expectNoHorizontalOverflow(page);

    // --- 2. Submit is disabled until a strong new password + matching confirmation ---
    await page.getByTestId("change-password-current").fill("Password123!");
    await expect(page.getByTestId("change-password-submit")).toBeDisabled();
    await page.getByTestId("change-password-new").fill("Welcome123!");
    await page.getByTestId("change-password-confirm").fill("Welcome123!");
    await expect(page.getByTestId("change-password-submit")).toBeEnabled();

    // --- 3. Save -> app shell (dashboard) without the change-password screen ---
    await page.getByTestId("change-password-submit").click();
    // header-user-name is hidden below 576px (d-none d-sm-inline); the role badge is always visible.
    await expect(page.getByTestId("header-role-badge")).toBeVisible();
    await expect(page.getByTestId("header-user-name")).toHaveText("New User (First Login)");
    await expect(page.getByTestId("change-password-card")).not.toBeVisible();

    // --- 4. Logout and sign in again with the newly chosen password ---
    await page.getByTestId("header-user-menu").click();
    await page.getByTestId("header-logout").click();
    await expect(page.getByTestId("login-card")).toBeVisible();
    await login(page, "newuser@toktickit.com", "Welcome123!");
    await expect(page.getByTestId("header-role-badge")).toBeVisible();
    await expect(page.getByTestId("header-user-name")).toHaveText("New User (First Login)");
    await expect(page.getByTestId("change-password-card")).not.toBeVisible();
    await page.screenshot({ path: shot(project, "authentication", "relogin-with-new-password"), fullPage: true });
    await expectNoHorizontalOverflow(page);
  });
});