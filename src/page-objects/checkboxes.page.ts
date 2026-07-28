import { Page, Locator } from '@playwright/test';

export class CheckboxesPage {
  readonly page: Page;
  readonly checkbox1: Locator;
  readonly checkbox2: Locator;

  constructor(page: Page) {
    this.page = page;
    // Selectores para los checkboxes
    this.checkbox1 = page.locator('form#checkboxes input:nth-child(1)');
    this.checkbox2 = page.locator('form#checkboxes input:nth-child(3)');
  }

  async open() {
    await this.page.goto('https://the-internet.herokuapp.com/checkboxes');
  }

  // Método genérico para marcar/desmarcar según estado deseado
  async setCheckbox(checkbox: 'first' | 'second', state: boolean) {
    const element = checkbox === 'first' ? this.checkbox1 : this.checkbox2;
    const isCurrentlyChecked = await element.isChecked();
    if (state !== isCurrentlyChecked) {
      await element.click();
    }
  }

  async isCheckboxChecked(checkbox: 'first' | 'second'): Promise<boolean> {
    const element = checkbox === 'first' ? this.checkbox1 : this.checkbox2;
    return await element.isChecked();
  }
}