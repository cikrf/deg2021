import * as BN from 'bn.js'
import { createPoint } from './gost'

const { GostEngine: gostEngine } = require('@wavesenterprise/crypto-gost-js')


export const hashPoints = (points: Uint8Array[]): BN => {
  const source = Buffer.from(points
    .map((p) => createPoint(p as Buffer).encodeCompressed('hex'))
    .join(''))
  return new BN(streebog256(source).toString('hex'), 'hex')
}


export const fromHex = (hex: string, length?: number): Uint8Array => {
  try {
    if (length && hex.length < length * 2) {
      hex.padStart(length * 2, '0')
    }
    return Buffer.from(hex, 'hex')
  } catch (e) {
    throw new Error(`Wrong hex format ${hex}`)
  }
}

export const toHex = (bytes: Uint8Array): string =>
  Buffer.from(bytes).toString('hex')


export const streebog256 = (data: Buffer) => {
  const streebog = gostEngine.getGostDigest(
    { name: 'GOST R 34.11', length: 256, version: 2012 },
  )
  return Buffer.from(streebog.digest(data))
}
