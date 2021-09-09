import * as BN from 'bn.js'
import { streebog256 } from '@wavesenterprise/rtk-encrypt/dist/streebog'
import { createPoint } from './gost-utils'

export const hashPoints = (points: Uint8Array[]): BN => {
  const source = Buffer.from(points
    .map((p) => createPoint(p as Buffer).encodeCompressed('hex'))
    .join(''))
  return new BN(streebog256(source).toString('hex'), 'hex')
}

export const fromHex = (hex: string, length?: number): Buffer => {
  try {
    return (new BN(hex, 'hex')).toBuffer('be', length)
  } catch (e) {
    throw new Error(`Wrong hex format ${hex}`)
  }
}
