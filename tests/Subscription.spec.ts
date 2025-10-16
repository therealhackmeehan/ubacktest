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
  await signUserUp({ page: page, user: testUser });
  await logUserIn({ page: page, user: testUser });
  await initEmptyStrategy({ page: page });
});

test.afterAll(async () => {
  await page.close();
});

test("Can generate 3 backtests for free", async () => {
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

test("Fourth attempted backtest fails", async () => {
  expect(page.url()).toContain("/editor");
  expect(page.getByText("0 tests remaining")).toBeVisible();
  await page.getByText("GO").click();
  expect(
    page.getByText(
      "You must add more credits or purchase a basic monthly subscription to continue to use this software."
    )
  ).toBeVisible();
  expect(page.getByText("Take a Look!")).toBeVisible();
  page.getByText("Take a Look!").click();
});

test("Make test payment with Stripe", async () => {
  const PLAN_NAME = "Hobby";
  await makeStripePayment({ test, page, planName: PLAN_NAME });
});

test("Can now generate another backtest", async () => {
  await page.goto("/editor");
  expect(page.url()).toContain("/editor");
  await page.getByText("GO").click();
  await expect(
    page.getByText("Stock Data and Simulated Backtest Result for")
  ).toBeVisible();
  await page.getByText("Toggle to Editor").click();
});
