import { test, type Page } from "@playwright/test";
import {
  signUserUp,
  logUserIn,
  createRandomUser,
  type User,
  initEmptyStrategy,
  runBacktest,
  isSuccessfulBacktest,
  chooseExample,
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

test.afterEach(async () => {
  await clickOnText(page, "Toggle to Editor");
  await clickOnText(page, "reset");
});

test("Strategy successfully runs a buy and hold strategy", async () => {
  await chooseExample(page, "Buy and Hold");
  await runBacktest({ page });
  await isSuccessfulBacktest(page);
});

test("Strategy successfully runs a mildly complicated example", async () => {
  await chooseExample(page, "Linear Regression");
  await runBacktest({ page });
  await isSuccessfulBacktest(page);
});
