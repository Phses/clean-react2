import { type AuthParams } from '@/domain/models'
import { faker } from '@faker-js/faker'

export const mockAuthParams = (): AuthParams => {
  return {
    senha: faker.internet.password(),
    email: faker.internet.email()
  }
}
