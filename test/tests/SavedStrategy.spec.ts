import { test, type Page } from "@playwright/test";
import {
  signUserUp,
  logUserIn,
  createRandomUser,
  createNewStrategy,
  RANDOM_STRATEGY_NAME,
  goToAndValidate,
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

test("Check that the new strategy is available in saved strategies", async () => {
  await goToAndValidate(page, "/home");
  await visibleText(page, RANDOM_STRATEGY_NAME);
});
