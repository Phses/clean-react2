import { type AccountParams } from '@/domain/models'
import { faker } from '@faker-js/faker'

export const mockAccountParams = (): AccountParams => {
  const password = faker.internet.password()
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password,
    passwordConfirmation: password
  }
}
