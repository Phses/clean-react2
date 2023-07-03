import { type AuthParams, type AuthToken } from '@/domain/models'

export interface Authentication {
  auth: (params: AuthParams) => Promise<AuthToken>
}
