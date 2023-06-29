export class EmailInvalidError extends Error {
    constructor() {
        super('Campo invalido')
        this.name = 'EmailInvalidError'
    }
}