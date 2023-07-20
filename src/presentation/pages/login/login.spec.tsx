import React from 'react'
import { cleanup, fireEvent, render, type RenderResult, waitFor } from '@testing-library/react'
import Login from './login'
import { expect } from '@jest/globals'
import { createMemoryHistory, type MemoryHistory } from 'history'
import 'jest-localstorage-mock'
import { ValidationSpy } from '@/presentation/test/login/validation-mock'
import { faker } from '@faker-js/faker'
import { InvalidCredentialsError } from '@/domain/erros'
import { Router } from 'react-router-dom'
import { LocalAccountStorageMock } from '@/presentation/test/login/local-storage-account-mock'
import { AuthenticationSpy } from '@/domain/test/authentication-spy'
import { Helper } from '@/presentation/test'

type sutTypes = {
  sut: RenderResult
  authenticationSpy: AuthenticationSpy
  history: MemoryHistory
  localStorageAccount: LocalAccountStorageMock
}

type sutProps = {
  validationError: string
}

const makeSut = (props?: sutProps): sutTypes => {
  const history = createMemoryHistory({ initialEntries: ['/login'] })
  const validationSpy = new ValidationSpy()
  validationSpy.errorMassage = props?.validationError
  const authenticationSpy = new AuthenticationSpy()
  const localStorageAccount = new LocalAccountStorageMock()
  const sut = render(
    <Router location={history.location} navigator={history}>
      <Login
        validation={validationSpy}
        authentication={authenticationSpy}
        accountStorage={localStorageAccount}
      />
    </Router>
  )
  return {
    sut,
    authenticationSpy,
    history,
    localStorageAccount
  }
}

const simulaSubmitComCamposPreenchidos = (sut: RenderResult, email = faker.internet.email(), password = faker.internet.password()): void => {
  Helper.preencheCampo(sut, 'email', email)
  Helper.preencheCampo(sut, 'password', password)
  const button = sut.getByRole('button', { name: 'Entrar' }) as HTMLButtonElement
  fireEvent.click(button)
}

describe('Login testes', () => {
  afterEach(() => {
    cleanup()
  })
  test('Deve iniciar a tela com estado inicial', () => {
    const validationErro = 'Campo Obrigatório'
    const { sut } = makeSut({ validationError: validationErro })
    Helper.verificaNumeroDeFilhos(sut, 'form-status', 0)
    const button = sut.getByRole('button', { name: 'Entrar' }) as HTMLButtonElement
    expect(button.disabled).toBe(true)
    Helper.verifcaFieldError(sut, 'email-status', validationErro)
    Helper.verifcaFieldError(sut, 'password-status', validationErro)
  })

  test('Deve setar valor do input status com o erro do validation password', () => {
    const validationErro = faker.word.words()
    const { sut } = makeSut({ validationError: validationErro })

    Helper.preencheCampo(sut, 'password')
    Helper.verificaFieldStatus(sut, 'password-status', '❌', validationErro)
  })
  test('Deve setar valor do input status com o erro do validation email', () => {
    const validationErro = faker.word.words()
    const { sut } = makeSut({ validationError: validationErro })

    Helper.preencheCampo(sut, 'email')
    Helper.verificaFieldStatus(sut, 'email-status', '❌', validationErro)
  })
  test('Deve setar valor do input status como vazio e mostrar sucesso email', () => {
    const { sut } = makeSut()

    Helper.preencheCampo(sut, 'email')
    Helper.verificaFieldStatus(sut, 'email-status', '✅')
  })
  test('Deve setar valor do input status como vazio e mostrar sucesso password', () => {
    const { sut } = makeSut()

    Helper.preencheCampo(sut, 'password')

    Helper.verificaFieldStatus(sut, 'password-status', '✅')
  })
  test('Deve habilitar botao em caso de validate nao retornar erro', () => {
    const { sut } = makeSut()

    Helper.preencheCampo(sut, 'email')
    Helper.preencheCampo(sut, 'password')

    const button = sut.getByRole('button', { name: 'Entrar' }) as HTMLButtonElement
    expect(button.disabled).toBe(false)
  })
  test('Deve mostrar spinner apos o clique em submit', () => {
    const { sut } = makeSut()

    simulaSubmitComCamposPreenchidos(sut)

    const spinner = sut.getByTestId('spinner')
    expect(spinner).toBeTruthy()
  })
  test('Deve chamar authentication com valores corretos', () => {
    const { sut, authenticationSpy } = makeSut()

    const email = faker.internet.email()
    const password = faker.internet.password()

    simulaSubmitComCamposPreenchidos(sut, email, password)

    expect(authenticationSpy.params).toEqual({
      email,
      password
    })
  })
  test('Deve chamar authentication apenas uma vez enquanto isLoading', () => {
    const { sut, authenticationSpy } = makeSut()

    simulaSubmitComCamposPreenchidos(sut)
    simulaSubmitComCamposPreenchidos(sut)

    expect(authenticationSpy.count).toBe(1)
  })
  test('Nao deve chamar authentication caso exista erro no form', () => {
    const validationErro = faker.word.words()
    const { sut, authenticationSpy } = makeSut({ validationError: validationErro })

    Helper.preencheCampo(sut, 'email')

    const form = sut.getByTestId('form') as HTMLFormElement

    fireEvent.submit(form)

    expect(authenticationSpy.count).toBe(0)
  })
  test('Deve mostrar main error em caso de excecao e esconder spinner', async () => {
    const { sut, authenticationSpy } = makeSut()
    const error = new InvalidCredentialsError()
    jest.spyOn(authenticationSpy, 'auth').mockReturnValueOnce(Promise.reject(error))

    simulaSubmitComCamposPreenchidos(sut)
    const formStatus = sut.getByTestId('form-status')
    await waitFor(() => formStatus)
    Helper.verificaNumeroDeFilhos(sut, 'form-status', 1)
    const mainError = sut.getByTestId('main-error')
    expect(mainError.textContent).toBe(error.message)
  })
  test('Deve setar accessToken ao localStorage em caso de sucesso', async () => {
    const { sut, authenticationSpy, history, localStorageAccount } = makeSut()

    simulaSubmitComCamposPreenchidos(sut)

    await waitFor(() => sut.getByTestId('form'))

    expect(localStorageAccount.account).toEqual(authenticationSpy.authAccount)
    expect(history.location.pathname).toBe('/')
    expect(history.index).toBe(0)
  })
  test('Deve navegar para pagina de cadastro', () => {
    const { sut, history } = makeSut()

    const signup = sut.getByTestId('signup-link')
    fireEvent.click(signup)
    expect(history.location.pathname).toBe('/signup')
    expect(history.index).toBe(1)
  })
})
