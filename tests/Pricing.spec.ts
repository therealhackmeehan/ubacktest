import { test, expect, type Page } from "@playwright/test";
import {
  signUserUp,
  logUserIn,
  createRandomUser,
  makeStripePayment,
  type User,
} from "./utils";

let page: Page;
let testUser: User;

async function logNewUserIn() {
  testUser = createRandomUser();
  await signUserUp({ page: page, user: testUser });
  await logUserIn({ page: page, user: testUser });
}

test.describe.configure({ mode: "serial" });

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
});

test.afterAll(async () => {
  await page.close();
});

test("Unsubscriber should see Log In to buy plan button", async () => {
  await page.goto("/pricing");
  const buyPlanButton = page
    .getByRole("button", { name: "Log in to buy plan" })
    .first();
  await expect(buyPlanButton).toBeVisible();
  await expect(buyPlanButton).toBeEnabled();
  await buyPlanButton.click();
  await page.waitForURL("**/login");
  expect(page.url()).toContain("/login");
});

test("Unsubscriber should see the buy plan button before payment", async () => {
  await logNewUserIn();
  await page.goto("/pricing");
  const manageSubscriptionButton = page
    .getByRole("button", { name: "Buy plan" })
    .first();
  await expect(manageSubscriptionButton).toBeVisible();
  await expect(manageSubscriptionButton).toBeEnabled();
});

test("Purchase a hobby subscription", async () => {
  const PLAN_NAME = "Hobby";
  await makeStripePayment({ test, page, planName: PLAN_NAME });
});

test("Hobby Subscriber should see the manage subscription button after payment", async () => {
  await page.goto("/pricing");
  const manageSubscriptionButton = page
    .getByRole("button", { name: "Manage Subscription" })
    .first();
  await expect(manageSubscriptionButton).toBeVisible();
  await expect(manageSubscriptionButton).toBeEnabled();
  await manageSubscriptionButton.click();
  const newTabPromise = page.waitForEvent("popup");
  const newTab = await newTabPromise;
  await newTab.waitForLoadState();
  await expect(newTab).toHaveURL(/^https:\/\/billing\.stripe\.com\//);
});
