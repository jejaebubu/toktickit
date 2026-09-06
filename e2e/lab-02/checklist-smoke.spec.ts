import { test, expect, Page } from "@playwright/test";
import * as path from "path";

const fixture = path.join(__dirname, "fixtures", "wifi_error.png");

// Final acceptance checklist against the labsheet (runs on the live app).
// Mirrors the requirements matrix in tests.md + ui-spec 3.2/4.
test.describe("Acceptance checklist (labsheet conformance)", () => {
  test("all required UI functions are present and render on the live app", async ({ page }, testInfo) => {
    const isMobile = testInfo.project.name === "mobile";
    const rowOrCard = (text: string) =>
      page
        .locator(isMobile ? '[data-testid^="my-tickets-card-"]' : '[data-testid^="my-tickets-row-"]')
        .filter({ hasText: text })
        .first();
    const log: string[] = [];
    const check = (name: string) => {
      log.push(name);
      // consume the promise so failures bubble up with context
    };

    // 1. Requester selection (FR-01 / BR-03)
    await page.goto("/");
    await expect(page.getByTestId("requester-selector-modal")).toBeVisible();
    check("Requester selector modal shown on first visit");
    await page
      .locator('[data-testid^="requester-card-"]')
      .filter({ hasText: "Jennifer Anderson" })
      .click();
    await expect(page.getByTestId("requester-selector-modal")).toBeHidden();
    await expect(page.getByTestId("readonly-requester")).toHaveText(/Jennifer Anderson/);
    check("Requester selection persists (localStorage)");

    // 2. Create Ticket screen — every required control (FR-02, ui-spec 3.2)
    await expect(page.getByTestId("readonly-ticket-number")).toHaveText(/Auto-generated/);
    await expect(page.getByTestId("readonly-ticket-date")).toBeVisible();
    await expect(page.locator("#summary")).toBeVisible();
    await expect(page.locator("#description")).toBeVisible();
    await expect(page.locator("#categoryId")).toBeVisible();
    await expect(page.locator("#relatedSystemId")).toBeVisible();
    const categoryOptions = await page.locator("#categoryId option").count();
    expect(categoryOptions).toBeGreaterThanOrEqual(1);
    const systemOptions = await page.locator("#relatedSystemId option").count();
    expect(systemOptions).toBeGreaterThanOrEqual(1);
    const priorityOptions = await page.locator("#requestedPriority option").allTextContents();
    expect(priorityOptions).toEqual(["LOW", "MEDIUM", "HIGH", "URGENT"]);
    await expect(page.locator("#requestedPriority")).toHaveValue("MEDIUM");
    const acceptAttr = await page.locator("#attachments").getAttribute("accept");
    expect(acceptAttr).toContain("pdf");
    await expect(page.getByTestId("submit-ticket-btn")).toBeVisible();
    check("Create form: all required fields + dropdowns render (FR-02, ui-spec 3.2)");

    // ui-spec 4: main container max-width 1200px
    const maxWidth = await page
      .locator("main")
      .evaluate((el) => getComputedStyle(el as HTMLElement).maxWidth);
    expect(maxWidth).toBe("1200px");
    check("Main container max-width 1200px (ui-spec 4)");

    // 3. Create a ticket WITH attachment (FR-04) and read success info
    const summary = `Checklist ticket ${Date.now()}`;
    await page.locator("#summary").fill(summary);
    await page.locator("#description").fill("Filled by acceptance checklist.");
    await page.getByTestId("create-attachment-input").setInputFiles(fixture);
    await expect(page.getByText(/Selected 1 file/)).toBeVisible();
    await page.getByTestId("submit-ticket-btn").click();
    await expect(page.getByTestId("success-alert")).toBeVisible();
    await expect(page.getByTestId("uploaded-count")).toHaveText(/Attachments uploaded: 1 file\(s\)/);
    const tn = await page.getByTestId("success-alert").getByText(/TKT-\d{4}-\d{6}/).textContent().then((t) => (t ?? "").match(/TKT-\d{4}-\d{6}/)![0]);
    check("Create ticket succeeds and attachment uploads at create time (FR-04)");

    // 4. My Tickets screen — every control (FR-05..FR-08, ui-spec 4)
    await page.getByTestId("my-tickets-search").fill(summary);
    await page.getByTestId("my-tickets-search-btn").click();
    await expect(rowOrCard(summary)).toBeVisible();
    check("My Tickets: search works (FR-06)");

    for (const filterId of ["my-tickets-filter-category", "my-tickets-filter-priority", "my-tickets-filter-status"]) {
      await expect(page.getByTestId(filterId)).toBeVisible();
    }
    await expect(page.getByTestId("my-tickets-sort")).toBeVisible();
    await expect(page.getByTestId("my-tickets-order-toggle")).toBeVisible();
    await expect(page.getByTestId("my-tickets-total")).toBeVisible();
    check("My Tickets: category/priority/status filters + sort + order toggle render (FR-07/08)");

    // 5. Ticket Detail — all sections (FR-09, FR-10, ui-spec 5)
    await rowOrCard(summary).click();
    await expect(page.getByTestId("detail-status")).toHaveText("New");
    await expect(page.getByTestId("attachment-list").getByText("wifi_error.png")).toBeVisible();
    await expect(page.locator('[data-testid^="attachment-download-"]').first()).toBeVisible({ timeout: 10_000 });
    check("Detail: status + attachment from create visible (FR-03/04)");

    // 6. Attachment soft-remove with required reason (FR-10 / AC-05)
    await page.locator('[data-testid^="attachment-remove-"]').first().click();
    await expect(page.getByTestId("remove-reason-prompt")).toBeVisible();
    await page.getByTestId("remove-reason-input").fill("duplicate from checklist");
    await page.getByTestId("remove-confirm-btn").click();
    await expect(page.getByTestId("detail-notice")).toHaveText(/removed/i);
    await expect(page.locator('[data-testid^="attachment-removed-"]').first()).toContainText("[Removed]");
    check("Soft-remove requires reason and marks [Removed] (FR-10/AC-05)");

    await page.getByTestId("back-to-my-tickets").click();
    await expect(page.getByTestId("my-tickets-search")).toBeVisible();
    check("Back navigation returns to My Tickets");

    expect(log.length).toBeGreaterThan(0);
  });
});