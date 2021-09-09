// @ts-ignore
import { GostEngine as gostEngine } from '@wavesenterprise/crypto-gost-js/dist/CryptoGost'
import * as EC from 'elliptic'
import * as hash from 'hash.js'
import { CurvePoint, KeyPair } from '../types'

const MAX_SIGN_ATTEMPTS = 20

const algorithmGostSign = {
  name: 'GOST R 34.10',
  version: 2012,
  mode: 'SIGN',
  length: 256,
  procreator: 'CP',
  keySize: 32,
  namedCurve: 'S-256-A',
  hash:
    {
      name: 'GOST R 34.11',
      version: 2012,
      mode: 'HASH',
      length: 256,
      procreator: 'CP',
      keySize: 32,
    },
  id: 'id-tc26-gost3410-12-256',
}

export const gostSign = (privateKey: Buffer, dataBytes: Buffer, attempts: number = 1): Buffer => {
  try {
    const GostSign = gostEngine.getGostSign({ ...algorithmGostSign })
    return GostSign.sign(privateKey, dataBytes)
  } catch (err) {
    if (attempts < MAX_SIGN_ATTEMPTS) {
      return gostSign(privateKey, dataBytes, attempts + 1)
    }
    err.message = (err.message || '') + ` failed to sign transaction ${attempts} times`
    throw err
  }
}

export const gostVerify = (publicKey: Buffer, signature: Buffer, data: Buffer) => {
  const GostSign = gostEngine.getGostSign({ ...algorithmGostSign })
  return GostSign.verify(publicKey, signature, data)
}

export const gostId = (data: Buffer | string): Buffer => {
  if (typeof data === 'string') {
    data = Buffer.from(data)
  }
  const GostDigest = gostEngine.getGostDigest({
    name: 'GOST R 34.11',
  })
  return new Buffer(GostDigest.digest(data))
}

export const P = 'fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd97'
export const Q = 'ffffffffffffffffffffffffffffffff6c611070995ad10045841b09b761b893'
export const B = '00000000000000000000000000000000000000000000000000000000000000a6'
export const A = 'fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd94'

const x = '0000000000000000000000000000000000000000000000000000000000000001'
const y = '8d91e471e0989cda27df505a453f2b7635294f2ddf23e3b122acc99c9e9f1e14'

export const BASE_COMPRESSED = '020000000000000000000000000000000000000000000000000000000000000001'
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

export const createPoint = (point: Buffer | Buffer | string): CurvePoint => {
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

