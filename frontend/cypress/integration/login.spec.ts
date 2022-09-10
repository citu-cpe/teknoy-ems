describe('login.spec.ts - Login Form', () => {
  beforeEach(() => {
    cy.resetTestData();
    cy.visit('/login');
    cy.intercept('/api/v1/auth/logout').as('logout');
  });

  it('should successfully log in', () => {
    cy.login('test_staff@test.com', 'test');
  });

  it('should successfully log out', () => {
    cy.login('test_staff@test.com', 'test');

    cy.getBySel('profile-btn').first().click();
    cy.getBySel('logout-btn').click();
    cy.wait('@logout');

    cy.url().should('contain', 'login');
  });

  it('should show errors when fields are empty', () => {
    cy.getBySel('login-submit-btn').click();

    cy.get('.chakra-form__error-message')
      .eq(0)
      .contains('Required')
      .should('exist');

    cy.get('.chakra-form__error-message')
      .eq(1)
      .contains('Required')
      .should('exist');
  });

  it('should show error if email is invalid', () => {
    cy.get('input').first().type('test');
    cy.get('input').first().blur();

    cy.get('.chakra-form__error-message')
      .contains('Invalid email')
      .should('exist');
  });
});
