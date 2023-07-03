import { type Validation } from '@/presentation/protocols/validation'
import { type FieldValidation } from '../protocols'

export class ValidationComposite implements Validation {
  private constructor(readonly validates: FieldValidation[]) { }

  static build(validates: FieldValidation[]): ValidationComposite {
    return new ValidationComposite(validates)
  }

  validate(inputName: string, inputValue: string): string {
    const validates = this.validates.filter(val => val.field === inputName)
    for (const validator of validates) {
      const error = validator.validate(inputValue)
      if (error) {
        return error.message
      }
    }

    return null
  }
}
