import React from 'react'
import { cleanup, fireEvent, render, type RenderResult, waitFor } from '@testing-library/react'
import Login from './login'
import { createMemoryHistory, type MemoryHistory } from 'history'
import 'jest-localstorage-mock'
import { ValidationSpy } from '@/presentation/test/login/validation-mock'
import { faker } from '@faker-js/faker'
import { type Authentication } from '@/domain/usecases/authentication'
import { type AuthParams, type AuthToken } from '@/domain/models'
import { InvalidCredentialsError } from '@/domain/erros'
import { Router } from 'react-router-dom'
import { LocalStorageAccessTokenMock } from '@/presentation/test/login/local-storage-accessToken-mock'

type sutTypes = {
  sut: RenderResult
  authenticationSpy: AuthenticationSpy
  history: MemoryHistory
  localStorageAccessToken: LocalStorageAccessTokenMock
}

type sutProps = {
  validationError: string
}

class AuthenticationSpy implements Authentication {
  authToken: AuthToken = { token: faker.string.uuid() }
  params: AuthParams
  count: number = 0
  async auth(params: AuthParams): Promise<AuthToken> {
    this.params = params
    this.count++
    return await Promise.resolve(this.authToken)
  }
}

const makeSut = (props?: sutProps): sutTypes => {
  const history = createMemoryHistory({ initialEntries: ['/login'] })
  const validationSpy = new ValidationSpy()
  validationSpy.errorMassage = props?.validationError
  const authenticationSpy = new AuthenticationSpy()
  const localStorageAccessToken = new LocalStorageAccessTokenMock()
  const sut = render(
    <Router location={history.location} navigator={history}>
      <Login
        validation={validationSpy}
        authentication={authenticationSpy}
        storgeAccessToken={localStorageAccessToken}
      />
    </Router>
  )
  return {
    sut,
    authenticationSpy,
    history,
    localStorageAccessToken
  }
}

const simulaSubmitComCamposPreenchidos = (sut: RenderResult, email = faker.internet.email(), password = faker.internet.password()): void => {
  preencheCampoEmail(sut, email)
  preencheCampoPassword(sut, password)
  const button = sut.getByRole('button', { name: 'Entrar' }) as HTMLButtonElement
  fireEvent.click(button)
}

const preencheCampoEmail = (sut: RenderResult, email = faker.internet.email()): void => {
  const emailInput = sut.getByLabelText('email')
  fireEvent.input(emailInput, { target: { value: email } })
}

const preencheCampoPassword = (sut: RenderResult, password = faker.internet.password()): void => {
  const passwordInput = sut.getByLabelText('password')
  fireEvent.input(passwordInput, { target: { value: password } })
}

const verificaNumeroDeFilhos = (sut: RenderResult, testId: string, numChilds: number): void => {
  const formStatus = sut.getByTestId(testId)
  expect(formStatus.childElementCount).toBe(numChilds)
}

const verifcaFieldError = (sut: RenderResult, fieldTestId: string, fieldError: string = faker.lorem.words()): void => {
  const fieldStatus = sut.getByTestId(fieldTestId)
  expect(fieldStatus.title).toBe(fieldError)
}

const verificaFieldStatus = (sut: RenderResult, fieldTestId: string, textContent: string, fieldError: string = ''): void => {
  const inputStatus = sut.getByTestId(fieldTestId)
  expect(inputStatus.title).toBe(fieldError)
  expect(inputStatus.textContent).toBe(textContent)
}

describe('Login testes', () => {
  afterEach(() => {
    cleanup()
  })
  test('Deve iniciar a tela com estado inicial', () => {
    const validationErro = 'Campo Obrigatório'
    const { sut } = makeSut({ validationError: validationErro })
    verificaNumeroDeFilhos(sut, 'form-status', 0)
    const button = sut.getByRole('button', { name: 'Entrar' }) as HTMLButtonElement
    expect(button.disabled).toBe(true)
    verifcaFieldError(sut, 'email-status', validationErro)
    verifcaFieldError(sut, 'password-status', validationErro)
  })

  test('Deve setar valor do input status com o erro do validation password', () => {
    const validationErro = faker.word.words()
    const { sut } = makeSut({ validationError: validationErro })

    preencheCampoPassword(sut)
    verificaFieldStatus(sut, 'password-status', '❌', validationErro)
  })
  test('Deve setar valor do input status com o erro do validation email', () => {
    const validationErro = faker.word.words()
    const { sut } = makeSut({ validationError: validationErro })

    preencheCampoEmail(sut)
    verificaFieldStatus(sut, 'email-status', '❌', validationErro)
  })
  test('Deve setar valor do input status como vazio e mostrar sucesso email', () => {
    const { sut } = makeSut()

    preencheCampoEmail(sut)
    verificaFieldStatus(sut, 'email-status', '✅')
  })
  test('Deve setar valor do input status como vazio e mostrar sucesso password', () => {
    const { sut } = makeSut()

    preencheCampoPassword(sut)

    verificaFieldStatus(sut, 'password-status', '✅')
  })
  test('Deve habilitar botao em caso de validate nao retornar erro', () => {
    const { sut } = makeSut()

    preencheCampoEmail(sut)
    preencheCampoPassword(sut)

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

    preencheCampoEmail(sut)

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
    verificaNumeroDeFilhos(sut, 'form-status', 1)
    const mainError = sut.getByTestId('main-error')
    expect(mainError.textContent).toBe(error.message)
  })
  test('Deve setar accessToken ao localStorage em caso de sucesso', async () => {
    const { sut, authenticationSpy, history, localStorageAccessToken } = makeSut()

    simulaSubmitComCamposPreenchidos(sut)

    await waitFor(() => sut.getByTestId('form'))

    expect(localStorageAccessToken.accessToken).toBe(authenticationSpy.authToken.token)
    expect(history.location.pathname).toBe('/')
    expect(history.index).toBe(0)
  })
  test('Deve navegar para pagina de cadastro', () => {
    const { sut, history } = makeSut()

    const signup = sut.getByTestId('signup')
    fireEvent.click(signup)
    expect(history.location.pathname).toBe('/signup')
    expect(history.index).toBe(1)
  })
})
