import { test, type Page } from "@playwright/test";
import {
  signUserUp,
  logUserIn,
  createRandomUser,
  type User,
  initEmptyStrategy,
  makeStripePayment,
  runBacktest,
  isSuccessfulBacktest,
} from "./utils";

let page: Page;
let testUser: User;

test.describe.configure({ mode: "serial" });

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  testUser = createRandomUser();
  await signUserUp(page, testUser);
  await logUserIn(page, testUser);
});

test.afterAll(async () => {
  await page.close();
});

test("Purchase pro subscription", async () => {
  await makeStripePayment({ test, page, planName: "pro" });
});

test("Pro subscriber is able to perform high-frequency backtesting", async () => {
  await initEmptyStrategy(page);

  const today = new Date();
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(today.getDate() - 7);
  const sixDaysAgo = new Date(today);
  sixDaysAgo.setDate(today.getDate() - 6);
  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  await runBacktest({
    page,
    startDate: formatDate(oneWeekAgo),
    endDate: formatDate(sixDaysAgo),
    intval: "5min",
  });

  await isSuccessfulBacktest(page);
});
