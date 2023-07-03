import { faker } from '@faker-js/faker'
import { MinLengthValidation } from './minlength-fiel-validation'
import { LengthInvalidError } from '../errors'

const makeSut = (): MinLengthValidation => {
  return new MinLengthValidation('senha', 5)
}

describe('minlength validation', () => {
  test('Deve retornar erro caso o numero de caracteres seja menor', () => {
    const sut = makeSut()

    const error = sut.validate(faker.string.alphanumeric(3))

    expect(error).toEqual(new LengthInvalidError(5))
  })
  test('Deve retornar nullo caso o numero de caracteres seja maior ou igual', () => {
    const sut = makeSut()

    const error = sut.validate(faker.string.alphanumeric(5))

    expect(error).toBeFalsy()
  })
})
