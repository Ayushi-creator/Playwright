import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
const websiteUrl = 'https://www.xenonstack.com/';
test('Performance testing of GET requests', async ({ page }) => {
  const iterations = 10;
  const performanceResults = [];
  for (let i = 0; i < iterations; i++) {
     const startTime = Date.now();
     try {
     const response = await page.goto(websiteUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
     const endTime = Date.now();
     const responseTime = endTime - startTime;
        console.log(`Response time for GET request ${i + 1}: ${responseTime} ms`);
        performanceResults.push({ 
        url: websiteUrl, 
        method: 'GET',   
        startTime,       
        endTime,        
        responseTime,    
        status: response.status() 
      });
        expect(response.status()).toBe(200);
} catch (error) {
     console.error(`Error during GET request ${i + 1}:`, error);
        performanceResults.push({ 
        url: websiteUrl,
        method: 'GET',
        startTime,
        endTime: Date.now(),
        responseTime: null,
        status: 'ERROR'
      });
    }
  }
  const successfulRequests = performanceResults.filter(result => result.status === 200);
  const averageResponseTime = successfulRequests.reduce((sum, result) => sum + result.responseTime, 0) / successfulRequests.length;
  console.log(`Average response time across ${iterations} requests: ${averageResponseTime} ms`);
  expect(averageResponseTime).toBeLessThan(2565.6);
  const errorRate = (performanceResults.filter(result => result.status !== 200).length / iterations) * 100;
  console.log(`Error rate: ${errorRate.toFixed(2)}%`);
  const artilleryCommand = `artillery quick --count ${iterations} -n 10 ${websiteUrl}`;
  console.log(`Running Artillery command: ${artilleryCommand}`);
  try {
    const output = execSync(artilleryCommand).toString();
    console.log(output);
  } catch (error) {
    console.error('Error running Artillery:', error);
  }
});










