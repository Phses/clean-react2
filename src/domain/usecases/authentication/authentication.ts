import { AuthAccount, type AuthParams } from '@/domain/models'

export interface Authentication {
  auth: (params: AuthParams) => Promise<AuthAccount>
}
