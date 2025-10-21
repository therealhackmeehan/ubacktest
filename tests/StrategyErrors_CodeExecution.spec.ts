import { test, type Page } from "@playwright/test";
import {
  signUserUp,
  logUserIn,
  createRandomUser,
  fillEditor,
  createNewStrategy,
  runBacktest,
  isVisibleText,
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

// Testing backend sucks with playwright. I'll revamp these one day. Some obvious test cases for now.
test("Script defines strategy but with incorrect indentation", async () => {
  await fillEditor(
    page,
    `def strategy(data):\ndata['signal'] = 1\nreturn data`
  ); // Incorrect indentation
  await runBacktest({ page });
  await page.waitForSelector("text=Output Console", { timeout: 10000 });
  await isVisibleText(page, "Output Console");
});

test("Strategy does not return a DataFrame", async () => {
  await fillEditor(
    page,
    `def strategy(data):\n\tdata['signal'] = 1\n\tdata = "lol"\n\treturn data`
  ); // Returns a string instead of DataFrame
  await runBacktest({ page });
  await page.waitForSelector("text=Output Console", { timeout: 10000 });
  await isVisibleText(page, "Output Console");
  await isVisibleText(page, "You must return a dataframe from your strategy.");
});

test('Strategy does not contain a "signal" column', async () => {
  await fillEditor(
    page,
    `def strategy(data):\n\tdata['lol'] = 1\n\treturn data`
  ); // No 'signal' column
  await runBacktest({ page });
  await page.waitForSelector("text=Output Console", { timeout: 10000 });
  await isVisibleText(page, "Output Console");
  await isVisibleText(page, "There is no 'signal' column in the table.");
});

test('Strategy returns two "signal" columns', async () => {
  await fillEditor(
    page,
    `def strategy(data):\n\tdata['signal'] = 1\n\tdata['SIGNAL'] = 1\n\treturn data`
  ); // Duplicate columns
  await runBacktest({ page });
  await page.waitForSelector("text=Output Console", { timeout: 10000 });
  await isVisibleText(page, "Output Console");
  await isVisibleText(
    page,
    "There are two or more 'signal' columns in the table."
  );
});

test('Strategy returns "signal" values outside the range [-1, 1]', async () => {
  await fillEditor(
    page,
    `def strategy(data):\n\tdata['signal'] = 2\n\treturn data`
  ); // Invalid values
  await runBacktest({ page });
  await page.waitForSelector("text=Output Console", { timeout: 10000 });
  await isVisibleText(page, "Output Console");
  await isVisibleText(
    page,
    "'signal' column contains values outside the range [-1, 1]."
  );
});

test("Strategy changes the height of the DataFrame", async () => {
  await fillEditor(
    page,
    `def strategy(data):\n\tdata['signal'] = 1\n\treturn data.iloc[2:]`
  ); // Drops rows
  await runBacktest({ page });
  await page.waitForSelector("text=Output Console", { timeout: 10000 });
  await isVisibleText(page, "Output Console");
  await isVisibleText(
    page,
    "The height of the dataframe has changed upon applying your strategy."
  );
});
