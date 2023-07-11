/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useEffect, useState } from 'react'
import Styles from './signup-styles.scss'
import Context from '../../context/form-context'
import { Footer, Input, LoginHeader, FormStatus } from '@/presentation/components/'
import { type Validation } from '@/presentation/protocols/validation'
import { type AddAccount } from '@/domain/usecases/add-account/add-account'
import { type AccessTokenStorage } from '@/domain/usecases/local-storage/local-store-token'
import { useNavigate } from 'react-router-dom'

type Props = {
  validation: Validation
  addAccount: AddAccount
  storgeAccessToken: AccessTokenStorage
}

const SignUp: React.FC<Props> = ({ validation, addAccount, storgeAccessToken }: Props) => {
  const navigate = useNavigate()
  const [state, setState] = useState({
    isLoading: false,
    isFormInvalid: true,
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    nameError: '',
    emailError: '',
    passwordError: '',
    confirmPasswordError: '',
    mainError: ''
  })

  useEffect(() => {
    const { name, email, password, confirmPassword } = state
    const formData = { name, email, password, confirmPassword }
    const nameError = validation.validate('name', formData)
    const emailError = validation.validate('email', formData)
    const passwordError = validation.validate('password', formData)
    const confirmPasswordError = validation.validate('confirmPassword', formData)
    setState({
      ...state,
      nameError,
      emailError,
      passwordError,
      confirmPasswordError,
      isFormInvalid: !!nameError || !!emailError || !!passwordError || !!confirmPasswordError
    })
  }, [state.name, state.email, state.password, state.confirmPassword])

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
      const accessToken = await addAccount.add({
        nome: state.name,
        email: state.email,
        senha: state.password
      })
      await storgeAccessToken.save(accessToken.token)
      navigate('/', { replace: true })
    } catch (error) {
      setState({
        ...state,
        mainError: error.message
      })
    }
  }
  return (
    <div className={Styles.login}>
      <LoginHeader />
      <Context.Provider value={{ state, setState }}>
        <form data-testid='form' className={Styles.form} onSubmit={handleSubmit}>
          <h2>Cadastro</h2>
          <Input type="text" name="name" id="name" placeholder="Digite seu nome" />
          <Input type="email" name="email" id="email" placeholder="Digite seu email" />
          <Input type="password" name="password" id="password" placeholder="Digite sua senha" />
          <Input type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirme sua senha" />
          <button type="submit" disabled={state.isFormInvalid} className={Styles.submit}>Cadastrar</button>
          <span data-testid='login-link' className={Styles.link} onClick={() => { navigate('/login') }}>Voltar para o login</span>
          <FormStatus />
        </form>
      </Context.Provider>
      <Footer />
    </div>
  )
}

export default SignUp
