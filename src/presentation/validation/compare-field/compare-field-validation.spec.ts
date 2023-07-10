import { faker } from '@faker-js/faker'
import { CompareFieldValidation } from './compare-fiels-validation'
import { expect } from '@jest/globals'
import { CompareFieldError } from '../errors'

const makeSut = (field: string, fieldToCompare: string): CompareFieldValidation => {
  return new CompareFieldValidation(field, fieldToCompare)
}

describe('Teste validacao email', () => {
  test('Deve retornar error quando valores nao batem', () => {
    const field = faker.database.column()
    const fieldToCompare = faker.database.column()
    const sut = makeSut(field, fieldToCompare)

    const error = sut.validate({ [field]: faker.lorem.words(), [fieldToCompare]: faker.lorem.words() })

    expect(error).toEqual(new CompareFieldError())
  })
  test('Deve retornar null caso campos sejam identicos', () => {
    const field = faker.database.column()
    const fieldToCompare = faker.database.column()
    const value = faker.lorem.words()
    const sut = makeSut(field, fieldToCompare)

    const error = sut.validate({ [field]: value, [fieldToCompare]: value })

    expect(error).toBeFalsy()
  })
})
