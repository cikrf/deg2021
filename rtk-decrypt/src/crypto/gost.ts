import * as EC from 'elliptic'
import * as hash from 'hash.js'
import { CurvePoint, KeyPair } from './types'

export const P = 'fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd97'
export const Q = 'ffffffffffffffffffffffffffffffff6c611070995ad10045841b09b761b893'
export const B = '00000000000000000000000000000000000000000000000000000000000000a6'
export const A = 'fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd94'

const x = '0000000000000000000000000000000000000000000000000000000000000001'
const y = '8d91e471e0989cda27df505a453f2b7635294f2ddf23e3b122acc99c9e9f1e14'

export const BASE = `04${x}${y}`

const paramSetA = new EC.curves.PresetCurve({
  type: 'short',
  prime: null,
  p: P,
  a: A,
  b: B,
  n: Q,
  hash: hash.sha256,
  gRed: false,
  g: [
    x,
    y,
  ],
})


export const curve = new EC.ec(paramSetA)

export const createPoint = (point: Buffer | Uint8Array | string): CurvePoint => {
  if (typeof point === 'string') {
    return curve.keyFromPublic(point, 'hex').getPublic()
  } else if (Buffer.isBuffer(point)) {
    return curve.keyFromPublic(point.toString('hex'), 'hex').getPublic()
  } else {
    throw new Error('Unknown point format')
  }
}

export const generateKeyPair = (): KeyPair => {
  const keypair = curve.genKeyPair()
  return {
    privateKey: keypair.getPrivate().toBuffer('be'),
    publicKey: Buffer.from(keypair.getPublic().encode('array', true)),
  }
}
