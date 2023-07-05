import { RequiredFieldError } from '@/presentation/validation/errors/'
import { type FieldValidation } from '@/presentation/validation/protocols/'

export class RequiredFieldValidation implements FieldValidation {
  constructor(readonly field: string) { }

  validate(input: object): Error {
    return input[this.field] ? null : new RequiredFieldError()
  }
}
