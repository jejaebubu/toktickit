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

test.describe("E2E-01: Actions Taken complete user workflow (AC-01, AC-02, AC-03, AC-12, AC-14)", () => {
  test("IT Staff creates, edits, and completes an Action Taken with follow-up toggle; Requester views it in read-only mode", async ({
    page,
  }, testInfo) => {
    const project = testInfo.project.name;
    const isMobile = project === "mobile";

    // --- 1. Login as Requester and create a fresh ticket ---
    await login(page, "jennifer@toktickit.com", "Password123!");
    await expect(page.getByTestId("my-tickets-card")).toBeVisible();
    await navigateHeader(page, project, "create-ticket");
    await expect(page.getByTestId("submit-ticket-btn")).toBeVisible();

    const summary = `E2E Actions Taken flow ${Date.now()}`;
    await page.locator("#summary").fill(summary);
    await page.locator("#description").fill("Switch port link flapping in Building B conference room.");
    await page.locator("#requestedPriority").selectOption("HIGH");
    await page.getByTestId("submit-ticket-btn").click();
    await expect(page.getByTestId("success-alert")).toBeVisible({ timeout: 15_000 });
    const successText = (await page.getByTestId("success-alert").textContent())!;
    const ticketNumber = successText.match(/TKT-\d{4}-\d{6}/)![0];

    // --- 2. Logout and login as IT Staff ---
    await page.getByTestId("header-user-menu").click();
    await page.getByTestId("header-logout").click();
    await expect(page.getByTestId("login-card")).toBeVisible();

    await login(page, "alex.it@toktickit.com", "Password123!");
    await expect(page.getByTestId("staff-queue-card")).toBeVisible();

    // --- 3. Search Ticket Queue and open the new ticket ---
    await page.getByTestId("queue-search").fill(ticketNumber);
    await page.getByTestId("queue-search-btn").click();
    const queueEntry = page
      .locator(isMobile ? '[data-testid^="queue-card-"]' : '[data-testid^="queue-row-"]')
      .filter({ hasText: ticketNumber })
      .first();
    await expect(queueEntry).toBeVisible({ timeout: 15_000 });
    await queueEntry.click();

    await expect(page.getByTestId("staff-detail-card")).toBeVisible();
    await expect(page.getByTestId("actions-taken-container")).toBeVisible();
    await expect(page.getByTestId("actions-taken-count")).toHaveText("0");
    await expect(page.getByTestId("action-add")).toBeVisible();

    // --- 4. Open Add Action Taken form & verify dynamic Follow-Up Note validation (AC-03) ---
    await page.getByTestId("action-add").click();
    await expect(page.getByTestId("action-form")).toBeVisible();

    // Wait for assignable staff options to load and pick the first valid assignee
    const assigneeSelect = page.getByTestId("action-assignee");
    await expect(assigneeSelect.locator("option")).not.toHaveCount(1);
    await assigneeSelect.selectOption({ index: 1 });

    await page.getByTestId("action-description").fill("Inspected wall jack and ran cable diagnostics on port B-12.");
    await page.getByTestId("action-followup-required").check();
    await expect(page.getByTestId("action-followup-note")).toBeVisible();

    // Attempt to save with empty Follow-Up Note -> client validation error
    await page.getByTestId("action-save").click();
    await expect(page.getByTestId("action-followup-note-error")).toContainText(/Follow-Up Note is required/i);

    // --- 5. Fill Follow-Up Note and Attachment Notes, then save as PENDING (nullable Result per BR-16) ---
    await page.getByTestId("action-followup-note").fill("Monitor switch port error counter after patch cord replacement.");
    await page.getByTestId("action-attachment-notes").fill("fluke-cable-report.pdf");
    await page.getByTestId("action-save").click();

    await expect(page.getByTestId("action-form")).not.toBeVisible();
    await expect(page.getByTestId("actions-taken-count")).toHaveText("1");

    const actionCard = page.locator('[data-testid^="action-card-"]').first();
    await expect(actionCard).toBeVisible();
    await expect(actionCard).toContainText("Inspected wall jack and ran cable diagnostics on port B-12.");
    await expect(actionCard).toContainText("Follow-Up Required");
    await expect(actionCard).toContainText("Monitor switch port error counter after patch cord replacement.");
    await expect(actionCard).toContainText("fluke-cable-report.pdf");
    await expect(actionCard).toContainText("Alex Thompson");
    await page.screenshot({ path: shot(project, "actions-taken", "staff-action-created"), fullPage: true });
    await expectNoHorizontalOverflow(page);

    // --- 6. Edit the Action Taken: move status to IN_PROGRESS and clear follow-up ---
    await actionCard.locator('[data-testid^="action-edit-"]').click();
    await expect(page.getByTestId("action-form")).toBeVisible();
    await page.getByTestId("action-status").selectOption("IN_PROGRESS");
    await page.getByTestId("action-description").fill("Replaced damaged Cat6 patch cord and reset switch port B-12.");
    await page.getByTestId("action-followup-required").uncheck();
    await expect(page.getByTestId("action-followup-note")).not.toBeVisible();
    await page.getByTestId("action-save").click();

    await expect(page.getByTestId("action-form")).not.toBeVisible();
    await expect(actionCard).toContainText("In Progress");
    await expect(actionCard).toContainText("Replaced damaged Cat6 patch cord and reset switch port B-12.");
    await expect(actionCard).not.toContainText("Follow-Up Required");

    // --- 7. Complete the Action Taken (requires Result when COMPLETED per BR-16 / AC-15) ---
    await actionCard.locator('[data-testid^="action-complete-"]').click();
    await expect(page.getByTestId("action-form")).toBeVisible();
    await expect(page.getByTestId("action-status")).toHaveValue("COMPLETED");
    // Attempt to save COMPLETED action without Result -> negative validation error (BR-16 / AC-15)
    await page.getByTestId("action-save").click();
    await expect(page.getByTestId("action-result-error")).toContainText(/Result is required/i);

    await page.getByTestId("action-result").fill("Link negotiated at 1 Gbps full-duplex with zero CRC errors over 15 minutes.");
    await page.getByTestId("action-save").click();

    await expect(page.getByTestId("action-form")).not.toBeVisible();
    await expect(actionCard).toContainText("Completed");
    await expect(actionCard).toContainText("Link negotiated at 1 Gbps full-duplex with zero CRC errors over 15 minutes.");
    // Final state: Complete/Cancel Action buttons are no longer rendered
    await expect(actionCard.locator('[data-testid^="action-complete-"]')).toHaveCount(0);
    await expect(actionCard.locator('[data-testid^="action-cancel-status-"]')).toHaveCount(0);
    await page.screenshot({ path: shot(project, "actions-taken", "staff-action-completed"), fullPage: true });
    await expectNoHorizontalOverflow(page);

    // --- 8. Logout and login as Requester -> verify Read-Only Actions Taken view (AC-02) ---
    await page.getByTestId("header-user-menu").click();
    await page.getByTestId("header-logout").click();
    await expect(page.getByTestId("login-card")).toBeVisible();

    await login(page, "jennifer@toktickit.com", "Password123!");
    await expect(page.getByTestId("my-tickets-card")).toBeVisible();

    await page.getByTestId("my-tickets-search").fill(ticketNumber);
    await page.getByTestId("my-tickets-search-btn").click();
    const requesterEntry = page
      .locator(isMobile ? '[data-testid^="my-tickets-card-"]' : '[data-testid^="my-tickets-row-"]')
      .filter({ hasText: ticketNumber })
      .first();
    await expect(requesterEntry).toBeVisible({ timeout: 15_000 });
    await requesterEntry.click();

    await expect(page.getByTestId("back-to-my-tickets")).toBeVisible();
    await expect(page.getByTestId("actions-taken-container")).toBeVisible();
    await expect(page.getByTestId("actions-taken-count")).toHaveText("1");
    await expect(page.getByTestId("actions-taken-container")).toContainText(
      "Replaced damaged Cat6 patch cord and reset switch port B-12."
    );
    await expect(page.getByTestId("actions-taken-container")).toContainText(
      "Link negotiated at 1 Gbps full-duplex with zero CRC errors over 15 minutes."
    );
    // Requester must NOT see "+ Add Action Taken" or "Edit" buttons
    await expect(page.getByTestId("action-add")).toHaveCount(0);
    await expect(page.locator('[data-testid^="action-edit-"]')).toHaveCount(0);

    await page.screenshot({ path: shot(project, "actions-taken", "requester-readonly"), fullPage: true });
    await expectNoHorizontalOverflow(page);
  });
});

