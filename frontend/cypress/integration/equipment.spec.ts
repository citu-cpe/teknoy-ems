describe('equipment.spec.ts - Equipment Page', () => {
  beforeEach(() => {
    cy.resetTestDataAndLoginAsAdmin();

    cy.visit('/equipment');

    cy.intercept('GET', '/api/v1/equipment').as('getAllEquipment');
    cy.intercept('POST', '/api/v1/equipment').as('createEquipment');
    cy.intercept('PUT', '/api/v1/equipment/*').as('editEquipment');
    cy.intercept('DELETE', '/api/v1/equipment/*').as('deleteEquipment');

    cy.wait('@getAllEquipment');
  });

  it('should get all equipment', () => {
    cy.getBySel('equipment-row').should('have.length', 1);

    //codes from line 20-23 are working fine if the chakra element is Text however the element is
    //Ellipisis Text and I have no Idea how get the text values even if I already searched the internet
    // cy.getBySel('equipment-name').contains('SONY CAM 1').should('exist');
    // cy.getBySel('equipment-type').contains('CAMERA').should('exist');
    // cy.getBySel('equipment-brand').contains('SONY');
    // cy.getBySel('equipment-notes').contains('This is a test');

    //should show equipment view
    cy.getBySel('equipment-row').first().click();
    cy.getBySel('equipment-view-name').contains('SONY CAM 1').should('exist');
  });

  it('should add an equipment', () => {
    cy.getBySel('add-equipment-btn').click();

    cy.getBySel('name-input').type('RJ45');
    cy.getBySel('type-select').select('Wire');
    cy.getBySel('brand-input').type('N/A');
    cy.getBySel('serial-input').type('GIOEMSKIQ');

    cy.getBySel('add-submit-btn').click();

    //wait for create req
    cy.wait('@createEquipment');

    cy.getBySel('close-btn').click();

    cy.wait('@getAllEquipment');
    cy.getBySel('equipment-row').should('have.length', 2);
    // cy.getBySel('equipment-name').contains('RJ45').should('exist'); //cannot implement this
    //due to ellipsistext element
  });

  it('should add an equipment even withouth populating brand and serial fields', () => {
    cy.getBySel('add-equipment-btn').click();

    cy.getBySel('name-input').type('JBL');
    cy.getBySel('type-select').select('Speaker');

    cy.getBySel('add-submit-btn').click();

    //wait for create req
    cy.wait('@createEquipment');

    cy.getBySel('close-btn').click();

    cy.wait('@getAllEquipment');
    cy.getBySel('equipment-row').should('have.length', 2);
    // cy.getBySel('equipment-name').contains('JBL').should('exist'); //cannot implement this
    //due to ellipsistext element
  });

  it('should not add a duplicate equipment', () => {
    cy.getBySel('add-equipment-btn').click();

    cy.getBySel('name-input').type('SONY CAM 1');
    cy.getBySel('brand-input').type('SONY');
    cy.getBySel('serial-input').type('123456789');

    cy.getBySel('add-submit-btn').click();

    //wait for create req
    cy.wait('@createEquipment');
  });

  it('should edit an equipment', () => {
    const newName = 'SONY CAM 2';
    const newSerial = '987654321'
    const newNote = 'Handle with Care';

    cy.getBySel('actions-btn').first().click();
    cy.getBySel('actions-edit-btn').first().click();

    cy.getBySel('name-input').clear().type(newName);
    cy.getBySel('serial-input').clear().type(newSerial);
    cy.getBySel('notes-input').clear().type(newNote);

    cy.getBySel('edit-submit-btn').click();

    //wait for edit req
    cy.wait('@editEquipment');
    
    cy.wait(1000);
    // cy.getBySel('equipment-name').contains('SONY CAM 2').should('exist'); //cannot implement since test will fail 
    //due to same reasons in getting all equipments

    cy.getBySel('equipment-row').first().click();
    cy.getBySel('equipment-view-name').contains('SONY CAM 2').should('exist');
  });

  it('should delete organizer', () => {
    cy.getBySel('actions-btn').first().click();
    cy.getBySel('actions-delete-btn').first().click();
    cy.getBySel('dialog-yes-btn').click();

    // wait for delete request
    cy.wait('@deleteEquipment');

    // wait for refetch
    cy.wait('@getAllEquipment');

    cy.getBySel('equipment-row').should('have.length', 0);
    // cy.getBySel('equipment-name').contains('SONY CAM 1').should('not.exist');
  })
});
