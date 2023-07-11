import { type AccountParams } from '@/domain/models'
import { faker } from '@faker-js/faker'

export const mockAccountParams = (): AccountParams => {
  const senha = faker.internet.password()
  return {
    nome: faker.person.fullName(),
    email: faker.internet.email(),
    senha
  }
}
