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
      cy.wait('@getAllEvents');

      cy.get('[aria-label="Enable Light mode"]').click();

      cy.contains('Month').click();
      //viewing prev and next months
      cy.get('[title="Previous month"]')
        .click()
        .get('[title="Previous month"]')
        .click()
        .get('[title="Next month"]')
        .click()
        .get('[title="This month"]')
        .click();
    });

    it('should show weekly view', () => {
      cy.contains('Week').click();
      //viewing prev and next week
      cy.get('[title="Previous week"]')
        .click()
        .get('[title="Previous week"]')
        .click()
        .get('[title="Next week"]')
        .click()
        .get('[title="This week"]')
        .click();
    });

    it('should show daily view', () => {
      cy.contains('Day').click();
      //viewing prev and next days
      cy.get('[title="Previous day"]')
        .click()
        .get('[title="Previous day"]')
        .click()
        .get('[title="Next day"]')
        .click()
        .get('[title="Today"]')
        .click();
    });

    it('should show list view', () => {
      cy.contains('List').click();
      //viewing prev and next years
      cy.get('[title="Previous year"]')
        .click()
        .get('[title="Previous year"]')
        .click()
        .get('[title="Next year"]')
        .click()
        .get('[title="This year"]')
        .click();
    });
  });

  describe('adding an event on a day without a reserved event', () => {
    it('should not add an event with missing fields', () => {
      cy.visit('/events');
      cy.intercept('GET', '/api/v1/event').as('getAllEvents');
      cy.wait('@getAllEvents');

      cy.get('[aria-label="Enable Light mode"]').click();

      cy.get('.fc-reserve-button').click();
      cy.getBySel('add-submit-btn').click();
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
            .select(2)
            .select(3)
            .select(4)
            .select(5)
            .select(6)
            .select(7)
            .select('Academic');
        }
      );

      // //start time and end time
      // //invalid start time
      it(
        'should show toast message when start time is after end time',
        { scrollBehavior: false },
        () => {
          cy.getBySel('start-time-input').type('2022-10-13T15:30');
          cy.getBySel('end-time-input').type('2022-10-13T13:30');
        }
      );
      //valid start time
      it(
        'should successfully input start and end time',
        { scrollBehavior: false },
        () => {
          cy.getBySel('start-time-input').type('2022-10-13T08:30');
          cy.getBySel('end-time-input').type('2022-10-13T13:30');
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
            .get('#react-select-5-listbox')
            .contains('TEMS_TEST_DATA - GYM')
            .click();
        }
      );

      it(
        'should successfully select a venue by selecting options on the dropdown list',
        { scrollBehavior: false },
        () => {
          //directly selecting from dropdown list options
          cy.get('#react-select-5-listbox')
            .contains('TEMS_TEST_DATA - Covered Court')
            .click();
        }
      );

      it(
        'should successfully remove a selected venue option',
        { scrollBehavior: false },
        () => {
          //removing selected option
          cy.get('[aria-label="Remove TEMS_TEST_DATA - GYM"]').click();
        }
      );

      it(
        'should successfully show "no options" message when inputting a non existing venue',
        { scrollBehavior: false },
        () => {
          //checking "no options" mssg when input is not in the options
          cy.get('#venueIds')
            .type('AVR')
            //out of focus selection box click
            .get(':nth-child(4) > .chakra-heading')
            .click();
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
            .click();
        }
      );

      it(
        'should successfully remove a selected equipment option',
        { scrollBehavior: false },
        () => {
          //removing selected option
          cy.get('[aria-label="Remove TEMS_TEST_DATA - SONY CAM 1"]').click();
        }
      );

      it(
        'should successfully select an equipment by selecting options on the dropdown list',
        { scrollBehavior: false },
        () => {
          //directly selecting from dropdown list options
          cy.get('#react-select-7-listbox')
            .contains('TEMS_TEST_DATA - SONY CAM 1')
            .click();
        }
      );

      it(
        'should successfully show "no options" message when inputting a non existing equipment',
        { scrollBehavior: false },
        () => {
          //checking "no options" mssg when input is not in the options
          cy.get('#equipmentIds')
            .type('DSLR')
            //out of focus selection box click
            .get(':nth-child(4) > .chakra-heading')
            .click();
        }
      );

      //title
      it('should successfully input title', { scrollBehavior: false }, () => {
        cy.getBySel('title-input').type('Microcontrollers Workshop');
      });

      //description
      it(
        'should successfully input description',
        { scrollBehavior: false },
        () => {
          cy.getBySel('description-input').type(
            'A whole day workshop for CPE students who wish to learn microcontrollers'
          );
        }
      );

      //view access
      it('should successfully select any "VIEW ACCESS" from dropdown list', () => {
        cy.getBySel('view-access-select').select('Private').select('Public');
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
            .clear()
            .type('supre')
            .get('#react-select-3-listbox')
            .contains('TEMS_TEST_DATA - Supreme Student Government')
            .click();
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
            .click();
        }
      );

      //contact person
      it(
        'should sucessfully input contact person',
        { scrollBehavior: false },
        () => {
          cy.getBySel('contact-person-input').type('Allicent Lowtower');
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
            .clear()
            //messenger
            .type('Allicent L')
            .clear()
            //email
            .type('lowtower.a@cit.edu');
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
            .select('Reserved');
        }
      );

      //approved by
      it(
        'should sucessfully input approved by',
        { scrollBehavior: false },
        () => {
          cy.getBySel('approved-by-input').type('SAO');
        }
      );

      //additional notes
      it(
        'should successfully input additional notes',
        { scrollBehavior: false },
        () => {
          cy.getBySel('additional-notes-input').type(
            'Students must bring their own kits and mcu'
          );
        }
      );

      //submit invalid form
      it(
        'should not successfully create a new event',
        { scrollBehavior: false },
        () => {
          cy.getBySel('add-submit-btn').click();
        }
      );

      //re-select status
      it(
        'should successfully re-select the correct status',
        { scrollBehavior: false },
        () => {
          cy.getBySel('status-select').select('Pending');
        }
      );

      //clearing approved by field
      it(
        'should clear approved by field input',
        { scrollBehavior: false },
        () => {
          cy.getBySel('approved-by-input').clear();
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
            .getBySel('close-btn')
            .click();
        }
      );
    });

    describe('should be able to view the newly created event', () => {
      it('should be able to view the event on weekly view', () => {
        //viewing event on weekly calendar view
        cy.get(
          '.fc-day-thu > .fc-timegrid-col-frame > :nth-child(2) > .fc-timegrid-event-harness > .fc-timegrid-event > .fc-event-main > .fc-event-main-frame > .fc-event-time'
        ).click();
        //for scrolling down
        cy.get('.css-1tx7y9u > .css-17xejub').click();
        cy.get('[aria-label="Close"]').click();
      });

      it('should be able to view the event on monthly view', () => {
        //viewing event on monthly calendar view
        cy.contains('Month').click();
        cy.get(
          '.fc-day-thu > .fc-daygrid-day-frame > .fc-daygrid-day-events > .fc-daygrid-event-harness > .fc-daygrid-event'
        )
          .contains('Microcontrollers Workshop')
          .click();
        //for scrolling down
        cy.get('.css-1tx7y9u > .css-17xejub').click();
        cy.get('[aria-label="Close"]').click();
      });

      it('should be able to view the event on daily view', () => {
        cy.contains('Day').click();
        //viewing oct 13
        cy.get('[title="Next day"]')
          .click()
          .get('[title="Next day"]')
          .click()
          //viewing event
          .get('.fc-event-title-container')
          .contains('Microcontrollers Workshop')
          .click();
        //for scrolling down
        cy.get('.css-1tx7y9u > .css-17xejub').click();
        cy.get('[aria-label="Close"]').click();
      });

      it('should be able to view the event on list view', () => {
        cy.contains('List').click();
        cy.get(':nth-child(2) > .fc-list-event-title').click();
        //for scrolling down
        cy.get('.css-1tx7y9u > .css-17xejub').click();
        cy.get('[aria-label="Close"]').click();
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
          cy.get('.fc-reserve-button').click();

          cy.getBySel('type-select')
            .select(1)
            .select(2)
            .select(3)
            .select(4)
            .select(5)
            .select(6)
            .select('Sports');
        }
      );

      // //start time and end time
      // //invalid start time
      it(
        'should show toast message when start time is after end time',
        { scrollBehavior: false },
        () => {
          cy.getBySel('start-time-input').type('2022-10-13T15:30');
          cy.getBySel('end-time-input').type('2022-10-13T13:30');
        }
      );
      //valid start time
      it(
        'should successfully input start and end time',
        { scrollBehavior: false },
        () => {
          cy.getBySel('start-time-input').type('2022-10-13T10:30');
          cy.getBySel('end-time-input').type('2022-10-13T15:00');
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
            .get('#react-select-11-listbox')
            .contains('TEMS_TEST_DATA - GYM')
            .click();
        }
      );

      it(
        'should successfully remove a selected venue option',
        { scrollBehavior: false },
        () => {
          //removing selected option
          cy.get('[aria-label="Remove TEMS_TEST_DATA - GYM"]').click();
        }
      );

      it(
        'should successfully select a venue by selecting options on the dropdown list',
        { scrollBehavior: false },
        () => {
          //directly selecting from dropdown list options
          cy.get('#react-select-11-listbox')
            .contains('TEMS_TEST_DATA - GYM')
            .click();
        }
      );

      it(
        'should successfully show "no options" message when inputting a non existing venue',
        { scrollBehavior: false },
        () => {
          //checking "no options" mssg when input is not in the options
          cy.get('#venueIds')
            .type('Table Tennis Room')
            //out of focus selection box click
            .get(':nth-child(4) > .chakra-heading')
            .click();
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
            //out of focus selection box click
            .get(':nth-child(4) > .chakra-heading')
            .click();
        }
      );

      //title
      it('should successfully input title', { scrollBehavior: false }, () => {
        cy.getBySel('title-input').type('Wildcats Sports Fest');
      });

      //description
      it(
        'should successfully input description',
        { scrollBehavior: false },
        () => {
          cy.getBySel('description-input').type(
            'Inviting all athletes and sports enthusiasts to join the first ever sports fest'
          );
        }
      );

      // view access
      it('should successfully select any "VIEW ACCESS" from dropdown list', () => {
        cy.getBySel('view-access-select').select('Private').select('Public');
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
            .clear()
            .type('msd')
            .get('#react-select-9-listbox')
            .contains('TEMS_TEST_DATA - MSDO')
            .click();
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
            .click();
        }
      );

      //contact person
      it(
        'should sucessfully input contact person',
        { scrollBehavior: false },
        () => {
          cy.getBySel('contact-person-input').type('Rhaenyra Targaryarn');
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
            .clear()
            //messenger
            .type('Princess Rhaenyra')
            .clear()
            //email
            .type('targs.rhaenyra@cit.edu');
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
            .select('Pending');
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
            .getBySel('close-btn')
            .click();
        }
      );

      describe('should be able to view the newly created event', () => {
        it('should be able to view the event on weekly view', () => {
          //viewing event on weekly calendar view
          cy.get(
            '[style="inset: 225px 0% -450px 50%; z-index: 2;"] > .fc-timegrid-event > .fc-event-main > .fc-event-main-frame > .fc-event-title-container'
          )
            .contains('Wildcats Sports Fest')
            .click();
          //for scrolling down
          cy.get('.css-1tx7y9u > .css-17xejub').click();
          cy.get('[aria-label="Close"]').click();
        });

        it('should be able to view the event on monthly view', () => {
          //viewing event on monthly calendar view
          cy.contains('Month').click();
          cy.get(':nth-child(2) > .fc-daygrid-event > .fc-event-title')
            .contains('Wildcats Sports Fest')
            .click();
          //for scrolling down
          cy.get('.css-1tx7y9u > .css-17xejub').click();
          cy.get('[aria-label="Close"]').click();
        });

        it('should be able to view the event on daily view', () => {
          cy.contains('Day').click();
          //viewing oct 13
          cy.get('[title="Next day"]')
            .click()
            .get('[title="Next day"]')
            .click()
            //viewing event
            .get(
              '[style="inset: 225px 0% -450px 50%; z-index: 2;"] > .fc-timegrid-event > .fc-event-main > .fc-event-main-frame > .fc-event-title-container'
            )
            .contains('Wildcats Sports Fest')
            .click();
          //for scrolling down
          cy.get('.css-1tx7y9u > .css-17xejub').click();
          cy.get('[aria-label="Close"]').click();
        });

        it('should be able to view the event on list view', () => {
          cy.contains('List').click();
          cy.get(':nth-child(3) > .fc-list-event-title').click();
          //for scrolling down
          cy.get('.css-1tx7y9u > .css-17xejub').click();
          cy.get('[aria-label="Close"]').click();
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
          cy.get('.fc-reserve-button').click();

          cy.getBySel('type-select')
            .select(1)
            .select(2)
            .select(3)
            .select(4)
            .select(5)
            .select(6)
            .select(7)
            .select('Seminar');
        }
      );

      // //start time and end time
      // //invalid start time
      it(
        'should show toast message when start time is after end time',
        { scrollBehavior: false },
        () => {
          cy.getBySel('start-time-input').type('2022-10-13T15:30');
          cy.getBySel('end-time-input').type('2022-10-13T13:30');
        }
      );
      //valid start time
      it(
        'should successfully input start and end time',
        { scrollBehavior: false },
        () => {
          cy.getBySel('start-time-input').type('2022-10-13T16:00');
          cy.getBySel('end-time-input').type('2022-10-13T18:00');
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
            .get('#react-select-17-listbox')
            .contains('TEMS_TEST_DATA - GYM')
            .click();
        }
      );

      it(
        'should successfully select a venue by selecting options on the dropdown list',
        { scrollBehavior: false },
        () => {
          //directly selecting from dropdown list options
          cy.get('#react-select-17-listbox')
            .contains('TEMS_TEST_DATA - Covered Court')
            .click();
        }
      );

      it(
        'should successfully remove a selected venue option',
        { scrollBehavior: false },
        () => {
          //removing selected option
          cy.get('[aria-label="Remove TEMS_TEST_DATA - GYM"]').click();
        }
      );

      it(
        'should successfully show "no options" message when inputting a non existing venue',
        { scrollBehavior: false },
        () => {
          //checking "no options" mssg when input is not in the options
          cy.get('#venueIds')
            .type('Case Room')
            //out of focus selection box click
            .get(':nth-child(4) > .chakra-heading')
            .click();
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
            .click();
        }
      );

      it(
        'should successfully remove a selected equipment option',
        { scrollBehavior: false },
        () => {
          //removing selected option
          cy.get('[aria-label="Remove TEMS_TEST_DATA - SONY CAM 1"]').click();
        }
      );

      it(
        'should successfully select an equipment by selecting options on the dropdown list',
        { scrollBehavior: false },
        () => {
          //directly selecting from dropdown list options
          cy.get('#react-select-19-listbox')
            .contains('TEMS_TEST_DATA - SONY CAM 1')
            .click();
        }
      );

      it(
        'should successfully show "no options" message when inputting a non existing equipment',
        { scrollBehavior: false },
        () => {
          //checking "no options" mssg when input is not in the options
          cy.get('#equipmentIds')
            .type('JBL')
            //out of focus selection box click
            .get(':nth-child(4) > .chakra-heading') //out of focus selection box click
            .click();
        }
      );

      //title
      it('should successfully input title', { scrollBehavior: false }, () => {
        cy.getBySel('title-input').type('Classroom Ethics');
      });

      //description
      it(
        'should successfully input description',
        { scrollBehavior: false },
        () => {
          cy.getBySel('description-input').type(
            'A seminar for college teachers only'
          );
        }
      );

      // view access
      it('should successfully select any "VIEW ACCESS" from dropdown list', () => {
        cy.getBySel('view-access-select').select('Private');
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
            .clear()
            .type('supre')
            .get('#react-select-15-listbox')
            .contains('TEMS_TEST_DATA - Supreme Student Government')
            .click();
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
            .click();
        }
      );

      //contact person
      it(
        'should sucessfully input contact person',
        { scrollBehavior: false },
        () => {
          cy.getBySel('contact-person-input').type('Daemond Yarn');
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
            .clear()
            //messenger
            .type('Yarn Daemond')
            .clear()
            //email
            .type('daemon.yarn@cit.edu');
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
            .select('Pending');
        }
      );

      //additional notes
      it(
        'should successfully input additional notes',
        { scrollBehavior: false },
        () => {
          cy.getBySel('additional-notes-input').type('Bring your own snacks');
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
            .getBySel('close-btn')
            .click();
        }
      );
    });

    describe('should be able to view the newly created event', () => {
      it('should be able to view the event on weekly view', () => {
        //viewing event on weekly calendar view
        cy.get(
          '[style="inset: 500px 0% -600px; z-index: 1;"] > .fc-timegrid-event > .fc-event-main > .fc-event-main-frame > .fc-event-title-container'
        ).click();
        //for scrolling down
        cy.get('.css-1tx7y9u > .css-17xejub').click();
        cy.get('[aria-label="Close"]').click();
      });

      it('should be able to view the event on monthly view', () => {
        //viewing event on monthly calendar view
        cy.contains('Month').click();
        cy.get(
          '.fc-day-thu > .fc-daygrid-day-frame > .fc-daygrid-day-events > .fc-daygrid-event-harness > .fc-daygrid-event'
        )
          .contains('Classroom Ethics')
          .click();
        //for scrolling down
        cy.get('.css-1tx7y9u > .css-17xejub').click();
        cy.get('[aria-label="Close"]').click();
      });

      it('should be able to view the event on daily view', () => {
        cy.contains('Day').click();
        //viewing nov
        cy.get('[title="Next day"]')
          .click()
          .get('[title="Next day"]')
          .click()
          //viewing event
          .get('.fc-event-title-container')
          .contains('Classroom Ethics')
          .click();
        //for scrolling down
        cy.get('.css-1tx7y9u > .css-17xejub').click();
        cy.get('[aria-label="Close"]').click();
      });

      it('should be able to view the event on list view', () => {
        cy.contains('List').click();
        cy.get(':nth-child(4) > .fc-list-event-title').click();
        //for scrolling down
        cy.get('.css-1tx7y9u > .css-17xejub').click();
        cy.get('[aria-label="Close"]').click();
      });
    });
  });

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
  describe('updating an event', () => {
    it('should should not successfully update an event with missing data', () => {
      //updating microcontrollers workshop event
      cy.contains('List').click();
      cy.get(':nth-child(2) > .fc-list-event-title').click();
      //for scrolling down
      cy.get('.css-1tx7y9u > .css-17xejub').click();
      //clicking update button
      cy.getBySel('update-submit-btn').click();

      //clearing contact person
      cy.getBySel('contact-person-input').clear();
      //submiting update form
      cy.getBySel('add-submit-btn').click();
    });

    describe('updating an event with valid data', () => {
      it('should successfully update start and end time', () => {
        cy.getBySel('start-time-input').type('2022-10-14T13:00');
        cy.getBySel('end-time-input').type('2022-10-14T15:00');
      });
      it('should successfully input a contact person', () => {
        cy.getBySel('contact-person-input').type('Aemond Towers');
      });
      it('should successfully update email', () => {
        cy.getBySel('contact-input').clear().type('towers.a@cit.edu');
      });
      it('should successfully update status', () => {
        cy.getBySel('status-select').select('Reserved');
      });
      it('should successfully update approved by', () => {
        cy.getBySel('approved-by-input').type('SAO');
      });
      it('should successfully update an event', () => {
        cy.intercept('PUT', '/api/v1/event/*').as('updateEvents');

        cy.getBySel('add-submit-btn').click().wait('@updateEvents');
      });

      describe('should be able to view the updated event', () => {
        it('should be able to view the event on weekly view', () => {
          cy.contains('Week').click();
          //viewing event on weekly calendar view
          cy.get(
            '.fc-day-fri > .fc-timegrid-col-frame > :nth-child(2) > .fc-timegrid-event-harness > .fc-timegrid-event > .fc-event-main > .fc-event-main-frame > .fc-event-title-container'
          ).click();
          //for scrolling down
          cy.get('.css-1tx7y9u > .css-17xejub').click();
          cy.get('[aria-label="Close"]').click();
        });

        it('should be able to view the event on monthly view', () => {
          //viewing event on monthly calendar view
          cy.contains('Month').click();
          cy.get(
            '.fc-day-fri > .fc-daygrid-day-frame > .fc-daygrid-day-events > .fc-daygrid-event-harness > .fc-daygrid-event'
          )
            .contains('Microcontrollers Workshop')
            .click();
          //for scrolling down
          cy.get('.css-1tx7y9u > .css-17xejub').click();
          cy.get('[aria-label="Close"]').click();
        });

        it('should be able to view the event on daily view', () => {
          cy.contains('Day').click();
          //viewing oct 14
          cy.get('[title="Next day"]')
            .click()
            .get('[title="Next day"]')
            .click()
            .get('[title="Next day"]')
            .click()
            //viewing event
            .get('.fc-event-title-container')
            .contains('Microcontrollers Workshop')
            .click();
          //for scrolling down
          cy.get('.css-1tx7y9u > .css-17xejub').click();
          cy.get('[aria-label="Close"]').click();
        });

        it('should be able to view the event on list view', () => {
          cy.contains('List').click();
          cy.get(':nth-child(5) > .fc-list-event-title').click();
          //for scrolling down
          cy.get('.css-1tx7y9u > .css-17xejub').click();
          cy.get('[aria-label="Close"]').click();
        });
      });
    });
  });

  describe('deleting an event', () => {
    it('should not delete an event when "no" button is clicked', () => {
      cy.contains('Month').click();
      cy.get(
        '.fc-day-thu > .fc-daygrid-day-frame > .fc-daygrid-day-events > .fc-daygrid-event-harness > .fc-daygrid-event'
      )
        .contains('Classroom Ethics')
        .click();
      //for scrolling down
      cy.get('.css-1tx7y9u > .css-17xejub').click();
      cy.getBySel('delete-submit-btn').click();
      cy.getBySel('dialog-no-btn').click();

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

      cy.getBySel('delete-submit-btn').click();
      cy.getBySel('dialog-yes-btn').click().wait('@deleteEvents');
    });

    describe('deleted event should not be found in various calendar views anymore', () => {
      it('should not be found in weekly view', () => {});
      it('should not be found in monthly view', () => {
        cy.contains('Month').click();
      });
      it('should not be found in daily view', () => {
        cy.contains('Day').click();
        //viewing oct 13
        cy.get('[title="Next day"]');
        cy.get('[title="Next day"]');
      });
      it('should not be found in list view', () => {
        cy.contains('List').click();
      });
    });
  });
});
