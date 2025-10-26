import { type Page, test, expect } from "@playwright/test";
import { randomUUID } from "crypto";

export const RANDOM_STRATEGY_NAME = "randomStrategyName123123";
export const RANDOM_RESULT_NAME = "randomResultName";
const DEFAULT_PASSWORD = "password123";

export type User = {
  id?: number;
  email: string;
  password?: string;
};

export const createRandomUser = () => {
  const email = `${randomUUID()}@test.com`;
  return { email, password: DEFAULT_PASSWORD } as User;
};

type AuthAction = "login" | "signup";
type AuthOptions = {
  fast?: boolean;
  redirectTo?: string;
};

const navigateToAuth = async (page: Page, action: AuthAction) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Log in" }).click();
  if (action === "signup") await page.click('text="go to signup"');
  await page.waitForURL(`**/${action}`, { waitUntil: "domcontentloaded" });
};

const fillAuthForm = async (page: Page, user: User) => {
  await page.fill('input[name="email"]', user.email);
  await page.fill('input[name="password"]', user.password || DEFAULT_PASSWORD);
};

const submitAuthForm = async (page: Page, action: AuthAction, fast = false) => {
  const buttonText = action === "login" ? "Log in" : "Sign up";
  const click = page.click(`button:has-text("${buttonText}")`);

  if (fast) {
    await click;
    return;
  }

  await Promise.all([
    page
      .waitForResponse(
        (response) =>
          response.url().includes(action) && response.status() === 200
      )
      .catch((err) => console.error(err.message)),
    click,
  ]);
};

export const authenticateUser = async (
  page: Page,
  user: User,
  action: AuthAction,
  options: AuthOptions = {}
) => {
  const { fast = false, redirectTo } = options;

  await navigateToAuth(page, action);
  await fillAuthForm(page, user);
  await submitAuthForm(page, action, fast);

  if (!fast && redirectTo) {
    await page.waitForURL(`**/${redirectTo}`);
  }
};

export const logUserIn = (page: Page, user: User) =>
  authenticateUser(page, user, "login", { redirectTo: "editor" });

export const logUserInQuick = (page: Page, user: User) =>
  authenticateUser(page, user, "login", { fast: true });

export const signUserUp = (page: Page, user: User) =>
  authenticateUser(page, user, "signup");

export const signUserUpQuick = (page: Page, user: User) =>
  authenticateUser(page, user, "signup", { fast: true });

export const logUserOut = async (page: Page, email: string) => {
  await goToAndValidate(page, "/account");
  await clickOnText(page, "logout");
};

export async function createNewStrategy(
  page: Page,
  name: string = RANDOM_STRATEGY_NAME
) {
  await goToAndValidate(page, "/editor");
  await clickOnText(page, "new");
  await page.getByPlaceholder("Enter strategy name").fill(name);
  await clickOnText(page, "Confirm");
}

export async function fillEditor(page: Page, content: string) {
  await page.evaluate((code) => {
    const editor = (window as any).monaco.editor.getEditors()[0];
    editor.setValue(code);
  }, content);
}

export async function goToAndValidate(page: Page, ref: string) {
  await page.goto(ref);
  await page.waitForURL("**" + ref);
  expect(page.url()).toContain(ref);
}

export async function successfulBacktest(page: Page) {
  await visibleText(page, "Stock Data and Simulated Backtest Result for");
  await visibleText(page, "Toggle To Editor");
  await visibleTestId(page, "hypothetical-growth-header");
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
  await zoomOut(page);
  await clickOnText(page, "reset");
  await clickOnText(page, "advanced options");
  if (symbol) await page.fill('input[name="symbol"]', symbol);
  if (startDate) await page.fill('input[name="startDate"]', startDate);
  if (endDate) await page.fill('input[name="endDate"]', endDate);
  if (intval) await page.selectOption('select[name="intval"]', intval);
  // add more backtest options if needed!
  await page.click('button:has-text("GO")');
}

export async function visibleText(page: Page, text: string) {
  const locator = page.getByText(text);
  await expect(locator.first()).toBeVisible();
  const count = await locator.count();
  expect(count).toBe(1);
}

export async function clickOnText(page: Page, text: string) {
  await visibleText(page, text);
  await page.getByText(text).click();
}

export async function visibleTestId(page: Page, testid: string) {
  const locator = page.getByTestId(testid);
  const count = await locator.count();
  expect(count).toBe(1);
  await expect(locator.first()).toBeVisible();
}

export async function clickOnTestId(page: Page, testid: string) {
  await visibleTestId(page, testid);
  await page.getByTestId(testid).click();
}

export async function saveResult(
  page: Page,
  name: string = RANDOM_RESULT_NAME
) {
  await page.getByText("save to my results").first().click();
  await page.getByPlaceholder("Enter result name").fill(name);
  await clickOnText(page, "Confirm");
  await page.waitForTimeout(3500);
}

export async function chooseExample(page: Page, exampleToChoose: string) {
  await clickOnTestId(page, "launch-examples-button");
  await clickOnText(page, exampleToChoose);
}

export async function zoomOut(page: Page, customZoom: string = "60%") {
  await page.evaluate((zoom) => {
    document.body.style.zoom = zoom;
  }, customZoom);
}

export async function rejectCookies(page: Page) {
  await clickOnText(page, "Reject all");
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
