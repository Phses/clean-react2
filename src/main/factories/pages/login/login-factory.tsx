import React from 'react'
import { Login } from '@/presentation/pages'
import { makeRemoteAuthentication } from '../../usecases/authentication/remote-authentication-factory'
import { makeLoginValidation } from '../../validation/validation-login-factory'
import { makeLocalAccountStorage } from '../../usecases/local-storage-token/local-storage-account-factory'

export const MakeLogin: React.FC = () => {
  const validation = makeLoginValidation()
  const authentication = makeRemoteAuthentication()
  const storgeAccount = makeLocalAccountStorage()
  return (
    <Login
      validation={validation}
      authentication={authentication}
      accountStorage={storgeAccount}
    />
  )
}
