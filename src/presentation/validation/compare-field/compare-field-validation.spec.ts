import { faker } from '@faker-js/faker'
import { CompareFieldValidation } from './compare-fiels-validation'
import { CompareFieldError } from '../errors'

const makeSut = (fieldToCompare: string = faker.lorem.words()): CompareFieldValidation => {
  return new CompareFieldValidation('email', fieldToCompare)
}

describe('Teste validacao email', () => {
  test('Deve retornar error quando valores nao batem', () => {
    const sut = makeSut()

    const error = sut.validate(faker.lorem.words())

    expect(error).toEqual(new CompareFieldError())
  })
  test('Deve retornar null caso campos sejam identicos', () => {
    const fieldToCompare = faker.lorem.words()
    const sut = makeSut(fieldToCompare)

    const error = sut.validate(fieldToCompare)

    expect(error).toBeFalsy()
  })
})
