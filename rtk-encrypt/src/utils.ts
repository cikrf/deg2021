import * as BN from 'bn.js'
import * as EC from 'elliptic'
import * as gost from './gost'
import { BasePoint } from './types'
import { streebog256 } from './streebog'

const Q = new BN(require('./gost').Q, 'hex')

const curve = new EC.ec(gost.curve)

export const createPoint = (point: Uint8Array | string): BasePoint => {
  return curve.keyFromPublic(point, 'hex').getPublic()
}

export const generateRandomScalar = (): BN => curve.genKeyPair().getPrivate()

export const generateRandomLessThanQ = (): BN => {
  const currentMaxNumber = Q.clone()
  const randomNumber = new BN(generateRandomScalar()).umod(Q)

  while (Q > currentMaxNumber) {
    randomNumber.imul(new BN(generateRandomScalar()))
    currentMaxNumber.imul(currentMaxNumber)
  }

  return randomNumber.umod(Q)
}

// @todo
export const hashPoints = (points: BasePoint[]): BN => {
  const source = Buffer.from(points
    .map((p) => p.encodeCompressed('hex'))
    // .map((p) => `${p.getX().toString()},${p.getY().toString()},`)
    .join(''))
  return new BN(streebog256(source).toString('hex'), 'hex')
}

