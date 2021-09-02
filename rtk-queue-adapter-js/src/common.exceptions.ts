export class AlreadyInProcessingException extends Error {
  constructor(message?: string) {
    super(message)
    this.name = AlreadyInProcessingException.name
  }
}

export class AlreadyInStateException extends Error {
  constructor(message?: string) {
    super(message)
    this.name = AlreadyInStateException.name
  }
}

export class InvalidSignatureException extends Error {
  constructor(message?: string) {
    super(message)
    this.name = InvalidSignatureException.name
  }
}

export class UnknownErrorException extends Error {
  constructor(message?: string) {
    super(message)
    this.name = UnknownErrorException.name
  }
}

export class ContractNotFoundException extends Error {
  constructor(message?: string) {
    super(message)
    this.name = ContractNotFoundException.name
  }
}

export class NotReadyException extends Error {
  constructor(message?: string) {
    super(message)
    this.name = NotReadyException.name
  }
}

export class VoteValidationException extends Error {
  constructor(message?: string) {
    super(message)
    this.name = VoteValidationException.name
  }
}

export class InvalidPublicKeyException extends Error {
  constructor(message?: string) {
    super(message)
    this.name = InvalidPublicKeyException.name
  }
}
