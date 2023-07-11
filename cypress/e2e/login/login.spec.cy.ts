import { toHaveAttribute } from "@testing-library/jest-dom/matchers"
import { type } from "os"

describe('Login', () => {
  beforeEach(() => {
    cy.visit("login")
  })
  it('teste', () => {
    cy.getByTestId("email-status")
      .should('have.attr', 'title', 'Campo obrigatorio')
      .should('have.text', '❌')
    cy.getByTestId("password-status")
      .should('have.attr', 'title', 'Campo obrigatorio')
      .should('have.text', '❌')
    cy.contains('button', 'Entrar').should('have.attr', 'disabled')
    cy.getByTestId('form-status').should('not.have.descendants')
  })
})