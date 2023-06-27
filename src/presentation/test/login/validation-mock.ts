import { Validation } from "@/presentation/protocols/validation"

export class ValidationSpy implements Validation {
    errorMassage: string

    validate(inputName: string, inputValue: string): string {
        return  (
            this.errorMassage
        )
    }
}