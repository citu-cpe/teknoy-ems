/// <reference types="Cypress" />

import './common';
import './auth';
import './date';
import './event';
import { CreateEventInfo } from './event';

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.getBySel('greeting')
       */
      getBySel(selector: string, ...children: string[]): Chainable<Element>;

      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.containsBySel('btn', 'Add')
       */
      containsBySel(selector: string, text: string): Chainable<Element>;

      /**
       * Custom command to log in
       * @example cy.login('test_staff@test.com', 'test')
       */
      login(email: string, password: string): void;

      /**
       * Custom command to log in as admin
       * @example cy.loginAsAdmin()
       */
      loginWithAdmin(): void;

      /**
       * Custom command to log in as staff
       * @example cy.loginAsStaff()
       */
      loginWithStaff(): void;

      /**
       * Custom command to register
       * @example cy.register('test', 'test_staff@test.com', 'test')
       * @example cy.register('test', 'test_staff@test.com', 'test', true)
       */
      register(
        name: string,
        email: string,
        password: string,
        shouldFail?: boolean
      ): void;

      /**
       * Custom command to reset test data
       * @example cy.resetTestData()
       */
      resetTestData(): void;

      /**
       * Custom command to reset test data then log in
       * @example cy.resetTestDataAndLogin('test_staff@test.com', 'test')
       */
      resetTestDataAndLogin(email?: string, password?: string): void;

      /**
       * Custom command to reset test data then log in as admin
       * @example cy.resetTestDataAndLoginAsAdmin()
       */
      resetTestDataAndLoginAsAdmin(): void;

      /**
       * Custom command to reset test data then log in as staff
       * @example cy.resetTestDataAndLoginAsStaff()
       */
      resetTestDataAndLoginAsStaff(): void;

      /**
       * Custom command to set value on datetime-local input
       * @example cy.setDateTimeLocal('.datetime-input', new Date())
       */
      setDateTimeLocal(selector: string, date: Date): void;

      /**
       * Custom command to set value on datetime-local input using data-cy
       * @example cy.setDateTimeLocalBySel('datetime-input', new Date())
       */
      setDateTimeLocalBySel(selector: string, date: Date): void;

      /**
       * Custom command to fill out create event form
       * @example cy.createEvent(info)
       */
      createEvent(info: CreateEventInfo): void;
    }
  }
}
