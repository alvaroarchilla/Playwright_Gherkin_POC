import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CheckboxesPage } from '../page-objects/checkboxes.page';

let checkboxesPage: CheckboxesPage;

Given('que estoy en la página de checkboxes', async function () {
  checkboxesPage = new CheckboxesPage(this.page);
  await checkboxesPage.open();
});

When('marco el primer checkbox', async function () {
  await checkboxesPage.setCheckbox('first', true);
});

When('desmarco el segundo checkbox', async function () {
  await checkboxesPage.setCheckbox('second', false);
});

Then('el primer checkbox debería estar marcado', async function () {
  const isChecked = await checkboxesPage.isCheckboxChecked('first');
  expect(isChecked).toBe(true);
});

Then('el segundo checkbox debería estar desmarcado', async function () {
  const isChecked = await checkboxesPage.isCheckboxChecked('second');
  expect(isChecked).toBe(false);
});