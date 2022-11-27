import 'cypress-localstorage-commands';

describe('report.spec.ts - Report Page', () => {
  before(() => {
    cy.resetTestDataAndLoginAsAdmin();
    cy.saveLocalStorage();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.intercept('POST', '/api/v1/report').as('exportReport');

    cy.visit('/reports');
  });

  it('should not export report without selecting at least one filter', () => {
    cy.getBySel('report-submit-btn').click();
  });

  it('should successfully reset filters', () => {
    cy.getBySel('event-toggle').click();

    cy.getBySel('reset-btn').click();
  });

  describe('export functions for events', () => {
    it('should successfully export events with all filters selected', () => {
      cy.getBySel('event-toggle').click();

      cy.getBySel('report-submit-btn').click();
      cy.wait('@exportReport');
    });

    it('should successfully select desired filter only', () => {
      cy.getBySel('event-id-checkbox').click();
      cy.getBySel('event-title-checkbox').click();
      cy.getBySel('event-description-checkbox').click();
      cy.getBySel('event-startTime-checkbox').click();
      cy.getBySel('event-endTime-checkbox').click();
      cy.getBySel('event-status-checkbox').click();
      cy.getBySel('event-contact-person-checkbox').click();
      cy.getBySel('event-additional-notes-checkbox').click();

      cy.getBySel('report-submit-btn').click();
      cy.wait('@exportReport');
    });
  });

  describe('export functions for organizer', () => {
    it('should successfully export organizer with all filters selected', () => {
      cy.getBySel('organizer-toggle').click();

      cy.getBySel('report-submit-btn').click();
      cy.wait('@exportReport');
    });

    it('should successfully export organizer with modified filters', () => {
      cy.getBySel('organizer-name-checkbox').click();
      cy.getBySel('organizer-type-checkbox').click();

      cy.getBySel('report-submit-btn').click();
      cy.wait('@exportReport');
    });
  });

  describe('export functions for venue', () => {
    it('should successfully export venue with all filters selected', () => {
      cy.getBySel('venue-toggle').click();

      cy.getBySel('report-submit-btn').click();
      cy.wait('@exportReport');
    });

    it('should successfully export venue with modified filters', () => {
      cy.getBySel('venue-id-checkbox').click();
      cy.getBySel('venue-name-checkbox').click();

      cy.getBySel('report-submit-btn').click();
      cy.wait('@exportReport');
    });
  });

  describe('export functions for announcement', () => {
    it('should successfully export announcement with all filters selected', () => {
      cy.getBySel('announcement-toggle').click();

      cy.getBySel('report-submit-btn').click();
      cy.wait('@exportReport');
    });

    it('should successfully export announcement with modified filters', () => {
      cy.getBySel('announcement-id-checkbox').click();
      cy.getBySel('announcement-title-checkbox').click();
      cy.getBySel('announcement-content-checkbox').click();

      cy.getBySel('report-submit-btn').click();
      cy.wait('@exportReport');
    });
  });

  describe('export functions for equipment', () => {
    it('should successfully export equipment with all filters selected', () => {
      cy.getBySel('equipment-toggle').click();

      cy.getBySel('report-submit-btn').click();
      cy.wait('@exportReport');
    });

    it('should successfully export equipment with modified filters', () => {
      cy.getBySel('equipment-id-checkbox').click();
      cy.getBySel('equipment-name-checkbox').click();
      cy.getBySel('equipment-type-checkbox').click();
      cy.getBySel('equipment-schedules-checkbox').click();
      cy.getBySel('equipment-notes-checkbox').click();

      cy.getBySel('report-submit-btn').click();
      cy.wait('@exportReport');
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

      // equipment
      cy.getBySel('equipment-id-checkbox').click();
      cy.getBySel('equipment-name-checkbox').click();
      cy.getBySel('equipment-type-checkbox').click();
      cy.getBySel('equipment-schedules-checkbox').click();
      cy.getBySel('equipment-notes-checkbox').click();

      cy.getBySel('message-input').type('Reports as of October 11, 2022');

      cy.getBySel('report-submit-btn').click();
      cy.wait('@exportReport');
    });
  });
});
