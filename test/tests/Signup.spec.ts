import { test, type Page } from "@playwright/test";
import {
  signUserUp,
  createRandomUser,
  visibleText,
  type User,
  logUserOut,
  logUserIn,
} from "./utils";

let page: Page;
let testUser: User;

test.describe.configure({ mode: "serial" });

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  testUser = createRandomUser();
  await signUserUp(page, testUser);
  await logUserIn(page, testUser);
  await logUserOut(page, testUser.email);
});

test.afterAll(async () => {
  await page.close();
});

test("Ensure that a single user cannot sign up twice", async () => {
  testUser.password = "newpassword";

  await signUserUp(page, testUser);
  await visibleText(
    page,
    "Save failed: user with the same identity already exists"
  );
});
