import * as secp256k1 from 'secp256k1'
import BN from 'bn.js'
import { createHash } from 'crypto'
import { PointObj } from './types'

export const hashPoints = (points: Uint8Array[]): BN => {
  const source = points
    .map((p) => secp256k1.publicKeyConvert(p, true))
    .map((p) => Buffer.from(p).toString('hex'))
    .join('')
  return new BN(createHash('sha256').update(source).digest())
}

export const fromHex = (hex: string, length: number = 0): Uint8Array => {
  const hexStr = !(hex.length % 2) ? hex : '0' + hex
  return Buffer.from(hexStr.padStart(length, '0'))
}

export const toHex = (bytes: Uint8Array): string =>
  Buffer.from(bytes).toString('hex')


export const compact = (p: string): Uint8Array => {
  return secp256k1.publicKeyConvert(fromHex(p), true)
}

export const uncompact = (p: string): Uint8Array => {
  return secp256k1.publicKeyConvert(fromHex(p), false)
}

export const negative = (y: string, p: string): string => {
  return new BN(
    secp256k1.privateKeyTweakAdd(fromHex(p, 32),
      secp256k1.privateKeyNegate(fromHex(y, 32))),
  ).toString('hex')
}

export const coordsToString = (p: PointObj) => `04${p.x.padStart(64, '0')}${p.y.padStart(64, '0')}`

export const stringToCoords = (p: string): PointObj => ({
  x: p.substr(2, 64),
  y: p.substr(66, 64),
})
