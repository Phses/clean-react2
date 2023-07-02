import React from "react"
import { cleanup, fireEvent, render, RenderResult, waitFor } from "@testing-library/react"
import Login  from "./login"
import { createMemoryHistory, MemoryHistory } from "history"
import 'jest-localstorage-mock'
import { ValidationSpy } from "@/presentation/test/login/validation-mock"
import { faker } from "@faker-js/faker"
import { Authentication } from "@/domain/usecases/authentication"
import { AuthParams, AuthToken } from "@/domain/models"
import { InvalidCredentialsError } from "@/domain/erros"
import { Router } from "react-router-dom"
import { LocalStorageAccessTokenMock } from "@/presentation/test/login/local-storage-accessToken-mock"

type sutTypes = {
    sut: RenderResult,
    authenticationSpy: AuthenticationSpy,
    history: MemoryHistory,
    localStorageAccessToken: LocalStorageAccessTokenMock
}

type sutProps = {
    validationError: string
}

class AuthenticationSpy implements Authentication {
    authToken:AuthToken = { token: faker.string.uuid() }
    params: AuthParams
    count: number = 0
    auth(params: AuthParams): Promise<AuthToken> {
        this.params = params
        this.count++
        return Promise.resolve(this.authToken)
    }
}


const makeSut  = (props?: sutProps): sutTypes => {
    const history = createMemoryHistory({ initialEntries: ['/login'] })
    const validationSpy = new ValidationSpy()
    validationSpy.errorMassage = props?.validationError
    const authenticationSpy = new AuthenticationSpy()
    const localStorageAccessToken = new LocalStorageAccessTokenMock()
    const sut = render(
        <Router location={history.location} navigator={history}>
            <Login 
            validation={ validationSpy } 
            authentication={ authenticationSpy } 
            storgeAccessToken= { localStorageAccessToken }
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
    afterEach(() => {
        cleanup()
      })
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
        expect(inputStatus.textContent).toBe(`❌`)
    })
    test('Deve setar valor do input status com o erro do validation email', () => {
        const validationErro = faker.word.words()
        const { sut } = makeSut({validationError: validationErro})
        const inputStatus = sut.getByTestId('email-status')
        
        preencheCampoEmail(sut)
        
        expect(inputStatus.title).toBe(validationErro)
        expect(inputStatus.textContent).toBe('❌')
    })
    test('Deve setar valor do input status como vazio e mostrar sucesso email', () => {
        const { sut } = makeSut()
        const inputStatus = sut.getByTestId('email-status')
        
        preencheCampoEmail(sut)

        expect(inputStatus.title).toBe('')
        expect(inputStatus.textContent).toBe('✅')
    })
    test('Deve setar valor do input status como vazio e mostrar sucesso password', () => {
        const { sut } = makeSut()
        const inputStatus = sut.getByTestId('password-status')

        preencheCampoPassword(sut)

        expect(inputStatus.title).toBe('')
        expect(inputStatus.textContent).toBe('✅')
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
    test('Deve chamar authentication apenas uma vez enquanto isLoading', () => {
        const { sut, authenticationSpy } = makeSut()
        
        simulaSubmitComCamposPreenchidos(sut)
        simulaSubmitComCamposPreenchidos(sut)

        expect(authenticationSpy.count).toBe(1)
    })
    test('Nao deve chamar authentication caso exista erro no form', () => {
        const validationErro = faker.word.words()
        const { sut, authenticationSpy } = makeSut({validationError: validationErro})

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
        const mainError = sut.getByTestId('main-error')
        expect(formStatus.childElementCount).toBe(1);
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

