import { BasePoint, Bulletin, EncryptParams, Question, RangeProof } from './types'
import * as gost from './gost'
import * as BN from 'bn.js'
import { createPoint, generateRandomLessThanQ, generateRandomScalar, hashPoints } from './utils'

const Q = new BN(gost.Q, 'hex')

const defaultOpts: Pick<EncryptParams, 'validation'> = {
  validation: true,
}

export const encrypt = (opts: EncryptParams): Bulletin => {
  opts = { ...defaultOpts, ...opts }
  if (opts.validation && opts.dimension.length !== opts.bulletin.length) {
    throw new Error(`Selection configuration length should be equal bulletins length`)
  }

  const mainKey = createPoint(new BN(opts.mainKey, 'hex').toArrayLike(Buffer, 'be'))
  const base = createPoint(new BN(gost.BASE, 'hex').toArrayLike(Buffer, 'be'))
  const infinity = base.add(base.neg())

  const calculateRangeProof = (vote: number, selectionConf: number[], A: BasePoint, B: BasePoint, r: BN, publicKey: BasePoint): RangeProof => {
    const As: BasePoint[] = []
    const Bs: BasePoint[] = []
    const c_sum: BN = new BN(0)
    const r_ss = []
    const c_ = []
    let index_of_real = 0
    let r_s_of_real: BN = new BN(0)
    for (let i = 0; i < selectionConf.length; i++) {
      if (vote != selectionConf[i]) {
        c_.push(generateRandomLessThanQ())
        r_ss.push(generateRandomScalar())
        As.push(base.mul(r_ss[i]).add(A.mul(c_[i]).neg()))
        Bs.push(publicKey.mul(r_ss[i]).add(B.add(base.mul(new BN(selectionConf[i])).neg()).mul(c_[i]).neg()))
        c_sum.iadd(c_[i])
      } else {
        index_of_real = i
        r_s_of_real = generateRandomScalar()
        c_.push(new BN(0))
        r_ss.push(new BN(0))
        As.push(base.mul(r_s_of_real))
        Bs.push(publicKey.mul(r_s_of_real))
      }
    }

    const c = hashPoints([publicKey, A, B, ...As, ...Bs])
    const c_of_real = c.add(c_sum.neg()).umod(Q)
    const r_ss_real = r_s_of_real.add(c_of_real.mul(r)).umod(Q)
    c_[index_of_real] = c_of_real
    r_ss[index_of_real] = r_ss_real

    return {
      A: Uint8Array.from(A.encode('array', true)),
      B: Uint8Array.from(B.encode('array', true)),
      As: As.map((p) => Uint8Array.from(p.encode('array', true))),
      Bs: Bs.map((p) => Uint8Array.from(p.encode('array', true))),
      c: c_.map(num => Uint8Array.from(num.toArrayLike(Buffer, 'be', 32))),
      r: r_ss.map(num => Uint8Array.from(num.toArrayLike(Buffer, 'be', 32))),
    }
  }

  const makeEncryptedBulletin = (bulletin: number[], selectionConf: number[] = [0, 1], sumSelectionConf: number[] = [0, 1]): Question => {
    const min = Math.min(...sumSelectionConf)
    const max = Math.max(...sumSelectionConf)
    const selectedNum = bulletin.reduce((a, b) => a + b, 0)
    if (opts.validation && (min > selectedNum || max < selectedNum)) {
      throw new Error('Bad bulletin')
    }

    let sumR = infinity
    let sumC = infinity
    let sumr = new BN(0)
    let sumvote = 0

    const rangeProofs = bulletin.map((vote) => {
      const message = base.mul(new BN(vote))
      const r = generateRandomScalar()
      const R = base.mul(r)
      const C = mainKey.mul(r).add(message)
      sumvote += vote

      sumR = sumR.add(R)
      sumC = sumC.add(C)
      sumr = sumr.add(r).umod(Q)
      return calculateRangeProof(vote, selectionConf, R, C, r, mainKey)
    })

    const sumRangeProof = calculateRangeProof(sumvote, sumSelectionConf, sumR, sumC, sumr, mainKey)

    return {
      options: rangeProofs,
      sum: sumRangeProof,
    }

  }

  return {
    questions: opts.bulletin.map((question, i) => {
      const selectionConf: number[] = [0, 1]
      const sumSelectionConf: number[] = Array(opts.dimension[i].max - opts.dimension[i].min + 1).fill(0).map((_, j) => j + opts.dimension[i].min)

      return makeEncryptedBulletin(question, selectionConf, sumSelectionConf)
    }),
  }
}

