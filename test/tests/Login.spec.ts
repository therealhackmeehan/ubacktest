import { test, type Page } from "@playwright/test";
import {
  signUserUp,
  createRandomUser,
  visibleText,
  type User,
  logUserInQuick,
} from "./utils";

let page: Page;
let testUser: User;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  testUser = createRandomUser();
});

test.afterAll(async () => {
  await page.close();
});

test("Ensure unregistered user is unable to log in", async () => {
  await logUserInQuick(page, testUser);
  await visibleText(page, "Invalid credentials");
});

test("Ensure that a registered user (with wrong password) is unable to log in", async () => {
  await signUserUp(page, testUser);
  const wrongPasswordUser = {
    ...testUser,
    password: "uhohwrongpassword123",
  };
  await logUserInQuick(page, wrongPasswordUser);
  await visibleText(page, "Invalid credentials");
});
