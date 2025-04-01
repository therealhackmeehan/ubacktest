import { test, expect, type Page } from '@playwright/test';
import { signUserUp, logUserIn, createRandomUser, makeStripePayment, initEmptyStrategy, type User } from './utils';

let page: Page;
let testUser: User;

test.describe.configure({ mode: 'serial' });

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    testUser = createRandomUser();
    await signUserUp({ page: page, user: testUser });
    await logUserIn({ page: page, user: testUser });
    await initEmptyStrategy({page: page});
});

test.afterAll(async () => {
    await page.close();
});

test('User starts with 3 credits', async () => {
    expect(page.url()).toContain('/editor');
    expect(page.getByText('3 tests remaining')).toBeVisible();
});

test('Buy 10 credits with stripe', async () => {
    const PLAN_NAME = 'credits10';
    await makeStripePayment({ test, page, planName: PLAN_NAME });
});

test('User now has 13 credits', async () => {
    expect(page.getByText('Credits remaining: 13')).toBeVisible();
});