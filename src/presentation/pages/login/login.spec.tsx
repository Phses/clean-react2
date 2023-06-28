import React from "react"
import { fireEvent, render, RenderResult } from "@testing-library/react"
import Login  from "./login"
import { ValidationSpy } from "@/presentation/test/login/validation-mock"
import { faker } from "@faker-js/faker"
import { Authentication } from "@/domain/usecases/authentication"
import { AuthParams, AuthToken } from "@/domain/models"

type sutTypes = {
    sut: RenderResult,
    authenticationSpy: AuthenticationSpy
}

type sutProps = {
    validationError: string
}

class AuthenticationSpy implements Authentication {
    authToken:AuthToken = { token: faker.string.uuid() }
    params: AuthParams
    auth(params: AuthParams): Promise<AuthToken> {
        this.params = params
        return Promise.resolve(this.authToken)
    }
}


const makeSut  = (props?: sutProps): sutTypes => {
    const validationSpy = new ValidationSpy()
    validationSpy.errorMassage = props?.validationError
    const authenticationSpy = new AuthenticationSpy()
    const sut = render(<Login validation={ validationSpy } authentication={ authenticationSpy } />)
    return {
        sut,
        authenticationSpy
    }
}

const simulaSubmitComCamposPreenchidos = (sut: RenderResult, email = faker.internet.email(), password = faker.internet.password()): void => {
    preencheCampoEmail(sut, email)
    preencheCampoPassword(sut, password)
    const button = sut.getByRole('button', { name: 'Entrar' }) as HTMLButtonElement;
    fireEvent.click(button)
}

const preencheCampoEmail = (sut: RenderResult, email = faker.internet.email()) => {
    const emailInput = sut.getByLabelText('email')
    fireEvent.input(emailInput, {target: {value: email}})
}

const preencheCampoPassword = (sut: RenderResult, password = faker.internet.password()) => {
    const passwordInput = sut.getByLabelText('password')
    fireEvent.input(passwordInput, {target: {value: password}})
}

describe('Login testes', () => {
    test('Deve iniciar a tela com estado inicial', () => {
        const validationErro = "Campo Obrigatório"
        const { sut } = makeSut({validationError: validationErro});
        const formStatus = sut.getByTestId('form-status')
        expect(formStatus.childElementCount).toBe(0);
        const button = sut.getByRole('button', { name: 'Entrar' }) as HTMLButtonElement;
        expect(button.disabled).toBe(true)
        const emailStatus = sut.getByTestId('email-status')
        expect(emailStatus.title).toBe(validationErro)
        const passwordStatus = sut.getByTestId('password-status')
        expect(passwordStatus.title).toBe(validationErro)
    })
    
    test('Deve setar valor do input status com o erro do validation password', () => {
        const validationErro = faker.word.words()
        const { sut } = makeSut({validationError: validationErro})
        const inputStatus = sut.getByTestId('password-status')
        
        preencheCampoPassword(sut)

        expect(inputStatus.title).toBe(validationErro)
        expect(inputStatus.textContent).toBe(`&#10060`)
    })
    test('Deve setar valor do input status com o erro do validation email', () => {
        const validationErro = faker.word.words()
        const { sut } = makeSut({validationError: validationErro})
        const inputStatus = sut.getByTestId('email-status')
        
        preencheCampoEmail(sut)
        
        expect(inputStatus.title).toBe(validationErro)
        expect(inputStatus.textContent).toBe('&#10060')
    })
    test('Deve setar valor do input status como vazio e mostrar sucesso email', () => {
        const { sut } = makeSut()
        const inputStatus = sut.getByTestId('email-status')
        
        preencheCampoEmail(sut)

        expect(inputStatus.title).toBe('')
        expect(inputStatus.textContent).toBe('&#9989')
    })
    test('Deve setar valor do input status como vazio e mostrar sucesso password', () => {
        const { sut } = makeSut()
        const inputStatus = sut.getByTestId('password-status')

        preencheCampoPassword(sut)

        expect(inputStatus.title).toBe('')
        expect(inputStatus.textContent).toBe('&#9989')
    })
    test('Deve habilitar botao em caso de validate nao retornar erro', () => {
        const { sut } = makeSut()
        
        preencheCampoEmail(sut)
        preencheCampoPassword(sut)

        const button = sut.getByRole('button', { name: 'Entrar' }) as HTMLButtonElement;
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
})

