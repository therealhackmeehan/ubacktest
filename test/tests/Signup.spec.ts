import { test, type Page } from "@playwright/test";
import {
  createRandomUser,
  visibleText,
  type User,
  signUserUpQuick,
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

// test("Ensure that a single user cannot sign up twice", async () => {
//   // this is really tricky. This is technically not an error. Because two people can't have the same email.
//   await signUserUp(page, testUser);
//   await logUserIn(page, testUser);
//   await logUserOut(page, testUser.email);
//   const sameUserNewPW = { ...testUser, password: "newpassword123" };
//   await signUserUpQuick(page, sameUserNewPW);
//   await visibleText(
//     page,
//     "Save failed: user with the same identity already exists"
//   );
// });

// Playwright not able to find tooltip. Rework coming!
// test("Ensure that username is a valid email", async () => {
//   const invalidEmailUser = { ...testUser, email: "notAnEmail" };
//   await signUserUpQuick(page, invalidEmailUser);
//   await visibleText(
//     page,
//     "Please include an '@' in the email address. 'notAnEmail' is missing an '@'."
//   );
// });

test("Ensure that password contains a number", async () => {
  const userWithoutNumberPassword = { ...testUser, password: "passwordNoNum" };
  await signUserUpQuick(page, userWithoutNumberPassword);
  await visibleText(page, "Validation failed: password must contain a number");
});

test("Ensure that password is long enough", async () => {
  const userWithTooShortPW = { ...testUser, password: "lol" };
  await signUserUpQuick(page, userWithTooShortPW);
  await visibleText(
    page,
    "Validation failed: password must be at least 8 characters"
  );
});
