import { test, expect, type Page } from '@playwright/test';
import { signUserUp, logUserIn, createRandomUser, type User, initEmptyStrategy } from './utils';

let page: Page;
let testUser: User;

const ERROR_HEADER = "We've Encountered an Error...";

test.describe.configure({ mode: 'serial' });

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    testUser = createRandomUser();
    await signUserUp({ page, user: testUser });
    await logUserIn({ page, user: testUser });
    await initEmptyStrategy({page: page});
});

test.afterAll(async () => {
    await page.close();
});

test.afterEach(async () => {
    await page.click('button:has-text("OK")');
    await page.click('button:has-text("reset")')
})

// General form input tests
const inputNames = ['symbol', 'startDate', 'endDate', 'timeout'];
for (const name of inputNames) {
    test(`Empty ${name} triggers an error`, async () => {
        expect(page.url()).toContain('/editor');

        await page.fill(`input[name="${name}"]`, '');
        await page.click('button:has-text("GO")');
        await expect(page.getByText(ERROR_HEADER)).toBeVisible();
    });
}

// symbol tests
test('Nonexistent stock symbol triggers an error', async () => {
    await page.fill('input[name="symbol"]', 'ZZZZ'); // Assume 'ZZZZ' is not a real stock
    await page.click('button:has-text("GO")');
    await expect(page.getByText(ERROR_HEADER)).toBeVisible();
});

// startdate/enddate tests
test('Extremely old dates trigger an error', async () => {
    const OneHundred = new Date();
    OneHundred.setFullYear(OneHundred.getFullYear() - 100);
    const OneHundredString = OneHundred.toISOString().slice(0, 10);

    const NinetyNine = new Date();
    NinetyNine.setFullYear(NinetyNine.getFullYear() - 99);
    const NinetyNineString = NinetyNine.toISOString().slice(0, 10);

    await page.fill('input[name="startDate"]', OneHundredString);
    await page.fill('input[name="endDate"]', NinetyNineString);
    await page.click('button:has-text("GO")');
    await expect(page.getByText(ERROR_HEADER)).toBeVisible();
});

test('Excessively long date ranges trigger an error (>1000 timepoints)', async () => {
    const fiveYearsAgo = new Date();
    fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
    const fiveYearsAgoString = fiveYearsAgo.toISOString().slice(0, 10);

    await page.fill('input[name="startDate"]', fiveYearsAgoString);
    await page.click('button:has-text("GO")');
    await expect(page.getByText(ERROR_HEADER)).toBeVisible();
});

test('Excessively short date ranges trigger an error (<3 days)', async () => {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const threeDaysAgoString = threeDaysAgo.toISOString().slice(0, 10);

    const today = new Date();
    const todayString = today.toISOString().slice(0, 10);

    await page.fill('input[name="startDate"]', threeDaysAgoString);
    await page.fill('input[name="endDate"]', todayString);
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

// timeout tests
test('Too large a timeout specified', async () => {
    await page.fill('input[name="timeout"]', '70');
    await page.click('button:has-text("GO")');
    await expect(page.getByText(ERROR_HEADER)).toBeVisible();
});

test('Too small a timeout specified', async () => {
    await page.fill('input[name="timeout"]', '.1');
    await page.click('button:has-text("GO")');
    await expect(page.getByText(ERROR_HEADER)).toBeVisible();
});

// costpertrade tests

// warmupdate tests

// frontend syntax python failure tests