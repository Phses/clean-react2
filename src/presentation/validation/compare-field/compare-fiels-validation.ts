import { CompareFieldError } from '../errors/'
import { type FieldValidation } from '../protocols'

export class CompareFieldValidation implements FieldValidation {
  constructor(readonly field: string, readonly valueToCompare: string) { }

  validate(value: string): Error {
    return value === this.valueToCompare ? null : new CompareFieldError()
  }
}
