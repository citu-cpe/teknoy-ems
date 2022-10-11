import 'cypress-localstorage-commands';

describe('event.spec.ts - Event Page', () => {
  before(() => {
    cy.resetTestDataAndLoginAsAdmin();
    cy.saveLocalStorage();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();

    // cy.intercept('POST', '/api/v1/event').as('createEvents');
    // cy.intercept('PUT', '/api/v1/event/*').as('editEvents');
    // cy.intercept('DELETE', '/api/v1/event/*').as('deleteEvents');
  });

  describe('viewing various calendar views', () => {
    it('should show monthly view', () => {
      cy.visit('/events');
      cy.intercept('GET', '/api/v1/event').as('getAllEvents');
      cy.wait('@getAllEvents').wait(2000);

      cy.get('[aria-label="Enable Light mode"]').click().wait(2000);

      cy.contains('Month').click().wait(1500);
      //viewing prev and next months
      cy.get('[title="Previous month"]')
        .click()
        .wait(500)
        .get('[title="Previous month"]')
        .click()
        .wait(500)
        .get('[title="Next month"]')
        .click()
        .wait(500)
        .get('[title="This month"]')
        .click()
        .wait(1000);
    });

    it('should show weekly view', () => {
      cy.contains('Week').click().wait(1500);
      //viewing prev and next week
      cy.get('[title="Previous week"]')
        .click()
        .wait(500)
        .get('[title="Previous week"]')
        .click()
        .wait(500)
        .get('[title="Next week"]')
        .click()
        .wait(500)
        .get('[title="This week"]')
        .click()
        .wait(1000);
    });

    it('should show daily view', () => {
      cy.contains('Day').click().wait(1500);
      //viewing prev and next days
      cy.get('[title="Previous day"]')
        .click()
        .wait(500)
        .get('[title="Previous day"]')
        .click()
        .wait(500)
        .get('[title="Next day"]')
        .click()
        .wait(500)
        .get('[title="Today"]')
        .click()
        .wait(1000);
    });

    it('should show list view', () => {
      cy.contains('List').click().wait(1500);
      //viewing prev and next years
      cy.get('[title="Previous year"]')
        .click()
        .wait(500)
        .get('[title="Previous year"]')
        .click()
        .wait(500)
        .get('[title="Next year"]')
        .click()
        .wait(500)
        .get('[title="This year"]')
        .click()
        .wait(1000);
    });
  });

  describe('adding an event on a day without a reserved event', () => {
    it('should not add an event with missing fields', () => {
      cy.visit('/events');
      cy.intercept('GET', '/api/v1/event').as('getAllEvents');
      cy.wait('@getAllEvents').wait(2000);

      cy.get('[aria-label="Enable Light mode"]').click().wait(2000);

      cy.get('.fc-reserve-button').click().wait(1000);
      cy.getBySel('add-submit-btn').click().wait(2000);
      //bring scroll view to top
      cy.get(':nth-child(4) > .chakra-heading').click();
    });

    describe('adding an event with valid data', () => {
      //type
      it(
        'should successfully select any "TYPE" from dropdown list',
        { scrollBehavior: false },
        () => {
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
        }
      );

      // //start time and end time
      // //invalid start time
      it(
        'should show toast message when start time is after end time',
        { scrollBehavior: false },
        () => {
          cy.getBySel('start-time-input').type('2022-10-13T15:30').wait(2000);
          cy.getBySel('end-time-input').type('2022-10-13T13:30').wait(4000);
        }
      );
      //valid start time
      it(
        'should successfully input start and end time',
        { scrollBehavior: false },
        () => {
          cy.getBySel('start-time-input').type('2022-10-13T08:30').wait(2000);
          cy.getBySel('end-time-input').type('2022-10-13T13:30').wait(2000);
        }
      );

      //venue
      it(
        'should successfully show autocompleted options upon inputting or typing an existing venue',
        { scrollBehavior: false },
        () => {
          cy.get('#venueIds')
            .click()
            //showing autocomplete search box and selecting it
            .type('Gym')
            .wait(3000)
            .get('#react-select-5-listbox')
            .contains('TEMS_TEST_DATA - GYM')
            .click()
            .wait(2000);
        }
      );

      it(
        'should successfully select a venue by selecting options on the dropdown list',
        { scrollBehavior: false },
        () => {
          //directly selecting from dropdown list options
          cy.get('#react-select-5-listbox')
            .contains('TEMS_TEST_DATA - Covered Court')
            .click()
            .wait(2000);
        }
      );

      it(
        'should successfully remove a selected venue option',
        { scrollBehavior: false },
        () => {
          //removing selected option
          cy.get('[aria-label="Remove TEMS_TEST_DATA - GYM"]')
            .click()
            .wait(2000);
        }
      );

      it(
        'should successfully show "no options" message when inputting a non existing venue',
        { scrollBehavior: false },
        () => {
          //checking "no options" mssg when input is not in the options
          cy.get('#venueIds')
            .type('AVR')
            .wait(2000)
            //out of focus selection box click
            .get(':nth-child(4) > .chakra-heading')
            .click()
            .wait(4000);
        }
      );

      //equipment
      it(
        'should successfully show autocompleted options upon inputting or typing an existing equipment',
        { scrollBehavior: false },
        () => {
          cy.get('#equipmentIds')
            .click()
            //showing autocomplete search box and selecting it
            .type('sony')
            .get('#react-select-7-listbox')
            .contains('TEMS_TEST_DATA - SONY CAM 1')
            .click()
            .wait(2000);
        }
      );

      it(
        'should successfully remove a selected equipment option',
        { scrollBehavior: false },
        () => {
          //removing selected option
          cy.get('[aria-label="Remove TEMS_TEST_DATA - SONY CAM 1"]')
            .click()
            .wait(2000);
        }
      );

      it(
        'should successfully select an equipment by selecting options on the dropdown list',
        { scrollBehavior: false },
        () => {
          //directly selecting from dropdown list options
          cy.get('#react-select-7-listbox')
            .contains('TEMS_TEST_DATA - SONY CAM 1')
            .click()
            .wait(2000);
        }
      );

      it(
        'should successfully show "no options" message when inputting a non existing equipment',
        { scrollBehavior: false },
        () => {
          //checking "no options" mssg when input is not in the options
          cy.get('#equipmentIds')
            .type('DSLR')
            .wait(2000)
            //out of focus selection box click
            .get(':nth-child(4) > .chakra-heading')
            .click()
            .wait(4000);
        }
      );

      //title
      it('should successfully input title', { scrollBehavior: false }, () => {
        cy.getBySel('title-input').type('Microcontrollers Workshop').wait(1000);
      });

      //description
      it(
        'should successfully input description',
        { scrollBehavior: false },
        () => {
          cy.getBySel('description-input')
            .type(
              'A whole day workshop for CPE students who wish to learn microcontrollers'
            )
            .wait(2000);
        }
      );

      //view access
      it('should successfully select any "VIEW ACCESS" from dropdown list', () => {
        cy.getBySel('view-access-select')
          .select('Private')
          .wait(2000)
          .select('Public')
          .wait(4000);
      });

      // //organizer
      it(
        'should successfully show autocompleted options upon inputting or typing an existing organizer',
        { scrollBehavior: false },
        () => {
          //typing
          cy.get('#react-select-3-input')
            .click({ force: true })
            .type('Msdo')
            .wait(2000)
            .clear()
            .wait(1000)
            .type('supre')
            .wait(1000)
            .get('#react-select-3-listbox')
            .contains('TEMS_TEST_DATA - Supreme Student Government')
            .click()
            .wait(3000);
        }
      );

      it(
        'should successfully select an organizer by selecting options on the dropdown list',
        { scrollBehavior: false },
        () => {
          //directly selecting from dropdown list options
          cy.get('#react-select-3-input')
            .click()
            .get('#react-select-3-listbox')
            .contains('TEMS_TEST_DATA - MSDO')
            .click()
            .wait(4000);
        }
      );

      //contact person
      it(
        'should sucessfully input contact person',
        { scrollBehavior: false },
        () => {
          cy.getBySel('contact-person-input')
            .type('Allicent Lowtower')
            .wait(4000);
        }
      );

      //contact info
      it(
        'should successfully input contact number',
        { scrollBehavior: false },
        () => {
          cy.getBySel('contact-input')
            //number
            .type('09972649372')
            .wait(2000)
            .clear()
            //messenger
            .type('Allicent L')
            .wait(2000)
            .clear()
            //email
            .type('lowtower.a@cit.edu')
            .wait(4000);
        }
      );

      //status but with invalid input
      it(
        'should successfully select any "STATUS" from the dropdown list',
        { scrollBehavior: false },
        () => {
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
        }
      );

      //approved by
      it(
        'should sucessfully input approved by',
        { scrollBehavior: false },
        () => {
          cy.getBySel('approved-by-input').type('SAO').wait(4000);
        }
      );

      //additional notes
      it(
        'should successfully input additional notes',
        { scrollBehavior: false },
        () => {
          cy.getBySel('additional-notes-input')
            .type('Students must bring their own kits and mcu')
            .wait(2000);
        }
      );

      //submit invalid form
      it(
        'should not successfully create a new event',
        { scrollBehavior: false },
        () => {
          cy.getBySel('add-submit-btn').click().wait(4000);
        }
      );

      //re-select status
      it(
        'should successfully re-select the correct status',
        { scrollBehavior: false },
        () => {
          cy.getBySel('status-select').select('Pending').wait(3000);
        }
      );

      //clearing approved by field
      it(
        'should clear approved by field input',
        { scrollBehavior: false },
        () => {
          cy.getBySel('approved-by-input').clear().wait(3000);
        }
      );

      //re-submit correct form
      it(
        'should successfully create a new event',
        { scrollBehavior: false },
        () => {
          cy.intercept('POST', '/api/v1/event').as('createEvents');
          cy.getBySel('add-submit-btn')
            .click()
            .wait('@createEvents')
            .wait(7000)
            .getBySel('close-btn')
            .click()
            .wait(3000);
        }
      );
    });

    describe('should be able to view the newly created event', () => {
      it('should be able to view the event on weekly view', () => {
        cy.wait(3000);
        //viewing event on weekly calendar view
        cy.get(
          '.fc-day-thu > .fc-timegrid-col-frame > :nth-child(2) > .fc-timegrid-event-harness > .fc-timegrid-event > .fc-event-main > .fc-event-main-frame > .fc-event-time'
        )
          .click()
          .wait(1000);
        //for scrolling down
        cy.get('.css-1tx7y9u > .css-17xejub').click().wait(3000);
        cy.get('[aria-label="Close"]').click().wait(1000);
      });

      it('should be able to view the event on monthly view', () => {
        //viewing event on monthly calendar view
        cy.contains('Month').click().wait(1500);
        cy.get(
          '.fc-day-thu > .fc-daygrid-day-frame > .fc-daygrid-day-events > .fc-daygrid-event-harness > .fc-daygrid-event'
        )
          .contains('Microcontrollers Workshop')
          .click()
          .wait(1000);
        //for scrolling down
        cy.get('.css-1tx7y9u > .css-17xejub').click().wait(3000);
        cy.get('[aria-label="Close"]').click().wait(1000);
      });

      it('should be able to view the event on daily view', () => {
        cy.contains('Day').click().wait(1500);
        //viewing oct 13
        cy.get('[title="Next day"]')
          .click()
          .wait(500)
          .get('[title="Next day"]')
          .click()
          .wait(500)
          //viewing event
          .get('.fc-event-title-container')
          .contains('Microcontrollers Workshop')
          .click()
          .wait(1000);
        //for scrolling down
        cy.get('.css-1tx7y9u > .css-17xejub').click().wait(3000);
        cy.get('[aria-label="Close"]').click().wait(1000);
      });

      it('should be able to view the event on list view', () => {
        cy.contains('List').click().wait(1500);
        cy.get(':nth-child(2) > .fc-list-event-title').click().wait(3000);
        //for scrolling down
        cy.get('.css-1tx7y9u > .css-17xejub').click().wait(3000);
        cy.get('[aria-label="Close"]').click().wait(1000);
      });
    });
  });

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
  describe('adding an event on a day with a reserved event with a conflict in venue/equipment', () => {
    describe('adding an event with valid data', () => {
      //type
      it(
        'should successfully select any "TYPE" from dropdown list',
        { scrollBehavior: false },
        () => {
          cy.get('.fc-reserve-button').click().wait(1000);

          cy.getBySel('type-select')
            .select(1)
            .select(2)
            .select(3)
            .select(4)
            .select(5)
            .select(6)
            .select('Sports')
            .wait(3000);
        }
      );

      // //start time and end time
      // //invalid start time
      it(
        'should show toast message when start time is after end time',
        { scrollBehavior: false },
        () => {
          cy.getBySel('start-time-input').type('2022-10-13T15:30').wait(2000);
          cy.getBySel('end-time-input').type('2022-10-13T13:30').wait(4000);
        }
      );
      //valid start time
      it(
        'should successfully input start and end time',
        { scrollBehavior: false },
        () => {
          cy.getBySel('start-time-input').type('2022-10-13T10:30').wait(3000);
          cy.getBySel('end-time-input').type('2022-10-13T15:00').wait(8000);
        }
      );

      //venue
      it(
        'should successfully show autocompleted options upon inputting or typing an existing venue',
        { scrollBehavior: false },
        () => {
          cy.get('#venueIds')
            .click()
            .wait(8000)
            //showing autocomplete search box and selecting it
            .type('Gym')
            .wait(3000)
            .get('#react-select-11-listbox')
            .contains('TEMS_TEST_DATA - GYM')
            .click()
            .wait(2000);
        }
      );

      it(
        'should successfully remove a selected venue option',
        { scrollBehavior: false },
        () => {
          //removing selected option
          cy.get('[aria-label="Remove TEMS_TEST_DATA - GYM"]')
            .click()
            .wait(2000);
        }
      );

      it(
        'should successfully select a venue by selecting options on the dropdown list',
        { scrollBehavior: false },
        () => {
          //directly selecting from dropdown list options
          cy.get('#react-select-11-listbox')
            .contains('TEMS_TEST_DATA - GYM')
            .click()
            .wait(2000);
        }
      );

      it(
        'should successfully show "no options" message when inputting a non existing venue',
        { scrollBehavior: false },
        () => {
          //checking "no options" mssg when input is not in the options
          cy.get('#venueIds')
            .type('Table Tennis Room')
            .wait(2000)
            //out of focus selection box click
            .get(':nth-child(4) > .chakra-heading')
            .click()
            .wait(4000);
        }
      );

      //equipment
      it(
        'should successfully show autocompleted options upon inputting or typing an existing equipment',
        { scrollBehavior: false },
        () => {
          cy.get('#equipmentIds')
            .click()
            //showing autocomplete search box and selecting it
            .type('sony')
            .wait(2000)
            //out of focus selection box click
            .get(':nth-child(4) > .chakra-heading')
            .click()
            .wait(8000);
        }
      );

      //title
      it('should successfully input title', { scrollBehavior: false }, () => {
        cy.getBySel('title-input').type('Wildcats Sports Fest').wait(1000);
      });

      //description
      it(
        'should successfully input description',
        { scrollBehavior: false },
        () => {
          cy.getBySel('description-input')
            .type(
              'Inviting all athletes and sports enthusiasts to join the first ever sports fest'
            )
            .wait(2000);
        }
      );

      // view access
      it('should successfully select any "VIEW ACCESS" from dropdown list', () => {
        cy.getBySel('view-access-select')
          .select('Private')
          .wait(1000)
          .select('Public')
          .wait(3000);
      });

      //organizer
      it(
        'should successfully show autocompleted options upon inputting or typing an existing organizer',
        { scrollBehavior: false },
        () => {
          //typing
          cy.get('#react-select-9-input')
            .click({ force: true })
            .type('supreme')
            .wait(2000)
            .clear()
            .wait(1000)
            .type('msd')
            .wait(1000)
            .get('#react-select-9-listbox')
            .contains('TEMS_TEST_DATA - MSDO')
            .click()
            .wait(3000);
        }
      );

      it(
        'should successfully select an organizer by selecting options on the dropdown list',
        { scrollBehavior: false },
        () => {
          //directly selecting from dropdown list options
          cy.get('#react-select-9-input')
            .click()
            .get('#react-select-9-listbox')
            .contains('TEMS_TEST_DATA - Supreme Student Government')
            .click()
            .wait(4000);
        }
      );

      //contact person
      it(
        'should sucessfully input contact person',
        { scrollBehavior: false },
        () => {
          cy.getBySel('contact-person-input')
            .type('Rhaenyra Targaryarn')
            .wait(3000);
        }
      );

      //contact info
      it(
        'should successfully input contact number',
        { scrollBehavior: false },
        () => {
          cy.getBySel('contact-input')
            //number
            .type('09763728164')
            .wait(2000)
            .clear()
            //messenger
            .type('Princess Rhaenyra')
            .wait(2000)
            .clear()
            //email
            .type('targs.rhaenyra@cit.edu')
            .wait(4000);
        }
      );

      //status but with invalid input
      it(
        'should successfully select any "STATUS" from the dropdown list',
        { scrollBehavior: false },
        () => {
          cy.getBySel('status-select')
            .select(1)
            .select(2)
            .select(3)
            .select(4)
            .select(5)
            .select('Pending')
            .wait(4000);
        }
      );

      //submit form
      it(
        'should successfully create another new event',
        { scrollBehavior: false },
        () => {
          cy.intercept('POST', '/api/v1/event').as('createEvents');
          cy.getBySel('add-submit-btn')
            .click()
            .wait('@createEvents')
            .wait(7000)
            .getBySel('close-btn')
            .click()
            .wait(3000);
        }
      );

      describe('should be able to view the newly created event', () => {
        it('should be able to view the event on weekly view', () => {
          cy.wait(3000);
          //viewing event on weekly calendar view
          cy.get(
            '[style="inset: 225px 0% -450px 50%; z-index: 2;"] > .fc-timegrid-event > .fc-event-main > .fc-event-main-frame > .fc-event-title-container'
          )
            .contains('Wildcats Sports Fest')
            .click()
            .wait(1000);
          //for scrolling down
          cy.get('.css-1tx7y9u > .css-17xejub').click().wait(3000);
          cy.get('[aria-label="Close"]').click().wait(1000);
        });

        it('should be able to view the event on monthly view', () => {
          //viewing event on monthly calendar view
          cy.contains('Month').click().wait(1500);
          cy.get(':nth-child(2) > .fc-daygrid-event > .fc-event-title')
            .contains('Wildcats Sports Fest')
            .click()
            .wait(1000);
          //for scrolling down
          cy.get('.css-1tx7y9u > .css-17xejub').click().wait(3000);
          cy.get('[aria-label="Close"]').click().wait(1000);
        });

        it('should be able to view the event on daily view', () => {
          cy.contains('Day').click().wait(1500);
          //viewing oct 13
          cy.get('[title="Next day"]')
            .click()
            .wait(500)
            .get('[title="Next day"]')
            .click()
            .wait(500)
            //viewing event
            .get(
              '[style="inset: 225px 0% -450px 50%; z-index: 2;"] > .fc-timegrid-event > .fc-event-main > .fc-event-main-frame > .fc-event-title-container'
            )
            .contains('Wildcats Sports Fest')
            .click()
            .wait(1000);
          //for scrolling down
          cy.get('.css-1tx7y9u > .css-17xejub').click().wait(3000);
          cy.get('[aria-label="Close"]').click().wait(1000);
        });

        it('should be able to view the event on list view', () => {
          cy.contains('List').click().wait(1500);
          cy.get(':nth-child(3) > .fc-list-event-title').click().wait(3000);
          //for scrolling down
          cy.get('.css-1tx7y9u > .css-17xejub').click().wait(3000);
          cy.get('[aria-label="Close"]').click().wait(1000);
        });
      });
    });
  });

  //////////////////////////////////////////////////////////////////////////////////////////////////
  describe('adding an event on a day with a reserved event without a conflict in venue/equipment', () => {
    describe('adding an event with valid data', () => {
      //type
      it(
        'should successfully select any "TYPE" from dropdown list',
        { scrollBehavior: false },
        () => {
          cy.get('.fc-reserve-button').click().wait(1000);

          cy.getBySel('type-select')
            .select(1)
            .select(2)
            .select(3)
            .select(4)
            .select(5)
            .select(6)
            .select(7)
            .select('Seminar')
            .wait(4000);
        }
      );

      // //start time and end time
      // //invalid start time
      it(
        'should show toast message when start time is after end time',
        { scrollBehavior: false },
        () => {
          cy.getBySel('start-time-input').type('2022-10-13T15:30').wait(2000);
          cy.getBySel('end-time-input').type('2022-10-13T13:30').wait(4000);
        }
      );
      //valid start time
      it(
        'should successfully input start and end time',
        { scrollBehavior: false },
        () => {
          cy.getBySel('start-time-input').type('2022-10-13T16:00').wait(4000);
          cy.getBySel('end-time-input').type('2022-10-13T18:00').wait(4000);
        }
      );

      //venue
      it(
        'should successfully show autocompleted options upon inputting or typing an existing venue',
        { scrollBehavior: false },
        () => {
          cy.get('#venueIds')
            .click()
            //showing autocomplete search box and selecting it
            .type('Gym')
            .wait(3000)
            .get('#react-select-17-listbox')
            .contains('TEMS_TEST_DATA - GYM')
            .click()
            .wait(2000);
        }
      );

      it(
        'should successfully select a venue by selecting options on the dropdown list',
        { scrollBehavior: false },
        () => {
          //directly selecting from dropdown list options
          cy.get('#react-select-17-listbox')
            .contains('TEMS_TEST_DATA - Covered Court')
            .click()
            .wait(2000);
        }
      );

      it(
        'should successfully remove a selected venue option',
        { scrollBehavior: false },
        () => {
          //removing selected option
          cy.get('[aria-label="Remove TEMS_TEST_DATA - GYM"]')
            .click()
            .wait(2000);
        }
      );

      it(
        'should successfully show "no options" message when inputting a non existing venue',
        { scrollBehavior: false },
        () => {
          //checking "no options" mssg when input is not in the options
          cy.get('#venueIds')
            .type('Case Room')
            .wait(2000)
            //out of focus selection box click
            .get(':nth-child(4) > .chakra-heading')
            .click()
            .wait(4000);
        }
      );

      //equipment
      it(
        'should successfully show autocompleted options upon inputting or typing an existing equipment',
        { scrollBehavior: false },
        () => {
          cy.get('#equipmentIds')
            .click()
            //showing autocomplete search box and selecting it
            .type('sony')
            .get('#react-select-19-listbox')
            .contains('TEMS_TEST_DATA - SONY CAM 1')
            .click()
            .wait(2000);
        }
      );

      it(
        'should successfully remove a selected equipment option',
        { scrollBehavior: false },
        () => {
          //removing selected option
          cy.get('[aria-label="Remove TEMS_TEST_DATA - SONY CAM 1"]')
            .click()
            .wait(2000);
        }
      );

      it(
        'should successfully select an equipment by selecting options on the dropdown list',
        { scrollBehavior: false },
        () => {
          //directly selecting from dropdown list options
          cy.get('#react-select-19-listbox')
            .contains('TEMS_TEST_DATA - SONY CAM 1')
            .click()
            .wait(2000);
        }
      );

      it(
        'should successfully show "no options" message when inputting a non existing equipment',
        { scrollBehavior: false },
        () => {
          //checking "no options" mssg when input is not in the options
          cy.get('#equipmentIds')
            .type('JBL')
            .wait(2000)
            //out of focus selection box click
            .get(':nth-child(4) > .chakra-heading') //out of focus selection box click
            .click()
            .wait(2000);
        }
      );

      //title
      it('should successfully input title', { scrollBehavior: false }, () => {
        cy.getBySel('title-input').type('Classroom Ethics').wait(1000);
      });

      //description
      it(
        'should successfully input description',
        { scrollBehavior: false },
        () => {
          cy.getBySel('description-input')
            .type('A seminar for college teachers only')
            .wait(1000);
        }
      );

      // view access
      it('should successfully select any "VIEW ACCESS" from dropdown list', () => {
        cy.getBySel('view-access-select').select('Private').wait(1000);
      });

      //organizer
      it(
        'should successfully show autocompleted options upon inputting or typing an existing organizer',
        { scrollBehavior: false },
        () => {
          //typing
          cy.get('#react-select-15-input')
            .click({ force: true })
            .type('Msdo')
            .wait(2000)
            .clear()
            .wait(1000)
            .type('supre')
            .wait(1000)
            .get('#react-select-15-listbox')
            .contains('TEMS_TEST_DATA - Supreme Student Government')
            .click()
            .wait(2000);
        }
      );

      it(
        'should successfully select an organizer by selecting options on the dropdown list',
        { scrollBehavior: false },
        () => {
          //directly selecting from dropdown list options
          cy.get('#react-select-15-input')
            .click()
            .get('#react-select-15-listbox')
            .contains('TEMS_TEST_DATA - MSDO')
            .click()
            .wait(2000);
        }
      );

      //contact person
      it(
        'should sucessfully input contact person',
        { scrollBehavior: false },
        () => {
          cy.getBySel('contact-person-input').type('Daemond Yarn').wait(2000);
        }
      );

      //contact info
      it(
        'should successfully input contact number',
        { scrollBehavior: false },
        () => {
          cy.getBySel('contact-input')
            //number
            .type('09092735172')
            .wait(2000)
            .clear()
            //messenger
            .type('Yarn Daemond')
            .wait(2000)
            .clear()
            //email
            .type('daemon.yarn@cit.edu')
            .wait(2000);
        }
      );

      //status but with invalid input
      it(
        'should successfully select any "STATUS" from the dropdown list',
        { scrollBehavior: false },
        () => {
          cy.getBySel('status-select')
            .select(1)
            .select(2)
            .select(3)
            .select(4)
            .select(5)
            .select('Pending')
            .wait(2000);
        }
      );

      //additional notes
      it(
        'should successfully input additional notes',
        { scrollBehavior: false },
        () => {
          cy.getBySel('additional-notes-input')
            .type('Bring your own snacks')
            .wait(2000);
        }
      );

      //submit valid form
      it(
        'should successfully create a new event',
        { scrollBehavior: false },
        () => {
          cy.intercept('POST', '/api/v1/event').as('createEvents');
          cy.getBySel('add-submit-btn')
            .click()
            .wait('@createEvents')
            .wait(7000)
            .getBySel('close-btn')
            .click()
            .wait(3000);
        }
      );
    });

    describe('should be able to view the newly created event', () => {
      it('should be able to view the event on weekly view', () => {
        cy.wait(3000);
        //viewing event on weekly calendar view
        cy.get(
          '[style="inset: 500px 0% -600px; z-index: 1;"] > .fc-timegrid-event > .fc-event-main > .fc-event-main-frame > .fc-event-title-container'
        )
          .click()
          .wait(1000);
        //for scrolling down
        cy.get('.css-1tx7y9u > .css-17xejub').click().wait(3000);
        cy.get('[aria-label="Close"]').click().wait(1000);
      });

      it('should be able to view the event on monthly view', () => {
        //viewing event on monthly calendar view
        cy.contains('Month').click().wait(1500);
        cy.get(
          '.fc-day-thu > .fc-daygrid-day-frame > .fc-daygrid-day-events > .fc-daygrid-event-harness > .fc-daygrid-event'
        )
          .contains('Classroom Ethics')
          .click()
          .wait(1000);
        //for scrolling down
        cy.get('.css-1tx7y9u > .css-17xejub').click().wait(3000);
        cy.get('[aria-label="Close"]').click().wait(1000);
      });

      it('should be able to view the event on daily view', () => {
        cy.contains('Day').click().wait(1500);
        //viewing nov
        cy.get('[title="Next day"]')
          .click()
          .get('[title="Next day"]')
          .click()
          //viewing event
          .get('.fc-event-title-container')
          .contains('Classroom Ethics')
          .click()
          .wait(1000);
        //for scrolling down
        cy.get('.css-1tx7y9u > .css-17xejub').click().wait(3000);
        cy.get('[aria-label="Close"]').click().wait(1000);
      });

      it('should be able to view the event on list view', () => {
        cy.contains('List').click().wait(1500);
        cy.get(':nth-child(4) > .fc-list-event-title').click().wait(3000);
        //for scrolling down
        cy.get('.css-1tx7y9u > .css-17xejub').click().wait(3000);
        cy.get('[aria-label="Close"]').click().wait(1000);
      });
    });
  });

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
  describe('updating an event', () => {
    it('should should not successfully update an event with missing data', () => {
      //updating microcontrollers workshop event
      cy.contains('List').click().wait(1500);
      cy.get(':nth-child(2) > .fc-list-event-title').click().wait(3000);
      //for scrolling down
      cy.get('.css-1tx7y9u > .css-17xejub').click().wait(3000);
      //clicking update button
      cy.getBySel('update-submit-btn').click().wait(3000);

      //clearing contact person
      cy.getBySel('contact-person-input').clear().wait(3000);
      //submiting update form
      cy.getBySel('add-submit-btn').click().wait(3000);
    });

    describe('updating an event with valid data', () => {
      it('should successfully update start and end time', () => {
        cy.getBySel('start-time-input').type('2022-10-14T13:00').wait(4000);
        cy.getBySel('end-time-input').type('2022-10-14T15:00').wait(4000);
      });
      it('should successfully input a contact person', () => {
        cy.getBySel('contact-person-input').type('Aemond Towers').wait(3000);
      });
      it('should successfully update email', () => {
        cy.getBySel('contact-input')
          .clear()
          .wait(2000)
          .type('towers.a@cit.edu')
          .wait(3000);
      });
      it('should successfully update status', () => {
        cy.getBySel('status-select').select('Reserved').wait(3000);
      });
      it('should successfully update approved by', () => {
        cy.getBySel('approved-by-input').type('SAO').wait(3000);
      });
      it('should successfully update an event', () => {
        cy.intercept('PUT', '/api/v1/event/*').as('updateEvents');

        cy.getBySel('add-submit-btn').click().wait('@updateEvents').wait(7000);
      });

      describe('should be able to view the updated event', () => {
        it('should be able to view the event on weekly view', () => {
          cy.contains('Week').click().wait(1500);
          //viewing event on weekly calendar view
          cy.get(
            '.fc-day-fri > .fc-timegrid-col-frame > :nth-child(2) > .fc-timegrid-event-harness > .fc-timegrid-event > .fc-event-main > .fc-event-main-frame > .fc-event-title-container'
          )
            .click()
            .wait(1000);
          //for scrolling down
          cy.get('.css-1tx7y9u > .css-17xejub').click().wait(3000);
          cy.get('[aria-label="Close"]').click().wait(1000);
        });

        it('should be able to view the event on monthly view', () => {
          //viewing event on monthly calendar view
          cy.contains('Month').click().wait(1500);
          cy.get(
            '.fc-day-fri > .fc-daygrid-day-frame > .fc-daygrid-day-events > .fc-daygrid-event-harness > .fc-daygrid-event'
          )
            .contains('Microcontrollers Workshop')
            .click()
            .wait(1000);
          //for scrolling down
          cy.get('.css-1tx7y9u > .css-17xejub').click().wait(3000);
          cy.get('[aria-label="Close"]').click().wait(1000);
        });

        it('should be able to view the event on daily view', () => {
          cy.contains('Day').click().wait(1500);
          //viewing oct 14
          cy.get('[title="Next day"]')
            .click()
            .wait(500)
            .get('[title="Next day"]')
            .click()
            .wait(500)
            .get('[title="Next day"]')
            .click()
            .wait(500)
            //viewing event
            .get('.fc-event-title-container')
            .contains('Microcontrollers Workshop')
            .click()
            .wait(1000);
          //for scrolling down
          cy.get('.css-1tx7y9u > .css-17xejub').click().wait(3000);
          cy.get('[aria-label="Close"]').click().wait(1000);
        });

        it('should be able to view the event on list view', () => {
          cy.contains('List').click().wait(1500);
          cy.get(':nth-child(5) > .fc-list-event-title').click().wait(3000);
          //for scrolling down
          cy.get('.css-1tx7y9u > .css-17xejub').click().wait(3000);
          cy.get('[aria-label="Close"]').click().wait(1000);
        });
      });
    });
  });

  describe('deleting an event', () => {
    it('should not delete an event when "no" button is clicked', () => {
      cy.contains('Month').click().wait(1500);
      cy.get(
        '.fc-day-thu > .fc-daygrid-day-frame > .fc-daygrid-day-events > .fc-daygrid-event-harness > .fc-daygrid-event'
      )
        .contains('Classroom Ethics')
        .click()
        .wait(1000);
      //for scrolling down
      cy.get('.css-1tx7y9u > .css-17xejub').click().wait(3000);
      cy.getBySel('delete-submit-btn').click().wait(1000);
      cy.getBySel('dialog-no-btn').click().wait(3000);

      //should be implemented when no btn is not yet fixed

      // cy.get('.chakra-modal__close-btn').click().wait(1000);
      // cy.get(
      //   '.fc-day-thu > .fc-daygrid-day-frame > .fc-daygrid-day-events > .fc-daygrid-event-harness > .fc-daygrid-event'
      // )
      //   .contains('Classroom Ethics')
      //   .click()
      //   .wait(1000);
      // //for scrolling down
      // cy.get('.css-1tx7y9u > .css-17xejub').click().wait(3000);
    });

    it('should successfully delete an event when "yes" button is clicked', () => {
      cy.intercept('DELETE', '/api/v1/event/*').as('deleteEvents');

      cy.getBySel('delete-submit-btn').click().wait(1000);
      cy.getBySel('dialog-yes-btn').click().wait('@deleteEvents').wait(3000);
    });

    describe('deleted event should not be found in various calendar views anymore', () => {
      it('should not be found in weekly view', () => {
        cy.wait(4000);
      });
      it('should not be found in monthly view', () => {
        cy.contains('Month').click().wait(4000);
      });
      it('should not be found in daily view', () => {
        cy.contains('Day').click().wait(2000);
        //viewing oct 13
        cy.get('[title="Next day"]').click().wait(4000);
        cy.get('[title="Next day"]').click().wait(4000);
      });
      it('should not be found in list view', () => {
        cy.contains('List').click().wait(4000);
      });
    });
  });
});
