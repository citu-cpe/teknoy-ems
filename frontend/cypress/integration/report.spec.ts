import 'cypress-localstorage-commands';

describe('report.spec.ts - Report Page', () => {
  before(() => {
    cy.resetTestDataAndLoginAsAdmin();
    cy.saveLocalStorage();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  it('should not export report without selecting at least one filter', () => {
    cy.visit('/reports');

    cy.getBySel('report-submit-btn').click();
  });

  it('should successfully reset filters', () => {
    cy.get(
      '.css-1l5obqg > :nth-child(2) > :nth-child(1) > .css-165casq > .chakra-button'
    ).click();
    cy.getBySel('reset-btn').click();
  });

  describe('export functions for events', () => {
    it('should successfully select all events filter', () => {
      cy.get(
        '.css-1l5obqg > :nth-child(2) > :nth-child(1) > .css-165casq > .chakra-button'
      ).click();
    });
    it('should successfully export events with all filters selected', () => {
      cy.intercept('POST', '/api/v1/report').as('exportReport');
      cy.getBySel('report-submit-btn').click().wait('@exportReport');
    });
    it('should successfully unselect all events filter and select desired filter only', () => {
      cy.get(
        '.css-1l5obqg > :nth-child(2) > :nth-child(1) > .css-165casq > .chakra-button'
      ).click();
      cy.getBySel('event-id-checkbox').click();
      cy.getBySel('event-title-checkbox').click();
      cy.getBySel('event-description-checkbox').click();
      cy.getBySel('event-startTime-checkbox').click();
      cy.getBySel('event-endTime-checkbox').click();
      cy.getBySel('event-status-checkbox').click();
      cy.getBySel('event-contact-person-checkbox').click();
      cy.getBySel('event-additional-notes-checkbox').click();
    });
    it('should successfully export events with modified filters', () => {
      cy.intercept('POST', '/api/v1/report').as('exportReport');
      cy.getBySel('report-submit-btn').click().wait('@exportReport');
    });
  });

  describe('export functions for organizer', () => {
    it('should successfully select all organizer filter', () => {
      //reset past filter
      cy.getBySel('reset-btn').click();

      cy.get(
        '.css-q3j5jo > :nth-child(1) > .css-165casq > .chakra-button'
      ).click();
    });
    it('should successfully export organizer with all filters selected', () => {
      cy.intercept('POST', '/api/v1/report').as('exportReport');
      cy.getBySel('report-submit-btn').click().wait('@exportReport');
    });
    it('should successfully unselect all organizer filter and select desired filter only', () => {
      cy.get(
        '.css-q3j5jo > :nth-child(1) > .css-165casq > .chakra-button'
      ).click();
      cy.getBySel('organizer-name-checkbox').click();
      cy.getBySel('organizer-type-checkbox').click();
    });
    it('should successfully export organizer with modified filters', () => {
      cy.intercept('POST', '/api/v1/report').as('exportReport');
      cy.getBySel('report-submit-btn').click().wait('@exportReport');
    });
  });

  describe('export functions for venue', () => {
    it('should successfully select all venue filter', () => {
      //reset past filter
      cy.getBySel('reset-btn').click();

      cy.get(
        '.css-q3j5jo > :nth-child(2) > .css-165casq > .chakra-button'
      ).click();
    });
    it('should successfully export venue with all filters selected', () => {
      cy.intercept('POST', '/api/v1/report').as('exportReport');
      cy.getBySel('report-submit-btn').click().wait('@exportReport');
    });
    it('should successfully unselect all venue filter and select desired filter only', () => {
      cy.get(
        '.css-q3j5jo > :nth-child(2) > .css-165casq > .chakra-button'
      ).click();
      cy.getBySel('venue-id-checkbox').click();
      cy.getBySel('venue-name-checkbox').click();
    });
    it('should successfully export venue with modified filters', () => {
      cy.intercept('POST', '/api/v1/report').as('exportReport');
      cy.getBySel('report-submit-btn').click().wait('@exportReport');
    });
  });

  describe('export functions for announcement', () => {
    it('should successfully select all announcement filter', () => {
      //reset past filter
      cy.getBySel('reset-btn').click();

      cy.get(
        ':nth-child(3) > :nth-child(1) > .css-165casq > .chakra-button'
      ).click();
    });
    it('should successfully export announcement with all filters selected', () => {
      cy.intercept('POST', '/api/v1/report').as('exportReport');
    });
    it('should successfully unselect all announcement filter and select desired filter only', () => {
      cy.get(
        ':nth-child(3) > :nth-child(1) > .css-165casq > .chakra-button'
      ).click();
      cy.getBySel('announcement-id-checkbox').click();
      cy.getBySel('announcement-title-checkbox').click();
      cy.getBySel('announcement-content-checkbox').click();
    });
    it('should successfully export announcement with modified filters', () => {
      cy.intercept('POST', '/api/v1/report').as('exportReport');
      cy.getBySel('report-submit-btn').click().wait('@exportReport');
    });
  });

  describe('export functions for equipment', () => {
    it('should successfully select all equipment filter', () => {
      //reset past filter
      cy.getBySel('reset-btn').click();

      cy.get(
        ':nth-child(3) > :nth-child(2) > .css-165casq > .chakra-button'
      ).click();
    });
    it('should successfully export equipment with all filters selected', () => {
      cy.intercept('POST', '/api/v1/report').as('exportReport');
      cy.getBySel('report-submit-btn').click().wait('@exportReport');
    });
    it('should successfully unselect all equipment filter and select desired filter only', () => {
      cy.get(
        ':nth-child(3) > :nth-child(2) > .css-165casq > .chakra-button'
      ).click();
      cy.getBySel('equipment-id-checkbox').click();
      cy.getBySel('equipment-name-checkbox').click();
      cy.getBySel('equipment-type-checkbox').click();
      cy.getBySel('equipment-schedules-checkbox').click();
      cy.getBySel('equipment-notes-checkbox').click();
    });
    it('should successfully export equipment with modified filters', () => {
      cy.intercept('POST', '/api/v1/report').as('exportReport');
      cy.getBySel('report-submit-btn').click().wait('@exportReport');
    });
  });

  describe('export functions for various data', () => {
    it('should successfully export all data with selected filters', () => {
      //events
      cy.getBySel('event-id-checkbox').click();
      cy.getBySel('event-title-checkbox').click();
      cy.getBySel('event-description-checkbox').click();
      cy.getBySel('event-startTime-checkbox').click();
      cy.getBySel('event-endTime-checkbox').click();
      cy.getBySel('event-status-checkbox').click();
      cy.getBySel('event-contact-person-checkbox').click();
      cy.getBySel('event-additional-notes-checkbox').click();

      //organizer
      cy.getBySel('organizer-name-checkbox').click();
      cy.getBySel('organizer-type-checkbox').click();

      //venue
      cy.getBySel('venue-id-checkbox').click();
      cy.getBySel('venue-name-checkbox').click();

      //announcements
      cy.getBySel('announcement-id-checkbox').click();
      cy.getBySel('announcement-title-checkbox').click();
      cy.getBySel('announcement-content-checkbox').click();

      cy.getBySel('message-input').type('Reports as of October 11, 2022');

      //export
      cy.intercept('POST', '/api/v1/report').as('exportReport');
    });
  });
});
