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

// General form input tests (input empty)
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
test('Too large a cost per trade specified', async () => {
    await page.fill('input[name="costPerTrade"]', '11');
    await page.click('button:has-text("GO")');
    await expect(page.getByText(ERROR_HEADER)).toBeVisible();
});

test('Too small a cost per trade specified', async () => {
    await page.fill('input[name="timeout"]', '-1');
    await page.click('button:has-text("GO")');
    await expect(page.getByText(ERROR_HEADER)).toBeVisible();
});

// warmupdate tests
test('Warmupdate in the future', async () => {
    await page.check('input[name="useWarmupDate"]');
    await page.fill('input[name="warmupDate"]', '2030-07-31');
    await page.click('button:has-text("GO")');
    await expect(page.getByText(ERROR_HEADER)).toBeVisible();
});

test('Warmupdate after start date', async () => {
    await page.check('input[name="useWarmupDate"]');
    await page.fill('input[name="startDate"]', '2020-07-31');
    await page.fill('input[name="warmupDate"]', '2020-08-31');
    await page.click('button:has-text("GO")');
    await expect(page.getByText(ERROR_HEADER)).toBeVisible();
});

test('Blank script errors', async () => {
    await fillEditor(page, '');
    await page.click('button:has-text("GO")');
    await expect(page.getByText(ERROR_HEADER)).toBeVisible();
});

// frontend syntax checks

test('Non-blank script without def strategy() errors', async () => {
    await fillEditor(page, 'x = 3\nprint(x)');
    await page.click('button:has-text("GO")');
    await expect(page.getByText(ERROR_HEADER)).toBeVisible();
});

test('Script has no parameter to strategy()', async () => {
    await fillEditor(page, 'def strategy():\n    return 42');
    await page.click('button:has-text("GO")');
    await expect(page.getByText(ERROR_HEADER)).toBeVisible();
});

test('Script with hidden syntax error (zero-width space in function name)', async () => {
    await fillEditor(page, `def strategy​(data):\n\tdata['signal'] = 1\n\treturn data`); // Zero-width space in function name
    await page.click('button:has-text("GO")');
    await expect(page.getByText(ERROR_HEADER)).toBeVisible();
});

test('Script has more than one parameter to strategy()', async () => {
    await fillEditor(page, 'def strategy(a, b):\n    return a + b');
    await page.click('button:has-text("GO")');
    await expect(page.getByText(ERROR_HEADER)).toBeVisible();
});

test('Script defines strategy but uses an incorrect function name', async () => {
    await fillEditor(page, 'def strat(input):\n    return input * 2');
    await page.click('button:has-text("GO")');
    await expect(page.getByText(ERROR_HEADER)).toBeVisible();
});

test('Script defines strategy but input is a keyword argument', async () => {
    await fillEditor(page, 'def strategy(input=5):\n    return input * 2');
    await page.click('button:has-text("GO")');
    await expect(page.getByText(ERROR_HEADER)).toBeVisible();
});

test('Script with missing colon after function definition', async () => {
    await fillEditor(page, 'def strategy(data)\ndata[\'signal\'] = 1\nreturn data');
    await page.click('button:has-text("GO")');
    await expect(page.getByText(ERROR_HEADER)).toBeVisible();
});

test('Script with input parameter missing parentheses', async () => {
    await fillEditor(page, 'def strategy data:\ndata[\'signal\'] = 1\nreturn data');
    await page.click('button:has-text("GO")');
    await expect(page.getByText(ERROR_HEADER)).toBeVisible();
});

