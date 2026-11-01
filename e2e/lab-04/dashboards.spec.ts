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

test.describe("E2E-03: Role dashboards navigation & drill-down flow (AC-04, AC-05, FR-10)", () => {
  test("IT Staff and Requester view their role-specific dashboards and drill down into filtered ticket lists", async ({
    page,
  }, testInfo) => {
    const project = testInfo.project.name;
    const isMobile = project === "mobile";

    // --- 1. Login as IT Staff and open the IT Staff Dashboard ---
    await login(page, "alex.it@toktickit.com", "Password123!");
    await expect(page.getByTestId("staff-queue-card")).toBeVisible();

    await navigateHeader(page, project, "dashboard");
    await expect(page.getByTestId("staff-dashboard")).toBeVisible();
    await expect(page.getByTestId("staff-dashboard-greeting")).toContainText("Welcome back,");
    await expect(page.getByTestId("staff-dashboard-greeting")).toContainText("Alex Thompson");

    // Verify all 5 operational metric cards are rendered with numeric values
    for (const key of ["new", "open", "in-progress", "waiting-for-requester", "my-assigned"]) {
      await expect(page.getByTestId(`staff-metric-card-${key}`)).toBeVisible();
      await expect(page.getByTestId(`staff-metric-value-${key}`)).toHaveText(/^\d+$/);
    }

    // Verify Recent Queue Tickets & Quick Actions panels
    await expect(page.getByTestId("staff-recent-tickets-panel")).toBeVisible();
    await expect(page.getByTestId("staff-quick-actions-panel")).toBeVisible();
    if (isMobile) {
      await expect(page.getByTestId("staff-recent-tickets-cards")).toBeVisible();
    } else {
      await expect(page.getByTestId("staff-recent-tickets-table")).toBeVisible();
    }
    await page.screenshot({ path: shot(project, "dashboards", "staff-dashboard"), fullPage: true });
    await expectNoHorizontalOverflow(page);

    // --- 2. Drill down from Staff Dashboard "In Progress" card -> Ticket Queue filtered by "In Progress" ---
    await page.getByTestId("staff-metric-card-in-progress").click();
    await expect(page.getByTestId("staff-queue-card")).toBeVisible();
    await expect(page.getByTestId("queue-filter-status")).toHaveValue("In Progress");
    await expectNoHorizontalOverflow(page);

    // --- 3. Return to Staff Dashboard and test "My Queue" Quick Action drill-down ---
    await navigateHeader(page, project, "dashboard");
    await expect(page.getByTestId("staff-dashboard")).toBeVisible();
    await page.getByTestId("staff-quick-action-my-queue").click();
    await expect(page.getByTestId("staff-queue-card")).toBeVisible();
    await expect(page.getByTestId("queue-filter-owner")).not.toHaveValue("");

    // --- 4. Logout and login as Requester, then open Requester Dashboard ---
    await page.getByTestId("header-user-menu").click();
    await page.getByTestId("header-logout").click();
    await expect(page.getByTestId("login-card")).toBeVisible();

    await login(page, "jennifer@toktickit.com", "Password123!");
    await expect(page.getByTestId("my-tickets-card")).toBeVisible();

    await navigateHeader(page, project, "dashboard");
    await expect(page.getByTestId("requester-dashboard")).toBeVisible();
    await expect(page.getByTestId("requester-dashboard-greeting")).toContainText("Welcome,");
    await expect(page.getByTestId("requester-dashboard-greeting")).toContainText("Jennifer Anderson");

    // Verify all 4 requester metric cards are rendered with numeric values
    for (const key of ["my-open", "in-progress", "resolved", "closed"]) {
      await expect(page.getByTestId(`requester-metric-card-${key}`)).toBeVisible();
      await expect(page.getByTestId(`requester-metric-value-${key}`)).toHaveText(/^\d+$/);
    }

    // Verify My Recent Tickets & Quick Actions panels
    await expect(page.getByTestId("requester-recent-tickets-panel")).toBeVisible();
    await expect(page.getByTestId("requester-quick-actions-panel")).toBeVisible();
    if (isMobile) {
      await expect(page.getByTestId("requester-recent-tickets-cards")).toBeVisible();
    } else {
      await expect(page.getByTestId("requester-recent-tickets-table")).toBeVisible();
    }
    await page.screenshot({ path: shot(project, "dashboards", "requester-dashboard"), fullPage: true });
    await expectNoHorizontalOverflow(page);

    // --- 5. Drill down from Requester Dashboard "Resolved" card -> My Tickets filtered by "Resolved" ---
    await page.getByTestId("requester-metric-card-resolved").click();
    await expect(page.getByTestId("my-tickets-card")).toBeVisible();
    await expect(page.getByTestId("my-tickets-filter-status")).toHaveValue("Resolved");
    await expectNoHorizontalOverflow(page);

    // --- 6. Return to Requester Dashboard and verify Quick Actions (+ Create Ticket & View My Tickets) ---
    await navigateHeader(page, project, "dashboard");
    await expect(page.getByTestId("requester-dashboard")).toBeVisible();
    await page.getByTestId("requester-quick-action-create-ticket").click();
    await expect(page.getByTestId("submit-ticket-btn")).toBeVisible();
    await expectNoHorizontalOverflow(page);

    await navigateHeader(page, project, "dashboard");
    await expect(page.getByTestId("requester-dashboard")).toBeVisible();
    await page.getByTestId("requester-quick-action-view-tickets").click();
    await expect(page.getByTestId("my-tickets-card")).toBeVisible();
    await expect(page.getByTestId("my-tickets-filter-status")).toHaveValue("");
    await expectNoHorizontalOverflow(page);
  });
});

