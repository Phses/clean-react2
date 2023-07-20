import { faker } from '@faker-js/faker'
import { AuthAccount, type AuthParams } from '../models'
import { type Authentication } from '../usecases/authentication'

export class AuthenticationSpy implements Authentication {
  authAccount: AuthAccount = { token: faker.string.uuid(), name: faker.person.fullName() }
  params: AuthParams
  count: number = 0
  async auth(params: AuthParams): Promise<AuthAccount> {
    this.params = params
    this.count++
    return await Promise.resolve(this.authAccount)
  }
}
