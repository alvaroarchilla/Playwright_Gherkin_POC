Feature: Casillas de Verificación
  Como usuario
  Quiero marcar y desmarcar casillas
  Para probar la interacción con elementos de tipo checkbox

  Scenario: Marcar el primer checkbox
    Given que estoy en la página de checkboxes
    When marco el primer checkbox
    Then el primer checkbox debería estar marcado

  Scenario: Desmarcar el segundo checkbox
    Given que estoy en la página de checkboxes
    When desmarco el segundo checkbox
    Then el segundo checkbox debería estar desmarcado