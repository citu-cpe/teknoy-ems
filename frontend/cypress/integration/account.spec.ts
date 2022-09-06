describe('account.spec.ts - Accounts Page', () => {
  beforeEach(() => {
    cy.resetTestDataAndLoginAsAdmin();

    cy.visit('/accounts');

    cy.intercept('GET', '/api/v1/user').as('getAllUsers');
    cy.intercept('POST', '/api/v1/auth/register').as('registerUser');
    cy.intercept('PUT', '/api/v1/user/*').as('editUser');
    cy.intercept('DELETE', '/api/v1/user/*').as('deleteUser');

    cy.wait('@getAllUsers');
  });

  it('should get all users except self', () => {
    cy.getBySel('user-name').contains('test').should('exist');
    cy.getBySel('user-email').contains('test_staff@test.com').should('exist');

    cy.getBySel('user-name').contains('test admin').should('not.exist');
    cy.getBySel('user-email')
      .contains('test_admin@test.com')
      .should('not.exist');
  });

  it('should register user', () => {
    cy.getBySel('register-account-btn').click();
    cy.getBySel('email-input').type('test_new@test.com');
    cy.getBySel('name-input').type('test new');
    cy.getBySel('staff-checkbox').click();
    cy.getBySel('register-submit-btn').click();

    // wait for create request
    cy.wait('@registerUser');

    cy.wait('@getAllUsers');
    cy.getBySel('close-btn').click();
    cy.getBySel('user-name').contains('test new').should('exist');
    cy.getBySel('user-row').should('have.length', 2);
    cy.getBySel('user-row')
      .first()
      .find('[data-cy="roles-tag"]')
      .contains('STAFF')
      .should('exist');
  });

  it('should edit user', () => {
    const newName = 'test staff';

    cy.getBySel('actions-btn').first().click();
    cy.getBySel('actions-edit-btn').click();
    cy.getBySel('admin-checkbox').click();
    cy.getBySel('name-input').clear().type(newName);
    cy.getBySel('edit-submit-btn').click();

    // wait for edit request
    cy.wait('@editUser');

    // refetch users
    cy.wait('@getAllUsers');

    // check if update values are correct
    cy.getBySel('user-name').contains(newName).should('exist');
    cy.getBySel('user-row')
      .first()
      .find('[data-cy="roles-tag"]')
      .contains('ADMIN')
      .should('exist');
  });

  it('should delete user', () => {
    cy.getBySel('actions-btn').first().click();
    cy.getBySel('actions-delete-btn').click();
    cy.getBySel('dialog-yes-btn').click();

    // wait for delete request
    cy.wait('@deleteUser');

    // wait for refetch users
    cy.wait('@getAllUsers');

    // no other users should exist
    cy.getBySel('user-row').should('not.exist');
  });
});
