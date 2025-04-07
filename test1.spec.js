import { test, expect } from '@playwright/test';

function generateProductName() {
    const adjectives = ['Red', 'Blue', 'Green', 'Fast', 'Smart', 'Super', 'Mega', 'Ultra', 'Pro', 'Elite'];
    const nouns = ['Panda', 'Tiger', 'Lion', 'Eagle', 'Hawk', 'Wolf', 'Bear', 'Fox', 'Dragon', 'Phoenix'];
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const timestamp = Date.now().toString().slice(-4);
    return `${randomAdjective}${randomNoun}${timestamp}`;
  }

  // Function to generate random rate name
  function generateRateName() {
    const prefixes = ['Rate', 'Price', 'Cost', 'Fee', 'Charge'];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const timestamp = Date.now().toString().slice(-4);
    return `${randomPrefix}_${timestamp}`;
  }

  // Function to generate random rate value
  function generateRate() {
    return (Math.floor(Math.random() * 900) + 100).toString(); // Random number between 100 and 999
  }
  function generateCode() {
    return (Math.floor(Math.random() * 9000) + 1000).toString(); // Random number between 100 and 999
  }

// Set the global timeout for all tests
test.setTimeout(180000); // 180 seconds (3 minutes)

test.describe('Create Product', () => {
  test('User', async ({ page }) => {
    await page.goto('https://dev.typ.delivery/en/auth/login');
    await expect(page.getByText('Sign in to TYP TMS')).toBeVisible();
    await page.getByPlaceholder('Email').click();
    await page.getByPlaceholder('Email').fill('platformops@lifedata.ai');
    await page.getByPlaceholder('Password').click();
    await page.getByPlaceholder('Password').fill('Lifedata@124');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await page.locator('.css-1ddw5gp').first().click();
    await page.getByRole('link', { name: 'Products' }).click();
    await page.getByRole('link', { name: 'Products' }).nth(1).click();
    await page.getByRole('button', { name: 'Add new product' }).click();
    const productName = generateProductName();
    console.log('Generated product name:', productName);
    await page.getByLabel('Product Name *').click();
    await page.getByLabel('Product Name *').fill(productName);
    const codeValue = generateCode();
    console.log('Generated rate value:', codeValue);
    await page.getByLabel('Product Code *').click();
    await page.getByLabel('Product Code *').fill(codeValue);
    await page.getByLabel('Product type *').click();
    await page.getByLabel('Close').click();
    await page.locator('div').filter({ hasText: /^Product type \*$/ }).getByLabel('Open').click();
    await page.getByRole('option', { name: 'Freight' }).click();
    await page.locator('[id="Transport\\ mode\\ \\*-select"]').click();
    await page.getByRole('option', { name: 'Standard' }).click();
    await page.locator('div').filter({ hasText: /^Business rule\(s\) \*$/ }).getByLabel('Open').click();
    await page.getByRole('option', { name: 'Transport Order' }).getByRole('checkbox').check();
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Add area(s)' }).click();
    await page.getByRole('cell', { name: 'San Polo dei Cavalieri' }).click();
    await page.getByRole('button', { name: 'Confirm' }).click();
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await page.getByRole('cell', { name: 'Open', exact: true }).getByLabel('Open').click();
    await page.getByRole('option', { name: 'HMI', exact: true }).click();
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await page.getByRole('button', { name: 'Complete' }).click();

    await page.getByRole('button', { name: 'Add a new rate' }).click();
    await page.locator('.MuiBackdrop-root').click();
    const rateName = generateRateName();
    console.log('Generated rate name:', rateName);
    await page.getByLabel('Rate name *').fill(rateName);
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Complete' }).click();
    const rateValue = generateRate();
    console.log('Generated rate value:', rateValue);
    await page.getByRole('row', { name: 'ITA all all all all € Could' }).getByRole('textbox').click();
    await page.getByRole('row', { name: 'ITA all all all all € Could' }).getByRole('textbox').fill(rateValue);
    await page.getByRole('button', { name: 'Complete' }).click();





});
});

