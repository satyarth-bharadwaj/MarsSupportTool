import { test, expect } from "@playwright/test";
import { chromium, Browser, BrowserContext, Page } from "playwright";

test.describe("Ops-Dashboard Component E2E Test for rendering Page", () => {
  let browser: Browser;
  let context: BrowserContext;
  let page: Page;

  test.beforeAll(async () => {
    browser = await chromium.launch();
    context = await browser.newContext();
    page = await context.newPage();
  });

  test.afterAll(async () => {
    await browser.close();
  });

  test.beforeEach(async () => {
    await page.goto("http://localhost:5173/dashboard/ops");
  });

  test("Verify initial page load", async () => {
    await expect(page.locator('h1:has-text("Points Crediting Tool")')).toBeVisible();
  });
});

test.describe("E2E testing by clicking the dropdown options and check whether its getting changed", () => {
  let browser: Browser;
  let context: BrowserContext;
  let page: Page;

  test.beforeAll(async () => {
    browser = await chromium.launch();
    context = await browser.newContext();
    page = await context.newPage();
  });

  test.afterAll(async () => {
    await browser.close();
  });

  test.beforeEach(async () => {
    await page.goto("http://localhost:5173/dashboard/ops");
  });

  test("Country selection updates funder dropdown", async () => {
    await page.selectOption('select[id="country"]', 'UK');
    
    await page.waitForFunction(() => {
        const options = Array.from(document.querySelectorAll('select[id="funder"] option'));
        return options.some(option => option.textContent?.includes("Reward Partner bonus points"));
    });

    const funderOptions = await page.$$eval('select[id="funder"] option', options => 
      options.map(option => option.textContent)
    );
    expect(funderOptions).toContain('Reward Partner bonus points');
  });

  test("Point Crediting File button functionality", async () => {
    await page.selectOption('select[id="country"]', 'UK');
    await page.selectOption('select[id="funder"]', 'Reward Partner bonus points');
    
    const downloadPromise = page.waitForEvent('download');
    await page.click('button:has-text("Point Crediting File")');
    const download = await downloadPromise;
    
    expect(download.suggestedFilename()).toMatch(/UK_Reward_Partner_bonus_points_template/);
  });
});

test.describe("E2E Ops Dashboard CSV Validaion & API Processing Tests", () => {
  let browser: Browser;
  let context: BrowserContext;
  let page: Page;

  // CSV file content as strings
  const rewardPartnerCSV = `Customer UUID,Number of Points,Funder ID,Funder Name
d33f1471-c88a-4c76-ba65-77f8cd6de9c4,-5,1868,Reward Partner bonus points`;

  const clubcardCompetitionCSV = `Customer UUID,Number of Points,Funder ID,Funder Name
d33f1471-c88a-4c76-ba65-77f8cd6de9c4,20,1868,Clubcard competition`;

  test.beforeAll(async () => {
    browser = await chromium.launch();
    context = await browser.newContext();
    page = await context.newPage();
  });

  test.afterAll(async () => {
    await browser.close();
  });

  test.beforeEach(async () => {
    await page.goto("http://localhost:5173/dashboard/ops");
  });

  test("CSV file upload and validation", async () => {
    await page.selectOption('select[id="country"]', 'UK');
    await page.selectOption('select[id="funder"]', 'Reward Partner bonus points');
    
    // Create a File object from the CSV string
    await page.evaluate((csvContent) => {
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const file = new File([blob], 'UK_Reward Partner bonus points.csv', { type: 'text/csv' });
      
      // Mock the file input element
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInput.files = dataTransfer.files;
        
        // Trigger change event
        const event = new Event('change', { bubbles: true });
        fileInput.dispatchEvent(event);
      }
    }, rewardPartnerCSV);
    
    await expect(page.locator('table.csv-table')).toBeVisible();
  });

  test("Invalid CSV shows error download button", async () => {
    await page.selectOption('select[id="country"]', 'UK');
    await page.selectOption('select[id="funder"]', 'Reward Partner bonus points');
    
    // Create a File object from the CSV string
    await page.evaluate((csvContent) => {
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const file = new File([blob], 'UK_Reward Partner bonus points.csv', { type: 'text/csv' });
      
      // Mock the file input element
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInput.files = dataTransfer.files;
        
        // Trigger change event
        const event = new Event('change', { bubbles: true });
        fileInput.dispatchEvent(event);
      }
    }, rewardPartnerCSV);
    
    await expect(page.locator('button:has-text("Failed Validations")')).toBeVisible();
  });
  
  test("Valid CSV shows Proceed to Credit button", async () => {
    await page.selectOption('select[id="country"]', 'UK');
    await page.selectOption('select[id="funder"]', 'Clubcard competition');
    
    // Create a File object from the CSV string
    await page.evaluate((csvContent) => {
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const file = new File([blob], 'UK_Clubcard competition.csv', { type: 'text/csv' });
      
      // Mock the file input element
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInput.files = dataTransfer.files;
        
        // Trigger change event
        const event = new Event('change', { bubbles: true });
        fileInput.dispatchEvent(event);
      }
    }, clubcardCompetitionCSV);
    
    await expect(page.locator('button:has-text("Proceed to Credit")')).toBeVisible();
  });
  
  test("Form submission with valid data", async () => {
    await page.route('**/storedvalue/points/customer/**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      });
    });
    
    await page.selectOption('select[id="country"]', 'UK');
    await page.selectOption('select[id="funder"]', 'Clubcard competition');
    
    // Create a File object from the CSV string
    await page.evaluate((csvContent) => {
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const file = new File([blob], 'UK_Clubcard competition.csv', { type: 'text/csv' });
      
      // Mock the file input element
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInput.files = dataTransfer.files;
        
        // Trigger change event
        const event = new Event('change', { bubbles: true });
        fileInput.dispatchEvent(event);
      }
    }, clubcardCompetitionCSV);
    
    await page.click('button:has-text("Proceed to Credit")');
    
    await expect(page.locator('h1:has-text("Points Crediting Results")')).toBeVisible();
  });

  test("Start new process resets the form", async () => {
    await page.route('**/storedvalue/points/customer/**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      });
    });
    
    await page.selectOption('select[id="country"]', 'UK');
    await page.selectOption('select[id="funder"]', 'Clubcard competition');
    
    // Create a File object from the CSV string
    await page.evaluate((csvContent) => {
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const file = new File([blob], 'UK_Clubcard competition.csv', { type: 'text/csv' });
      
      // Mock the file input element
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInput.files = dataTransfer.files;
        
        // Trigger change event
        const event = new Event('change', { bubbles: true });
        fileInput.dispatchEvent(event);
      }
    }, clubcardCompetitionCSV);
    await page.click('button:has-text("Proceed to Credit")');
    
    test.setTimeout(100000);
    await page.click('button:has-text("Start New Process")');
    
    await expect(page.locator('h1:has-text("Points Crediting Tool")')).toBeVisible();
    await expect(page.locator('table.csv-table')).not.toBeVisible();
  });
});
