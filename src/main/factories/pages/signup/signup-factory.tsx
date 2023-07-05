import React from 'react'
import { SignUp } from '@/presentation/pages'
import { makeSignUpValidation } from '../../validation/validation-signup-factory'
import { makeLocalStorageAcessToken } from '../../usecases/local-storage-token/local-storage-token-factory'
import { makeRemoteAddAccount } from '../../usecases/add-account/remote-add-account-factory'

export const MakeSignUp: React.FC = () => {
  const validation = makeSignUpValidation()
  const addAccount = makeRemoteAddAccount()
  const storgeAccessToken = makeLocalStorageAcessToken()
  return (
    <SignUp
      validation={validation}
      addAccount={addAccount}
      storgeAccessToken={storgeAccessToken}
    />
  )
}
