import { test, expect, type Page } from "@playwright/test";
import {
  signUserUp,
  logUserIn,
  createRandomUser,
  type User,
  initEmptyStrategy,
  RANDOM_STRATEGY_NAME,
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

test("Check that the new strategy is available in saved strategies", async () => {
  await page.goto("/home");
  expect(page.url()).toContain("/home");
  await expect(page.getByText(RANDOM_STRATEGY_NAME)).toBeVisible();
});
