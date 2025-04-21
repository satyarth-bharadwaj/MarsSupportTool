// test/cae.e2e.spec.ts
import { test, expect } from "@playwright/test";
import { chromium, Browser, BrowserContext, Page } from "playwright";
test.describe("CAV Component E2E Tests for input and form submission", () => {
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
    await page.goto("http://localhost:5173/dashboard/coupons"); // Adjust URL as needed
  });

  test("Verify input fields are present and functional", async () => {
    const passwordInput = await page.$('input[name="credentials"]');
    expect(passwordInput).not.toBeNull();

    const textInput = await page.$('input[name="input"]');
    expect(textInput).not.toBeNull();

    if (textInput) {
      await textInput.type(
        "trn:tesco:uid:uuid:4c55660b-05d6-4022-9813-271b33822e26"
      );
      const inputValue = await page.$eval(
        'input[name="input"]',
        (input) => (input as HTMLInputElement).value
      );
      expect(inputValue).toBe(
        "trn:tesco:uid:uuid:4c55660b-05d6-4022-9813-271b33822e26"
      );
    } else {
      throw new Error("Text input field not found");
    }

    if (passwordInput) {
      const password = "Test Password";
      for (const char of password) {
        await passwordInput.type(char);
        await page.waitForTimeout(50); // Adjust the delay as needed
      }
      const passwordValue = await page.$eval(
        'input[name="credentials"]',
        (input) => (input as HTMLInputElement).value
      );
      expect(passwordValue).toBe("Test Password");
    } else {
      throw new Error("Password input field not found");
    }
  });
  test("Verify clicking on buttons triggers correct actions", async () => {
    const preElementBeforeClick = await page.$eval(
      "pre",
      (element) => element.innerHTML
    );
    const buttonHandle = await page.evaluateHandle(() => {
      const buttons = document.evaluate(
        '//button[@name="api"]',
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null
      );
      return buttons.snapshotItem(1);
    });

    if (buttonHandle.asElement()) {
      await buttonHandle.asElement()!.click();
    } else {
      console.error("Button not found");
    }

    const preElementAfterClick = await page.$eval(
      "pre",
      (element) => element.innerHTML
    );

    // Assert that the content has changed after clicking the button
    expect(preElementBeforeClick).not.toEqual(preElementAfterClick);
  });

  test("Submit the form with valid input and verify data change", async () => {
    const btnGroup = await page.$(".btn-group");

    if (btnGroup != null) {
      const buttons = await btnGroup.$$("button");

      if (buttons.length >= 2) {
        await buttons[0].click();
        const ppeButton = await page.$('button:has-text("PPE")');
        if (ppeButton) {
          await ppeButton.click();
        } else {
          await page.waitForTimeout(100);
          console.error("button not found");
        }
      } else {
        console.error("Second button not found");
      }
    }
    const preElementBeforeSubmission = await page.$eval(
      "pre",
      (element) => element.innerHTML
    );

    // Fill out the form fields with valid input
    await page.type(
      'input[name="credentials"]',
      "enter valid token before testing=="
    );
    await page.type(
      'input[name="input"]',
      "trn:tesco:uid:uuid:f23d85cd-24ce-4bdb-bced-ebd568391969"
    );
    const buttonHandle = await page.evaluateHandle(() => {
      const buttons = document.evaluate(
        '//button[@name="api"]',
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null
      );
      return buttons.snapshotItem(2);
    });

    if (buttonHandle.asElement()) {
      await buttonHandle.asElement()!.click();
    } else {
      console.error("Button not found");
    }

    await page.waitForTimeout(10000); // Adjust the timeout as needed

    const preElementAfterSubmission = await page.$eval(
      "pre",
      (element) => element.innerHTML
    );

    expect(preElementBeforeSubmission).not.toEqual(preElementAfterSubmission);
    const statusCode = await page.$('div[data-testid="child-mainOutlet"] p');

    if (statusCode) {
      const paragraphText = await statusCode.textContent();
      expect(paragraphText).toBe("200");
    }
  });
  test("Verify error handling when submitting with invalid input", async () => {
    // Fill out the form fields with invalid input
    await page.type(
      'input[name="credentials"]',
      "enter valid token before testing=="
    );
    await page.type('input[name="input"]', "invalidInput");

    // Submit the form
    await page.click('button[type="submit"]');

    const errormessage = await page.$(`text=Enter valid couponID/`);
    expect(errormessage).toBeTruthy();
  });
  test("Verify error handling when submitting with invalid credentials", async () => {
    // Fill out the form fields with invalid input
    await page.type(
      'input[name="credentials"]',
      "DlhZTlJQ0NTTmU1ODUzNDgyMjUzMTE1NTRiNDhmYg=="
    );
    await page.type(
      'input[name="input"]',
      "trn:tesco:uid:uuid:f23d85cd-24ce-4bdb-bced-ebd568391969"
    );

    const buttonHandle = await page.evaluateHandle(() => {
      const buttons = document.evaluate(
        '//button[@name="api"]',
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null
      );
      return buttons.snapshotItem(2);
    });

    if (buttonHandle.asElement()) {
      await buttonHandle.asElement()!.click();
    } else {
      console.error("Button not found");
    }
    await page.waitForTimeout(10000);
    const statusCode = await page.$('div[data-testid="child-mainOutlet"] p');

    if (statusCode) {
      const paragraphText = await statusCode.textContent();
      expect(paragraphText).toBe("401");
    }
  });
});

test.describe("E2E testing by clicking the filters and check whether its getting changed", () => {
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
    await page.goto("http://localhost:5173/dashboard/coupons");
    const btnGroup = await page.$(".btn-group");

    if (btnGroup != null) {
      const buttons = await btnGroup.$$("button");

      if (buttons.length >= 2) {
        await buttons[0].click();
        const ppeButton = await page.$('button:has-text("PPE")');
        if (ppeButton) {
          await ppeButton.click();
        } else {
          await page.waitForTimeout(100);
          console.error("button not found");
        }
      } else {
        console.error("Second button not found");
      }
    }
    await page.type(
      'input[name="credentials"]',
      "enter valid token before testing=="
    );
    await page.type(
      'input[name="input"]',
      "trn:tesco:uid:uuid:f23d85cd-24ce-4bdb-bced-ebd568391969"
    );
    const buttonHandle = await page.evaluateHandle(() => {
      const buttons = document.evaluate(
        '//button[@name="api"]',
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null
      );
      return buttons.snapshotItem(2);
    });
    if (buttonHandle.asElement()) {
      await buttonHandle.asElement()!.click();
    } else {
      console.error("Button not found");
    }

    await page.waitForTimeout(10000);
  });
  test("filters are changing based on the check boxes are being clicked", async () => {
    const selectFiltersbutton = await page.$(
      'button:has-text("Select Filters")'
    );

    if (selectFiltersbutton) {
      const preElementBeforeSubmission = await page.$eval(
        "pre",
        (element) => element.innerHTML
      );
      await selectFiltersbutton.click();
      await page.waitForSelector('label:has-text("couponId")');
      const checkbox = await page.$('label:has-text("couponId")');
      if (checkbox) await checkbox.check();
      let preElementAfterSubmission = await page.$eval(
        "pre",
        (element) => element.innerHTML
      );
      expect(preElementBeforeSubmission).not.toEqual(preElementAfterSubmission);
      const clearFiltersbutton = await page.$(
        'button:has-text("Clear Filters")'
      );
      await clearFiltersbutton?.click();
      preElementAfterSubmission = await page.$eval(
        "pre",
        (element) => element.innerHTML
      );
      expect(preElementBeforeSubmission).toEqual(preElementAfterSubmission);
    }
  });
});
test.describe("E2E testing by Hover Box functionality being checked", () => {
  let browser: Browser;
  let context: BrowserContext;
  let page: Page;
  test.beforeAll(async () => {
    browser = await chromium.launch();
    context = await browser.newContext();
    page = await context.newPage();
  });

  test.beforeEach(async () => {
    await page.goto("http://localhost:5173/dashboard/coupons");
    const btnGroup = await page.$(".btn-group");

    if (btnGroup != null) {
      const buttons = await btnGroup.$$("button");

      if (buttons.length >= 2) {
        await buttons[0].click();
        const ppeButton = await page.$('button:has-text("PPE")');
        if (ppeButton) {
          await ppeButton.click();
        } else {
          await page.waitForTimeout(100);
          console.error("button not found");
        }
      } else {
        console.error("Second button not found");
      }
    }
    await page.type(
      'input[name="credentials"]',
      "enter valid token before testing=="
    );
    await page.type(
      'input[name="input"]',
      "trn:tesco:uid:uuid:f23d85cd-24ce-4bdb-bced-ebd568391969"
    );
    const buttonHandle = await page.evaluateHandle(() => {
      const buttons = document.evaluate(
        '//button[@name="api"]',
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null
      );
      return buttons.snapshotItem(2);
    });
    if (buttonHandle.asElement()) {
      await buttonHandle.asElement()!.click();
    } else {
      console.error("Button not found");
    }

    await page.waitForTimeout(10000);
  });
  test("selecting the text checking whether the hover box is displayed if displayed is it opening the new window", async () => {
    const elementToSelectText = await page.$(".hljs-string");
    if (elementToSelectText) await elementToSelectText.click();

    // Wait for a moment to ensure the element is in focus
    await page.waitForTimeout(500); // Adjust the timeout as needed

    // Retrieve selected text
    const selectedText = await page.evaluate((element) => {
      return element?.textContent;
    }, elementToSelectText);

    // Assert that the selected text matches the expected value
    expect(selectedText).toBe('"4b497931-f8d3-487e-bcd4-231beb48b730"');
  });
});
