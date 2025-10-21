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
const ERROR_HEADER = "We've Encountered an Error...";

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
  await clickOnText(page, "reset");
});

test("Nonexistent stock symbol triggers an error", async () => {
  await runBacktest({ page, symbol: "ZZZZ" });
  await visibleText(page, ERROR_HEADER);
});

test("Stock exists but does not have data in the selected date range", async () => {
  const sevenYearsAgo = new Date();
  sevenYearsAgo.setFullYear(sevenYearsAgo.getFullYear() - 7);
  const sevenYearsAgoString = sevenYearsAgo.toISOString().slice(0, 10);
  const sixYearsAgo = new Date();
  sixYearsAgo.setFullYear(sixYearsAgo.getFullYear() - 6);
  const sixYearsAgoString = sixYearsAgo.toISOString().slice(0, 10);

  await runBacktest({
    page,
    symbol: "ABNB",
    startDate: sevenYearsAgoString,
    endDate: sixYearsAgoString,
  });
  await visibleText(page, ERROR_HEADER);
});
