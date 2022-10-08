describe('event.spec.ts - Event Page', () => {
  before(() => {
    cy.resetTestDataAndLoginAsAdmin();

    cy.visit('/events');

    cy.intercept('GET', '/api/v1/event').as('getAllEvents');
    cy.intercept('POST', '/api/v1/event').as('createEvents');
    cy.intercept('PUT', '/api/v1/event/*').as('editEvents');
    cy.intercept('DELETE', '/api/v1/event/*').as('deleteEvents');

    cy.wait('@getAllEvents').pause();
    cy.contains('Month').click().wait(2000);
  });

  describe('should successfully add an event', () => {
    describe('should successfully add another events on a day with events already', () => {
      it('should not add an event with missing fields', () => {
        // selecting Oct 09, 2022 event
        cy.get('#fc-dom-118').click().wait(5000);
        cy.getBySel('add-submit-btn').click().wait(10000);
      });
      it('should successfully input title and description', () => {
        cy.getBySel('title-input').type('Microcontrollers Workshop').wait(1000);
        cy.getBySel('description-input')
          .type(
            'A whole day workshop for CPE students who wish to learn microcontrollers'
          )
          .wait(4000);
      });

      it('should successfully select any type from dropdown list', () => {
        cy.getBySel('type-select')
          .select(1)
          .wait(2000)
          .select(2)
          .wait(2000)
          .select(3)
          .wait(2000)
          .select(4)
          .wait(2000)
          .select(5)
          .wait(2000)
          .select(6)
          .wait(2000)
          .select(7)
          .wait(2000)
          .select('Academic')
          .wait(4000);
      });
      it('should successfully select any view access from dropdown list', () => {
        cy.getBySel('view-access-select')
          .select('Private')
          .wait(2000)
          .select('Public')
          .wait(4000);
      });
      it('should successfully select any status from the dropdown list', () => {
        cy.getBySel('status-select')
          .select(1)
          .wait(2000)
          .select(2)
          .wait(2000)
          .select(3)
          .wait(2000)
          .select(4)
          .wait(2000)
          .select(5)
          .wait(2000)
          .select('Reserved')
          .wait(4000);
      });

      //not yet working or has no validation yet but implemented it beforehand
      it('should show a toast message when start time is after end time', () => {
        cy.getBySel('start-time-input').type('2022-10-15T15:30').wait(2000);
        cy.getBySel('end-time-input').type('2022-10-15T13:30').wait(4000);
      });

      it('should successfully input correct start and end time', () => {
        cy.getBySel('start-time-input').type('2022-10-15T08:30').wait(2000);
        cy.getBySel('end-time-input').type('2022-10-15T13:30').wait(4000);
      });

      it('should sucessfully input contact person', () => {
        cy.getBySel('contact-person-input')
          .type('Allicent Lowtower')
          .wait(4000);
      });

      it('should not accept invalid contact number', () => {
        cy.getBySel('contact-number-input').type('my number').wait(4000);
      });

      it('should successfully input contact number', () => {
        cy.getBySel('contact-number-input')
          .clear()
          .type('09972649372')
          .wait(4000);
      });

      it('should sucessfully input approved by', () => {
        cy.getBySel('approved-by-input').type('SAO').wait(4000);
      });

      it('should successfully select an organizer by selecting options on the dropdown list', () => {
        cy.get('#organizerId')
          .click()
          .wait(5000)
          .get('#react-select-3-listbox')
          .contains('MSDO')
          .click()
          .wait(4000);
      });

      it('should successfully show autocompleted options upon inputting or typing an existing org', () => {
        //selecting org by typing and selecting dropdown choices
        cy.get('#organizerId')
          .type('Supreme Stud')
          .wait(3000)
          .get('.css-1qfsap8-menu')
          .contains('Supreme Student Government')
          .click()
          .wait(4000);
      });

      it('should successfully show "no options" message when inputting a non existing org', () => {
        cy.get('#organizerId').type('GDC');
        //to make selection out of focus
        cy.get('.css-1tx7y9u > .css-17xejub').click().wait(3000);
      });

      it('should successfully select an equipment from the dropdown list', () => {
        cy.get('#equipmentIds')
          .click()
          .get('#react-select-5-listbox')
          .contains('SONY CAM 1')
          .click()
          .wait(4000);
      });
      it('should successfully remove an equipment from the selected inputs', () => {
        cy.get('[aria-label="Remove SONY CAM 1"]')
          .wait(2000)
          .click()
          .wait(4000);
      });
      it('should successfully show autocompleted options upon inputting or typing an existing equipment', () => {
        cy.get('#equipmentIds')
          .type('SONY')
          .wait(3000)
          .get('#react-select-5-listbox')
          .contains('SONY CAM 1')
          .click();
        cy.get('.css-1tx7y9u > .css-17xejub').click().wait(4000);
      });

      it('should successfully select a venue from the dropdown list', () => {
        cy.get('#venueIds')
          .click()
          .get('#react-select-7-listbox')
          .contains('GYM')
          .click()
          .wait(4000);
      });

      it('should successfully input additional notes', () => {
        cy.getBySel('additional-notes-input')
          .type('Students must bring their own kits and mcu')
          .wait(2000);
      });
      it('should successfully add an event with correct data', () => {
        cy.getBySel('add-submit-btn').click().wait(1000);
      });
    });
  });
});
