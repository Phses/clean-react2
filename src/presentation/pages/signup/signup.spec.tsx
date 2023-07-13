import React from 'react'
import { type RenderResult, render, fireEvent, waitFor } from '@testing-library/react'
import SignUp from './signup'
import { faker } from '@faker-js/faker'
import { expect } from '@jest/globals'
import { ValidationSpy } from '@/presentation/test/login/validation-mock'
import { Helper } from '@/presentation/test'
import { type AccountParams, type AuthToken } from '@/domain/models'
import { type AddAccount } from '@/domain/usecases/add-account/add-account'
import { EmailInUseError } from '@/domain/erros/email-in-use-error'
import { type MemoryHistory, createMemoryHistory } from 'history'
import { Router } from 'react-router-dom'
import { LocalStorageAccessTokenMock } from '@/presentation/test/login/local-storage-accessToken-mock'

type sutTypes = {
  sut: RenderResult
  addAccountSpy: AddAccountSpy
  history: MemoryHistory
  localStorageAccessToken: LocalStorageAccessTokenMock
}

type sutProps = {
  validationError: string
}

class AddAccountSpy implements AddAccount {
  authToken: AuthToken = { token: faker.string.uuid() }
  params: AccountParams
  count: number = 0
  async add(params: AccountParams): Promise<AuthToken> {
    this.params = params
    this.count++
    return await Promise.resolve(this.authToken)
  }
}

const makeSut = (props?: sutProps): sutTypes => {
  const history = createMemoryHistory({ initialEntries: ['/login'] })
  const validationSpy = new ValidationSpy()
  validationSpy.errorMassage = props?.validationError
  const addAccountSpy = new AddAccountSpy()
  const localStorageAccessToken = new LocalStorageAccessTokenMock()
  const sut = render(
    <Router location={history.location} navigator={history}>
      <SignUp
        validation={validationSpy}
        addAccount={addAccountSpy}
        storgeAccessToken={localStorageAccessToken}
      />
    </Router>
  )
  return {
    sut,
    addAccountSpy,
    history,
    localStorageAccessToken
  }
}

const simulaSubmitComCamposPreenchidos = (sut: RenderResult, name = faker.person.fullName(), email = faker.internet.email(), password = faker.internet.password()): void => {
  Helper.preencheCampo(sut, 'name', name)
  Helper.preencheCampo(sut, 'email', email)
  Helper.preencheCampo(sut, 'password', password)
  Helper.preencheCampo(sut, 'passwordConfirmation', password)
  const button = sut.getByRole('button', { name: 'Cadastrar' }) as HTMLButtonElement
  fireEvent.click(button)
}

describe('SignUP testes', () => {
  test('Deve iniciar a tela com estado inicial', () => {
    const validationErro = 'Campo Obrigatório'
    const { sut } = makeSut({ validationError: validationErro })
    Helper.verificaNumeroDeFilhos(sut, 'form-status', 0)
    const button = sut.getByRole('button', { name: 'Cadastrar' }) as HTMLButtonElement
    expect(button.disabled).toBe(true)
    Helper.verifcaFieldError(sut, 'name-status', validationErro)
    Helper.verifcaFieldError(sut, 'email-status', validationErro)
    Helper.verifcaFieldError(sut, 'password-status', validationErro)
    Helper.verifcaFieldError(sut, 'passwordConfirmation-status', validationErro)
  })
  test('Deve setar valor do input status com o erro do validation name', () => {
    const validationErro = faker.word.words()
    const { sut } = makeSut({ validationError: validationErro })

    Helper.preencheCampo(sut, 'name')
    Helper.verificaFieldStatus(sut, 'name-status', '❌', validationErro)
  })
  test('Deve setar valor do input status com o erro do validation email', () => {
    const validationErro = faker.word.words()
    const { sut } = makeSut({ validationError: validationErro })

    Helper.preencheCampo(sut, 'email')
    Helper.verificaFieldStatus(sut, 'email-status', '❌', validationErro)
  })
  test('Deve setar valor do input status com o erro do validation password', () => {
    const validationErro = faker.word.words()
    const { sut } = makeSut({ validationError: validationErro })

    Helper.preencheCampo(sut, 'password')
    Helper.verificaFieldStatus(sut, 'password-status', '❌', validationErro)
  })
  test('Deve setar valor do input status com o erro do validation passwordConfirmation', () => {
    const validationErro = faker.word.words()
    const { sut } = makeSut({ validationError: validationErro })

    Helper.preencheCampo(sut, 'passwordConfirmation')
    Helper.verificaFieldStatus(sut, 'passwordConfirmation-status', '❌', validationErro)
  })
  test('Deve setar valor do input status como vazio e mostrar sucesso name', () => {
    const { sut } = makeSut()

    Helper.preencheCampo(sut, 'name')
    Helper.verificaFieldStatus(sut, 'name-status', '✅')
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
  test('Deve setar valor do input status como vazio e mostrar sucesso confirmPassword', () => {
    const { sut } = makeSut()

    Helper.preencheCampo(sut, 'passwordConfirmation')
    Helper.verificaFieldStatus(sut, 'passwordConfirmation-status', '✅')
  })
  test('Deve habilitar botao em caso de validate nao retornar erro', () => {
    const { sut } = makeSut()

    Helper.preencheCampo(sut, 'name')
    Helper.preencheCampo(sut, 'email')
    Helper.preencheCampo(sut, 'password')
    Helper.preencheCampo(sut, 'passwordConfirmation')

    const button = sut.getByRole('button', { name: 'Cadastrar' }) as HTMLButtonElement
    expect(button.disabled).toBe(false)
  })
  test('Deve mostrar spinner apos o clique em submit', () => {
    const { sut } = makeSut()

    simulaSubmitComCamposPreenchidos(sut)

    const spinner = sut.getByTestId('spinner')
    expect(spinner).toBeTruthy()
  })
  test('Deve chamar addaccount com valores corretos', () => {
    const { sut, addAccountSpy } = makeSut()

    const name = faker.person.fullName()
    const email = faker.internet.email()
    const password = faker.internet.password()

    simulaSubmitComCamposPreenchidos(sut, name, email, password)

    expect(addAccountSpy.params).toEqual({
      name,
      email,
      password,
      passwordConfirmation: password
    })
  })
  test('Deve chamar authentication apenas uma vez enquanto isLoading', () => {
    const { sut, addAccountSpy } = makeSut()

    simulaSubmitComCamposPreenchidos(sut)
    simulaSubmitComCamposPreenchidos(sut)

    expect(addAccountSpy.count).toBe(1)
  })
  test('Nao deve chamar authentication caso exista erro no form', () => {
    const validationErro = faker.word.words()
    const { sut, addAccountSpy } = makeSut({ validationError: validationErro })

    Helper.preencheCampo(sut, 'email')

    const form = sut.getByTestId('form') as HTMLFormElement

    fireEvent.submit(form)

    expect(addAccountSpy.count).toBe(0)
  })
  test('Deve mostrar main error em caso de excecao e esconder spinner', async () => {
    const { sut, addAccountSpy } = makeSut()
    const error = new EmailInUseError()
    jest.spyOn(addAccountSpy, 'add').mockRejectedValueOnce((error))

    simulaSubmitComCamposPreenchidos(sut)
    const formStatus = sut.getByTestId('form-status')
    await waitFor(() => formStatus)
    Helper.verificaNumeroDeFilhos(sut, 'form-status', 1)
    const mainError = sut.getByTestId('main-error')
    expect(mainError.textContent).toBe(error.message)
  })
  test('Deve setar accessToken ao localStorage em caso de sucesso', async () => {
    const { sut, addAccountSpy, history, localStorageAccessToken } = makeSut()

    simulaSubmitComCamposPreenchidos(sut)

    await waitFor(() => sut.getByTestId('form'))

    expect(localStorageAccessToken.accessToken).toBe(addAccountSpy.authToken.token)
    expect(history.location.pathname).toBe('/')
    expect(history.index).toBe(0)
  })
  test('Deve navegar para pagina de cadastro', () => {
    const { sut, history } = makeSut()

    const signup = sut.getByTestId('login-link')
    fireEvent.click(signup)
    expect(history.location.pathname).toBe('/login')
    expect(history.index).toBe(1)
  })
})
