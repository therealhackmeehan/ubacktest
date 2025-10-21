import { test, type Page } from "@playwright/test";
import {
  signUserUp,
  logUserIn,
  createRandomUser,
  createNewStrategy,
  runBacktest,
  isSuccessfulBacktest,
  chooseExample,
  clickOnText,
  rejectCookies,
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
  await rejectCookies(page);
  await createNewStrategy(page);
});

test.afterAll(async () => {
  await page.close();
});

test.afterEach(async () => {
  await clickOnText(page, "Toggle to Editor");
  await clickOnText(page, "reset");
});

test("Strategy successfully runs a buy and hold strategy", async () => {
  await chooseExample(page, "Buy and Hold Strategy");
  await runBacktest({ page });
  await isSuccessfulBacktest(page);
});

test("Strategy successfully runs an easy example", async () => {
  await chooseExample(page, "Simple Moving Average Crossover");
  await runBacktest({ page });
  await isSuccessfulBacktest(page);
});

test("Strategy successfully runs a medium example", async () => {
  await chooseExample(page, "Linear Regression");
  await runBacktest({ page });
  await isSuccessfulBacktest(page);
});
