import { EmailFieldValidation } from '../email-field/email-field-validation'
import { MinLengthValidation } from '../minlength-field/minlength-fiel-validation'
import { type FieldValidation } from '../protocols'
import { RequiredFieldValidation } from '../required-field/required-field-validation'

export class ValidationBuilder {
  validations: FieldValidation[] = []
  private constructor(private readonly fieldName: string) { }

  static field(fieldName: string): ValidationBuilder {
    return new ValidationBuilder(fieldName)
  }

  required(): ValidationBuilder {
    this.validations.push(new RequiredFieldValidation(this.fieldName))
    return this
  }

  email(): ValidationBuilder {
    this.validations.push(new EmailFieldValidation(this.fieldName))
    return this
  }

  minLength(min: number): ValidationBuilder {
    this.validations.push(new MinLengthValidation(this.fieldName, min))
    return this
  }

  build(): FieldValidation[] {
    return this.validations
  }
}
