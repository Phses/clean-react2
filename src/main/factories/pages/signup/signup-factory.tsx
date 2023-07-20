import React from 'react'
import { SignUp } from '@/presentation/pages'
import { makeSignUpValidation } from '../../validation/validation-signup-factory'
import { makeLocalAccountStorage } from '../../usecases/local-storage-token/local-storage-account-factory'
import { makeRemoteAddAccount } from '../../usecases/add-account/remote-add-account-factory'

export const MakeSignUp: React.FC = () => {
  const validation = makeSignUpValidation()
  const addAccount = makeRemoteAddAccount()
  const storageAccount = makeLocalAccountStorage()
  return (
    <SignUp
      validation={validation}
      addAccount={addAccount}
      accountStorage={storageAccount}
    />
  )
}
