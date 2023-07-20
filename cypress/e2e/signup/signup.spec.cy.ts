import { faker } from '@faker-js/faker'
import * as FormHelper from '../../support/form-helper'
import * as HttpHelper from '../../support/signup-mock'

const makeValidSubimit = () => {
  cy.get('input[type="text"]').type(faker.lorem.word(5))
  cy.get('input[type="email"]').type(faker.internet.email())
  const password = faker.lorem.word(6)
  cy.get('input[id="password"]').type(password)
  cy.get('input[id="passwordConfirmation"]').type(password)
  cy.contains('button', 'Cadastrar').click()
}

describe('Signup', () => {
  beforeEach(() => {
    cy.visit("signup")
  })
  it('Verifica o estado inicial da tela do cadastro', () => {
    FormHelper.testaInputStatus('name', 'Campo obrigatorio')
    FormHelper.testaInputStatus('email', 'Campo obrigatorio')
    FormHelper.testaInputStatus('password', 'Campo obrigatorio')
    FormHelper.testaInputStatus('passwordConfirmation', 'Campo obrigatorio')
    cy.contains('button', 'Cadastrar').should('have.attr', 'disabled')
    cy.getByTestId('form-status').should('not.have.descendants')
  })
  it('Verifica estado da tela de login apos campos preenchidos com dados invalidos', () => {
    cy.get('input[type="text"]').type(faker.lorem.word(2))
    FormHelper.testaInputStatus('name', 'Quantidades de caracteres precisa ser maior que 3')
    cy.get('input[type="email"]').type(faker.lorem.word())
    FormHelper.testaInputStatus('email', 'Campo invalido')
    cy.get('input[id="password"]').type(faker.lorem.word(3))
    FormHelper.testaInputStatus('password', 'Quantidades de caracteres precisa ser maior que 5')
    cy.get('input[id="passwordConfirmation"]').type(faker.lorem.word(3))
    FormHelper.testaInputStatus('passwordConfirmation', 'O valor dos campos nao sao iguais')
    cy.contains('button', 'Cadastrar').should('have.attr', 'disabled')
    cy.getByTestId('form-status').should('not.have.descendants')
  })
  it('Verifica estado da tela de cadastro apos campos preenchidos com dados validos', () => {
    cy.get('input[type="text"]').type(faker.lorem.word(5))
    FormHelper.testaInputStatus('name')
    cy.get('input[id="email"]').type(faker.internet.email())
    FormHelper.testaInputStatus('email')
    const password = faker.lorem.word(6)
    cy.get('input[id="password"]').type(password)
    FormHelper.testaInputStatus('password')
    cy.get('input[id="passwordConfirmation"]').type(password)
    FormHelper.testaInputStatus('passwordConfirmation')
    cy.contains('button', 'Cadastrar').should('not.have.attr', 'disabled')
    cy.getByTestId('form-status').should('not.have.descendants')
  })
  it('Verifica estado da tela de login apos campos preenchidos email em uso', () => {
    HttpHelper.mockEmailInUseError()
    makeValidSubimit()
    cy.url().should('eq', 'http://localhost:8080/signup')
    cy.getByTestId('spinner').should('not.exist')
    cy.getByTestId('main-error').should('exist')
  })
  it('Verifica estado da tela de login apos campos preenchidos erro inesperado', () => {
    HttpHelper.mockUnescpectdError()
    makeValidSubimit()
    cy.url().should('eq', 'http://localhost:8080/signup')
    cy.getByTestId('spinner').should('not.exist')
    cy.getByTestId('main-error').should('exist').contains('erro inesperado')
  })
  it('Verifica estado da tela de cadastro possui erro caso token passado nao seja valido', () => {
    HttpHelper.mockOkWithInvalidBody()
    makeValidSubimit()
    cy.url().should('eq', 'http://localhost:8080/signup')
    cy.getByTestId('spinner').should('not.exist')
    cy.getByTestId('main-error').should('exist')
  })
  it('Verifica estado da tela de cadastro apos campos preenchidos credenciais validas', () => {
    HttpHelper.mockOkWithValidBody()
    makeValidSubimit()
    cy.url().should('eq', 'http://localhost:8080/')
    cy.window().then(window => assert.isOk(window.localStorage.getItem('account')))
  })
  it('Verifica se é feita apenas uma requisicao apos double click', () => {
    HttpHelper.mockOkWithValidBody()
    cy.get('input[type="text"]').type(faker.lorem.word(5))
    cy.get('input[type="email"]').type(faker.internet.email())
    const password = faker.lorem.word(6)
    cy.get('input[id="password"]').type(password)
    cy.get('input[id="passwordConfirmation"]').type(password)
    cy.contains('button', 'Cadastrar').dblclick()
    cy.get('@request.all').should('have.length', 1)
  })
  it('Verifica se nao é feita a requisicao caso campos estejam invalidos', () => {
    HttpHelper.mockOkWithValidBody()
    cy.get('input[type="email"]').type(faker.internet.email()).type('{enter}')
    cy.get('@request.all').should('have.length', 0)
  })
})