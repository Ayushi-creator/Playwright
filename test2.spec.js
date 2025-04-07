import { test, expect } from '@playwright/test';

// Set the global timeout for all tests
test.setTimeout(180000); // 180 seconds (3 minutes)

test.describe('Pickup Trip', () => {
    test('Create TO', async ({ page }) => {
        let capturedReferenceNumber = '';
        let dynamicCellValue = '';
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
        await page.getByText('Your Transport Order');

        // Add a wait for network idle to ensure the page is fully loaded
        await page.waitForLoadState('networkidle');

        // Wait a bit longer to ensure the reference number is rendered
        await page.waitForTimeout(2000);
        try {
            // Use a more specific selector
            const referenceLocator = page.locator('text=/Order Reference Number\\s*\\d+[A-Z]+/');
            await referenceLocator.waitFor({ state: 'visible', timeout: 15000 });

            const referenceText = await referenceLocator.innerText();
            console.log('Found reference text:', referenceText);

            // Extract just the number+letters part using regex
            const referenceMatch = referenceText.match(/Order Reference Number\s*(\d+[A-Z]+)/);

            if (referenceMatch && referenceMatch[1]) {
                capturedReferenceNumber = referenceMatch[1]; // Store the reference number
                console.log(`Captured Reference Number: ${capturedReferenceNumber}`);

                // Add the reference number to test annotations
                test.info().annotations.push({
                    type: 'Reference Number',
                    description: capturedReferenceNumber
                });
// Verify that the reference number matches the expected format
expect(capturedReferenceNumber).toMatch(/^\d+[A-Z]+$/);

// Log success
console.log('Successfully captured and verified reference number');
} else {
console.error('Reference number format not found in text:', referenceText);
throw new Error('Failed to capture Reference Number - Invalid format');
}
} catch (error) {
console.error('Error while capturing reference number:', error);
await page.screenshot({ path: 'reference-number-error.png' });
throw error;
}

// Navigate to Orders and fill the TO ID with captured reference number
//await page.getByText('OrdersTripsNetworkProductsCash on deliveryEconomicsGeneral SettingsDev Portal').click();
await page.locator('.css-1ddw5gp').first().click();
await page.getByRole('link', { name: 'Orders' }).click({ force: true });
await page.getByRole('link', { name: 'Transport Order' }).click();
await page.getByLabel('TO ID').click();
await page.getByLabel('TO ID').fill(capturedReferenceNumber); // Fill with the captured reference number
console.log(`Filled TO ID with reference number: ${capturedReferenceNumber}`);
await page.getByLabel('TO ID').press('Enter');
const page1Promise = page.waitForEvent('popup');
await page.getByRole('link', { name: capturedReferenceNumber }).click();
const page1 = await page1Promise;
//await page1.getByText('DetailsTimelineTripsShipping').click();

await page1.getByRole('tab', { name: 'Trips' }).click();
try {
// Wait for and locate the dynamic cell
// Get the text content of the cell
const dynamicCell = await page1.getByRole('cell').first(); // Example locator, adjust as needed
    const dynamicCellValue = await dynamicCell.innerText();
    console.log(`Captured Trip ID: ${dynamicCellValue}`);

// Add the trip ID to test annotations
test.info().annotations.push({
    type: 'Trip ID',
    description: dynamicCellValue
});

// Click on the cell path element if needed
await page1.getByRole('cell', { name: dynamicCellValue }).locator('path').first();

// Navigate to Trips section
// await page1.getByText('OrdersTripsNetworkProductsCash on deliveryEconomicsGeneral SettingsDev Portal').click();
await page.locator('.css-1ddw5gp').first().click();
await page1.getByRole('link', { name: 'Trips' }).click();
await page1.getByRole('link', { name: 'Trips' }).nth(1).click();

// Fill the Trip ID field with the captured value
await page1.getByLabel('Trip ID').click();
await page1.getByLabel('Trip ID').fill(dynamicCellValue);
console.log(`Filled Trip ID field with value: ${dynamicCellValue}`);

// Optional: Verify the Trip ID was filled correctly
const tripIdValue = await page1.getByLabel('Trip ID').inputValue();
expect(tripIdValue).toBe(dynamicCellValue);

} catch (error) {
console.error('Error while capturing or using Trip ID:', error);
await page1.screenshot({ path: 'trip-id-error.png' });
throw error;
}
//    await page1.getByText('OrdersTripsNetworkProductsCash on deliveryEconomicsGeneral SettingsDev Portal').click();
//    await page1.getByRole('link', { name: 'Trips' }).click();
        //    await page1.getByRole('link', { name: 'Trips' }).nth(1).click();
        await page1.getByLabel('Trip ID').press('Enter');
        await page1.getByRole('button', { name: 'Confirmed' }).click();
await page1.getByRole('button', { name: 'Confirm' }).click();
await page1.getByRole('button', { name: 'Departed' }).click();
await page1.getByRole('button', { name: 'Confirm departure' }).click();
await page1.getByRole('button', { name: 'Arrived at destination' }).click();
await page1.getByRole('button', { name: 'Confirm arrival' }).click();

 });
});
