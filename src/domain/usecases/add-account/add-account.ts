import { type AccountParams, type AuthToken } from '@/domain/models'

export interface AddAccount {
  add: (params: AccountParams) => Promise<AuthToken>
}
