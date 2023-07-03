export class CompareFieldError extends Error {
  constructor() {
    super('O valor dos campos nao sao iguais')
    this.name = 'CompareFieldError'
  }
}
