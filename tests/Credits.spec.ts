import { test, expect, type Page } from "@playwright/test";
import {
  signUserUp,
  logUserIn,
  createRandomUser,
  makeStripePayment,
  createNewStrategy,
  visibleText,
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

test("Unsubscriber starts with 3 credits", async () => {
  expect(page.url()).toContain("/editor");
  await visibleText(page, "3 tests remaining");
});

test("Purchase 5 credits with stripe", async () => {
  await makeStripePayment({ test, page, planName: "credits5" });
});

test("Unsubscriber now has 8 credits on account page", async () => {
  expect(page.url()).toContain("/account");
  await visibleText(page, "Account Information");
  await visibleText(page, "Credits remaining: 8");
});
