// performance.test.js
import { test, expect } from '@playwright/test';

const apiUrl = 'https://reqres.in/api/users'; 
test('Performance testing of POST requests to ReqRes API', async ({ page }) => {
  const iterations = 10; 
  const postData = { name: 'John Doe', job: 'Software Engineer' };

  const performanceResults = [];

  for (let i = 0; i < iterations; i++) {
    const startTime = Date.now();


    const response = await page.goto(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData),
      waitUntil: 'domcontentloaded'
    });

    const endTime = Date.now();
    const responseTime = endTime - startTime;
    console.log(`Response time for POST request ${i + 1}: ${responseTime} ms`);
    performanceResults.push({
      url: apiUrl,
      method: 'POST',
      startTime,
      endTime,
      responseTime,
      status: response.status(),
    });

   
    expect(response.status()).toBe(200); 
  }

  // Perform analysis or reporting based on collected performance metrics
  const averageResponseTime = performanceResults.reduce((sum, result) => sum + result.responseTime, 0) / iterations;
  console.log(`Average response time across ${iterations} POST requests: ${averageResponseTime.toFixed(2)} ms`);

  expect(averageResponseTime).toBeLessThan(500); 
  const errorRate = (performanceResults.filter(result => result.status !== 201).length / iterations) * 100;
  console.log(`Error rate: ${errorRate.toFixed(2)}%`);
});


// import { test, expect } from '@playwright/test';
 
// const websiteUrl = 'https://www.xenonstack.com/'; // Replace with your website URL
 
// test('Performance testing of GET requests', async ({ page }) => {
//   const iterations = 10; // Number of GET requests to perform for testing
//   // Array to store performance metrics
//   const performanceResults = [];
 
//   for (let i = 0; i < iterations; i++) {
//     const startTime = Date.now();
//     try {
//       // Perform the GET request with increased timeout
//       const response = await page.goto(websiteUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
//       const endTime = Date.now();
//       const responseTime = endTime - startTime;
//       // Log the response time for each GET request
//       console.log(`Response time for GET request ${i + 1}: ${responseTime} ms`);
//       // Store performance metrics
//       performanceResults.push({ url: websiteUrl, method: 'GET', startTime, endTime, responseTime, status: response.status() });
//       expect(response.status()).toBe(200);
//     } catch (error) {
//       console.error(`Error during GET request ${i + 1}:`, error);
//       performanceResults.push({ url: websiteUrl, method: 'GET', startTime, endTime: Date.now(), responseTime: null, status: 'ERROR' });
//     }
//   }
 
//   const successfulRequests = performanceResults.filter(result => result.status === 200);
//   const averageResponseTime = successfulRequests.reduce((sum, result) => sum + result.responseTime, 0) / successfulRequests.length;
//   console.log(`Average response time across ${iterations} requests: ${averageResponseTime} ms`);
//   expect(averageResponseTime).toBeLessThan(8415);
 
//   const errorRate = (performanceResults.filter(result => result.status !== 200).length / iterations) * 100;
//   console.log(`Error rate: ${errorRate.toFixed(2)}%`);
// });