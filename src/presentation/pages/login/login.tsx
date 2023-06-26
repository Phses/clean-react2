import React, { useState } from "react";
import Styles from "./login-styles.scss"
import Context from "../../context/form-context"
import { Footer, Input, LoginHeader, FormStatus } from "@/presentation/components/";


const Login: React.FC = () => {
    const [state] = useState({
        isLoading: false,
    })
    const [errorState] = useState({
        email: 'Campo Obrigatório',
        password: 'Campo Obrigatório',
        main: ''
    })
    return(
        <div className={Styles.login}>
            <LoginHeader />
            <Context.Provider value={{state, errorState}}>
                <form className={Styles.form}>
                    <h2>Login</h2>
                    <Input type="email" name="email" placeholder="Digite seu email" />
                    <Input type="password" name="password" placeholder="Digite sua senha" />
                    <button type="submit" disabled className={Styles.submit}>Entrar</button>
                    <span className={Styles.link}><a href="#">Faça seu cadastro</a></span>
                    <FormStatus />
                </form>
            </Context.Provider>
            <Footer />
        </div>
    )
}

export default Login