/* eslint-disable no-useless-escape */
import { EmailInvalidError } from '../errors/'
import { type FieldValidation } from '../protocols'

export class EmailFieldValidation implements FieldValidation {
  constructor(readonly field: string) { }

  validate(value: string): Error {
    const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    return re.test(value) ? null : new EmailInvalidError()
  }
}
