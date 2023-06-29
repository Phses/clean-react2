import { faker } from "@faker-js/faker"
import { FieldValidation } from "../protocols"
import { EmailFieldValidation } from "./email-field-validation"
import { EmailInvalidError } from "../errors"






const makeSut = ():EmailFieldValidation => {
    return new EmailFieldValidation('email')
}

describe('Teste validacao email', () => {
    test('Deve retornar error para email invalido', () => {
        const sut = makeSut()

        const error = sut.validate(faker.lorem.words())

        expect(error).toEqual(new EmailInvalidError())
    })
    test('Deve retornar null caso email seja valido', () => {
        const sut = makeSut()

        const error = sut.validate(faker.internet.email())

        expect(error).toBeFalsy()
    })
})