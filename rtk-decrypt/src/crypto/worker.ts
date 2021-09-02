import { validateBulletin as validate } from '@wavesenterprise/rtk-encrypt'
import { ABBytes } from './types'
import { BASE, createPoint } from './gost'

export enum Methods {
  validateBulletin = 'validateBulletin',
  solveDLP = 'solveDLP',
  addVotes = 'addVotes',
}

try {
  createPoint(Buffer.from(BASE, 'hex')).validate()
} catch (e) {
  console.error(`Wrong base point ${JSON.stringify(BASE)}`)
  process.exit(1)
}


const validateBulletin = (bulletin: Uint8Array, mainKey: string, dimension: number[][], callback: any) => {
  const result = validate(bulletin, mainKey, dimension)
  return callback(result)
}

const addVotes = (ABs: ABBytes[][][], dimension: number[], callback: any) => {
  const sum: ABBytes[][] = ABs.shift()!
  const result = ABs.reduce((acc, bulletin) => {
    dimension.map((options, qIdx) => {
      for (const oIdx in Array(options).fill(0)) {
        acc[qIdx][oIdx].A = Buffer.from(createPoint(Buffer.from(acc[qIdx][oIdx].A))
          .add(createPoint(Buffer.from(bulletin[qIdx][oIdx].A)))
          .encode('array', false))

        acc[qIdx][oIdx].B = Buffer.from(createPoint(Buffer.from(acc[qIdx][oIdx].B))
          .add(createPoint(Buffer.from(bulletin[qIdx][oIdx].B)))
          .encode('array', false))
      }
    })
    return acc
  }, sum)
  callback(result)
}

const solveDLP = (Qs: Uint8Array[], n: number, callback: any) => {
  const result = Array(Qs.length).fill(-1)
  const base = createPoint(BASE)
  let p = base
  let i = 1
  let finished = false
  const preparedQs = Qs.map(createPoint)

  while (i <= n && !finished) {
    preparedQs.map((Q, idx) => {
      if (p.eq(Q)) {
        result[idx] = i
      }
    })
    p = p.add(base)
    i++
    finished = result.filter((item) => item !== -1).length === Qs.length
  }

  callback(Qs.map((Q, idx) => ({ key: Buffer.from(Q).toString('hex'), sum: result[idx] })))
}


module.exports[Methods.validateBulletin] = validateBulletin
module.exports[Methods.solveDLP] = solveDLP
module.exports[Methods.addVotes] = addVotes
