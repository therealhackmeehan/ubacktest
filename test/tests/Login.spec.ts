import { test, type Page } from "@playwright/test";
import {
  signUserUp,
  logUserIn,
  createRandomUser,
  visibleText,
  type User,
} from "./utils";

let page: Page;
let testUser: User;

test.describe.configure({ mode: "serial" });

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  testUser = createRandomUser();
});

test.afterAll(async () => {
  await page.close();
});

test("Ensure unregistered user is unable to log in", async () => {
  await logUserIn(page, testUser);
  await visibleText(page, "Invalid credentials");
});

test("Ensure that a registered user (with wrong password) is unable to log in", async () => {
  await signUserUp(page, testUser);
  testUser.password = "uhohincorrectpassword";
  await logUserIn(page, testUser);
  await visibleText(page, "Invalid credentials");
});
