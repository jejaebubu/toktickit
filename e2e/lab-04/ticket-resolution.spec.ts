import { test, expect, Page } from "@playwright/test";
import * as path from "path";

function screenshotDir() {
  return path.join(__dirname, "..", "..", "artifacts", "lab-04", "screenshots");
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

async function navigateHeader(page: Page, project: string, viewId: string) {
  if (project === "desktop") {
    await page.getByTestId(`header-nav-${viewId}`).click();
  } else {
    await page.getByTestId("header-nav-toggle").click();
    await page.getByTestId(`header-mobile-nav-${viewId}`).click();
  }
}

test.describe("E2E-02: Ticket resolution gate & lifecycle verification (AC-07, AC-08, AC-13)", () => {
  test("Requester indicates problem resolved (advisory only); IT Staff enforces transition matrix and Resolution Gate before resolving", async ({
    page,
  }, testInfo) => {
    const project = testInfo.project.name;
    const isMobile = project === "mobile";

    // --- 1. Login as Requester and create a fresh ticket ---
    await login(page, "jennifer@toktickit.com", "Password123!");
    await expect(page.getByTestId("my-tickets-card")).toBeVisible();
    await navigateHeader(page, project, "create-ticket");
    await expect(page.getByTestId("submit-ticket-btn")).toBeVisible();

    const summary = `E2E Resolution Gate flow ${Date.now()}`;
    await page.locator("#summary").fill(summary);
    await page.locator("#description").fill("VPN client disconnects intermittently during video calls.");
    await page.locator("#requestedPriority").selectOption("MEDIUM");
    await page.getByTestId("submit-ticket-btn").click();
    await expect(page.getByTestId("success-alert")).toBeVisible({ timeout: 15_000 });
    const successText = (await page.getByTestId("success-alert").textContent())!;
    const ticketNumber = successText.match(/TKT-\d{4}-\d{6}/)![0];

    // --- 2. Open ticket detail as Requester and indicate problem is resolved (AC-08, BR-09) ---
    await navigateHeader(page, project, "my-tickets");
    await page.getByTestId("my-tickets-search").fill(ticketNumber);
    await page.getByTestId("my-tickets-search-btn").click();
    const requesterEntry = page
      .locator(isMobile ? '[data-testid^="my-tickets-card-"]' : '[data-testid^="my-tickets-row-"]')
      .filter({ hasText: ticketNumber })
      .first();
    await expect(requesterEntry).toBeVisible({ timeout: 15_000 });
    await requesterEntry.click();

    await expect(page.getByTestId("back-to-my-tickets")).toBeVisible();
    await expect(page.getByTestId("detail-status")).toHaveText("New");
    await expect(page.getByTestId("requester-resolution-gate")).toBeVisible();

    await page.getByTestId("requester-indicate-resolved-btn").click();
    await expect(page.getByTestId("requester-indicate-resolved-confirm-box")).toContainText(
      /This will notify IT Staff that your issue is resolved/i
    );
    await page.getByTestId("requester-indicate-resolved-confirm").click();

    await expect(page.getByTestId("requester-resolved-advisory")).toBeVisible();
    await expect(page.getByTestId("requester-resolved-advisory-badge")).toHaveText(
      "Requester indicated problem resolved - Pending Staff Review"
    );
    // Ticket status must remain "New" (advisory only, no direct status transition by Requester)
    await expect(page.getByTestId("detail-status")).toHaveText("New");
    await page.screenshot({ path: shot(project, "workflow", "requester-indicated-resolved"), fullPage: true });
    await expectNoHorizontalOverflow(page);

    // --- 3. Logout and login as IT Staff ---
    await page.getByTestId("header-user-menu").click();
    await page.getByTestId("header-logout").click();
    await expect(page.getByTestId("login-card")).toBeVisible();

    await login(page, "alex.it@toktickit.com", "Password123!");
    await expect(page.getByTestId("staff-queue-card")).toBeVisible();

    await page.getByTestId("queue-search").fill(ticketNumber);
    await page.getByTestId("queue-search-btn").click();
    const queueEntry = page
      .locator(isMobile ? '[data-testid^="queue-card-"]' : '[data-testid^="queue-row-"]')
      .filter({ hasText: ticketNumber })
      .first();
    await expect(queueEntry).toBeVisible({ timeout: 15_000 });
    await queueEntry.click();

    await expect(page.getByTestId("staff-detail-card")).toBeVisible();
    await expect(page.getByTestId("detail-resolved-intent")).toBeVisible();
    await expect(page.getByTestId("staff-resolved-advisory-badge")).toHaveText(
      "Requester indicated problem resolved - Pending Staff Review"
    );

    // --- 4. Claim ticket (New -> Open) & transition Open -> In Progress (AC-07, BR-08) ---
    await page.getByTestId("detail-claim").click();
    await expect(page.getByTestId("detail-status")).toHaveText("Open");
    // Open cannot jump directly to Resolved
    await expect(page.getByTestId("workflow-resolve-btn")).toHaveCount(0);
    await expect(page.getByTestId("workflow-transition-in-progress")).toBeVisible();

    await page.getByTestId("workflow-transition-in-progress").click();
    await expect(page.getByTestId("detail-status")).toHaveText("In Progress");

    // --- 5. Add a PENDING Action Taken to trigger the Resolution Gate (AC-13, BR-15) ---
    await page.getByTestId("action-add").click();
    const assigneeSelect = page.getByTestId("action-assignee");
    await expect(assigneeSelect.locator("option")).not.toHaveCount(1);
    await assigneeSelect.selectOption({ index: 1 });
    await page.getByTestId("action-description").fill("Verify split-tunnel routing table and MTU settings.");
    await page.getByTestId("action-save").click();
    await expect(page.getByTestId("actions-taken-count")).toHaveText("1");

    // Resolution Gate warning badge and warning button are now visible
    await expect(page.getByTestId("resolution-gate-warning")).toContainText("1 action(s) still open");
    await expect(page.getByTestId("workflow-resolve-btn")).toContainText("Resolve (1 action(s) still open)");

    // Clicking Resolve opens the Resolution Gate Confirmation Modal
    await page.getByTestId("workflow-resolve-btn").click();
    await expect(page.getByTestId("resolution-gate-modal")).toBeVisible();
    await expect(page.getByTestId("resolution-gate-modal-message")).toContainText(
      "This ticket still has 1 unresolved action(s). Complete or cancel them before resolving the ticket."
    );
    await page.screenshot({ path: shot(project, "workflow", "resolution-gate-modal"), fullPage: true });
    await expectNoHorizontalOverflow(page);

    // Attempting to resolve anyway triggers backend 409 Conflict (UNRESOLVED_ACTIONS_EXIST)
    await page.getByTestId("resolution-gate-confirm").click();
    await expect(page.getByTestId("detail-action-error")).toContainText(/Cannot resolve ticket while 1 action\(s\) are still open/i);
    await expect(page.getByTestId("detail-status")).toHaveText("In Progress");

    // --- 6. Complete the Action Taken -> Resolve succeeds ---
    const actionCard = page.locator('[data-testid^="action-card-"]').first();
    await actionCard.locator('[data-testid^="action-complete-"]').click();
    await page.getByTestId("action-result").fill("Adjusted VPN tunnel MTU to 1380 and confirmed stable session.");
    await page.getByTestId("action-save").click();

    await expect(page.getByTestId("resolution-gate-warning")).toHaveCount(0);
    await expect(page.getByTestId("workflow-resolve-btn")).toHaveText("Resolved");

    await page.getByTestId("workflow-resolve-btn").click();
    await expect(page.getByTestId("detail-status")).toHaveText("Resolved");
    await expect(page.getByTestId("detail-notice")).toContainText(/updated successfully/i);
    await page.screenshot({ path: shot(project, "workflow", "ticket-resolved"), fullPage: true });
    await expectNoHorizontalOverflow(page);
  });
});

