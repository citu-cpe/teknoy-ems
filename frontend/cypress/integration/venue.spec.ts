describe('venue.spec.ts - Venues Page', () => {
  beforeEach(() => {
    cy.resetTestDataAndLoginAsAdmin();

    cy.visit('/venues');

    cy.intercept('GET', '/api/v1/venue').as('getAllVenue');
    cy.intercept('POST', '/api/v1/venue').as('createVenue');
    cy.intercept('PUT', '/api/v1/venue/*').as('editVenue');
    cy.intercept('DELETE', '/api/v1/venue/*').as('deleteVenue');

    cy.wait('@getAllVenue');
  });

  const venueName = 'Covered Court';
  const venueNotes = 'this is a test for covered court';
  const venueAddName = ' Innovation Lab';
  const venueAddNotes = 'test for innovation lab';

  it('should get all venues', () => {
    cy.getBySel('venue-row').should('have.length', 2);

    cy.getBySel('venue-name').contains(venueName).should('exist');
    cy.getBySel('venue-notes').contains(venueNotes).should('exist');

    //should show venue view
    cy.getBySel('venue-row').first().click();
    cy.getBySel('venue-view-name').contains(venueName).should('exist');
    cy.getBySel('venue-view-notes').contains(venueNotes).should('exist');
  });

  it('should add a venue', () => {
    cy.getBySel('add-venue-btn').click();

    cy.getBySel('name-input').type(venueAddName);
    cy.getBySel('notes-input').type(venueAddNotes);

    cy.getBySel('add-submit-btn').click();

    //wait for create req
    cy.wait('@createVenue');

    cy.getBySel('close-btn').click();

    cy.wait('@getAllVenue');
    cy.getBySel('venue-row').should('have.length', 3);
    cy.getBySel('venue-name').contains(venueAddName).should('exist');
    cy.getBySel('venue-notes').contains(venueAddNotes).should('exist');
  });

  it('should add a venue even without populating the notes field', () => {
    cy.getBySel('add-venue-btn').click();

    cy.getBySel('name-input').type(venueAddName);

    cy.getBySel('add-submit-btn').click();

    //wait for create req
    cy.wait('@createVenue');

    cy.getBySel('close-btn').click();

    cy.wait('@getAllVenue');
    cy.getBySel('venue-row').should('have.length', 3);
    cy.getBySel('venue-name').contains(venueAddName).should('exist');
  });

  it('should reset the fields upon clicking reset inputs', () => {
    cy.getBySel('add-venue-btn').click();

    cy.getBySel('name-input').type(venueAddName);
    cy.getBySel('notes-input').type(venueAddNotes);

    cy.getBySel('reset-btn').click();
  });

  it('should not create a duplicate venue', () => {
    cy.getBySel('add-venue-btn').click();

    cy.getBySel('name-input').type(venueName);
    cy.getBySel('notes-input').type(venueNotes);

    cy.getBySel('add-submit-btn').click();

    //wait for create req
    cy.wait('@createVenue');
  });

  it('should edit a venue', () => {
    const newName = 'Chemistry Lab';
    const newNotes = 'only 3 groups are allowed';

    cy.getBySel('actions-btn').first().click();
    cy.getBySel('actions-edit-btn').first().click();

    cy.getBySel('name-input').clear().type(newName);
    cy.getBySel('notes-input').clear().type(newNotes);

    cy.getBySel('edit-submit-btn').click();

    cy.wait('@editVenue');

    cy.wait(1000);
    cy.getBySel('venue-name').contains(newName).should('exist');
    cy.getBySel('venue-notes').contains(newNotes).should('exist');

    //should show venue view
    cy.getBySel('venue-name').contains(newName).click();
    cy.getBySel('venue-view-name').contains(newName).should('exist');
    cy.getBySel('venue-view-notes').contains(newNotes).should('exist');
  });

  it('should reset fields base on defaults', () => {
    const newName = 'Chemistry Lab';
    const newNotes = 'only 3 groups are allowed';

    cy.getBySel('actions-btn').first().click();
    cy.getBySel('actions-edit-btn').first().click();

    cy.getBySel('name-input').clear().type(newName);
    cy.getBySel('notes-input').clear().type(newNotes);

    cy.getBySel('reset-btn').click();
  });

  it('should delete venue', () => {
    cy.getBySel('actions-btn').first().click();
    cy.getBySel('actions-delete-btn').first().click();
    cy.getBySel('dialog-yes-btn').click();

    // wait for delete request
    cy.wait('@deleteVenue');

    // wait for refetch
    cy.wait('@getAllVenue');

    cy.getBySel('venue-row').should('have.length', 1);
    cy.getBySel('venue-name').contains(venueName).should('not.exist');
  });
});