import { RequiredFieldError } from '@/presentation/validation/errors/'
import { RequiredFieldValidation } from './required-field-validation'
import { faker } from '@faker-js/faker'
const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation('email')
}

describe('test campo obrigatorio', () => {
  test('Deve retornar erro caso campo nao esteja preenchido', () => {
    const sut = makeSut()

    const error = sut.validate('')

    expect(error).toEqual(new RequiredFieldError())
  })
  test('Deve retornar null caso o campo esteja preenchido', () => {
    const sut = makeSut()

    const error = sut.validate(faker.internet.email())

    expect(error).toBeFalsy()
  })
})
