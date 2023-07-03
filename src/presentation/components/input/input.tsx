/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useContext } from 'react'
import Styles from './input-styles.scss'
import Context from '@/presentation/context/form-context'

type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

const Input: React.FC<Props> = (props: Props) => {
  const { state, setState } = useContext(Context)
  const value = state[`${props.name}Error`]

  const handleChange = (event: React.FocusEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [props.name]: event.target.value
    })
  }
  const getStatusContent = (): string => {
    return value ? '❌' : '✅'
  }
  return (
    <div className={Styles.inputWrapper}>
      <label htmlFor={props.name}>{props.name}</label>
      <input {...props} onChange={handleChange} />
      <span data-testid={`${props.name}-status`} title={value} className={Styles.inputStatus}>{getStatusContent()}</span>
    </div>
  )
}

export default Input
