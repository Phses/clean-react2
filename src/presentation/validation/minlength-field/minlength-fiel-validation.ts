import { LengthInvalidError } from '../errors'
import { type FieldValidation } from '../protocols'

export class MinLengthValidation implements FieldValidation {
  constructor(readonly field: string, readonly minLength: number) { }

  validate(input: object): Error {
    return input[this.field]?.length < this.minLength ? new LengthInvalidError(this.minLength) : null
  }
}
