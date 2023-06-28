import React, { useEffect, useState } from "react";
import Styles from "./login-styles.scss"
import Context from "../../context/form-context"
import { Footer, Input, LoginHeader, FormStatus } from "@/presentation/components/";
import { Validation } from "@/presentation/protocols/validation";
import { Authentication } from "@/domain/usecases/authentication";

type Props = {
    validation: Validation
    authentication: Authentication
}

const Login: React.FC<Props> = ({ validation, authentication }: Props) => {
    const [state, setState] = useState({
        isLoading: false,
        email: '',
        password: '',
        emailError: '',
        passwordError: '',
        mainError: ''
    })

    useEffect(() => {
        setState({
            ...state,
            emailError: validation.validate('email', state.email),
            passwordError: validation.validate('password', state.password)
        })
    }, [state.email, state.password])

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event): Promise<void> => {
        event.preventDefault()
        setState({
            ...state,
            isLoading: true
        })
        await authentication.auth({
            email: state.email,
            password: state.password
        })
    }
    return(
        <div className={Styles.login}>
            <LoginHeader />
            <Context.Provider value={{state, setState}}>
                <form className={Styles.form} onSubmit={handleSubmit}>
                    <h2>Login</h2>
                    <Input type="email" name="email" id="email" placeholder="Digite seu email" />
                    <Input type="password" name="password" id="password" placeholder="Digite sua senha" />
                    <button type="submit" disabled={!!state.emailError || !!state.passwordError} className={Styles.submit}>Entrar</button>
                    <span className={Styles.link}><a href="#">Faça seu cadastro</a></span>
                    <FormStatus />
                </form>
            </Context.Provider>
            <Footer />
        </div>
    )
}

export default Login