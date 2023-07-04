import React from 'react'
import { type RenderResult, render, fireEvent } from '@testing-library/react'
import SignUp from './signup'
import { faker } from '@faker-js/faker'
import { ValidationSpy } from '@/presentation/test/login/validation-mock'
import { Helper } from '@/presentation/test'
import { type AccountParams, type AuthToken } from '@/domain/models'
import { type AddAccount } from '@/domain/usecases/add-account/add-account'

type sutTypes = {
  sut: RenderResult
  addAccountSpy: AddAccountSpy
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
    return await Promise.resolve(this.authToken)
  }
}

const makeSut = (props?: sutProps): sutTypes => {
  const validationSpy = new ValidationSpy()
  validationSpy.errorMassage = props?.validationError
  const addAccountSpy = new AddAccountSpy()
  const sut = render(<SignUp validation={validationSpy} addAccount={addAccountSpy} />)
  return {
    sut,
    addAccountSpy
  }
}

const simulaSubmitComCamposPreenchidos = (sut: RenderResult, name = faker.person.fullName(), email = faker.internet.email(), password = faker.internet.password()): void => {
  Helper.preencheCampo(sut, 'name', name)
  Helper.preencheCampo(sut, 'email', email)
  Helper.preencheCampo(sut, 'password', password)
  Helper.preencheCampo(sut, 'confirmPassword', password)
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
    Helper.verifcaFieldError(sut, 'confirmPassword-status', validationErro)
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
  test('Deve setar valor do input status com o erro do validation confirmPassword', () => {
    const validationErro = faker.word.words()
    const { sut } = makeSut({ validationError: validationErro })

    Helper.preencheCampo(sut, 'confirmPassword')
    Helper.verificaFieldStatus(sut, 'confirmPassword-status', '❌', validationErro)
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

    Helper.preencheCampo(sut, 'confirmPassword')
    Helper.verificaFieldStatus(sut, 'confirmPassword-status', '✅')
  })
  test('Deve habilitar botao em caso de validate nao retornar erro', () => {
    const { sut } = makeSut()

    Helper.preencheCampo(sut, 'name')
    Helper.preencheCampo(sut, 'email')
    Helper.preencheCampo(sut, 'password')
    Helper.preencheCampo(sut, 'confirmPassword')

    const button = sut.getByRole('button', { name: 'Cadastrar' }) as HTMLButtonElement
    expect(button.disabled).toBe(false)
  })
  test('Deve mostrar spinner apos o clique em submit', () => {
    const { sut } = makeSut()

    simulaSubmitComCamposPreenchidos(sut)

    const spinner = sut.getByTestId('spinner')
    expect(spinner).toBeTruthy()
  })
  test('Deve chamar authentication com valores corretos', () => {
    const { sut, addAccountSpy } = makeSut()

    const name = faker.person.fullName()
    const email = faker.internet.email()
    const password = faker.internet.password()

    simulaSubmitComCamposPreenchidos(sut, name, email, password)

    expect(addAccountSpy.params).toEqual({
      name,
      email,
      password,
      confirmPassword: password
    })
  })
})
