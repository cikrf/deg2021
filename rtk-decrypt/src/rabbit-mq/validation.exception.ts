export class ValidationException extends Error {
  constructor(readonly message: string) {
    super(message)
  }
}
