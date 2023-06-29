import { LengthInvalidError } from "../errors/";
import { FieldValidation } from "../protocols";

export class MinLengthValidation implements FieldValidation {
    constructor(readonly field: string, readonly minLength: number) {}

    validate(value: string): Error {
        return value.length >= this.minLength ? null : new LengthInvalidError(this.minLength)
    }
}