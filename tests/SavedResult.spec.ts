import { test, expect, type Page } from "@playwright/test";
import {
  signUserUp,
  logUserIn,
  createRandomUser,
  type User,
  initEmptyStrategy,
  RANDOM_RESULT_NAME,
} from "./utils";

let page: Page;
let testUser: User;

test.describe.configure({ mode: "serial" });

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  testUser = createRandomUser();
  await signUserUp(page, testUser);
  await logUserIn(page, testUser);
  await initEmptyStrategy(page);
});

test.afterAll(async () => {
  await page.close();
});

test("Run a simple buy-and-hold strategy", async () => {
  await page.click('button:has-text("GO")');
  await expect(
    page.getByText("Stock Data and Simulated Backtest Result for")
  ).toBeVisible();
});

test("Press 'save result' button", async () => {
  await page.click('button:has-text("save to my results")');
  await page.getByPlaceholder("Enter result name").fill(RANDOM_RESULT_NAME);
  await page.click('button:has-text("Confirm")');
  await page.waitForTimeout(3500);
});

test("Result is now available in saved results", async () => {
  await page.goto("/results");
  expect(page.url()).toContain("/results");
  await expect(page.getByText(RANDOM_RESULT_NAME)).toBeVisible();
});

// test("Result is now available in global leaderboard", async () => {
//   await page.goto("/leaderboard");
//   expect(page.url()).toContain("/leaderboard");
//   await expect(page.getByText(RANDOM_RESULT_NAME)).toBeVisible();
// });
