import { test, expect, type Page } from "@playwright/test";
import {
  signUserUp,
  logUserIn,
  createRandomUser,
  fillEditor,
  type User,
  initEmptyStrategy,
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

// Testing backend sucks with playwright. I'll revamp these one day. Some obvious test cases for now.

// ✅ Correct strategy structure for reference
const correctStrategy = `def strategy(data):\n\tdata['signal'] = 1\n\treturn data`;

test("Script defines strategy but with incorrect indentation", async () => {
  await fillEditor(
    page,
    `def strategy(data):\ndata['signal'] = 1\nreturn data`
  ); // Incorrect indentation
  await page.click('button:has-text("GO")');
  await page.waitForSelector("text=Output Console", { timeout: 10000 });
  await expect(page.getByText("Output Console")).toBeVisible();
});

test("Strategy does not return a DataFrame", async () => {
  await fillEditor(
    page,
    `def strategy(data):\n\tdata['signal'] = 1\n\tdata = "lol"\n\treturn data`
  ); // Returns a string instead of DataFrame
  await page.click('button:has-text("GO")');
  await page.waitForSelector("text=Output Console", { timeout: 10000 });
  await expect(page.getByText("Output Console")).toBeVisible();
  await expect(
    page.getByText("You must return a dataframe from your strategy.")
  ).toBeVisible();
});

test('Strategy does not contain a "signal" column', async () => {
  await fillEditor(
    page,
    `def strategy(data):\n\tdata['lol'] = 1\n\treturn data`
  ); // No 'signal' column
  await page.click('button:has-text("GO")');
  await page.waitForSelector("text=Output Console", { timeout: 10000 });
  await expect(page.getByText("Output Console")).toBeVisible();
  await expect(
    page.getByText("There is no 'signal' column in the table.")
  ).toBeVisible();
});

test('Strategy returns two "signal" columns', async () => {
  await fillEditor(
    page,
    `def strategy(data):\n\tdata['signal'] = 1\n\tdata['SIGNAL'] = 1\n\treturn data`
  ); // Duplicate columns
  await page.click('button:has-text("GO")');
  await page.waitForSelector("text=Output Console", { timeout: 10000 });
  await expect(page.getByText("Output Console")).toBeVisible();
  await expect(
    page.getByText("There are two or more 'signal' columns in the table.")
  ).toBeVisible();
});

test('Strategy returns "signal" values outside the range [-1, 1]', async () => {
  await fillEditor(
    page,
    `def strategy(data):\n\tdata['signal'] = 2\n\treturn data`
  ); // Invalid values
  await page.click('button:has-text("GO")');
  await page.waitForSelector("text=Output Console", { timeout: 10000 });
  await expect(page.getByText("Output Console")).toBeVisible();
  await expect(
    page.getByText("'signal' column contains values outside the range [-1, 1].")
  ).toBeVisible();
});

test("Strategy changes the height of the DataFrame", async () => {
  await fillEditor(
    page,
    `def strategy(data):\n\tdata['signal'] = 1\n\treturn data.iloc[2:]`
  ); // Drops rows
  await page.click('button:has-text("GO")');
  await page.waitForSelector("text=Output Console", { timeout: 10000 });
  await expect(page.getByText("Output Console")).toBeVisible();
  await expect(
    page.getByText(
      "The height of the dataframe has changed upon applying your strategy."
    )
  ).toBeVisible();
});
