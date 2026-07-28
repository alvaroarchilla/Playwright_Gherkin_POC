
Feature: Inicio de Sesión
  Como usuario registrado
  Quiero iniciar sesión en la aplicación
  Para acceder a mi panel de control

  Background:
    Given que estoy en la página de login

  Scenario: Login exitoso con credenciales válidas
    When ingreso el usuario "tomsmith" y la contraseña "SuperSecretPassword!"
    And hago clic en el botón "Login"
    Then debería ver un mensaje de éxito que contenga "You logged into a secure area!"

  Scenario: Login fallido con credenciales inválidas
    When ingreso el usuario "tomsmith" y la contraseña "WrongPass"
    And hago clic en el botón "Login"
    Then debería ver un mensaje de error que contenga "Your password is invalid!"