import { test, type Page } from "@playwright/test";
import {
  signUserUp,
  logUserIn,
  createRandomUser,
  createNewStrategy,
  runBacktest,
  isSuccessfulBacktest,
  saveResult,
  goToAndValidate,
  isVisibleText,
  RANDOM_RESULT_NAME,
  logUserOut,
  clickOnText,
  rejectCookies,
  type User,
} from "./utils";

let page: Page;
let testUser1: User;
let testUser2: User;

test.describe.configure({ mode: "serial" });

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  testUser1 = createRandomUser();
  testUser2 = createRandomUser();
  await rejectCookies(page);
});

test.afterAll(async () => {
  await page.close();
});

test("Create testuser2's account", async () => {
  await signUserUp(page, testUser2);
});

test("Create testuser1's account", async () => {
  await signUserUp(page, testUser1);
  await logUserIn(page, testUser1);
  await createNewStrategy(page);
});

test("Run and save a result in testuser1's account", async () => {
  await runBacktest({ page });
  await isSuccessfulBacktest(page);
  await saveResult(page);
  await goToAndValidate(page, "/results");
  await isVisibleText(page, RANDOM_RESULT_NAME);
});

test("Share result with testuser2", async () => {
  await page.click('[data-testid="share-button-icon"]');
  await page.getByPlaceholder("Enter email").fill(testUser2.email);
  await page.click('[data-testid="confirm-share-button"]');
  await isVisibleText(
    page,
    `Success! You've shared the result with ${testUser2.email}`
  );
  await page.waitForTimeout(3500);
});

test("Log out testuser1, log in testuser2", async () => {
  await logUserOut(page, testUser1.email);
  await logUserIn(page, testUser2);
});

test("Verify the result has been shared with testuser2", async () => {
  await goToAndValidate(page, "/results");
  await clickOnText(page, "Shared with me");
  await isVisibleText(
    page,
    `@${testUser1.email.split("@")[0]} sent you a result.`
  );
  await clickOnText(page, "Accept");
  await isVisibleText(page, RANDOM_RESULT_NAME);
});
