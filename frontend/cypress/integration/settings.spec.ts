describe('settings.spec.ts - Settings Page', () => {
  beforeEach(() => {
    cy.resetTestDataAndLoginAsStaff();

    cy.visit('/settings');

    cy.intercept('PUT', '/api/v1/user/*').as('editUser');
    cy.intercept('PUT', '/api/v1/auth/change-password').as('changePassword');
  });

  it('should edit user profile', () => {
    cy.getBySel('user-name').contains('test').should('exist');
    cy.getBySel('edit-profile-btn').click();
    cy.getBySel('name-input').clear().type('test staff');
    cy.getBySel('edit-submit-btn').click();

    cy.wait('@editUser');
    cy.getBySel('user-name').contains('test staff').should('exist');
  });

  it('should change password', () => {
    cy.getBySel('change-password-btn').click();
    cy.getBySel('current-password-input').type('test');
    cy.getBySel('new-password-input').type('testing');
    cy.getBySel('confirm-password-input').type('testing');

    cy.getBySel('change-password-submit-btn').click();
    cy.wait('@changePassword');
  });

  it('should not change password if current password is wrong', () => {
    cy.getBySel('change-password-btn').click();
    cy.getBySel('current-password-input').type('notmypassword');
    cy.getBySel('new-password-input').type('testing');
    cy.getBySel('confirm-password-input').type('testing');

    cy.getBySel('change-password-submit-btn').click();
    cy.wait('@changePassword').its('response.statusCode').should('eq', 400);
  });
});
