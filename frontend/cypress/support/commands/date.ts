/// <reference types="Cypress" />

const getDateTimeLocalString = (date: Date): string => {
  const formatOptions: Intl.NumberFormatOptions = {
    minimumIntegerDigits: 2,
    useGrouping: false,
  };
  const locale = 'en-US';

  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toLocaleString(locale, formatOptions);
  const day = date.getDate().toLocaleString(locale, formatOptions);
  const hour = date.getHours().toLocaleString(locale, formatOptions);
  const minute = date.getMinutes().toLocaleString(locale, formatOptions);

  return `${year}-${month}-${day}T${hour}:${minute}`;
};

Cypress.Commands.add('setDateTimeLocal', (selector: string, date: Date) => {
  cy.get(selector).type(getDateTimeLocalString(date), { force: true });
});

Cypress.Commands.add(
  'setDateTimeLocalBySel',
  (selector: string, date: Date) => {
    cy.getBySel(selector).type(getDateTimeLocalString(date), { force: true });
  }
);
