import { test, expect } from '@playwright/test';

function generateUniqueEmail() {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  return `test_${timestamp}_${randomString}@xenonstack.com`;
}

// Set the global timeout for all tests
test.setTimeout(180000); // 180 seconds (3 minutes)

test.describe('Create User', () => {
  test('User', async ({ page }) => {
    await page.goto('https://dev.typ.delivery/en/auth/login');
    await expect(page.getByText('Sign in to TYP TMS')).toBeVisible();
    await page.getByPlaceholder('Email').click();
    await page.getByPlaceholder('Email').fill('platformops@lifedata.ai');
    await page.getByPlaceholder('Password').click();
    await page.getByPlaceholder('Password').fill('Lifedata@124');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await page.locator('.css-1ddw5gp').first().click();
    await page.getByRole('link', { name: 'General Settings' }).click();
    await page.getByRole('link', { name: 'Users' }).click();
    await page.getByRole('button', { name: 'Create New user' }).click();

    // Use more specific selector for Account dropdown
    await page.getByLabel('Account*').click();
    await page.getByRole('option', { name: 'DEMO 1328' }).getByRole('checkbox').check();
    await page.getByLabel('Close').click();

    await page.getByLabel('Name *', { exact: true }).click();
    await page.getByLabel('Name *', { exact: true }).fill('test');
    await page.getByLabel('Surname *').click();
    await page.getByLabel('Surname *').fill('demo');
    const uniqueEmail = generateUniqueEmail();
    console.log('Generated email:', uniqueEmail);
    await page.getByLabel('Email *').click();
    await page.getByLabel('Email *').click();
    await page.getByLabel('Email *').fill(uniqueEmail);
    await page.getByLabel('Phone').click();
    await page.getByLabel('Phone').fill('1234567890');

    // Date picker interaction
    await page.getByLabel('Choose date').first().click();
    await page.getByRole('gridcell', { name: '23' }).click();

    await page.locator('button.MuiButton-outlinedPrimary').filter({ hasText: 'Next' }).click();

    // Use more specific selector for role dropdown

    await page.getByLabel('Role*').click();
     await page.getByRole('option', { name: 'Area Manager' }).getByRole('checkbox').check();
     await page.getByLabel('Close').click();


    await page.locator('button.MuiButton-outlinedPrimary').filter({ hasText: 'Next' }).click();

    // Use more specific selector for location dropdown
    await page.getByText('Locations').click();
    await page.getByPlaceholder('Choose location(s) to include').click();
    await page.getByRole('option', { name: 'Test Zudio' }).getByRole('checkbox').check();
    await page.getByLabel('Close').click();

    await page.locator('button.MuiButton-outlinedPrimary').filter({ hasText: 'Next' }).click();
    await page.locator('button.MuiButton-outlinedPrimary').filter({ hasText: 'Next' }).click();

    await page.getByRole('button', { name: 'Italian' }).click();
    await page.getByRole('option', { name: 'English' }).click();
    await page.getByRole('button', { name: 'Complete' }).click();
  });
});
