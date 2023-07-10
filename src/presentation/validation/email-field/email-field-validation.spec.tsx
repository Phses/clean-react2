import { faker } from '@faker-js/faker'
import { EmailFieldValidation } from './email-field-validation'
import { expect } from '@jest/globals'
import { EmailInvalidError } from '../errors'

const makeSut = (field: string): EmailFieldValidation => {
  return new EmailFieldValidation(field)
}

describe('Teste validacao email', () => {
  test('Deve retornar error para email invalido', () => {
    const field = faker.database.column()
    const sut = makeSut(field)

    const error = sut.validate({ [field]: faker.lorem.words() })

    expect(error).toEqual(new EmailInvalidError())
  })
  test('Deve retornar null caso email seja valido', () => {
    const field = faker.database.column()
    const sut = makeSut(field)

    const error = sut.validate({ [field]: faker.internet.email() })

    expect(error).toBeFalsy()
  })
})
