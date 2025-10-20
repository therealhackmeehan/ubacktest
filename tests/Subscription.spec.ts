import { test, expect, type Page } from "@playwright/test";
import {
  signUserUp,
  logUserIn,
  createRandomUser,
  makeStripePayment,
  initEmptyStrategy,
  type User,
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

test("Unsubscriber can generate 3 backtests for free", async () => {
  test.slow();

  expect(page.url()).toContain("/editor");
  expect(page.getByText("3 tests remaining")).toBeVisible();

  for (let i = 0; i < 3; i++) {
    await page.getByText("GO").click();
    await expect(
      page.getByText("Stock Data and Simulated Backtest Result for")
    ).toBeVisible();
    await page.getByText("Toggle to Editor").click();
    await page.waitForTimeout(1000);
  }

  expect(page.getByText("0 tests remaining")).toBeVisible();
});

test("Unsubscriber's 4th backtest fails", async () => {
  expect(page.url()).toContain("/editor");
  expect(page.getByText("0 tests remaining")).toBeVisible();
  await page.getByText("GO").click();
  await expect(
    page.getByText(
      "You must add more credits or purchase a subscription to continue using this service."
    )
  ).toBeVisible();
  await expect(page.getByText("Take a Look!")).toBeVisible();
  await page.getByText("Take a Look!").click();
});

test("Purchase hobby subscription", async () => {
  const PLAN_NAME = "Hobby";
  await makeStripePayment({ test, page, planName: PLAN_NAME });
});

test("Hobby subscriber unable to run a high-freqrequency backtest", async () => {
  await page.goto("/editor");
  expect(page.url()).toContain("/editor");
  await page.selectOption('select[name="intval"]', "1min");
  await page.click('button:has-text("GO")');
  await expect(
    page.getByText(
      "High frequency backtesting is only available to pro users. Consider upgrading your subscription."
    )
  ).toBeVisible();
  await expect(page.getByText("Take a Look!")).toBeVisible();
  await page.getByText("Take a Look!").click();
});

test("Hobby CAN generate another low-frequency backtest", async () => {
  await page.goto("/editor");
  expect(page.url()).toContain("/editor");
  await page.selectOption('select[name="intval"]', "daily");
  await page.getByText("GO").click();
  await expect(
    page.getByText("Stock Data and Simulated Backtest Result for")
  ).toBeVisible();
  await page.getByText("Toggle to Editor").click();
});
