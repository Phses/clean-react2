import React from 'react'
import { Login } from '@/presentation/pages'
import { makeRemoteAuthentication } from '../../usecases/authentication/remote-authentication-factory'
import { makeLoginValidation } from '../../validation/validation-login-factory'
import { makeLocalStorageAcessToken } from '../../usecases/local-storage-token/local-storage-token-factory'

export const MakeLogin: React.FC = () => {
  const validation = makeLoginValidation()
  const authentication = makeRemoteAuthentication()
  const storgeAccessToken = makeLocalStorageAcessToken()
  return (
    <Login
      validation={validation}
      authentication={authentication}
      storgeAccessToken={storgeAccessToken}
    />
  )
}
