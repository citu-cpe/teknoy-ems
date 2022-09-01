/// <reference types="Cypress" />

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.intercept('POST', '/api/v1/auth/login').as('login');

  cy.get('input').first().should('have.attr', 'name', 'email');
  cy.get('input').first().should('have.attr', 'type', 'email');
  cy.get('input').first().type(email);

  cy.get('input').eq(1).should('have.attr', 'name', 'password');
  cy.get('input').eq(1).should('have.attr', 'type', 'password');
  cy.get('input').eq(1).type(password);

  cy.getBySel('login-submit-btn').should('exist').click();
  cy.wait('@login');
});

Cypress.Commands.add(
  'resetTestDataAndLogin',
  (email: string = 'test_staff@test.com', password: string = 'test') => {
    cy.resetTestData();
    cy.login(email, password);
  }
);
