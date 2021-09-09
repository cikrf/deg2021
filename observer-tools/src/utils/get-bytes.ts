import { concatUint8Arrays, intToBytes, longToBytes } from './byte-utils'
import * as bs58 from 'bs58'
import { DataType, Tx } from '../types'

const getParamsBytes = (contractParams: any): Uint8Array => {
  const mapped = contractParams.map((entry: any) => {
    const { key, stringValue, boolValue, binaryValue, intValue } = entry
    let valBytes
    if (intValue) {
      valBytes = Uint8Array.from([DataType.INTEGER, ...longToBytes(+entry.intValue!)])
    } else if (boolValue) {
      valBytes = Uint8Array.from([DataType.BOOLEAN, entry.boolValue ? 1 : 0])
    } else if (binaryValue) {
      const value = Buffer.from(binaryValue, 'base64')
      const binLen = intToBytes(value.length, 4, 65536)
      valBytes = Uint8Array.from([DataType.BINARY, ...binLen, ...value!])
    } else if (stringValue) {
      const strLen = intToBytes(Buffer.from(entry.stringValue!).length, 4, 65536)
      valBytes = Uint8Array.from([DataType.STRING, ...strLen, ...Buffer.from(entry.stringValue!)])
    } else {
      throw new Error(`There is no data type "${entry.value}"`)
    }

    return Uint8Array.from([
      0,
      Buffer.from(key).length,
      ...Buffer.from(key),
      ...valBytes,
    ])
  })
  return mapped.length > 1 ? concatUint8Arrays(...mapped) : mapped[0]
}

export const getBytes = (tx: Tx): Buffer => {
  const feeAssetId = tx.feeAssetId ? Buffer.from(tx.feeAssetId) : [0]
  const atomicBadge = [0]
  const senderPublicKey = bs58.decode(tx.senderPublicKey)
  const fee = longToBytes(0)

  const timestamp = longToBytes(+tx.ts).splice(2)
  const paramsBytes = Buffer.from([...intToBytes(tx.raw.length), ...getParamsBytes(tx.raw)])

  let bytes: Buffer
  let data: Array<number>
  switch (tx.type) {
    case 103:
      const image = Buffer.from([0, Buffer.from(tx.extra.image).length, ...Buffer.from(tx.extra.image)])
      const imageHash = Buffer.from([0, Buffer.from(tx.extra.imageHash).length, ...Buffer.from(tx.extra.imageHash)])
      // eslint-disable-next-line max-len
      const contractName = Buffer.from([0, Buffer.from(tx.extra.contractName).length, ...Buffer.from(tx.extra.contractName)])
      data = [
        103, tx.version,
        ...senderPublicKey,
        ...image,
        ...imageHash,
        ...contractName,
        ...paramsBytes,
        0, 0,
        ...fee,
        ...timestamp,
      ]
      if (tx.version >= 2) {
        data.push(...feeAssetId)
      }
      if (tx.version >= 3) {
        data.push(...atomicBadge)
      }
      bytes = Buffer.from(data)
      break
    case 104:
      const contractId = Buffer.from([0, bs58.decode(tx.contractId).length, ...bs58.decode(tx.contractId)])
      const contractVersion = intToBytes(tx.extra.contractVersion, 4)
      data = [
        104, tx.version,
        ...senderPublicKey,
        ...contractId,
        ...paramsBytes,
        0, 0,
        ...fee,
        ...timestamp,
        ...contractVersion,
      ]
      if (tx.version >= 3) {
        data.push(...feeAssetId)
      }
      if (tx.version >= 4) {
        data.push(...atomicBadge)
      }
      bytes = Buffer.from(data)
      break
  }

  return bytes!
}
