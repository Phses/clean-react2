import { faker } from '@faker-js/faker'
import { expect } from '@jest/globals'
import { type RenderResult, fireEvent } from '@testing-library/react'

export const preencheCampo = (sut: RenderResult, inputType: string, valueField = faker.lorem.words()): void => {
  const input = sut.getByLabelText(inputType)
  fireEvent.input(input, { target: { value: valueField } })
}

export const verifcaFieldError = (sut: RenderResult, fieldTestId: string, fieldError: string = faker.lorem.words()): void => {
  const fieldStatus = sut.getByTestId(fieldTestId)
  expect(fieldStatus.title).toBe(fieldError)
}

export const verificaNumeroDeFilhos = (sut: RenderResult, testId: string, numChilds: number): void => {
  const formStatus = sut.getByTestId(testId)
  expect(formStatus.childElementCount).toBe(numChilds)
}

export const verificaFieldStatus = (sut: RenderResult, fieldTestId: string, textContent: string, fieldError: string = ''): void => {
  const inputStatus = sut.getByTestId(fieldTestId)
  expect(inputStatus.title).toBe(fieldError)
  expect(inputStatus.textContent).toBe(textContent)
}
