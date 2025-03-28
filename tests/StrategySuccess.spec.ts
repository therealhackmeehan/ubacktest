import { test, expect, type Page } from '@playwright/test';
import { signUserUp, logUserIn, createRandomUser, type User, initEmptyStrategy } from './utils';

let page: Page;
let testUser: User;

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
    await page.click('button:has-text("OK")');
    await page.click('button:has-text("reset")')
})

test('Strategy successfully runs a buy and hold strategy', async () => {
    await page.fill('.monaco-editor textarea', `
import pandas as pd
def strategy(input):
    input['signal'] = 1
    return input
    `);
    await page.click('button:has-text("GO")');
});

test('Strategy successfully runs a mildly complicated example', async () => {
    await page.click('button:has-text("examples")');
    await page.click('button:has-text("Linear Regression")');
    await page.click('button:has-text("GO")');
});