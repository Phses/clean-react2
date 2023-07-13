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

export const mockOk = (url: string, body: object) => {
  cy.intercept('POST', `*/${url}`, {
    status: 200,
    body: body
  }).as('request');
}