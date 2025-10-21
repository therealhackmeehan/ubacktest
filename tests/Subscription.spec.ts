import { test, expect, type Page } from "@playwright/test";
import {
  signUserUp,
  logUserIn,
  createRandomUser,
  makeStripePayment,
  initEmptyStrategy,
  type User,
  goToAndValidate,
  runBacktest,
  isVisibleText,
  isSuccessfulBacktest,
  clickOnText,
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
  await isVisibleText(page, "3 tests remaining");

  for (let i = 0; i < 3; i++) {
    await runBacktest({ page });
    await isSuccessfulBacktest(page);
    await clickOnText(page, "Toggle to Editor");
    await page.waitForTimeout(1000);
  }

  await isVisibleText(page, "0 tests remaining");
});

test("Unsubscriber's 4th backtest fails", async () => {
  expect(page.url()).toContain("/editor");
  await isVisibleText(page, "0 tests remaining");
  await runBacktest({ page });
  await isVisibleText(
    page,
    "You must add more credits or purchase a subscription to continue using this service."
  );
  await isVisibleText(page, "Take a Look!");
  await clickOnText(page, "Take a Look!");
});

test("Purchase hobby subscription", async () => {
  await makeStripePayment({ test, page, planName: "hobby" });
});

test("Hobby subscriber unable to run a high-freqrequency backtest", async () => {
  await goToAndValidate(page, "/editor");
  await runBacktest({ page, intval: "1min" });
  await isVisibleText(
    page,
    "High frequency backtesting is only available to pro users. Consider upgrading your subscription."
  );
  await isVisibleText(page, "Take a Look!");
  await clickOnText(page, "Take a Look!");
});

test("Hobby CAN generate another low-frequency backtest", async () => {
  await goToAndValidate(page, "/editor");
  await runBacktest({ page, intval: "daily" });
  await isSuccessfulBacktest(page);
  await clickOnText(page, "Toggle to Editor");
});
