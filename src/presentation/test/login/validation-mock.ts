import { type Validation } from '@/presentation/protocols/validation'

export class ValidationSpy implements Validation {
  errorMassage: string

  validate(inputName: string, input: object): string {
    return (
      this.errorMassage
    )
  }
}
