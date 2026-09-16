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

async function gotoCreateTicket(page: Page, project: string) {
  if (project === "desktop") {
    await page.getByTestId("header-nav-create-ticket").click();
  } else {
    await page.getByTestId("header-nav-toggle").click();
    await page.getByTestId("header-mobile-nav-create-ticket").click();
  }
}

test.describe("E2E-03: IT Staff ticket queue, claim & update flow (AC-05)", () => {
  test("staff searches the queue, claims an unassigned ticket, updates it, and posts comment + note", async ({
    page,
  }, testInfo) => {
    const project = testInfo.project.name;
    const isMobile = project === "mobile";

    // --- 1. Login as Requester and create a fresh, unassigned ticket (self-contained state) ---
    await login(page, "jennifer@toktickit.com", "Password123!");
    await expect(page.getByTestId("my-tickets-card")).toBeVisible();
    await gotoCreateTicket(page, project);
    await expect(page.getByTestId("submit-ticket-btn")).toBeVisible();
    const summary = `E2E claim flow ${Date.now()}`;
    await page.locator("#summary").fill(summary);
    await page.locator("#description").fill("Ticket created by the E2E staff-flow test to guarantee an unassigned ticket.");
    await page.locator("#requestedPriority").selectOption("LOW");
    await page.getByTestId("submit-ticket-btn").click();
    await expect(page.getByTestId("success-alert")).toBeVisible({ timeout: 15_000 });
    const successText = (await page.getByTestId("success-alert").textContent())!;
    const ticketNumber = successText.match(/TKT-\d{4}-\d{6}/)![0];

    // --- 2. Logout -> login as IT Staff (role dashboard is the Ticket Queue) ---
    await page.getByTestId("header-user-menu").click();
    await page.getByTestId("header-logout").click();
    await expect(page.getByTestId("login-card")).toBeVisible();
    await login(page, "alex.it@toktickit.com", "Password123!");
    await expect(page.getByTestId("staff-queue-card")).toBeVisible();
    await expect(page.getByTestId("header-role-badge")).toContainText(/IT Staff/);

    // --- 3. Queue search + Owner filter -> narrow to the new unassigned ticket ---
    await page.getByTestId("queue-search").fill(ticketNumber);
    await page.selectOption('[data-testid="queue-filter-owner"]', "unassigned");
    await page.getByTestId("queue-search-btn").click();
    const rowOrCard = page
      .locator(isMobile ? '[data-testid^="queue-card-"]' : '[data-testid^="queue-row-"]')
      .filter({ hasText: ticketNumber })
      .first();
    await expect(rowOrCard).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId("queue-total")).toContainText(/1/);
    await page.screenshot({ path: shot(project, "staff-queue", "queue-filtered"), fullPage: true });

    // --- 4. Open the ticket detail ---
    await rowOrCard.click();
    await expect(page.getByTestId("staff-detail-card")).toBeVisible();
    await expect(page.getByText(summary)).toBeVisible();
    await expectNoHorizontalOverflow(page);

    // --- 5. Claim the unassigned ticket ---
    const claimBtn = page.getByTestId("detail-claim");
    await expect(claimBtn).toBeEnabled();
    await claimBtn.click();
    await expect(page.getByTestId("detail-claim")).toBeDisabled();
    await expect(page.getByTestId("detail-claim")).toContainText(/Claimed by you/i);

    // --- 6. Update IT priority and status ---
    await page.selectOption('[data-testid="detail-priority-select"]', "URGENT");
    await page.selectOption('[data-testid="detail-status-select"]', "Resolved");
    await expect(page.getByTestId("detail-notice")).toContainText(/updated successfully/i);
    await page.screenshot({ path: shot(project, "staff-ticket-detail", "claimed-updated"), fullPage: true });

    // --- 7. Post a Public Comment (green/white card) ---
    await page.getByTestId("comment-input").fill("Sync issue repaired during end-to-end verification.");
    await page.getByTestId("comment-submit").click();
    await expect(page.getByTestId("public-comments-container")).toContainText("Sync issue repaired during end-to-end verification.");

    // --- 8. Post an Internal Note (amber card, staff-only) ---
    await page.getByTestId("note-input").fill("Root cause: stale profile; cleared remotely.");
    await page.getByTestId("note-submit").click();
    await expect(page.getByTestId("internal-notes-container")).toContainText("Root cause: stale profile; cleared remotely.");

    await page.screenshot({ path: shot(project, "staff-ticket-detail", "comment-and-note"), fullPage: true });
    await expectNoHorizontalOverflow(page);
  });
});