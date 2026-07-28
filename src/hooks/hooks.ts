import { Before, After, AfterAll } from '@cucumber/cucumber';
import { chromium, Browser, Page } from '@playwright/test';


let browser: Browser;

Before(async function () {
  if (!browser) {
    const headless = process.env.HEADLESS !== 'false';
    browser = await chromium.launch({ headless });
  }
  const context = await browser.newContext();
  this.page = await context.newPage();
});

After(async function (scenario) {
  if (scenario.result?.status === 'FAILED') {
    const screenshot = await this.page.screenshot();
    this.attach(screenshot, 'image/png');
  }
  await this.page.close();
});

AfterAll(async function () {
  if (browser) {
    await browser.close();
  }
});
