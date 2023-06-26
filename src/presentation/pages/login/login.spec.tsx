import React from "react"
import { render } from "@testing-library/react"
import Login  from "./login"

describe('Login testes', () => {
    test('Deve iniciar a tela sem spinner ou mensagem de erro', () => {
        const { getByTestId, getByRole } = render(<Login />);
        const formStatus = getByTestId('form-status')
        expect(formStatus.childElementCount).toBe(0);
        const button = getByRole('button', { name: 'Entrar' }) as HTMLButtonElement;
        expect(button.disabled).toBe(true)
        const emailStatus = getByTestId('email-status')
        expect(emailStatus.title).toBe('Campo Obrigatório')
        const passwordStatus = getByTestId('password-status')
        expect(passwordStatus.title).toBe('Campo Obrigatório')
    })
})