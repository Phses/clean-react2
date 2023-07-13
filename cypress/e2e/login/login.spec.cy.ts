import { faker } from '@faker-js/faker'
import * as FormHelper from '../../support/form-helper'
import * as HttpHelper from '../login/login-mocks'

const makeValidSubimit = () => {
  cy.get('input[type="email"]').type(faker.internet.email())
  cy.get('input[type="password"]').type(faker.lorem.word(6))
  cy.contains('button', 'Entrar').click()
}
describe('Login', () => {
  beforeEach(() => {
    cy.visit("login")
  })
  it('Verifica o estado inicial da tela do login', () => {
    FormHelper.testaInputStatus('email', 'Campo obrigatorio')
    FormHelper.testaInputStatus('password', 'Campo obrigatorio')
    cy.contains('button', 'Entrar').should('have.attr', 'disabled')
    cy.getByTestId('form-status').should('not.have.descendants')
  })
  it('Verifica estado da tela de login apos campos preenchidos com dados invalidos', () => {
    cy.get('input[type="email"]').type(faker.lorem.word())
    FormHelper.testaInputStatus('email', 'Campo invalido')
    cy.get('input[type="password"]').type(faker.lorem.word(3))
    FormHelper.testaInputStatus('password', 'Quantidades de caracteres precisa ser maior que 5')
    cy.contains('button', 'Entrar').should('have.attr', 'disabled')
    cy.getByTestId('form-status').should('not.have.descendants')
  })
  it('Verifica estado da tela de login apos campos preenchidos com dados validos', () => {
    cy.get('input[type="email"]').type(faker.internet.email())
    FormHelper.testaInputStatus('email')
    cy.get('input[type="password"]').type(faker.lorem.word(6))
    FormHelper.testaInputStatus('password')
    cy.contains('button', 'Entrar').should('not.have.attr', 'disabled')
    cy.getByTestId('form-status').should('not.have.descendants')
  })
  it('Verifica estado da tela de login apos campos preenchidos credenciais invalidas', () => {
    HttpHelper.mockUnauthorizedError()
    makeValidSubimit()
    cy.url().should('eq', 'http://localhost:8080/login')
    cy.getByTestId('spinner').should('not.exist')
    cy.getByTestId('main-error').should('exist')
  })
  it('Verifica estado da tela de login possui erro caso token passado nao seja valido', () => {
    HttpHelper.mockOkWithInvalidBody()
    makeValidSubimit()
    cy.url().should('eq', 'http://localhost:8080/login')
    cy.getByTestId('spinner').should('not.exist')
    cy.getByTestId('main-error').should('exist')
  })
  it('Verifica estado da tela de login apos campos preenchidos credenciais validas', () => {
    HttpHelper.mockOkWithValidBody()
    makeValidSubimit()
    cy.url().should('eq', 'http://localhost:8080/')
    cy.window().then(window => assert.isOk(window.localStorage.getItem('accessToken')))
  })
  it('Verifica se é feita apenas uma requisicao apos double click', () => {
    HttpHelper.mockOkWithValidBody()
    cy.get('input[type="email"]').type(faker.internet.email())
    cy.get('input[type="password"]').type(faker.lorem.word(6))
    cy.contains('button', 'Entrar').dblclick()
    cy.get('@request.all').should('have.length', 1)
  })
  it('Verifica se nao é feita a requisicao caso campos estejam invalidos', () => {
    HttpHelper.mockOkWithValidBody()
    cy.get('input[type="email"]').type(faker.internet.email()).type('{enter}')
    cy.get('@request.all').should('have.length', 0)
  })
})