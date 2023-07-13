import { ValidationComposite } from '@/presentation/validation'
import { ValidationBuilder } from '@/presentation/validation/validation-builder/validation-builder'

export const makeSignUpValidation = (): ValidationComposite => {
  return ValidationComposite.build([
    ...ValidationBuilder.field('name').required().minLength(3).build(),
    ...ValidationBuilder.field('email').required().email().build(),
    ...ValidationBuilder.field('password').required().minLength(5).build(),
    ...ValidationBuilder.field('passwordConfirmation').required().sameAs('password').minLength(5).build()
  ])
}
