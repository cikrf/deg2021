import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto'
import { isEqual } from 'lodash'

const CIPHER_ALGORITHM = 'aes-256-ctr'
const START_STR = Buffer.from('checksum')

export const encrypt = (bytes: Uint8Array, secret: string): Uint8Array => {
  const sha256 = createHash('sha256')
  sha256.update(secret)

  const iv = randomBytes(16)
  const cipher = createCipheriv(CIPHER_ALGORITHM, sha256.digest(), iv)

  const mixed = Buffer.concat([START_STR, bytes])

  const ciphertext = cipher.update(Buffer.from(mixed))
  return Buffer.concat([iv, ciphertext, cipher.final()])
}

export const decrypt = (bytes: Uint8Array, secret: string): Uint8Array => {
  const sha256 = createHash('sha256')
  sha256.update(secret)

  const input = Buffer.from(bytes)

  if (input.length < 17) {
    throw new TypeError('Provided "encrypted" must decrypt to a non-empty string')
  }

  const iv = input.slice(0, 16)
  const decipher = createDecipheriv(CIPHER_ALGORITHM, sha256.digest(), iv)

  const ciphertext = input.slice(16)
  const str = Buffer.concat([decipher.update(ciphertext), decipher.final()])
  if (!isEqual(str.slice(0, START_STR.length), START_STR)) {
    throw new Error('AES-256 decryption failed')
  }

  return str.slice(START_STR.length)
}
