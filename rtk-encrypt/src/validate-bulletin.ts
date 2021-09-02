import { Bulletin, Question } from './types'

import * as gost from './gost'
import * as BN from 'bn.js'
import { createPoint, hashPoints } from './utils'
import { decode } from './serializer'

const BASE = createPoint(new BN(gost.BASE, 'hex').toArrayLike(Buffer, 'be'))

const Q = new BN(gost.Q, 'hex')

function validateRangeProof(
  mainKey: string,
  selectionConf: number[],
  A: Uint8Array,
  B: Uint8Array,
  A_s: Uint8Array[],
  B_s: Uint8Array[],
  c: Uint8Array[],
  r: Uint8Array[],
) {
  let c_sum: BN = new BN(0)

  for (const idx in A_s) {

    const rIdx = new BN(r[idx])
    const cIdx = new BN(c[idx])

    if (!BASE.mul(rIdx).eq(createPoint(A_s[idx]).add(createPoint(A).mul(cIdx)))) {
      // console.log('B1 - false')
      return false
    }

    const b21 = createPoint(mainKey).mul(rIdx)
    const b22 = createPoint(B).add(BASE.mul(new BN(selectionConf[idx])).neg())
    const b23 = createPoint(B_s[idx]).add(b22.mul(cIdx))
    if (!b21.eq(b23)) {
      return false
    }

    c_sum = c_sum.add(cIdx)
  }

  return c_sum.umod(Q).eq(hashPoints([mainKey, A, B, ...A_s, ...B_s].map(createPoint)))
}

export const validateBulletin = (bulletin: Uint8Array, mainKey: string, dimension: number[][]) => {
  let decoded: Bulletin
  try {
    decoded = decode(bulletin)
  } catch (e) {
    return {
      valid: false,
      message: 'Protobuf decode error',
    }
  }

  if (
    decoded.questions.length !== dimension.length ||
    decoded.questions.some((q: Question, idx: number) => q.options.length !== dimension[idx][2])
  ) {
    return {
      valid: false,
      message: 'Wrong bulletin dimension',
    }
  }
  try {
    const result = decoded.questions.every((q: Question, q_idx: number) => {
      return [...q.options, q.sum].every((option, idx, all) => {
        const [min, max] = dimension[q_idx]
        const sumConf = Array(max - min + 1).fill(0).map((_, i) => min + i)

        return validateRangeProof(
          mainKey,
          (all.length - 1 === idx ? sumConf : [0, 1]),
          option.A,
          option.B,
          option.As,
          option.Bs,
          option.c,
          option.r,
        )
      })
    })
    return {
      valid: result,
      message: !result ? 'Range proof validation error' : undefined,
    }
  } catch (e) {
    return {
      valid: false,
      message: `Unexpected error "${e.message}"`,
    }
  }
}
