import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { DropdownPage } from '../page-objects/dropdown.page';

let dropdownPage: DropdownPage;


Given('que estoy en la página de dropdown', async function () {
  dropdownPage = new DropdownPage(this.page);
  await dropdownPage.navigate();
});

When('selecciono {string} del dropdown', async function (option: string) {
  await dropdownPage.selectOption(option);
});

Then('el dropdown debería tener seleccionado {string}', async function (expectedOption: string) {
  const selected = await dropdownPage.getSelectedOption();
  expect(selected).toBe(expectedOption);
});