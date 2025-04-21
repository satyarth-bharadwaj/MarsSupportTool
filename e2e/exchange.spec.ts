// test/cae.e2e.spec.ts
import { test, expect } from "@playwright/test";
import { error } from "console";
import { chromium, Browser, BrowserContext, Page } from "playwright";
test.describe("Exchange Component E2E Tests for input and form submission", () => {
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
    await page.goto("http://localhost:5173/dashboard/exchange"); // Adjust URL as needed
  });

  test("Verify input fields are present and functional", async () => {
    const passwordInput = await page.$('input[name="credentials"]');

    const customerInput = await page.$('input[placeholder="Enter UUID"]');
    const schemeIdInput = await page.$('label:has-text("SchemeId") input');

    if (customerInput) {
      await customerInput.type(
        "trn:tesco:uid:uuid:4c55660b-05d6-4022-9813-271b33822e26"
      );
      const inputValue = await page.$eval(
        'input[placeholder="Enter UUID"]',
        (input) => (input as HTMLInputElement).value
      );
      expect(inputValue).toBe("");
    } else {
      throw new Error("customer Input field missing");
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
    // if (schemeIdInput) {
    //   await schemeIdInput.click();
    // } else {
    //   throw new Error("schemeid field not found");
    // }
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
      return buttons.snapshotItem(3);
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
      "<input valid token before testing>"
    );
    await page.type(
      'input[placeholder="Enter UUID"]',
      "trn:tesco:uid:uuid:7fb134d8-2b4a-4fd4-8858-8cb85db34db6"
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
    await page.type('input[placeholder="Enter UUID"]', "invalidInput");

    // Submit the form
    await page.click('button[type="submit"]');

    const errormessage = await page.$(`text=Customer UUID is required.`);
    expect(errormessage).toBeTruthy();
  });
  test("Verify error handling when submitting with invalid credentials", async () => {
    // Fill out the form fields with invalid input
    await page.type(
      'input[name="credentials"]',
      "DlhZTlJQ0NTTmU1ODUzNDgyMjUzMTE1NTRiNDhmYg=="
    );
    await page.type(
      'input[placeholder="Enter UUID"]',
      "trn:tesco:uid:uuid:7fb134d8-2b4a-4fd4-8858-8cb85db34db6"
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
    await page.goto("http://localhost:5173/dashboard/exchange");
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
      'input[placeholder="Enter UUID"]',
      "trn:tesco:uid:uuid:7fb134d8-2b4a-4fd4-8858-8cb85db34db6"
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
      await page.waitForSelector('label:has-text("collectionPeriodNumber")');
      const checkbox = await page.$('label:has-text("collectionPeriodNumber")');
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
    await page.goto("http://localhost:5173/dashboard/exchange");
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
      'input[placeholder="Enter UUID"]',
      "trn:tesco:uid:uuid:7fb134d8-2b4a-4fd4-8858-8cb85db34db6"
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
  });
});
