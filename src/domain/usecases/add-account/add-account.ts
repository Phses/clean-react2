import { AuthAccount, type AccountParams } from '@/domain/models'

export interface AddAccount {
  add: (params: AccountParams) => Promise<AuthAccount>
}
