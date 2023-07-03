import React, { useContext } from 'react'
import Styles from './form-status-styles.scss'
import Spinner from '../spinner/spinner'
import Context from '../../context/form-context'

const FormStatus: React.FC = () => {
  const { state } = useContext(Context)
  const { isLoading, mainError } = state
  return (
    <div data-testid="form-status" className={Styles.formStatus}>
      {isLoading && <Spinner className={Styles.spinner} />}
      {mainError && <span data-testid="main-error">{mainError}</span>}
    </div>
  )
}

export default FormStatus
