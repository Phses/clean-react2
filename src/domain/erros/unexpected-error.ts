export class UnexpectedError extends Error {
    constructor() {
        super("erro inesperado")
        this.name = "UnexpectedError"
    }
}