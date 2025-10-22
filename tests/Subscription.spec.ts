import { test, expect, type Page } from "@playwright/test";
import {
  signUserUp,
  logUserIn,
  createRandomUser,
  makeStripePayment,
  createNewStrategy,
  goToAndValidate,
  runBacktest,
  visibleText,
  successfulBacktest,
  clickOnText,
  rejectCookies,
  type User,
} from "./utils";

let page: Page;
let testUser: User;

test.describe.configure({ mode: "serial" });
test.slow();

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  testUser = createRandomUser();
  await signUserUp(page, testUser);
  await logUserIn(page, testUser);
  await rejectCookies(page);
  await createNewStrategy(page);
});

test.afterAll(async () => {
  await page.close();
});

test("Unsubscriber can generate 3 backtests for free", async () => {
  test.slow();
  expect(page.url()).toContain("/editor");
  await visibleText(page, "3 tests remaining");
  for (let i = 0; i < 3; i++) {
    await runBacktest({ page });
    await successfulBacktest(page);
    await clickOnText(page, "Toggle to Editor");
    await page.waitForTimeout(1000);
  }

  await visibleText(page, "0 tests remaining");
});

test("Unsubscriber's 4th backtest fails", async () => {
  expect(page.url()).toContain("/editor");
  await visibleText(page, "0 tests remaining");
  await runBacktest({ page });
  await visibleText(
    page,
    "You must add more credits or purchase a subscription to continue using this service."
  );
  await visibleText(page, "Take a Look!");
  await clickOnText(page, "Take a Look!");
});

test("Purchase hobby subscription", async () => {
  await makeStripePayment({ test, page, planName: "hobby" });
});

test("Hobby subscriber unable to run a high-freqrequency backtest", async () => {
  await goToAndValidate(page, "/editor");
  await runBacktest({ page, intval: "1min" });
  await visibleText(
    page,
    "High frequency backtesting is only available to pro users. Consider upgrading your subscription."
  );
  await visibleText(page, "Take a Look!");
  await clickOnText(page, "Take a Look!");
});

test("Hobby subscriber can generate another low-frequency backtest", async () => {
  await goToAndValidate(page, "/editor");
  await runBacktest({ page, intval: "daily" });
  await successfulBacktest(page);
  await clickOnText(page, "Toggle to Editor");
});
