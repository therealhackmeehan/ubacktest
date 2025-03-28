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
    await initEmptyStrategy({ page: page });
});

test.afterAll(async () => {
    await page.close();
});

test.afterEach(async () => {
    await page.click('button:has-text("OK")');
    await page.click('button:has-text("reset")')
})

test('Script defines strategy but with incorrect indentation', async () => {
    await page.fill('.monaco-editor textarea', 'def strategy(input):\nreturn input * 2');
    await page.click('button:has-text("GO")');
    await expect(page.getByText(ERROR_HEADER)).toBeVisible();
});

test('Script defines strategy but function body is missing', async () => {
    await page.fill('.monaco-editor textarea', 'def strategy(input):');
    await page.click('button:has-text("GO")');
    await expect(page.getByText(ERROR_HEADER)).toBeVisible();
});

test('Script with missing colon after function definition', async () => {
    await page.fill('.monaco-editor textarea', 'def strategy(input)\n    return input * 2');
    await page.click('button:has-text("GO")');
    await expect(page.getByText(ERROR_HEADER)).toBeVisible();
});

test('Script with incorrect indentation inside function', async () => {
    await page.fill('.monaco-editor textarea', 'def strategy(input):\nreturn input * 2');
    await page.click('button:has-text("GO")');
    await expect(page.getByText(ERROR_HEADER)).toBeVisible();
});

test('Script using reserved keyword as parameter name', async () => {
    await page.fill('.monaco-editor textarea', 'def strategy(def):\n    return def * 2');
    await page.click('button:has-text("GO")');
    await expect(page.getByText(ERROR_HEADER)).toBeVisible();
});

test('Script with function name containing special characters', async () => {
    await page.fill('.monaco-editor textarea', 'def strategy$input(input):\n    return input * 2');
    await page.click('button:has-text("GO")');
    await expect(page.getByText(ERROR_HEADER)).toBeVisible();
});

test('Script with input parameter missing parentheses', async () => {
    await page.fill('.monaco-editor textarea', 'def strategy input:\n    return input * 2');
    await page.click('button:has-text("GO")');
    await expect(page.getByText(ERROR_HEADER)).toBeVisible();
});

test('Script where input is redefined as a function', async () => {
    await page.fill('.monaco-editor textarea', 'def strategy(input):\n    input = lambda x: x * 2\n    return input(3)');
    await page.click('button:has-text("GO")');
    await expect(page.getByText(ERROR_HEADER)).toBeVisible();
});

test('Script with multiline string before function definition', async () => {
    await page.fill('.monaco-editor textarea', '"""This is a docstring but missing closing quotes\ndef strategy(input):\n    return input * 2');
    await page.click('button:has-text("GO")');
    await expect(page.getByText(ERROR_HEADER)).toBeVisible();
});

test('Script with inline comment breaking function definition', async () => {
    await page.fill('.monaco-editor textarea', 'def strategy(input)  # Missing colon:\n    return input * 2');
    await page.click('button:has-text("GO")');
    await expect(page.getByText(ERROR_HEADER)).toBeVisible();
});

test('Script with decorator but invalid function syntax', async () => {
    await page.fill('.monaco-editor textarea', '@staticmethod\ndef strategy input:\n    return input * 2');
    await page.click('button:has-text("GO")');
    await expect(page.getByText(ERROR_HEADER)).toBeVisible();
});

test('Script with correct function but hidden syntax error (zero-width space)', async () => {
    await page.fill('.monaco-editor textarea', 'def strategy(input\u200B):\n    return input * 2');
    await page.click('button:has-text("GO")');
    await expect(page.getByText(ERROR_HEADER)).toBeVisible();
});

// frontend strategy validation failure tests

test('Strategy does not return a DataFrame', async () => {
    await page.fill('.monaco-editor textarea', 'def strategy(input):\n    return "not a dataframe"');
    await page.click('button:has-text("GO")');
    await expect(page.getByText("You must return a dataframe from your strategy.")).toBeVisible();
});

test('Strategy does not contain a "signal" column', async () => {
    await page.fill('.monaco-editor textarea', `
import pandas as pd
def strategy(input):
    return pd.DataFrame({'price': [100, 101, 102]})
    `);
    await page.click('button:has-text("GO")');
    await expect(page.getByText("There is no 'signal' column in the table.")).toBeVisible();
});

test('Strategy returns two "signal" columns', async () => {
    await page.fill('.monaco-editor textarea', `
import pandas as pd
def strategy(input):
    return pd.DataFrame({'signal': [1, -1, 0], 'SIGNAL': [0, 1, -1]})
    `);
    await page.click('button:has-text("GO")');
    await expect(page.getByText("There are two or more 'signal' columns in the table.")).toBeVisible();
});

test('Strategy returns an empty "signal" column', async () => {
    await page.fill('.monaco-editor textarea', `
import pandas as pd
def strategy(input):
    return pd.DataFrame({'signal': []})
    `);
    await page.click('button:has-text("GO")');
    await expect(page.getByText("'signal' column is empty.")).toBeVisible();
});

test('Strategy returns "signal" values outside the range [-1, 1]', async () => {
    await page.fill('.monaco-editor textarea', `
import pandas as pd
def strategy(input):
    return pd.DataFrame({'signal': [1, -2, 3]})
    `);
    await page.click('button:has-text("GO")');
    await expect(page.getByText("'signal' column contains values outside the range [-1, 1].")).toBeVisible();
});

test('Strategy returns DataFrame with a non-unique index', async () => {
    await page.fill('.monaco-editor textarea', `
import pandas as pd
def strategy(input):
    df = pd.DataFrame({'signal': [1, 0, -1]})
    df.index = [0, 0, 1]  # Duplicate index
    return df
    `);
    await page.click('button:has-text("GO")');
    await expect(page.getByText("Table index is not unique.")).toBeVisible();
});

test('Strategy changes the height of the DataFrame', async () => {
    await page.fill('.monaco-editor textarea', `
import pandas as pd
def strategy(input):
    df = pd.DataFrame({'signal': [1, 0, -1]})
    return df.iloc[:2]  # Modifies the number of rows
    `);
    await page.click('button:has-text("GO")');
    await expect(page.getByText("The height of the dataframe has changed upon applying your strategy.")).toBeVisible();
});
