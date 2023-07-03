export class LengthInvalidError extends Error {
  constructor(readonly minLength: number) {
    super(`Quantidades de caracteres precisa ser maior que ${minLength}`)
    this.name = 'LengthInvalidError'
  }
}
