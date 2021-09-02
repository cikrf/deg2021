import * as EC from 'elliptic'
import BasePoint = EC.curve.base.BasePoint

export type Point = string

export type KeyPair = {
  privateKey: Uint8Array,
  publicKey: Uint8Array,
}

export type KeyPairAndDecryption = KeyPair & {
  decryption: Decryption[][],
}

export type CryptoConfig = {
  a: string,
  b: string,
  p: string,
  q: string,
  base: string,
}

export type ABBytes = { A: Uint8Array, B: Uint8Array }

export type SumAB = ABBytes[][]

export type Decryption = {
  P: Uint8Array,
  w: Uint8Array,
  U1: Uint8Array,
  U2: Uint8Array,
}

export type ValidationResult = {
  valid: boolean,
  message: string,
  retry?: boolean,
}


export type DLPResult = {
  key: Uint8Array,
  sum: number,
}


export type Curve = EC.ec

export type CurvePoint = BasePoint
