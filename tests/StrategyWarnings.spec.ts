import { test, expect, type Page } from '@playwright/test';
import { signUserUp, logUserIn, createRandomUser, type User, initEmptyStrategy } from './utils';

let page: Page;
let testUser: User;

const WARNING_HEADER = "Just a Heads Up...";

test.describe.configure({ mode: 'serial' });

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    testUser = createRandomUser();
    await signUserUp({ page, user: testUser });
    await logUserIn({ page, user: testUser });
    await initEmptyStrategy({ page: page });
});

test.afterAll(async () => {
    await page.close();
});

test.afterEach(async () => {
    await page.click('button:has-text("OK")')
    await page.click('button:has-text("Toggle to Editor")');
    await page.click('button:has-text("reset")')
})

const WARNING_MISSING_DATA =
    'There appears to be a significant discrepancy between the available data and your selected start and end dates. ' +
    'This may indicate that the stock’s data is incomplete due to an IPO occurring after the specified start date, ' +
    'or the stock was delisted during the selected timeframe. Please review the date range and stock availability.';
test('Stock exists but does not have COMPLETE data in the selected date range', async () => {
    const startDate = '2020-03-01';
    const endDate = '2021-03-01';

    await page.fill('input[name="symbol"]', 'ABNB'); // Airbnb IPO was in December 2020
    await page.fill('input[name="startDate"]', startDate);
    await page.fill('input[name="endDate"]', endDate);
    await page.click('button:has-text("GO")');
    await expect(page.getByText(WARNING_HEADER)).toBeVisible();
    await expect(page.getByText(WARNING_MISSING_DATA)).toBeVisible();
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