import { ValidationComposite } from '@/presentation/validation'
import { ValidationBuilder } from '@/presentation/validation/validation-builder/validation-builder'

export const makeValidation = (): ValidationComposite => {
  return ValidationComposite.build([
    ...ValidationBuilder.field('email').required().email().build(),
    ...ValidationBuilder.field('password').required().minLength(5).build()
  ])
}
