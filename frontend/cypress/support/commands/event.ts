/// <reference types="Cypress" />

export interface CreateEventInfo {
  venueNames: string[] | string;
  startTime: Date;
  endTime: Date;
  approvedLetter?: string;
  type: string;
  additionalNotes?: string;
  equipmentNames: string[] | string;
  status: string;
  title: string;
  description?: string;
  viewAccess: string;
  organizerName: string;
  contactPerson: string;
  contactInfo: string;
}

export const getTestEvent = (): CreateEventInfo => {
  const startTime = new Date();
  const endTime = new Date();
  endTime.setHours(startTime.getHours() + 1);
  return {
    venueNames: 'TEMS_TEST_DATA - Covered Court',
    startTime,
    endTime,
    approvedLetter: 'Julius Novachrono',
    type: 'Photo And Video Documentation',
    additionalNotes: 'Test event for E2E tests',
    equipmentNames: 'TEMS_TEST_DATA - SONY CAM 1',
    status: 'Pending',
    title: 'E2E Test Event',
    description: 'This is a test event',
    viewAccess: 'Public',
    organizerName: 'TEMS_TEST_DATA - MSDO',
    contactPerson: 'Yami Sukehiro',
    contactInfo: 'yami.sukehiro@blackbulls.com',
  };
};

Cypress.Commands.add(
  'createEvent',
  (info: CreateEventInfo = getTestEvent()) => {
    if (Array.isArray(info.venueNames)) {
      info.venueNames.forEach((name) => {
        cy.get('.react-select#venueIds').find('input').first().clear();
        cy.get('.react-select#venueIds').find('input').first().type(name);
        cy.contains('div', name).click({ force: true });
        cy.get('body').focus();
      });
    } else {
      cy.get('.react-select#venueIds')
        .find('input')
        .first()
        .type(info.venueNames);
      cy.contains('div', info.venueNames).click({ force: true });
      cy.get('body').focus();
    }

    cy.setDateTimeLocalBySel('start-time-input', info.startTime);
    cy.setDateTimeLocalBySel('end-time-input', info.endTime);

    cy.getBySel('approved-by-input').type(info.approvedLetter);

    cy.getBySel('type-select').select(info.type);

    cy.getBySel('additional-notes-input').type(info.additionalNotes);

    if (Array.isArray(info.equipmentNames)) {
      info.equipmentNames.forEach((name) => {
        cy.get('.react-select#equipmentIds').find('input').first().clear();
        cy.get('.react-select#equipmentIds').find('input').first().type(name);
        cy.contains('div', name).click({ force: true });
        cy.get('body').focus();
      });
    } else {
      cy.get('.react-select#equipmentIds')
        .find('input')
        .first()
        .type(info.equipmentNames);
      cy.contains('div', info.equipmentNames).click({ force: true });
      cy.get('body').focus();
    }

    cy.getBySel('status-select').select(info.status, { force: true });

    cy.getBySel('title-input').type(info.title);

    cy.getBySel('description-input').type(info.description);

    cy.getBySel('view-access-select').select(info.viewAccess, { force: true });

    cy.get('.react-select#organizerId')
      .find('input')
      .first()
      .type(info.organizerName);
    cy.contains('div', info.organizerName).click({ force: true });
    cy.get('body').focus();

    cy.getBySel('contact-person-input').type(info.contactPerson);

    cy.getBySel('contact-info-input').type(info.contactInfo);
  }
);
