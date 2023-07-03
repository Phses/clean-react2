/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useEffect, useState } from 'react'
import Styles from './signup-styles.scss'
import Context from '../../context/form-context'
import { Footer, Input, LoginHeader, FormStatus } from '@/presentation/components/'
import { type Validation } from '@/presentation/protocols/validation'

type Props = {
  validation: Validation
}

const SignUp: React.FC<Props> = ({ validation }: Props) => {
  const [state, setState] = useState({
    isLoading: false,
    name: '',
    nameError: 'Campo Obrigatório',
    emailError: 'Campo Obrigatório',
    passwordError: 'Campo Obrigatório',
    confirmPasswordError: 'Campo Obrigatório'
  })

  useEffect(() => {
    setState({
      ...state,
      nameError: validation.validate('name', state.name)
    })
  }, [state.name])

  return (
    <div className={Styles.login}>
      <LoginHeader />
      <Context.Provider value={{ state, setState }}>
        <form className={Styles.form} >
          <h2>Cadastro</h2>
          <Input type="text" name="name" id="name" placeholder="Digite seu nome" />
          <Input type="email" name="email" id="email" placeholder="Digite seu email" />
          <Input type="password" name="password" id="password" placeholder="Digite sua senha" />
          <Input type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirme sua senha" />
          <button type="submit" disabled className={Styles.submit}>Cadastrar</button>
          <span className={Styles.link}>Voltar para o login</span>
          <FormStatus />
        </form>
      </Context.Provider>
      <Footer />
    </div>
  )
}

export default SignUp
