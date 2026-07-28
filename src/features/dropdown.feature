Feature: Menú Desplegable
  Como usuario
  Quiero seleccionar una opción de un menú desplegable
  Para probar la interacción con listas

  Scenario: Seleccionar la Opción 1
    Given que estoy en la página de dropdown
    When selecciono "Option 1" del dropdown
    Then el dropdown debería tener seleccionado "Option 1"

  Scenario: Seleccionar la Opción 2
    Given que estoy en la página de dropdown
    When selecciono "Option 2" del dropdown
    Then el dropdown debería tener seleccionado "Option 2"