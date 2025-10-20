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
  await signUserUp(page, testUser);
  await logUserIn(page, testUser);
  await initEmptyStrategy(page);
});

test.afterAll(async () => {
  await page.close();
});

test("Unsubscriber starts with 3 credits", () => {
  expect(page.url()).toContain("/editor");
  expect(page.getByText("3 tests remaining")).toBeVisible();
});

test("Purchase 5 credits with stripe", async () => {
  const PLAN_NAME = "credits5";
  await makeStripePayment({ test, page, planName: PLAN_NAME });
});

test("Unsubscriber now has 8 credits on account page", async () => {
  await expect(page.getByText("Account Information")).toBeVisible();
  expect(page.getByText("Credits remaining: 8")).toBeVisible();
});
