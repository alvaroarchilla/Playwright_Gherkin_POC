import { Page, Locator } from '@playwright/test';

export class DropdownPage {
  readonly page: Page;
  readonly dropdown: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dropdown = page.locator('#dropdown');
  }

  async navigate() {
    await this.page.goto('https://the-internet.herokuapp.com/dropdown');
  }

  async selectOption(optionText: string) {
    await this.dropdown.selectOption({ label: optionText });
  }

  async getSelectedOption(): Promise<string> {
    const selectedOption = await this.dropdown.locator('option:checked');
    return await selectedOption.textContent() || '';
  }
}