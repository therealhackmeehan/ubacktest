import { test, type Page } from "@playwright/test";
import {
  signUserUp,
  logUserIn,
  createRandomUser,
  createNewStrategy,
  makeStripePayment,
  runBacktest,
  isSuccessfulBacktest,
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
});

test.afterAll(async () => {
  await page.close();
});

test("Purchase pro subscription", async () => {
  await makeStripePayment({ test, page, planName: "pro" });
});

test("Pro subscriber is able to perform high-frequency backtesting", async () => {
  await createNewStrategy(page);

  const today = new Date();
  const daysAgo_7 = new Date(today);
  daysAgo_7.setDate(today.getDate() - 7);
  const daysAgo_3 = new Date(today);
  daysAgo_3.setDate(today.getDate() - 3);
  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  await runBacktest({
    page,
    startDate: formatDate(daysAgo_7),
    endDate: formatDate(daysAgo_3),
    intval: "5min",
  });

  await isSuccessfulBacktest(page);
});
