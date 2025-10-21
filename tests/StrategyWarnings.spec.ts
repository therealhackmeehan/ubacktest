import { test, type Page } from "@playwright/test";
import {
  signUserUp,
  logUserIn,
  createRandomUser,
  createNewStrategy,
  runBacktest,
  visibleText,
  clickOnText,
  rejectCookies,
  type User,
} from "./utils";

let page: Page;
let testUser: User;

const WARNING_HEADER = "Just a Heads Up...";
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

test.afterEach(async () => {
  await clickOnText(page, "OK");
  await clickOnText(page, "Toggle to Editor");
  await clickOnText(page, "reset");
});

const WARNING_MISSING_DATA =
  "Discrepancy between available data and selected dates. Stock may have IPO'd later or been delisted earlier.";

test("Stock exists but does not have COMPLETE data in the selected date range", async () => {
  await runBacktest({
    page,
    symbol: "ABNB",
    startDate: "2020-03-01",
    endDate: "2021-03-01",
  });
  await visibleText(page, WARNING_HEADER);
  await visibleText(page, WARNING_MISSING_DATA);
});

// const WARNING_LOW_VOLUME =
//     'The selected stock exhibits low trading volume, which may result in increased price volatility and unpredictable behavior. ' +
//     'Exercise caution when testing your strategy with this stock.';
// test('Stock exists but has strangely low volume', async () => {
//     const startDate = '2020-03-01';
//     const endDate = '2021-03-01';

//     await page.fill('input[name="symbol"]', 'AAA');
//     await page.fill('input[name="startDate"]', startDate);
//     await page.fill('input[name="endDate"]', endDate);
//     await page.click('button:has-text("GO")');
//     await expect(page.getByText(WARNING_HEADER)).toBeVisible();
//     await expect(page.getByText(WARNING_LOW_VOLUME)).toBeVisible();
// })
