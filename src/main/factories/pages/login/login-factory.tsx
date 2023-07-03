import React from 'react'
import { Login } from '@/presentation/pages'
import { makeRemoteAuthentication } from '../../usecases/authentication/remote-authentication-factory'
import { makeValidation } from '../../validation/validation-factory'
import { makeLocalStorageAcessToken } from '../../usecases/local-storage-token/local-storage-token-factory'

export const MakeLogin: React.FC = () => {
  const validation = makeValidation()
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
