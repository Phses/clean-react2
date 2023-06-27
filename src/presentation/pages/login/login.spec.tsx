import React from "react"
import { fireEvent, render, RenderResult } from "@testing-library/react"
import Login  from "./login"
import { ValidationSpy } from "@/presentation/test/login/validation-mock"
import { faker } from "@faker-js/faker"

type sutTypes = {
    sut: RenderResult,
    validationSpy: ValidationSpy
}

const makeSut  = (): sutTypes => {
    const validationSpy = new ValidationSpy()
    validationSpy.errorMassage = "Campo Obrigatório"
    const sut = render(<Login validation={ validationSpy } />)
    return {
        sut,
        validationSpy
    }
}

describe('Login testes', () => {
    test('Deve iniciar a tela com estado inicial', () => {
        const { sut } = makeSut();
        const formStatus = sut.getByTestId('form-status')
        expect(formStatus.childElementCount).toBe(0);
        const button = sut.getByRole('button', { name: 'Entrar' }) as HTMLButtonElement;
        expect(button.disabled).toBe(true)
        const emailStatus = sut.getByTestId('email-status')
        expect(emailStatus.title).toBe('Campo Obrigatório')
        const passwordStatus = sut.getByTestId('password-status')
        expect(passwordStatus.title).toBe('Campo Obrigatório')
    })
    
    test('Deve setar valor do input status com o erro do validation password', () => {
        const { sut, validationSpy } = makeSut()
        const errorMassage = faker.word.words()
        validationSpy.errorMassage = errorMassage
        const passwordInput = sut.getByLabelText('password')
        const inputStatus = sut.getByTestId('password-status')
        fireEvent.input(passwordInput, {target: {value: faker.internet.password()}})
        expect(inputStatus.title).toBe(errorMassage)
        expect(inputStatus.textContent).toBe(`&#10060`)
    })
    test('Deve setar valor do input status com o erro do validation email', () => {
        const { sut, validationSpy } = makeSut()
        const errorMassage = faker.word.words()
        validationSpy.errorMassage = errorMassage
        const emailInput = sut.getByLabelText('email')
        const inputStatus = sut.getByTestId('email-status')
        fireEvent.input(emailInput, {target: {value: faker.internet.email()}})
        expect(inputStatus.title).toBe(errorMassage)
        expect(inputStatus.textContent).toBe('&#10060')
    })
    test('Deve setar valor do input status como vazio e mostrar sucesso email', () => {
        const { sut, validationSpy } = makeSut()
        validationSpy.errorMassage = ''
        const emailInput = sut.getByLabelText('email')
        const inputStatus = sut.getByTestId('email-status')
        fireEvent.input(emailInput, {target: {value: faker.internet.email()}})
        expect(inputStatus.title).toBe('')
        expect(inputStatus.textContent).toBe('&#9989')
    })
    test('Deve setar valor do input status como vazio e mostrar sucesso password', () => {
        const { sut, validationSpy } = makeSut()
        validationSpy.errorMassage = ''
        const passwordInput = sut.getByLabelText('password')
        const inputStatus = sut.getByTestId('password-status')
        fireEvent.input(passwordInput, {target: {value: faker.internet.password()}})
        expect(inputStatus.title).toBe('')
        expect(inputStatus.textContent).toBe('&#9989')
    })
})