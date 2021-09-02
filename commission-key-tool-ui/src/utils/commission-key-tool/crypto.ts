import { randomBytes } from 'crypto'
import { KeyPair, Share } from './types'
import BN from 'bn.js'
import { fromHex } from './utils'
import { A, B, BASE, curve, P, Q } from './curve'

export class Crypto {

  private readonly random: (size: number) => Uint8Array = randomBytes

  private config = {
    'a': A,
    'b': B,
    'p': P,
    'q': Q,
    'base': BASE,
  }

  private readonly q: BN
  private readonly base
  private readonly zero

  constructor(rnd?: (size: number) => Uint8Array) {
    if (rnd) {
      this.random = rnd
    }
    this.q = new BN(this.config.q, 'hex')
    this.base = fromHex(this.config.base)
    this.zero = new BN(0)
  }

  generatePrivateKey(): Uint8Array {
    return curve.genKeyPair().getPrivate().toBuffer('be', 32)
  }

  getPublicKey(privateKey: Uint8Array) {
    return Buffer.from(curve.keyFromPrivate(privateKey).getPublic(true, 'hex'), 'hex')
  }

  generateKeyPair(): KeyPair {
    const keyPair = curve.genKeyPair()
    return {
      privateKey: keyPair.getPrivate().toBuffer('be', 32),
      publicKey: Buffer.from(keyPair.getPublic(true, 'hex'), 'hex'),
    }
  }

  splitPrivateKey(privateKey: Uint8Array, k: number, n: number) {
    const coeffs = this.polynomialCoefficients(privateKey, k)
    const shares = Array(n).fill(0).map((_, i) => {
      return this.calculatePolynomial(i + 1, coeffs)
    })
    return shares.map((share, i) => ({
      idx: i + 1,
      val: share,
    }))
  }

  restorePrivateKey(shares: Share[]): Uint8Array {
    const indexes = shares.map(({ idx }) => idx)
    return shares.reduce((acc, share) => {
      const coeff = this.calculateLagrangeCoeff(share.idx, indexes)
      return acc.add(new BN(share.val).mul(coeff)).umod(this.q)
    }, new BN(0)).toBuffer('be', 32)
  }

  private polynomialCoefficients(first: Uint8Array, k: number): Uint8Array[] {
    return [first, ...Array(k - 1).fill(0).map(this.generatePrivateKey.bind(this))] as Uint8Array[]
  }

  private calculatePolynomial(j: number, coeffs: Uint8Array[]): Uint8Array {
    const sum = coeffs.reduce((acc, coeff, i) => {
      return new BN(coeff).mul(new BN(j).pow(new BN(i))).add(acc)
    }, new BN(0))
    return sum.umod(this.q).toBuffer('be', 32)
  }

  private mulInverse(x: BN): BN {
    const y = this.q.sub(new BN(2))
    let res = new BN(1)
    x = x.umod(this.q)
    while (y.gt(this.zero)) {
      if (y.isOdd()) {
        res = res.mul(x).umod(this.q)
      }
      y.iushrn(1)
      x = x.mul(x).umod(this.q)
    }
    return res
  }

  private calculateLagrangeCoeff(idx: number, indexes: number[]): BN {
    let res = new BN(1)
    indexes.map((index) => {
      if (index !== idx) {
        res = res.mul(new BN(index).mul(this.mulInverse(new BN(index - idx)))).mod(this.q)
      }
    })
    return res
  }
}
