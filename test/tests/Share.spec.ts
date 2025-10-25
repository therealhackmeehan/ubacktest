import { test, type Page } from "@playwright/test";
import {
  signUserUp,
  logUserIn,
  createRandomUser,
  createNewStrategy,
  runBacktest,
  successfulBacktest,
  saveResult,
  goToAndValidate,
  visibleText,
  logUserOut,
  clickOnText,
  rejectCookies,
  type User,
  clickOnTestId,
} from "./utils";
import { randomUUID } from "crypto";

let page: Page;
let testUser1: User;
let testUser2: User;
const tempResultName = randomUUID().slice(0, 10);

test.describe.configure({ mode: "serial" });

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  testUser1 = createRandomUser();
  testUser2 = createRandomUser();
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
  await rejectCookies(page);
  await createNewStrategy(page);
});

test("Run and save a result in testuser1's account", async () => {
  await runBacktest({ page });
  await successfulBacktest(page);
  await saveResult(page, tempResultName);
  await goToAndValidate(page, "/results");
  await visibleText(page, tempResultName);
});

test("Share result with testuser2", async () => {
  await clickOnTestId(page, "share-button-icon");
  await page.getByPlaceholder("Enter email").fill(testUser2.email);
  await clickOnTestId(page, "confirm-share-button");
  await visibleText(
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
  await visibleText(
    page,
    `@${testUser1.email.split("@")[0]} sent you a result.`
  );
  await clickOnText(page, "Accept");
  await visibleText(page, tempResultName);
});
