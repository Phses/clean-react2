import React from 'react'
import { type RenderResult, render } from '@testing-library/react'
import SignUp from './signup'
import { faker } from '@faker-js/faker'
import { ValidationSpy } from '@/presentation/test/login/validation-mock'
import { Helper } from '@/presentation/test'
type sutTypes = {
  sut: RenderResult
}

type sutProps = {
  validationError: string
}

const makeSut = (props?: sutProps): sutTypes => {
  const validationSpy = new ValidationSpy()
  validationSpy.errorMassage = props?.validationError
  const sut = render(<SignUp validation={validationSpy} />)
  return {
    sut
  }
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
})
