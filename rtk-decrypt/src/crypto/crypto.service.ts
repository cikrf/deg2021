import { Injectable, OnApplicationShutdown } from '@nestjs/common'
import { ABBytes, Decryption, DLPResult, KeyPair, KeyPairAndDecryption, Point, SumAB, ValidationResult } from './types'
import { LoggerService } from '../logger/logger.service'
import { chunk, isEqual } from 'lodash'
import { ConfigService } from '../config/config.service'
import { hashPoints } from './utils'
import { Methods } from './worker'
import * as Farm from 'worker-farm'
import * as BN from 'bn.js'
import { BASE, createPoint, curve, Q } from './gost'


@Injectable()
export class CryptoService implements OnApplicationShutdown {

  private readonly threads: number = 1
  private readonly shortTasks: Farm.Workers
  private readonly longTasks: Farm.Workers

  constructor(
    private readonly configService: ConfigService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext(CryptoService.name)

    this.threads = this.configService.getShortCryptoThreads()

    this.loggerService.warn(`Starting ${this.threads} worker threads`)

    const farmOptions: Farm.FarmOptions = {
      workerOptions: {
        serialization: 'advanced',
      },
      maxConcurrentWorkers: this.threads,
      maxCallsPerWorker: Infinity,
      maxRetries: 3,
      maxConcurrentCallsPerWorker: this.configService.getMaxConcurrentCalls(),
      autoStart: true,
    }

    this.shortTasks = Farm({
      ...farmOptions,
      maxCallTime: this.configService.getShortTaskTimeout(),
    }, require.resolve('./worker'), [Methods.validateBulletin, Methods.addVotes])

    this.longTasks = Farm({
      ...farmOptions,
      maxCallTime: this.configService.getLongTaskTimeout(),
      maxConcurrentWorkers: this.configService.getLongCryptoThreads(),
    }, require.resolve('./worker'), [Methods.solveDLP])
  }

  onApplicationShutdown() {
    this.loggerService.warn('Terminating workers')
    Farm.end(this.shortTasks)
    Farm.end(this.longTasks)
  }

  generatePrivateKey() {
    return curve.genKeyPair().getPrivate().toBuffer('be', 32)
  }

  generateKeyPair(): KeyPair {
    const keyPair = curve.genKeyPair()
    return {
      privateKey: keyPair.getPrivate().toBuffer('be', 32),
      publicKey: Buffer.from(keyPair.getPublic().encodeCompressed('array')),
    }
  }

  validatePoint(point: Uint8Array): boolean {
    try {
      return createPoint(point).validate()
    } catch (err) {
      this.loggerService.error(err)
      return false
    }
  }

  validatePrivateKey(publicKey: Uint8Array, privateKey: Uint8Array) {
    try {
      const keyPair = curve.keyFromPrivate(privateKey)
      return keyPair.getPublic().eq(createPoint(publicKey as any))
    } catch (err) {
      this.loggerService.error(err)
      return false
    }
  }


  addCommissionPublicKey(p1: any, p2: any): Point {
    const k1 = hashPoints([p1, p2])
    const k2 = hashPoints([p2, p1])

    const h1 = createPoint(p1).mul(k1)
    const h2 = createPoint(p2).mul(k2)
    return h1.add(h2).encodeCompressed('hex')
  }

  validateBulletin(bulletin: Uint8Array, mainKey: string, dimension: number[][]): Promise<ValidationResult> {
    return new Promise((resolve, reject) => {
      this.shortTasks[Methods.validateBulletin](bulletin, mainKey, dimension, (result: Error | ValidationResult) => {
        if (result instanceof Error) {
          reject(result)
        } else {
          resolve(result)
        }
      })
    })
  }

  async addVotes(ABs: SumAB[], dimension: number[]): Promise<SumAB> {
    const batches = chunk(ABs, this.threads)

    const wrapped = (ABs: SumAB[], dimension: number[]): Promise<SumAB> =>
      new Promise((resolve, reject) => {
        this.shortTasks[Methods.addVotes](ABs, dimension, (result: Error | SumAB) => {
          if (result instanceof Error) {
            reject(result)
          } else {
            resolve(result)
          }
        })
      })

    const promises = batches.map((chunk) => wrapped(chunk, dimension))
    const result = await Promise.all(promises)
    return wrapped(result, dimension)
  }

  validateDLEq(
    w: Uint8Array,
    U1: Uint8Array,
    U2: Uint8Array,
    G1: Uint8Array,
    Y1: Uint8Array,
    G2: Uint8Array,
    Y2: Uint8Array,
    Rs: Uint8Array[] = [],
  ): boolean {
    try {
      const v = hashPoints([U1, U2, G1, Y1, G2, Y2, ...Rs])

      const k11 = createPoint(G1).mul(new BN(w))
      const k12 = createPoint(Y1).mul(new BN(v)).add(createPoint(U1))
      const k1 = k11.eq(k12)

      const k21 = createPoint(G2).mul(new BN(w))
      const k22 = createPoint(Y2).mul(new BN(v)).add(createPoint(U2))
      const k2 = k21.eq(k22)

      return k1 && k2
    } catch (e) {
      this.loggerService.error('Validation equality of DL failed', e)
      return false
    }
  }

  proofDLEq(
    x: Uint8Array,
    G1: Uint8Array,
    Y1: Uint8Array,
    G2: Uint8Array,
    Y2: Uint8Array,
    Rs: Uint8Array[] = [],
  ) {
    const u = this.generatePrivateKey()
    const U1 = Buffer.from(createPoint(G1)
      .mul(new BN(u))
      .encodeCompressed('array'))

    const U2 = Buffer.from(createPoint(G2)
      .mul(new BN(u))
      .encodeCompressed('array'))
    const v = hashPoints([U1, U2, G1, Y1, G2, Y2, ...Rs])

    const w = (new BN(x)
      .mul(v)
      .add(new BN(u)))
      .umod(new BN(Q, 'hex'))
      .toBuffer('be', 32)

    return { w, U1, U2 }
  }

  decryption(sums: ABBytes[][], dimension: number[], keyPair: KeyPair): Decryption[][] {
    return dimension.map((options, qIdx) => {
      return Array(options).fill(0).map((_, oIdx) => {
        const { publicKey, privateKey } = keyPair

        const P = Buffer.from(createPoint(sums[qIdx][oIdx].A)
          .mul(new BN(privateKey, 'hex'))
          .encodeCompressed('array'))

        const { w, U1, U2 } = this.proofDLEq(privateKey, Buffer.from(BASE, 'hex'), publicKey, sums[qIdx][oIdx].A, P)
        return { P, w, U1, U2 }
      })
    })
  }

  validateDecryption(sums: SumAB, dimension: number[], serverInfo: KeyPairAndDecryption): void {
    const result = dimension.every((options, qIdx) => {
      return Array(options).fill(0).every((_, oIdx) => {
        const { P, w, U1, U2 } = serverInfo.decryption![qIdx][oIdx]
        return this.validateDLEq(w, U1, U2, Buffer.from(BASE, 'hex'), serverInfo.publicKey, sums[qIdx][oIdx].A, P)
      })
    })
    if (!result) {
      throw new Error('Decryption is not valid')
    }
  }


  async calculateResults(
    sums: ABBytes[][],
    dimension: number[],
    n: number,
    master: KeyPairAndDecryption,
    commission: KeyPairAndDecryption,
  ): Promise<number[][]> {

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
            .encode('array', false))
        } catch (e) {
          return 0
        }
      })
    })

    const Qs = [...encryptedSums]
      .flatMap((Q) => Q)
      .filter((Q1, idx, self) => {
        return idx === self.findIndex((Q2) => isEqual(Q1, Q2))
      })
      .filter((Q) => Q !== 0)

    const decryptedQs = await new Promise((resolve, reject) => {
      this.longTasks[Methods.solveDLP](Qs, n, (result: Error | DLPResult) => {
        if (result instanceof Error) {
          reject(result)
        } else {
          resolve(result)
        }
      })
    })

    return encryptedSums.map((options) => {
      return options.map((sum) => {
        if (sum === 0) {
          return 0
        } else {
          const key = Buffer.from(sum).toString('hex')
          return (decryptedQs as any).find((Q: { key: string }) => {
            return key === Q.key
          }).sum
        }
      })
    })
  }

}
