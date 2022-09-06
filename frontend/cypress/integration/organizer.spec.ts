describe('organizer.spec.ts - Organizers Page', () => {
  beforeEach(() => {
    cy.resetTestDataAndLoginAsAdmin();

    cy.visit('/organizers');

    cy.intercept('GET', '/api/v1/organizer').as('getAllOrganizers');
    cy.intercept('POST', '/api/v1/organizer').as('createOrganizer');
    cy.intercept('PUT', '/api/v1/organizer/*').as('editOrganizer');
    cy.intercept('DELETE', '/api/v1/organizer/*').as('deleteOrganizer');

    cy.wait('@getAllOrganizers');
  });

  it('should get all organizers', () => {
    cy.getBySel('organizer-row').should('have.length', 2);

    cy.getBySel('organizer-name').contains('MSDO').should('exist');
    cy.getBySel('organizer-name')
      .contains('Supreme Student Government')
      .should('exist');
  });

  it('should add organizer', () => {
    cy.getBySel('add-organizer-btn').click();

    cy.getBySel('name-input').type('College of Computer Studies');
    cy.getBySel('type-select').select('DEPARTMENT');
    cy.getBySel('add-submit-btn').click();

    // wait for create request
    cy.wait('@createOrganizer');

    cy.getBySel('close-btn').click();

    cy.wait('@getAllOrganizers');
    cy.getBySel('organizer-row').should('have.length', 3);
    cy.getBySel('organizer-name')
      .contains('College of Computer Studies')
      .should('exist');
  });

  it('should edit organizer', () => {
    const newName = 'MinebeaMitsumi';

    cy.getBySel('actions-btn').first().click();
    cy.getBySel('actions-edit-btn').first().click();

    cy.getBySel('name-input').clear().type(newName);
    cy.getBySel('type-select').select('ORGANIZATION');
    cy.getBySel('edit-submit-btn').click();

    // wait for edit request
    cy.wait('@editOrganizer');

    // wait for refetch
    cy.wait('@getAllOrganizers');

    // TODO: find solution to remove cy.wait(1000)
    cy.wait(1000);
    cy.getBySel('organizer-name').contains(newName).should('exist');
  });

  it('should delete organizer', () => {
    cy.getBySel('actions-btn').first().click();
    cy.getBySel('actions-delete-btn').first().click();
    cy.getBySel('dialog-yes-btn').click();

    // wait for delete request
    cy.wait('@deleteOrganizer');

    // wait for refetch
    cy.wait('@getAllOrganizers');

    cy.getBySel('organizer-row').should('have.length', 1);
    cy.getBySel('organizer-name').contains('MSDO').should('not.exist');
  });
});
