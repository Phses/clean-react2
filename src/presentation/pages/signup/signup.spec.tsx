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
  validationSpy.errorMassage = props.validationError
  const sut = render(<SignUp validation={validationSpy} />)
  return {
    sut
  }
}

describe('Login testes', () => {
  test('Deve iniciar a tela com estado inicial', () => {
    const validationErro = 'Campo Obrigatório'
    const { sut } = makeSut({ validationError: validationErro })
    Helper.verificaNumeroDeFilhos(sut, 'form-status', 0)
    const button = sut.getByRole('button', { name: 'Cadastrar' }) as HTMLButtonElement
    expect(button.disabled).toBe(true)
    Helper.verifcaFieldError(sut, 'email-status', validationErro)
    Helper.verifcaFieldError(sut, 'password-status', validationErro)
  })
  test('Deve setar valor do input status com o erro do validation name', () => {
    const validationErro = faker.word.words()
    const { sut } = makeSut({ validationError: validationErro })

    Helper.preencheCampo(sut, 'name')
    Helper.verificaFieldStatus(sut, 'name-status', '❌', validationErro)
  })
})
