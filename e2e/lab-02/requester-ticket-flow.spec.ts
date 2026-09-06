import { test, expect, Page } from "@playwright/test";
import * as path from "path";

function screenshotDir() {
  return path.join(__dirname, "..", "..", "artifacts", "lab-02", "screenshots");
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

test.describe("E2E-01: Requester Ticket Flow (full journey)", () => {
  test("select requester -> create ticket with attachment -> find in My Tickets -> detail + soft-remove", async ({
    page,
    }, testInfo) => {
    const project = testInfo.project.name;
    const summary = `E2E WiFi reset ${Date.now()}`;
    const description = "Playwright end-to-end flow verifying the full requester ticket journey.";
    const fixture = path.join(__dirname, "fixtures", "wifi_error.png");

    // --- Step 1: Requester selection modal (mandatory when no context) ---
    await page.goto("/");
    await expect(page.getByTestId("requester-selector-modal")).toBeVisible();
    await page
      .locator('[data-testid^="requester-card-"]')
      .filter({ hasText: "Jennifer Anderson" })
      .click();
    await expect(page.getByTestId("requester-selector-modal")).toBeHidden();
    await expect(page.getByTestId("readonly-requester")).toHaveText(/Jennifer Anderson/);
    await expectNoHorizontalOverflow(page);

    // --- Step 2: Create Ticket screen (+ attach evidence file at create time, FR-04) ---
    await page.locator("#summary").fill(summary);
    await page.locator("#description").fill(description);
    // Category & Related System default to first option; keep MEDIUM priority.
    await page.getByTestId("create-attachment-input").setInputFiles(fixture);
    await expect(page.getByText(/Selected 1 file/)).toBeVisible();
    await page.getByTestId("submit-ticket-btn").scrollIntoViewIfNeeded();
    await page.screenshot({ path: shot(project, "create-ticket", "create-ticket"), fullPage: true });

    await page.getByTestId("submit-ticket-btn").click();
    await expect(page.getByTestId("success-alert")).toBeVisible();
    const ticketNumber = await page
      .getByTestId("success-alert")
      .getByText(/TKT-\d{4}-\d{6}/)
      .textContent()
      .then((t) => (t ?? "").match(/TKT-\d{4}-\d{6}/)![0]);
    expect(ticketNumber).toMatch(/^TKT-/);

    // --- Step 3: Find ticket in My Tickets (search mirrors backend query) ---
    await page.getByTestId("my-tickets-search").fill(summary);
    await page.getByTestId("my-tickets-search-btn").click();
    // Desktop/tablet render the table; mobile (<768px) renders cards.
    const isMobile = project === "mobile";
    const rowOrCard = page
      .locator(
        isMobile
          ? '[data-testid^="my-tickets-card-"]'
          : '[data-testid^="my-tickets-row-"]'
      )
      .filter({ hasText: summary })
      .first();
    await expect(rowOrCard).toBeVisible();
    await rowOrCard.scrollIntoViewIfNeeded();
    await page.screenshot({ path: shot(project, "my-tickets", "my-tickets"), fullPage: true });
    await expectNoHorizontalOverflow(page);

    // --- Step 4: Open Ticket Detail ---
    await rowOrCard.click();
    await expect(page.getByTestId("detail-status")).toBeVisible();
    await expect(page.getByText(ticketNumber, { exact: true }).first()).toBeVisible();
    await expect(page.getByTestId("detail-status")).toHaveText("New");

    // No vertical overflow artifacts / key info rendered
    // --- Step 5: Attachment attached at create time is present in detail (FR-04) ---
    await expect(page.getByTestId("attachment-list").getByText("wifi_error.png")).toBeVisible();
    await expect(page.locator('[data-testid^="attachment-download-"]').first()).toBeVisible({ timeout: 10_000 });

    // Capture detail WITH active attachment
    await page.locator('[data-testid^="attachment-download-"]').first().scrollIntoViewIfNeeded();
    await page.screenshot({ path: shot(project, "ticket-detail", "ticket-detail"), fullPage: true });
    await expectNoHorizontalOverflow(page);

    // --- Step 6: Soft-remove attachment with reason (E2E-01) ---
    const removeBtn = page.locator('[data-testid^="attachment-remove-"]').first();
    await removeBtn.click();
    await expect(page.getByTestId("remove-reason-prompt")).toBeVisible();
    await page.getByTestId("remove-reason-input").fill("Uploaded wrong evidence file during E2E");
    await page.getByTestId("remove-confirm-btn").click();
    await expect(page.getByTestId("detail-notice")).toHaveText(/removed/i);

    // [Removed] badge replaces the action buttons
    await expect(page.locator('[data-testid^="attachment-removed-"]').first()).toContainText("[Removed]");
    await expect(page.locator('[data-testid^="attachment-download-"]').first()).not.toBeVisible();
    await page.locator('[data-testid^="attachment-removed-"]').first().scrollIntoViewIfNeeded();
    await page.screenshot({ path: shot(project, "ticket-detail", "ticket-detail-removed"), fullPage: true });

    // --- Step 7: Back navigation returns to My Tickets ---
    await page.getByTestId("back-to-my-tickets").click();
    await expect(page.getByTestId("my-tickets-search")).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });
});