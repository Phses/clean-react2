import { CompareFieldError } from '../errors/'
import { type FieldValidation } from '../protocols'

export class CompareFieldValidation implements FieldValidation {
  constructor(readonly field: string, readonly fieldToCompare: string) { }

  validate(input: object): Error {
    return input[this.field] === input[this.fieldToCompare] ? null : new CompareFieldError()
  }
}
