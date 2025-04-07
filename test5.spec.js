import { test, expect } from '@playwright/test';
import faker from 'faker';

// Set the global timeout for all tests
test.setTimeout(180000); // 180 seconds (3 minutes)

test.describe('Create Product', () => {
  test('User', async ({ page }) => {
    // Login steps
    await page.goto('https://dev.typ.delivery/en/auth/login');
    await expect(page.getByText('Sign in to TYP TMS')).toBeVisible();
    await page.getByPlaceholder('Email').click();
    await page.getByPlaceholder('Email').fill('platformops@lifedata.ai');
    await page.getByPlaceholder('Password').click();
    await page.getByPlaceholder('Password').fill('Lifedata@124');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await page.locator('.css-1ddw5gp').first().click();
    await page.getByRole('link', { name: 'Products' }).click();

    // Navigate to products and start creation
    await page.getByRole('link', { name: 'Products' }).nth(1).click();
    await page.getByRole('button', { name: 'Add new product' }).click();

    // Generate and fill product details
    const productName = `${faker.commerce.productAdjective()}${faker.animal.type()}${faker.number.int({ min: 1000, max: 9999 })}`;
    console.log('Generated product name:', productName);
    await page.getByLabel('Product Name *').fill(productName);

    const productCode = faker.number.int({ min: 1000, max: 9999 }).toString();
    console.log('Generated product code:', productCode);
    await page.getByLabel('Product Code *').fill(productCode);

    // Product type and transport mode selection
    await page.getByLabel('Product type *').click();
    await page.getByLabel('Close').click();
    await page.locator('div').filter({ hasText: /^Product type \*$/ }).getByLabel('Open').click();
    await page.getByRole('option', { name: 'Freight' }).click();
    await page.locator('[id="Transport\\ mode\\ \\*-select"]').click();
    await page.getByRole('option', { name: 'Standard' }).click();
    // Business rule selection
    await page.locator('div').filter({ hasText: /^Business rule\(s\) \*$/ }).getByLabel('Open').click();
    await page.getByRole('option', { name: 'Transport Order' }).getByRole('checkbox').check();
    await page.getByRole('button', { name: 'Next' }).click();

    // Area selection
    await page.getByRole('button', { name: 'Add area(s)' }).click();
    await page.getByRole('cell', { name: 'San Polo dei Cavalieri' }).click();
    await page.getByRole('button', { name: 'Confirm' }).click();
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await page.getByRole('button', { name: 'Next', exact: true }).click();

    // HMI selection
    await page.getByRole('cell', { name: 'Open', exact: true }).getByLabel('Open').click();
    await page.getByRole('option', { name: 'HMI', exact: true }).click();
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await page.getByRole('button', { name: 'Complete' }).click();

    // Add new rate with improved waiting and visibility checks
    await page.getByRole('button', { name: 'Add a new rate' }).click();

    // Wait for the rate modal to be fully visible
    await page.waitForTimeout(2000); // Add a small delay to ensure modal is fully rendered

    // Generate and fill rate details
    const rateName = `${faker.commerce.productName()}_${faker.number.int({ min: 1000, max: 9999 })}`;
    console.log('Generated rate name:', rateName);

    // Wait for the rate name input to be visible and interactable
    await page.getByLabel('Rate name *').waitFor({ state: 'visible' });
    await page.getByLabel('Rate name *').fill(rateName);
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Complete' }).click();

    // Generate and fill rate value
    const rateValue = faker.number.int({ min: 100, max: 999 }).toString();
    console.log('Generated rate value:', rateValue);

    // Wait for the rate value input to be visible and interactable
    const rateRow = page.getByRole('row', { name: 'ITA all all all all € Could' });
    await rateRow.waitFor({ state: 'visible' });
    const textbox = rateRow.getByRole('textbox');
    await textbox.waitFor({ state: 'visible' });
    await textbox.click();
    await textbox.fill(rateValue);


    await page.getByRole('button', { name: 'Complete' }).click();
  });
});
