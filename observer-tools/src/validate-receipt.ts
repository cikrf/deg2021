import { basename } from 'path'
import * as fs from 'fs'
import { log, logError } from './utils/log-utils'
import * as bs58 from 'bs58'
import { intToBytes, longToBytes } from './utils/byte-utils'
import { DataType } from './types'
import { gostVerify } from './utils/gost-utils'

export const validateReceipt = async (filename: string) => {
  try {
    const data = fs.readFileSync(filename)
    const tx = JSON.parse(data.toString())

    const { version, contractId, params } = tx.transaction
    const mapped = params.map((param: { type: string, key: string, value: any }) => {

      const key = [0, param.key.length, ...Buffer.from(param.key)]

      switch (param.type) {
        case 'string':
          const strLen = intToBytes(Buffer.from(param.value).length, 4, 65536)
          return Buffer.from([...key, DataType.STRING, ...strLen, ...Buffer.from(param.value)])
        case 'boolean':
          return Buffer.from([...key, DataType.BOOLEAN, param.value ? 1 : 0])
        case 'integer':
          return Buffer.from([...key, DataType.INTEGER, ...longToBytes(+param.value)])
        case 'binary':
          const value = Buffer.from(param.value.replace('base64:', ''), 'base64')
          const binLen = intToBytes(value.length, 4, 65536)
          return Buffer.from([...key, DataType.BINARY, ...binLen, ...value])
        default:
          throw new Error('Wrong type')
      }
    })

    const fee = longToBytes(+tx.transaction.fee)
    const timestamp = longToBytes(+tx.transaction.timestamp).splice(2)
    const contractVersion = intToBytes(+tx.transaction.contractVersion, 4)
    const paramBytes = [...intToBytes(params.length), ...Buffer.concat(mapped)]

    const bytes: Buffer = Buffer.from([
      104, version,
      ...bs58.decode(tx.signerPublicKey),
      0, 32,
      ...bs58.decode(contractId),
      ...paramBytes,
      ...fee,
      0, 0,
      ...timestamp,
      ...contractVersion,
      0, 0,
    ])

    const result = gostVerify(bs58.decode(tx.signerPublicKey), Buffer.from(tx.signature, 'base64'), bytes)
    if (!result) {
      logError(`${basename(filename)}: Подпись не корректна`)
    } else {
      log(`${basename(filename)}: Подпись корректна`)
    }

  } catch (e) {
    logError(`Не удается прочитать ${basename(filename)}`)
  }

}
