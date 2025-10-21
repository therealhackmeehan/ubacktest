import { test, type Page } from "@playwright/test";
import {
  signUserUp,
  logUserIn,
  createRandomUser,
  type User,
  initEmptyStrategy,
  RANDOM_RESULT_NAME,
  goToAndValidate,
  runBacktest,
  isSuccessfulBacktest,
  saveResult,
  isVisibleText,
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
  await runBacktest({ page });
  await isSuccessfulBacktest(page);
});

test("Press 'save result' button", async () => {
  await saveResult(page);
});

test("Result is now available in saved results", async () => {
  await goToAndValidate(page, "/results");
  await isVisibleText(page, RANDOM_RESULT_NAME);
});
