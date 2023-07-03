import { faker } from '@faker-js/faker'
import { type AuthParams, type AuthToken } from '../models'
import { type Authentication } from '../usecases/authentication'

export class AuthenticationSpy implements Authentication {
  authToken: AuthToken = { token: faker.string.uuid() }
  params: AuthParams
  count: number = 0
  async auth(params: AuthParams): Promise<AuthToken> {
    this.params = params
    this.count++
    return await Promise.resolve(this.authToken)
  }
}
