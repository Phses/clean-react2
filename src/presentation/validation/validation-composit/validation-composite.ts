import { Validation } from "@/presentation/protocols/validation"
import { FieldValidation } from "../protocols"

export class ValidationComposite implements Validation {
    constructor(readonly validates: FieldValidation[]) {}

    validate(inputName: string, inputValue: string): string {
        const validates = this.validates.filter(val => val.field === inputName)
        for(const validator of validates) {
            const error = validator.validate(inputValue)
            if(error) {
                return error.message
            }
        }

        return null
    }
}