import { EmailFieldValidation } from "../email-field/email-field-validation"
import { MinLengthValidation } from "../minlingth-field/minlength-fiel-validation"
import { RequiredFieldValidation } from "../required-field/required-field-validation"
import { ValidationBuilder } from "./validation-builder"
import { faker } from "@faker-js/faker"

describe('Validation builder test', () => {
    test('Deve retornar required validation', () => {
        const field = faker.database.column()
        const validation = ValidationBuilder.field(field).required().build()
        expect(validation).toEqual([new RequiredFieldValidation(field)])
    })
    test('Deve retornar email validation', () => {
        const field = faker.database.column()
        const validation = ValidationBuilder.field(field).email().build()
        expect(validation).toEqual([new EmailFieldValidation(field)])
    })
    test('Deve retornar minLength validation', () => {
        const field = faker.database.column()
        const validation = ValidationBuilder.field(field).minLength(5).build()
        expect(validation).toEqual([new MinLengthValidation(field, 5)])
    })
    test('Deve retornar todos validations', () => {
        const field = faker.database.column()
        const validation = ValidationBuilder.field(field).required().email().minLength(5).build()
        expect(validation).toEqual([
            new RequiredFieldValidation(field),
            new EmailFieldValidation(field),
            new MinLengthValidation(field, 5)
        ])
    })
})

