import 'cypress-localstorage-commands';

describe('report.spec.ts - Report Page', () => {
  describe('Activities done by Staff', () => {
    //login as staff
    before(() => {
      cy.resetTestDataAndLoginAsStaff();
      cy.saveLocalStorage();
    });

    beforeEach(() => {
      cy.restoreLocalStorage();
    });

    describe('Equipment Activities', () => {
      it('should successfully add an equipment', () => {
        cy.visit('/equipment');
        cy.intercept('POST', '/api/v1/equipment').as('createEquipment');
        cy.intercept('GET', '/api/v1/equipment').as('getAllEquipment');

        cy.getBySel('add-equipment-btn').click();

        cy.getBySel('name-input').type('RJ45');
        cy.getBySel('type-select').select('Wire');
        cy.getBySel('brand-input').type('N/A');
        cy.getBySel('serial-input').type('GIOEMSKIQ');
        cy.getBySel('notes-input').type('Notes');

        cy.getBySel('add-submit-btn').click();

        //wait for create req
        cy.wait('@createEquipment');

        cy.getBySel('close-btn').click();

        cy.wait('@getAllEquipment');
      });
    });

    describe('Venue Activities', () => {
      it('should successfully add a venue', () => {
        cy.visit('/venues');
        cy.intercept('GET', '/api/v1/venue').as('getAllVenue');
        cy.intercept('POST', '/api/v1/venue').as('createVenue');

        cy.getBySel('add-venue-btn').click();

        cy.getBySel('name-input').type('Case Room');
        cy.getBySel('notes-input').type('No Food Allowed');

        cy.getBySel('add-submit-btn').click();

        //wait for create req
        cy.wait('@createVenue');

        cy.getBySel('close-btn').click();

        cy.wait('@getAllVenue');
      });

      it('should succssfully edit a venue', () => {
        cy.intercept('PUT', '/api/v1/venue/*').as('editVenue');

        cy.getBySel('actions-btn').first().click();
        cy.getBySel('actions-edit-btn').first().click();

        cy.getBySel('name-input').clear().type('TEMS_TEST_DATA - AVR');
        cy.getBySel('notes-input').clear().type('Max of 10 students only');

        cy.getBySel('edit-submit-btn').click();

        cy.wait('@editVenue');
      });
    });

    describe('Organizers Activities', () => {
      it('should successfully delete an organizer', () => {
        cy.visit('/organizers');
        cy.intercept('GET', '/api/v1/organizer').as('getAllOrganizers');
        cy.intercept('DELETE', '/api/v1/organizer/*').as('deleteOrganizer');

        cy.getBySel('actions-btn').first().click();
        cy.getBySel('actions-delete-btn').first().click();
        cy.getBySel('dialog-yes-btn').click();

        // wait for delete request
        cy.wait('@deleteOrganizer');

        // wait for refetch
        cy.wait('@getAllOrganizers').pause();
      });
    });

    describe('Staff Logout', () => {
      it('should successfully logout staff account', () => {
        cy.getBySel('profile-btn').click();
        cy.getBySel('logout-btn').click();
      });
    });
  });

  describe('Activities done by Admin', () => {
    //login as admin
    before(() => {
      cy.loginWithAdmin();
      cy.saveLocalStorage();
    });

    beforeEach(() => {
      cy.restoreLocalStorage();
    });

    it(
      'should receive notifications done by staff activities',
      { scrollBehavior: false },
      () => {
        cy.get('[aria-label="Open notifications"]').click();
        cy.get('[role="tab"]').contains('Today').click();
        cy.get('[role="tab"]').contains('Last week').click();
        cy.get('[role="tab"]').contains('Last month').click();
        cy.get('[aria-label="Open notifications"]').click();
      }
    );

    // it('should successfully delete an event', () => {
    //   cy.visit('/events');
    //   cy.intercept('GET', '/api/v1/event').as('getAllEvents');
    //   cy.intercept('DELETE', '/api/v1/event/*').as('deleteEvents');
    //   cy.wait('@getAllEvents');

    //   cy.get(
    //     '.fc-day-sat > .fc-timegrid-col-frame > :nth-child(2) > .fc-timegrid-event-harness > .fc-timegrid-event > .fc-event-main > .fc-event-main-frame > .fc-event-title-container > .fc-event-title'
    //   )
    //     .click()
    //     .wait(2000);
    //   cy.getBySel('delete-submit-btn').click().wait(2000);
    //   cy.getBySel('dialog-yes-btn').click().wait('@deleteEvents').wait(3000);
    // });

    it('should successfully edit an account', () => {
      cy.visit('/accounts');
      cy.intercept('GET', '/api/v1/user').as('getAllUsers');
      cy.intercept('PUT', '/api/v1/user/*').as('editUser');

      cy.getBySel('actions-btn').first().click();
      cy.getBySel('actions-edit-btn').click();
      cy.getBySel('admin-checkbox').click();
      cy.getBySel('name-input').clear().type('Sir Raol');
      cy.getBySel('edit-submit-btn').click();

      // wait for create request
      cy.wait('@editUser');
    });

    it('should successfully edit an announcement', () => {
      cy.visit('announcements');
      cy.intercept('GET', '/api/v1/announcement').as('getAllAnnouncement');
      cy.intercept('PUT', '/api/v1/announcement/*').as('editAnnouncement');

      cy.getBySel('actions-btn').first().click();
      cy.getBySel('actions-edit-btn').first().click();

      cy.getBySel('subtitle-input').clear().type('TEMS_TEST_DATA - SUBTITLE');
      cy.getBySel('content-input').clear().type('test content');
      cy.getBySel('information-checkbox').click();
      cy.getBySel('viewAccess-select').select('PUBLIC');

      cy.getBySel('edit-submit-btn').click();

      cy.wait('@editAnnouncement');
    });

    describe('Admin Logout', () => {
      it('should successfully logout admin account', () => {
        cy.getBySel('profile-btn').click();
        cy.getBySel('logout-btn').click();
      });
    });
  });

  describe('Check Notifications on Staff Account', () => {
    //login as staff
    before(() => {
      cy.loginWithStaff();
      cy.saveLocalStorage();
    });

    beforeEach(() => {
      cy.restoreLocalStorage();
    });

    it(
      'should receive notifications done by admin activities',
      { scrollBehavior: false },
      () => {
        cy.get('[aria-label="Open notifications"]').click();
        cy.get('[role="tab"]').contains('Today').click();
        cy.get('[role="tab"]').contains('Last week').click();
        cy.get('[role="tab"]').contains('Last month').click();
        cy.get('[role="tab"]').contains('All').click();

        cy.get('[data-index="4"]').click();
        cy.get('[aria-label="Open notifications"]').click();
        cy.get('[data-index="5"]').click();
        // cy.get('[aria-label="Open notifications"]').click().wait(3000);
        // cy.get('[data-index="6"]').click();

        cy.getBySel('profile-btn').click();
      }
    );
  });
});
