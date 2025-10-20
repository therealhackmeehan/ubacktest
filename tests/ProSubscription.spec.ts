import { test, expect, type Page } from "@playwright/test";
import {
  signUserUp,
  logUserIn,
  createRandomUser,
  type User,
  initEmptyStrategy,
  makeStripePayment,
} from "./utils";

let page: Page;
let testUser: User;

test.describe.configure({ mode: "serial" });

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  testUser = createRandomUser();
  await signUserUp(page, testUser);
  await logUserIn(page, testUser);
});

test.afterAll(async () => {
  await page.close();
});

test("Purchase pro subscription", async () => {
  await makeStripePayment({ test, page, planName: "pro" });
});

test("Pro subscriber is able to perform high-frequency backtesting", async ({
  page,
}) => {
  await initEmptyStrategy(page);
  await page.selectOption('select[name="intval"]', "1min");

  const today = new Date();
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(today.getDate() - 7);
  const sixDaysAgo = new Date(today);
  sixDaysAgo.setDate(today.getDate() - 6);
  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  await page.fill('input[name="startDate"]', formatDate(oneWeekAgo));
  await page.fill('input[name="endDate"]', formatDate(sixDaysAgo));
  await page.click('button:has-text("GO")');
  await expect(
    page.getByText("Stock Data and Simulated Backtest Result for")
  ).toBeVisible();
});
