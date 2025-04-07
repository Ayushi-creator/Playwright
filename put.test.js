// performance.test.js
import { test, expect } from '@playwright/test';

const apiUrl = 'https://reqres.in/api/users/2'; // API URL for PUT requests (updating user with ID 2)

test('Performance testing of PUT requests to ReqRes API', async ({ page }) => {
  const iterations = 10; // Number of PUT requests to perform for testing
  const putData = { name: 'Updated John Doe', job: 'Senior Software Engineer' };

  // Array to store performance metrics
  const performanceResults = [];

  for (let i = 0; i < iterations; i++) {
    const startTime = Date.now();

    // Perform the PUT request
    const response = await page.goto(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(putData),
      waitUntil: 'domcontentloaded'
    });

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    // Log the response time for each PUT request
    console.log(`Response time for PUT request ${i + 1}: ${responseTime} ms`);

    // Store performance metrics
    performanceResults.push({
      url: apiUrl,
      method: 'PUT',
      startTime,
      endTime,
      responseTime,
      status: response.status(),
    });

    // Example assertion: Verify HTTP status code
    expect(response.status()).toBe(200); // Assuming 200 is the expected status code for successful update
  }

  // Perform analysis or reporting based on collected performance metrics
  const averageResponseTime = performanceResults.reduce((sum, result) => sum + result.responseTime, 0) / iterations;
  console.log(`Average response time across ${iterations} PUT requests: ${averageResponseTime.toFixed(2)} ms`);

  expect(averageResponseTime).toBeLessThan(500); // Example threshold: 500 ms for average response time
  const errorRate = (performanceResults.filter(result => result.status !== 201).length / iterations) * 100;
  console.log(`Error rate: ${errorRate.toFixed(2)}%`);
});
