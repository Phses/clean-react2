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
    isFormInvalid: true,
    email: '',
    password: '',
    emailError: '',
    passwordError: '',
    mainError: ''
  })

  useEffect(() => {
    const { email, password } = state
    const formData = { email, password }
    const emailError = validation.validate('email', formData)
    const passwordError = validation.validate('password', formData)
    setState({
      ...state,
      emailError,
      passwordError,
      isFormInvalid: !!emailError || !!passwordError
    })
  }, [state.email, state.password])

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event): Promise<void> => {
    event.preventDefault()
    if (state.isLoading || state.isFormInvalid) {
      return
    }
    setState({
      ...state,
      isLoading: true
    })
    try {
      const accessToken = await authentication.auth({
        senha: state.password,
        email: state.email
      })
      await storgeAccessToken.save(accessToken.token)
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
          <button type="submit" data-testid="submit" disabled={state.isFormInvalid} className={Styles.submit}>Entrar</button>
          <span data-testid="signup-link" className={Styles.link} onClick={() => { navigate('/signup') }}>Faça seu cadastro</span>
          <FormStatus />
        </form>
      </Context.Provider>
      <Footer />
    </div>
  )
}

export default Login
