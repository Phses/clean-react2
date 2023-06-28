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
        const passwordInput = sut.getByLabelText('password')
        const inputStatus = sut.getByTestId('password-status')
        fireEvent.input(passwordInput, {target: {value: faker.internet.password()}})
        expect(inputStatus.title).toBe(validationErro)
        expect(inputStatus.textContent).toBe(`&#10060`)
    })
    test('Deve setar valor do input status com o erro do validation email', () => {
        const validationErro = faker.word.words()
        const { sut } = makeSut({validationError: validationErro})
        const emailInput = sut.getByLabelText('email')
        const inputStatus = sut.getByTestId('email-status')
        fireEvent.input(emailInput, {target: {value: faker.internet.email()}})
        expect(inputStatus.title).toBe(validationErro)
        expect(inputStatus.textContent).toBe('&#10060')
    })
    test('Deve setar valor do input status como vazio e mostrar sucesso email', () => {
        const { sut } = makeSut()
        const emailInput = sut.getByLabelText('email')
        const inputStatus = sut.getByTestId('email-status')
        fireEvent.input(emailInput, {target: {value: faker.internet.email()}})
        expect(inputStatus.title).toBe('')
        expect(inputStatus.textContent).toBe('&#9989')
    })
    test('Deve setar valor do input status como vazio e mostrar sucesso password', () => {
        const { sut } = makeSut()
        const passwordInput = sut.getByLabelText('password')
        const inputStatus = sut.getByTestId('password-status')
        fireEvent.input(passwordInput, {target: {value: faker.internet.password()}})
        expect(inputStatus.title).toBe('')
        expect(inputStatus.textContent).toBe('&#9989')
    })
    test('Deve habilitar botao em caso de validate nao retornar erro', () => {
        const { sut } = makeSut()
        const passwordInput = sut.getByLabelText('password')
        fireEvent.input(passwordInput, {target: {value: faker.internet.password()}})
        const emailInput = sut.getByLabelText('email')
        fireEvent.input(emailInput, {target: {value: faker.internet.email()}})
        const button = sut.getByRole('button', { name: 'Entrar' }) as HTMLButtonElement;
        expect(button.disabled).toBe(false)
    })
    test('Deve mostrar spinner apos o clique em submit', () => {
        const { sut } = makeSut()
        const passwordInput = sut.getByLabelText('password')
        fireEvent.input(passwordInput, {target: {value: faker.internet.password()}})
        const emailInput = sut.getByLabelText('email')
        fireEvent.input(emailInput, {target: {value: faker.internet.email()}})
        const button = sut.getByRole('button', { name: 'Entrar' }) as HTMLButtonElement;
        fireEvent.click(button)
        const spinner = sut.getByTestId('spinner')
        expect(spinner).toBeTruthy()
    })
    test('Deve chamar authentication com valores corretos', () => {
        const { sut, authenticationSpy } = makeSut()
        const passwordInput = sut.getByLabelText('password')
        const password = faker.internet.password()
        fireEvent.input(passwordInput, {target: {value: password}})
        const emailInput = sut.getByLabelText('email')
        const email = faker.internet.email()
        fireEvent.input(emailInput, {target: {value: email}})
        const button = sut.getByRole('button', { name: 'Entrar' }) as HTMLButtonElement;
        fireEvent.click(button)
        expect(authenticationSpy.params).toEqual({
            email,
            password
        })
    })
})

