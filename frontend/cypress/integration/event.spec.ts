import 'cypress-localstorage-commands';
import { CreateEventInfo, getTestEvent } from '../support/commands/event';

const testEvent = getTestEvent();

describe('event.spec.ts - Event Page', () => {
  before(() => {
    cy.resetTestDataAndLoginAsAdmin();
    cy.saveLocalStorage();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.resetTestData();

    cy.intercept('POST', '/api/v1/event').as('createEvent');
    cy.intercept('PUT', '/api/v1/event/*').as('editEvent');
    cy.intercept('DELETE', '/api/v1/event/*').as('deleteEvent');
    cy.intercept('GET', '/api/v1/event').as('getAllEvents');
    cy.intercept('GET', '/api/v1/event/*').as('getEvent');

    cy.visit('/events');
    cy.wait('@getAllEvents');
  });

  it('should create an event', () => {
    cy.contains('button', 'Reserve').click();

    cy.createEvent(testEvent);

    cy.getBySel('add-submit-btn').click();
    cy.wait('@createEvent');

    cy.getBySel('close-btn').click();
    cy.wait('@getAllEvents');

    cy.get('button[title="List view"]').click();
    cy.contains('td.fc-list-event-title', testEvent.title).should('exist');
  });

  it('should not create event when status is set to RESERVED', () => {
    cy.contains('button', 'Reserve').click();

    const event: CreateEventInfo = {
      ...testEvent,
      status: 'Reserved',
    };

    cy.createEvent(event);

    cy.getBySel('add-submit-btn').click();
    cy.wait('@createEvent').its('response.statusCode').should('eq', 400);
  });

  it('should not create overlapping events', () => {
    cy.contains('button', 'Reserve').click();

    cy.createEvent(testEvent);
    cy.getBySel('add-submit-btn').click();
    cy.wait('@createEvent');

    cy.contains('button', 'Reserve again').click();
    cy.createEvent(testEvent);
    cy.getBySel('add-submit-btn').click();
    cy.wait('@createEvent').its('response.statusCode').should('eq', 400);
  });

  it('should update event', () => {
    cy.contains('button', 'Reserve').click();

    cy.createEvent(testEvent);
    cy.getBySel('add-submit-btn').click();
    cy.wait('@createEvent');

    cy.getBySel('close-btn').click();
    cy.wait('@getAllEvents');

    cy.get('button[title="List view"]').click();
    cy.contains('td.fc-list-event-title', testEvent.title).click();
    cy.wait('@getEvent');

    cy.getBySel('update-submit-btn').click();

    const updatedName = 'Updated Test Event';
    cy.getBySel('title-input').clear().type(updatedName);
    cy.getBySel('add-submit-btn').click();
    cy.wait('@editEvent');
    cy.wait('@getAllEvents');

    cy.get('.chakra-modal__content').should('not.exist');
    cy.get('button[title="List view"]').should('exist');
    cy.get('button[title="List view"]').click();
    cy.contains('td.fc-list-event-title', testEvent.title).should('not.exist');
    cy.contains('td.fc-list-event-title', updatedName).should('exist');
  });

  it('should delete event', () => {
    cy.contains('button', 'Reserve').click();

    cy.createEvent(testEvent);
    cy.getBySel('add-submit-btn').click();
    cy.wait('@createEvent');

    cy.getBySel('close-btn').click();
    cy.wait('@getAllEvents');

    cy.get('button[title="List view"]').click();
    cy.contains('td.fc-list-event-title', testEvent.title).click();
    cy.wait('@getEvent');

    cy.getBySel('delete-submit-btn').click();
    cy.getBySel('dialog-yes-btn').click();
    cy.wait('@deleteEvent');
    cy.wait('@getAllEvents');

    cy.get('.chakra-modal__content').should('not.exist');
    cy.get('button[title="List view"]').should('exist');
    cy.get('button[title="List view"]').click();
    cy.contains('td.fc-list-event-title', testEvent.title).should('not.exist');
  });
});
