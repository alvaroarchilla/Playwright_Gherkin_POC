import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { LoginPage } from '../page-objects/login.page';

let loginPage: LoginPage;


Given('que estoy en la página de login', async function () {
  loginPage = new LoginPage(this.page);
  await loginPage.navigate();
});

When('ingreso el usuario {string} y la contraseña {string}', async function (username: string, password: string) {
  await loginPage.login(username, password);
});

When('hago clic en el botón {string}', async function (buttonText: string) {
  // El botón ya se clickea en el método login()
  // Este paso queda como placeholder
});

Then('debería ver un mensaje de éxito que contenga {string}', async function (expectedText: string) {
  const message = await loginPage.getFlashMessageText();
  expect(message).toContain(expectedText);
});

Then('debería ver un mensaje de error que contenga {string}', async function (expectedText: string) {
  const message = await loginPage.getFlashMessageText();
  expect(message).toContain(expectedText);
});