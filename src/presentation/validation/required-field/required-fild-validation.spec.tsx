import { RequiredFieldError } from '@/presentation/validation/errors/'
import { RequiredFieldValidation } from './required-field-validation'
import { faker } from '@faker-js/faker'

const makeSut = (field: string): RequiredFieldValidation => {
  return new RequiredFieldValidation(field)
}

describe('test campo obrigatorio', () => {
  test('Deve retornar erro caso campo nao esteja preenchido', () => {
    const field = faker.database.column()
    const sut = makeSut(field)

    const error = sut.validate({ [field]: '' })

    expect(error).toEqual(new RequiredFieldError())
  })
  test('Deve retornar null caso o campo esteja preenchido', () => {
    const field = faker.database.column()
    const sut = makeSut(field)

    const error = sut.validate({ [field]: faker.internet.email() })

    expect(error).toBeFalsy()
  })
})
