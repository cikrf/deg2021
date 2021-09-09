import { ABBytes, ContractState, SumAB, Tx } from '../types'
import { hashPoints } from '../utils/utils'
import * as BN from 'bn.js'
import * as bs58 from 'bs58'
import * as ref from 'ref-napi'
import * as ffi from 'ffi-napi'
import * as os from 'os'
import * as path from 'path'
import { Bulletin, Question } from '@wavesenterprise/rtk-encrypt/dist/types'
import { decode } from '@wavesenterprise/rtk-encrypt/dist'
import { createPoint } from '../utils/gost-utils'
import { verifySignature } from '../utils/rsa'
import { getBytes } from '../utils/get-bytes'

export enum Methods {
  initContexts = 'initContexts',
  validateBulletin = 'validateBulletin',
  solveDLP = 'solveDLP',
  addVotesChunk = 'addVotesChunk',
  encryptedSums = 'encryptedSums',
  verifyDLEq = 'verifyDLEq',
  publicKeyMul = 'publicKeyMul',
  verifyTxSignature = 'verifyTxSignature',
  validateBlindSignature = 'validateBlindSignature',
  validateTxSignature = 'validateTxSignature'
}

const ArrayType = require('ref-array-di')(ref)

const uint = ref.types.uint
const ulong = ref.types.ulong
const IntArray = ArrayType(uint)
const LongArray = ArrayType(ulong)
const CharPtr = ref.refType(ref.types.void)
const CharPtrArray = ArrayType(CharPtr)

const LIBRARY_DIR: { [key: string]: string } = {
  'darwin': './lib',
  'linux': './lib',
}

const LIBRARY_NAME = 'libgostcrypto' // libcsp.dylib // libcapi20.dylib
const LIBRARY_PATH = path.resolve(LIBRARY_DIR[os.platform()], LIBRARY_NAME)

const lib = ffi.Library(LIBRARY_PATH, {
  VerifyRangeProofExCompressedCryptoPro: [
    ref.types.int,
    [
      CharPtr,
      ref.types.uchar,
      IntArray,
      ref.types.uint,
      CharPtr, ref.types.uchar,
      CharPtr, ref.types.uchar,
      CharPtr, CharPtr,
      CharPtr, CharPtr,
      CharPtr,
      CharPtr,
    ],
  ],
  VerifyGost3410SignatureBE: [
    ref.types.bool,
    [
      CharPtr,
      CharPtr,
      CharPtr,
      ref.types.uint,
    ],
  ],
  publicKeyCombine: [
    ref.types.int,
    [
      CharPtrArray,
      ref.types.uint,
      CharPtrArray,
    ],
  ],
  generatePair: [
    ref.types.int,
    [
      CharPtrArray,
      CharPtrArray,
    ],
  ],
  validatePublicKey: [
    ref.types.bool,
    [
      CharPtrArray,
    ],
  ],
  validatePrivateKey: [
    ref.types.bool,
    [
      CharPtrArray,
      CharPtrArray,
    ],
  ],
  mixPublicKeys: [
    ref.types.int,
    [
      CharPtrArray,
      CharPtrArray,
      CharPtrArray,
    ],
  ],
  ProofEqualityOfDL: [
    ref.types.bool,
    [
      CharPtrArray,
      CharPtrArray,
      CharPtrArray,
      CharPtrArray,
      CharPtrArray,
      CharPtrArray,
      CharPtrArray,
      CharPtrArray,
    ],
  ],
  VerifyEqualityOfDLOpenSSL: [
    ref.types.bool,
    [
      CharPtrArray,
      CharPtrArray,
      CharPtrArray,
      CharPtrArray,
      CharPtrArray,
      CharPtrArray,
      CharPtrArray,
    ],
  ],
  publicKeyMul: [
    ref.types.int,
    [
      CharPtrArray,
      CharPtrArray,
      CharPtrArray,
    ],
  ],
  solveDLP: [
    ref.types.int,
    [
      CharPtrArray,
      ref.types.uint,
      ref.types.ulong,
      LongArray,
    ],
  ],
  initContexts: [
    ref.types.int,
    [],
  ],
})

const publicKeyCombine = (points: Buffer[], result?: Buffer): Buffer => {
  if (!result) {
    result = Buffer.alloc(33)
  }

  const bytes = Buffer.concat(points)
  if (lib.publicKeyCombine(bytes, points.length, result) !== 1) {
    throw new Error('Unknown wrapper error')
  }

  return result
}

const validateBulletin = (binary: Uint8Array, mainKey: string, dimension: number[][], callback: any) => {

  let bulletin: Bulletin
  try {
    bulletin = decode(binary)
  } catch (e) {
    return callback({
      valid: false,
      message: 'Protobuf decode error',
    })
  }

  if (
    bulletin.questions.length !== dimension.length ||
    bulletin.questions.some((q: Question, idx: number) => q.options.length !== dimension[idx][2])
  ) {
    return callback({
      valid: false,
      message: 'Wrong bulletin dimension',
    })
  }

  const isOdd = (point: Buffer | Uint8Array): any => point[0] === 0x02 ? 0 : 1
  const getX = (point: Buffer | Uint8Array): any => point.slice(1)

  const publicKey = Buffer.from(mainKey, 'hex')

  const valid = bulletin.questions.every((q, qIdx) => {
    return [...q.options, q.sum].every((option, oIdx, all) => {
      const [min, max] = dimension[qIdx]
      const conf =
        all.length - 1 === oIdx ?
          Array(max - min + 1).fill(0).map((_, i) => min + i)
          : [0, 1]

      const messages = IntArray(conf.length)
      conf.map((m, idx) => messages[idx] = m)

      const A = getX(option.A)

      const B = getX(option.B)

      const As = Buffer.concat(option.As.map(getX)) as any
      const AsFlags = Buffer.from(option.As.map(isOdd)) as any

      const Bs = Buffer.concat(option.Bs.map(getX)) as any
      const BsFlags = Buffer.from(option.Bs.map(isOdd)) as any
      const c = Buffer.concat(option.c) as any

      const r = Buffer.concat(option.r) as any

      return lib.VerifyRangeProofExCompressedCryptoPro(
        getX(publicKey), isOdd(publicKey),
        messages,
        conf.length,
        A, isOdd(option.A),
        B, isOdd(option.B),
        As, AsFlags,
        Bs, BsFlags,
        c, r,
      )
    })
  })

  return callback({
    valid,
    message: valid ? '' : 'Range proof validation error',
  })
}

// @todo error
const addVotesChunk = (ABs: ABBytes[][][], dimension: number[], callback: any) => {
  const result: ABBytes[][] = Array(dimension.length).fill(0).map((_, qIdx) =>
    Array(dimension[qIdx]).fill(0).map(() =>
      ({ A: Buffer.alloc(33), B: Buffer.alloc(33) })))

  for (let qIdx = 0; qIdx < dimension.length; qIdx++) {
    for (let oIdx = 0; oIdx < dimension[qIdx]; oIdx++) {

      const As = ABs.map((AB) => AB[qIdx][oIdx].A)
      publicKeyCombine(As, result[qIdx][oIdx].A)

      const Bs = ABs.map((AB) => AB[qIdx][oIdx].B)
      publicKeyCombine(Bs, result[qIdx][oIdx].B)
    }
  }
  return callback(result)
}

// @todo move to c
const encryptedSums = (
  sums: SumAB,
  dimension: number[],
  master: any,
  commission: any,
  callback: any,
) => {
  const p1 = master.publicKey
  const p2 = commission.publicKey
  const h1 = hashPoints([p1, p2])
  const h2 = hashPoints([p2, p1])

  const encryptedSums = dimension.map((options, qIdx) => {
    return Array(options).fill(0).map((_, oIdx) => {
      const P1 = createPoint(master.decryption[qIdx][oIdx].P).mul(new BN(h1))
      const P2 = createPoint(commission.decryption[qIdx][oIdx].P).mul(new BN(h2))

      const C = P1.add(P2)
      try {
        return Buffer.from(createPoint(sums[qIdx][oIdx].B)
          .add(C.neg())
          .encodeCompressed('array'))
      } catch (e) {
        return 0
      }
    })
  })

  return callback(encryptedSums)
}

const verifyDLEq = (
  { w, U1, U2, G1, Y1, G2, Y2 }: Record<string, Buffer>,
  callback: any,
) => {
  const result = lib.VerifyEqualityOfDLOpenSSL(w, U1, U2, G1, Y1, G2, Y2)
  return callback(result)
}

// @todo cleanup return format
const publicKeyMul = (point: Buffer, scalar: Buffer, callback: any) => {
  const result = Buffer.alloc(33)
  const res = lib.publicKeyMul(point, scalar, result)
  if (res) {
    return callback(result)
  }
  return callback(false)
}

const solveDLP = (Qs: Buffer[], n: number, callback: any) => {
  const pointsNum = Qs.length
  const results = LongArray(pointsNum)
  const points = Buffer.concat(Qs)
  lib.solveDLP(points, pointsNum, n, results)
  const result: any[] = []
  Array(pointsNum).fill(0).map((_, i) => {
    result[i] = {
      key: Qs[i].toString('hex'),
      sum: results[i],
    }
  })
  return callback(result)
}

const validateBlindSignature = (contractState: ContractState, tx: Tx, callback: any): boolean => {
  const modulo = new BN(contractState.VOTING_BASE.blindSigModulo, 'hex')
  const exp = new BN(contractState.VOTING_BASE.blindSigExponent, 'hex')
  const signature = Buffer.from(tx.params.blindSig, 'base64')
  const message = Buffer.from(tx.senderPublicKey)
  const result = verifySignature(modulo, exp, message, signature as any)
  return callback(result)
}

const validateTxSignature = (tx: Tx, callback: any) => {
  const senderPublicKey = bs58.decode(tx.senderPublicKey) as any

  const signature = bs58.decode(tx.signature) as any

  const data = getBytes(tx) as any

  try {
    const result = lib.VerifyGost3410SignatureBE(signature, senderPublicKey, data, data.length)
    return callback(result)
  } catch (e) {
    return callback(new Error(e))
  }
}

module.exports[Methods.validateBulletin] = validateBulletin

module.exports[Methods.solveDLP] = solveDLP

module.exports[Methods.addVotesChunk] = addVotesChunk

module.exports[Methods.encryptedSums] = encryptedSums

module.exports[Methods.verifyDLEq] = verifyDLEq

module.exports[Methods.publicKeyMul] = publicKeyMul

module.exports[Methods.validateBlindSignature] = validateBlindSignature

module.exports[Methods.validateTxSignature] = validateTxSignature
