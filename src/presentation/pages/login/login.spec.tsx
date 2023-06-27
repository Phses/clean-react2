import React from "react"
import { fireEvent, render, RenderResult } from "@testing-library/react"
import Login  from "./login"
import { ValidationSpy } from "@/presentation/test/login/validation-mock"
import { faker } from "@faker-js/faker"
import exp from "constants"

type sutTypes = {
    sut: RenderResult,
    validationSpy: ValidationSpy
}

type sutProps = {
    validationError: string
}

const makeSut  = (props?: sutProps): sutTypes => {
    const validationSpy = new ValidationSpy()
    validationSpy.errorMassage = props?.validationError
    const sut = render(<Login validation={ validationSpy } />)
    return {
        sut,
        validationSpy
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
})

