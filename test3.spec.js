import { test, expect } from '@playwright/test';

// Set the global timeout for all tests
test.setTimeout(180000); // 180 seconds (3 minutes)

test.describe('Create TO Tests', () => {
  test('Sign in', async ({ page }) => {
    await page.goto('https://dev.typ.delivery/en/auth/login');
    await expect(page.getByText('Sign in to TYP TMS')).toBeVisible();
    await page.getByPlaceholder('Email').click();
    await page.getByPlaceholder('Email').fill('platformops@lifedata.ai');
    await page.getByPlaceholder('Password').click();
    await page.getByPlaceholder('Password').fill('Lifedata@124');
    await page.getByRole('button', { name: 'Sign in' }).click();
  });
  test('Sign in with invalid email', async ({ page }) => {
    await page.goto('https://dev.typ.delivery/en/auth/login');
    await page.getByPlaceholder('Email').click();
    await page.getByPlaceholder('Email').fill('invalidemail@domain.com');
    await page.getByPlaceholder('Password').click();
    await page.getByPlaceholder('Password').fill('Lifedata@124');
    await page.getByRole('button', { name: 'Sign in' }).click();
    const errorMessage = page.locator('text=Warning!user not found for given credential');
    await expect(errorMessage).toHaveText('Warning!user not found for given credential');
  });
  test('Sign in with invalid password', async ({ page }) => {
    await page.goto('https://dev.typ.delivery/en/auth/login');
    await page.getByPlaceholder('Email').click();
    await page.getByPlaceholder('Email').fill('platformops@lifedata.ai');
    await page.getByPlaceholder('Password').click();
    await page.getByPlaceholder('Password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Sign in' }).click();
    // Adjust the locator to match the element that contains the error message
    const errorMessage = page.locator('div.MuiAlert-message');
    // Wait for the error message to be visible
    await errorMessage.waitFor({ state: 'visible', timeout: 10000 });
    // Assert that the error message contains the expected text
    await expect(errorMessage).toHaveText('Warning!NotAuthorizedException: Incorrect username or password.'); // Adjust this to match your error message
  });
  test('Sign in with empty email', async ({ page }) => {
    await page.goto('https://dev.typ.delivery/en/auth/login');
    await page.getByPlaceholder('Password').click();
    await page.getByPlaceholder('Password').fill('Lifedata@124');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByPlaceholder('Email')).toHaveAttribute('aria-invalid', 'true'); // Adjust this to match your validation behavior
  });

  test('Sign in with empty password', async ({ page }) => {
    await page.goto('https://dev.typ.delivery/en/auth/login');
    await page.getByPlaceholder('Email').click();
    await page.getByPlaceholder('Email').fill('platformops@lifedata.ai');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByPlaceholder('Password')).toHaveAttribute('aria-invalid', 'true'); // Adjust this to match your validation behavior
  });

  test('Sign in with both fields empty', async ({ page }) => {
    await page.goto('https://dev.typ.delivery/en/auth/login');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByPlaceholder('Email')).toHaveAttribute('aria-invalid', 'true'); // Adjust this to match your validation behavior
    await expect(page.getByPlaceholder('Password')).toHaveAttribute('aria-invalid', 'true'); // Adjust this to match your validation behavior
  });

  test('Create TO with missing required fields', async ({ page }) => {
    await page.goto('https://dev.typ.delivery/en/auth/login');
    await page.getByPlaceholder('Email').click();
    await page.getByPlaceholder('Email').fill('platformops@lifedata.ai');
    await page.getByPlaceholder('Password').click();
    await page.getByPlaceholder('Password').fill('Lifedata@124');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await page.getByRole('button', { name: 'Create TO' }).click();

    // Skip some required fields and attempt to proceed
    await page.getByPlaceholder('Start typing the contract').click();
    await page.getByPlaceholder('Start typing the contract').fill('ITX ITALIA S.R.L.');
    await page.getByText('Account name:').click();
    await page.getByRole('button', { name: 'Confirm' }).click();
    await page.getByLabel('Product').click();
    await page.getByRole('option', { name: 'Test Ayushi Product' }).click();
    await page.getByLabel('Commodity').click();
    await page.getByRole('option', { name: 'Electronics & Lighting' }).click();
    await page.getByLabel('Dimension').click();
    await page.getByRole('option', { name: 'Envelope' }).click();
    await page.getByRole('button', { name: 'Next' }).click({ timeout: 60000 });
    const newAddressCheckbox = page.locator('input[value="new_address"]');
    await page.waitForSelector('input[value="new_address"]:enabled', { timeout: 10000 });
    await newAddressCheckbox.scrollIntoViewIfNeeded(); // Scroll into view if needed
    await newAddressCheckbox.click({ force: true });

    // Retry clicking the checkbox if it's not checked
    for (let i = 0; i < 3; i++) {
      if (await newAddressCheckbox.isChecked()) break;
      await newAddressCheckbox.click({ force: true });
    }

    // Verify the state of the checkbox after attempting to check it
    await expect(newAddressCheckbox).toBeChecked();

    await page.getByLabel('Name *', { exact: true }).click();
    await page.getByLabel('Name *', { exact: true }).fill('demo');
    await page.getByLabel('Surname *').click();
    await page.getByLabel('Surname *').fill('test');
    await page.locator('locker').filter({ hasText: 'New AddressPrivateCompanyName' }).getByLabel('Email *').click();
    await page.locator('locker').filter({ hasText: 'New AddressPrivateCompanyName' }).getByLabel('Email *').fill('test@xenonstack.com');
    await page.locator('locker').filter({ hasText: 'New AddressPrivateCompanyName' }).getByLabel('Phone').click();
    await page.locator('locker').filter({ hasText: 'New AddressPrivateCompanyName' }).getByLabel('Phone').fill('1234567890');
    await page.getByLabel('Address *').click();
    await page.getByLabel('Address *').fill('Via Roma 5, 20026 Novate Milanese (MI)');
    await page.getByLabel('Address *').press('Enter');
    await page.getByRole('option', { name: 'Via Roma 5, 20026 Novate' }).click();
    await page.getByRole('button', { name: 'Confirm' }).click();
 // Adjust the locator to match the element that contains the error message
 const errorMessage = page.locator('div.MuiAlert-message');
 // Wait for the error message to be visible
 await errorMessage.waitFor({ state: 'visible', timeout: 10000 });
 await expect(errorMessage).toHaveText('Warning!Please Select a Pickup Address');
});

test('Create TO', async ({ page }) => {
 await page.goto('https://dev.typ.delivery/en/auth/login');
await page.getByPlaceholder('Email').click();
await page.getByPlaceholder('Email').fill('platformops@lifedata.ai');
await page.getByPlaceholder('Password').click();
await page.getByPlaceholder('Password').fill('Lifedata@124');
await page.getByRole('button', { name: 'Sign in' }).click();
await page.getByRole('button', { name: 'Create TO' }).click();
 await page.getByPlaceholder('Start typing the contract').click();
 await page.getByPlaceholder('Start typing the contract').fill('ITX ITALIA S.R.L.');
 await page.getByText('Account name:').click();
 await page.getByRole('button', { name: 'Confirm' }).click();
 await page.getByLabel('Product').click();
 await page.getByRole('option', { name: 'Test Ayushi Product' }).click();
 await page.getByLabel('Commodity').click();
 await page.getByRole('option', { name: 'Electronics & Lighting' }).click();
 await page.getByLabel('Dimension').click();
 await page.getByRole('option', { name: 'Envelope' }).click();
 await page.getByRole('button', { name: 'Next' }).click({ timeout: 60000 });

 // Force-click the "Store" checkbox
 const storeCheckbox = page.getByLabel('Store');
 await storeCheckbox.scrollIntoViewIfNeeded(); // Scroll into view if needed
 await storeCheckbox.click({ force: true });

 // Retry clicking the checkbox if it's not checked
 for (let i = 0; i < 3; i++) {
   if (await storeCheckbox.isChecked()) break;
   await storeCheckbox.click({ force: true });
}
// Verify the state of the checkbox after attempting to check it
await expect(storeCheckbox).toBeChecked();

await page.getByLabel('Name *', { exact: true }).click();
await page.getByLabel('Name *', { exact: true }).fill('demo');
await page.getByLabel('Surname *').click();
await page.getByLabel('Surname *').fill('demo');
await page.getByLabel('Email *').click();
await page.getByLabel('Email *').fill('demo@xenonstack.com');
await page.getByLabel('Phone').click();
await page.getByLabel('Phone').fill('1234567890');
await page.getByText('Choose the Store').click();
await page.locator('div').filter({ hasText: /^ZudioSelect$/ }).getByRole('button').click();
await page.getByRole('button', { name: 'Confirm' }).click();

// Wait for the overlay to be hidden before interacting with the checkbox
await page.waitForSelector('div[class="MuiBackdrop-root css-xuaqpw"]', { state: 'hidden', timeout: 10000 });

// Wait for the "New Address" checkbox to be visible and enabled before clicking it
const newAddressCheckbox = page.locator('input[value="new_address"]');
await page.waitForSelector('input[value="new_address"]:enabled', { timeout: 10000 });
await newAddressCheckbox.scrollIntoViewIfNeeded(); // Scroll into view if needed
await newAddressCheckbox.click({ force: true });

// Retry clicking the checkbox if it's not checked
for (let i = 0; i < 3; i++) {
  if (await newAddressCheckbox.isChecked()) break;
  await newAddressCheckbox.click({ force: true });
}

// Verify the state of the checkbox after attempting to check it
await expect(newAddressCheckbox).toBeChecked();
await page.getByLabel('Name *', { exact: true }).click();
    await page.getByLabel('Name *', { exact: true }).fill('demo');
    await page.getByLabel('Surname *').click();
    await page.getByLabel('Surname *').fill('test');
    await page.locator('locker').filter({ hasText: 'New AddressPrivateCompanyName' }).getByLabel('Email *').click();
    await page.locator('locker').filter({ hasText: 'New AddressPrivateCompanyName' }).getByLabel('Email *').fill('test@xenonstack.com');
    await page.locator('locker').filter({ hasText: 'New AddressPrivateCompanyName' }).getByLabel('Phone').click();
    await page.locator('locker').filter({ hasText: 'New AddressPrivateCompanyName' }).getByLabel('Phone').fill('1234567890');
    await page.getByLabel('Address *').click();
    await page.getByLabel('Address *').fill('Via Roma 5, 20026 Novate Milanese (MI)');
    await page.getByLabel('Address *').press('Enter');
    await page.getByRole('option', { name: 'Via Roma 5, 20026 Novate' }).click();
    await page.getByRole('button', { name: 'Confirm' }).click();


  });
});

