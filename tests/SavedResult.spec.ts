import { test, type Page } from "@playwright/test";
import {
  signUserUp,
  logUserIn,
  createRandomUser,
  RANDOM_RESULT_NAME,
  goToAndValidate,
  runBacktest,
  successfulBacktest,
  saveResult,
  visibleText,
  clickOnText,
  rejectCookies,
  type User,
  createNewStrategy,
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
});

test.afterAll(async () => {
  await page.close();
});

test("Run a simple buy-and-hold strategy", async () => {
  await createNewStrategy(page);
  await runBacktest({ page });
  await successfulBacktest(page);
});

test("Press 'save result' and name result", async () => {
  await saveResult(page);
});

test("Result is now available in saved results", async () => {
  await goToAndValidate(page, "/results");
  await visibleText(page, RANDOM_RESULT_NAME);
});
