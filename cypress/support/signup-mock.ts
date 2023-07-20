import * as Helper from './http-mock'
import { faker } from '@faker-js/faker'

export const mockEmailInUseError = () => {
  Helper.mockForbbidenError('signup')
}

export const mockUnescpectdError = () => {
  Helper.mockUnescpectdError('signup')
}

export const mockOkWithInvalidBody = () => {
  Helper.mockOk('signup', { tokenInvalido: faker.string.uuid() })
}

export const mockOkWithValidBody = () => {
  Helper.mockOk('signup', { token: faker.string.uuid(), name: faker.person.fullName() })
}