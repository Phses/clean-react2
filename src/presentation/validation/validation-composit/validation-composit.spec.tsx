import { FieldValidationSpy } from '../test/mock-field-validation'
import { ValidationComposite } from './validation-composite'

describe('Teste validation Composit', () => {
  test('Deve retonar primeiro erro caso algum validate retorne erro', () => {
    const fieldValidationSut1 = new FieldValidationSpy('any_field')
    const fieldValidationSut2 = new FieldValidationSpy('any_field')
    fieldValidationSut1.error = new Error('first-error')
    fieldValidationSut2.error = new Error('second_error')
    const sut = ValidationComposite.build([fieldValidationSut1, fieldValidationSut2])

    const error = sut.validate('any_field', { any_field: 'any_value' })

    expect(error).toBe('first-error')
  })
  test('Nao deve retonar erro caso  o validate nao for do campo especifico', () => {
    const fieldValidationSut1 = new FieldValidationSpy('any_field')
    const fieldValidationSut2 = new FieldValidationSpy('other_field')
    fieldValidationSut2.error = new Error('any-error')
    const sut = ValidationComposite.build([fieldValidationSut1, fieldValidationSut2])

    const error = sut.validate('any_field', { any_field: 'any_value' })

    expect(error).toBeFalsy()
  })
  test('Nao deve retonar null caso os validators nao retornem erro', () => {
    const fieldValidationSut1 = new FieldValidationSpy('any_field')
    const fieldValidationSut2 = new FieldValidationSpy('any_field')

    const sut = ValidationComposite.build([fieldValidationSut1, fieldValidationSut2])

    const error = sut.validate('any_field', { any_field: 'any_value' })

    expect(error).toBeFalsy()
  })
})
