import React from "react"
import { render } from "@testing-library/react"
import Login  from "./login"

describe('Login testes', () => {
    test('Deve iniciar a tela sem spinner ou mensagem de erro', () => {
        const { getByTestId } = render(<Login />);
        const formStatus = getByTestId('form-status')
        expect(formStatus.childElementCount).toBe(0);
    })
})