import { test, expect, type Page } from '@playwright/test';
import { signUserUp, logUserIn, createRandomUser, fillEditor, type User, initEmptyStrategy } from './utils';

let page: Page;
let testUser: User;

const ERROR_HEADER = "We've Encountered an Error...";

test.describe.configure({ mode: 'serial' });

test.slow();

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
    await page.click('button:has-text("OK")');
    await page.click('button:has-text("reset")');
})

// symbol tests
test('Nonexistent stock symbol triggers an error', async () => {
    await page.fill('input[name="symbol"]', 'ZZZZ'); // Assume 'ZZZZ' is not a real stock
    await page.click('button:has-text("GO")');
    await expect(page.getByText(ERROR_HEADER)).toBeVisible();
});

test('Stock exists but does not have data in the selected date range', async () => {
    const sevenYearsAgo = new Date();
    sevenYearsAgo.setFullYear(sevenYearsAgo.getFullYear() - 7);
    const sevenYearsAgoString = sevenYearsAgo.toISOString().slice(0, 10);

    const sixYearsAgo = new Date();
    sixYearsAgo.setFullYear(sixYearsAgo.getFullYear() - 6);
    const sixYearsAgoString = sixYearsAgo.toISOString().slice(0, 10);

    await page.fill('input[name="symbol"]', 'ABNB'); // Valid stock, but outside IPO range
    await page.fill('input[name="startDate"]', sevenYearsAgoString);
    await page.fill('input[name="endDate"]', sixYearsAgoString);
    await page.click('button:has-text("GO")');
    await expect(page.getByText(ERROR_HEADER)).toBeVisible();
});