import { type Page, test, expect } from "@playwright/test";
import { randomUUID } from "crypto";

export type User = {
  id?: number;
  email: string;
  password?: string;
};

const DEFAULT_PASSWORD = "password123";

export const createRandomUser = () => {
  const email = `${randomUUID()}@test.com`;
  return { email, password: DEFAULT_PASSWORD } as User;
};

export const logUserIn = async (page: Page, user: User) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Log in" }).click();
  await page.waitForURL("**/login", {
    waitUntil: "domcontentloaded",
  });
  await page.fill('input[name="email"]', user.email);
  await page.fill('input[name="password"]', DEFAULT_PASSWORD);
  const clickLogin = page.click('button:has-text("Log in")');
  await Promise.all([
    page
      .waitForResponse((response) => {
        return response.url().includes("login") && response.status() === 200;
      })
      .catch((err) => console.error(err.message)),
    ,
    clickLogin,
  ]);
  await page.waitForURL("**/editor");
};

export const logUserOut = async (page: Page) => {
  await goToAndValidate(page, "/");
  await page.getByRole("link", { name: "Log out" }).click();
};

export const signUserUp = async (page: Page, user: User) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Log in" }).click();
  await page.click('text="go to signup"');
  await page.fill('input[name="email"]', user.email);
  await page.fill('input[name="password"]', DEFAULT_PASSWORD);
  await page.click('button:has-text("Sign up")');
  await page
    .waitForResponse((response) => {
      return response.url().includes("signup") && response.status() === 200;
    })
    .catch((err) => console.error(err.message));
};

export const RANDOM_STRATEGY_NAME = "randomStrategyName";
export const RANDOM_RESULT_NAME = "randomResultName";

export const initEmptyStrategy = async (page: Page) => {
  await goToAndValidate(page, "/editor");
  await clickOnText(page, "new");
  await page.getByPlaceholder("Enter strategy name").fill(RANDOM_STRATEGY_NAME);
  await clickOnText(page, "Confirm");
  await clickOnText(page, "Reject all");
  await page.evaluate(() => {
    document.body.style.zoom = "60%";
  });
};

export async function fillEditor(page: Page, content: string) {
  await page.evaluate((code) => {
    const editor = (window as any).monaco.editor.getEditors()[0];
    editor.setValue(code);
  }, content);
}

export async function goToAndValidate(page: Page, ref: string) {
  await page.goto(ref);
  await page.waitForURL("**/" + ref);
  expect(page.url()).toContain(ref);
}

export async function isSuccessfulBacktest(page: Page) {
  await isVisibleText(page, "Stock Data and Simulated Backtest Result for");
  await isVisibleText(page, "Toggle to Editor");
}

interface RunBacktestOptions {
  page: Page;
  symbol?: string;
  startDate?: string;
  endDate?: string;
  intval?: string;
}

export async function runBacktest({
  page,
  symbol,
  startDate,
  endDate,
  intval,
}: RunBacktestOptions) {
  await clickOnText(page, "reset");
  await clickOnText(page, "advanced options");
  if (symbol) await page.fill('input[name="symbol"]', symbol);
  if (startDate) await page.fill('input[name="startDate"]', startDate);
  if (endDate) await page.fill('input[name="endDate"]', endDate);
  if (intval) await page.selectOption('select[name="intval"]', intval);
  // add more backtest options if needed!
  await page.click('button:has-text("GO")');
}

export async function isVisibleText(page: Page, text: string) {
  const locator = page.getByText(text);
  const count = await locator.count();
  expect(count).toBe(1);
  await expect(locator.first()).toBeVisible();
}

export async function clickOnText(page: Page, text: string) {
  await isVisibleText(page, text);
  await page.getByText(text).click();
}

export async function saveResult(page: Page) {
  await clickOnText(page, "save to my results");
  await page.getByPlaceholder("Enter result name").fill(RANDOM_RESULT_NAME);
  await clickOnText(page, "Confirm");
  await page.waitForTimeout(3500);
}

export async function chooseExample(page: Page, exampleToChoose: string) {
  await clickOnText(page, "examples");
  await clickOnText(page, exampleToChoose);
}

export const makeStripePayment = async ({
  test,
  page,
  planName,
}: {
  test: any;
  page: Page;
  planName: string;
}) => {
  test.slow(); // Stripe payments take a long time to confirm and can cause tests to fail so we use a longer timeout

  await page.click('text="Pricing"');
  await page.waitForURL("**/pricing");

  let idx = 0;
  if (planName == "credits5") {
    idx = 2;
  } else if (planName == "pro") {
    idx = 1;
  }

  const buyBtn = page.getByRole("button", { name: "Buy plan" }).nth(idx);
  await expect(buyBtn).toBeVisible();
  await expect(buyBtn).toBeEnabled();
  await buyBtn.click();

  await page.waitForURL("https://checkout.stripe.com/**", {
    waitUntil: "domcontentloaded",
  });
  await page
    .locator('.PaymentMethodFormAccordionItemTitle div:has-text("Card")')
    .first()
    .click({ force: true });

  await page.fill('input[name="cardNumber"]', "4242424242424242");
  await page.getByPlaceholder("MM / YY").fill("1225");
  await page.getByPlaceholder("CVC").fill("123");
  await page.getByPlaceholder("Full name on card").fill("Test User");
  const countrySelect = page.getByLabel("Country or region");
  await countrySelect.selectOption("Germany");
  // This is a weird edge case where the `payBtn` assertion tests pass, but the button click still isn't registered.
  // That's why we wait for stripe responses below to finish loading before clicking the button.
  await page.waitForResponse(
    (response) =>
      response.url().includes("trusted-types-checker") &&
      response.status() === 200
  );
  const payBtn = page.getByTestId("hosted-payment-submit-button");
  await expect(payBtn).toBeVisible();
  await expect(payBtn).toBeEnabled();
  await payBtn.click();

  await page.waitForURL("**/checkout?success=true");
  await page.waitForURL("**/account");
  if (planName != "credits5")
    await expect(page.getByText(planName)).toBeVisible();
};
