import { faker } from '@faker-js/faker'

export const mockUnauthorizedError = (url: string) => {
  cy.intercept('POST', `**/${url}`, (req) => {
    req.reply({
      forceError: true,
      statusCode: 401,
      body: {
        error: faker.lorem.words(),
      },
    });
  }).as('request');
}

export const mockUnescpectdError = (url: string) => {
  cy.intercept('POST', `**/${url}`, (req) => {
    req.reply({
      forceError: true,
      statusCode: faker.helpers.arrayElement([400, 500]),
      body: {
        error: faker.lorem.words(),
      },
    });
  }).as('request');
}

export const mockForbbidenError = (url: string) => {
  cy.intercept('POST', `**/${url}`, (req) => {
    req.reply({
      forceError: true,
      statusCode: 403,
      body: {
        error: faker.lorem.words(),
      },
    });
  }).as('request');
}

export const mockOk = (url: string, body: object) => {
  cy.intercept('POST', `**/${url}`, {
    statusCode: 200,
    body: body
  }).as('request');
}