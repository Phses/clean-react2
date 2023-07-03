/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Styles from './login-styles.scss'
import Context from '../../context/form-context'
import { Footer, Input, LoginHeader, FormStatus } from '@/presentation/components/'
import { type Validation } from '@/presentation/protocols/validation'
import { type Authentication } from '@/domain/usecases/authentication'
import { type AccessTokenStorage } from '@/domain/usecases/local-storage/local-store-token'

type Props = {
  validation: Validation
  authentication: Authentication
  storgeAccessToken: AccessTokenStorage
}

const Login: React.FC<Props> = ({ validation, authentication, storgeAccessToken }: Props) => {
  const navigate = useNavigate()
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
    if (state.isLoading || state.emailError || state.passwordError) {
      return
    }
    try {
      const accessToken = await authentication.auth({
        email: state.email,
        password: state.password
      })
      void storgeAccessToken.save(accessToken.token)
      navigate('/', { replace: true })
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        mainError: error.message
      })
    }
  }
  return (
    <div className={Styles.login}>
      <LoginHeader />
      <Context.Provider value={{ state, setState }}>
        <form data-testid='form' className={Styles.form} onSubmit={handleSubmit}>
          <h2>Login</h2>
          <Input type="email" name="email" id="email" placeholder="Digite seu email" />
          <Input type="password" name="password" id="password" placeholder="Digite sua senha" />
          <button type="submit" disabled={!!state.emailError || !!state.passwordError} className={Styles.submit}>Entrar</button>
          <span data-testid="signup" className={Styles.link} onClick={() => { navigate('/signup') }}>Faça seu cadastro</span>
          <FormStatus />
        </form>
      </Context.Provider>
      <Footer />
    </div>
  )
}

export default Login
