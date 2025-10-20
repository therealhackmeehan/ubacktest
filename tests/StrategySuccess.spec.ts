import { test, expect, type Page } from "@playwright/test";
import {
  signUserUp,
  logUserIn,
  createRandomUser,
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

test.afterEach(async () => {
  await page.click('button:has-text("Toggle to Editor")');
  await page.click('button:has-text("reset")');
});

test("Strategy successfully runs a buy and hold strategy", async () => {
  await page.evaluate(() => {
    const editor = (window as any).monaco.editor.getEditors()[0];
    editor.setValue(`import pandas as pd
def strategy(data):
    data['signal'] = 1
    return data`);
  });
  await page.click('button:has-text("GO")');
  await expect(
    page.getByText("Stock Data and Simulated Backtest Result for")
  ).toBeVisible();
});

test("Strategy successfully runs a mildly complicated example", async () => {
  await page.click('button:has-text("examples")');
  await page.click('button:has-text("Linear Regression")');
  await page.click('button:has-text("GO")');

  // Wait for the results container or confirmation text to appear
  await page.waitForSelector(
    "text=Stock Data and Simulated Backtest Result for",
    { timeout: 10000 }
  );

  // Assert that the expected text is visible
  await expect(
    page.getByText("Stock Data and Simulated Backtest Result for")
  ).toBeVisible();
});
