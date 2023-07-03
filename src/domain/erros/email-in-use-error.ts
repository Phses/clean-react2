export class EmailInUseError extends Error {
  constructor() {
    super('Este email ja esta sendo usado em outra conta')
    this.name = 'EmailInUseError'
  }
}
