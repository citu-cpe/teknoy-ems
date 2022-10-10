describe('event.spec.ts - Event Page', () => {
  beforeEach(() => {
    cy.resetTestDataAndLoginAsAdmin();

    cy.visit('/events');

    cy.intercept('GET', '/api/v1/event').as('getAllEvents');
    cy.intercept('POST', '/api/v1/event').as('createEvents');
    cy.intercept('PUT', '/api/v1/event/*').as('editEvents');
    cy.intercept('DELETE', '/api/v1/event/*').as('deleteEvents');

    cy.wait('@getAllEvents').wait(2000);
  });

  it('should succsesfully switch between various calendar views', () => {
    cy.contains('Month').click().wait(1500);
    cy.contains('Week').click().wait(1500);
    cy.contains('Day').click().wait(1500);
    cy.contains('List').click().wait(1500);
  });
  describe('should successfully add an event on a day without a reserved event', () => {
    it('should not add an event with an invalid input and missing fields', () => {
      cy.get('.fc-reserve-button').click().wait(2000);
      //invalid start time
      cy.getBySel('start-time-input').type('2022-10-13T15:30').wait(2000);
      cy.getBySel('end-time-input').type('2022-10-13T13:30').wait(4000);
      cy.getBySel('add-submit-btn').click().wait(4000);
    });
    it('should successfully add an event with correct data', () => {
      //TYPE
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

      //start time and end time
      cy.getBySel('start-time-input').type('2022-10-13T8:30').wait(2000);
      cy.getBySel('end-time-input').type('2022-10-13T13:30').wait(2000);

      //venue
      cy.get('#venueIds')
        .click()
        .get('#react-select-29-listbox')
        .contains('TEMS_TEST_DATA - GYM')
        .click()
        .contains('TEMS_TEST_DATA - Covered Court')
        .get('[aria-label="Remove TEMS_TEST_DATA - GYM"]')
        .click()
        .wait(4000);

      //equipment
      cy.get('#equipmentIds')
        .click()
        .get('#react-select-49-listbox')
        .contains('TEMS_TEST_DATA - SONY CAM 1')
        .click()
        .wait(4000);
    });
  });
});
