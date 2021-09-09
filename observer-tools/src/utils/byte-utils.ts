import * as BN from 'bn.js'

export const hexToBytes = (data: string, length?: number): Uint8Array => {
  return (new BN(data, 'hex')).toBuffer('be', length)
}

export const intToBytes = (x: number, numBytes = 2, unsignedMax = 65536, opt_bigEndian = true) => {
  const signedMax = Math.floor(unsignedMax / 2)
  const negativeMax = (signedMax + 1) * -1
  if (x !== Math.floor(x) || x < negativeMax || x > unsignedMax) {
    throw new Error(
      x + ' is not a ' + (numBytes * 8) + ' bit integer')
  }
  const bytes = []
  let current
  // Number type 0 is in the positive int range, 1 is larger than signed int,
  // and 2 is negative int.
  const numberType = x >= 0 && x <= signedMax ? 0 :
    x > signedMax && x <= unsignedMax ? 1 : 2
  if (numberType === 2) {
    x = (x * -1) - 1
  }
  for (let i = 0; i < numBytes; i++) {
    if (numberType === 2) {
      current = 255 - (x % 256)
    } else {
      current = x % 256
    }

    if (opt_bigEndian) {
      bytes.unshift(current)
    } else {
      bytes.push(current)
    }

    if (numberType === 1) {
      x = Math.floor(x / 256)
    } else {
      x = x >> 8
    }
  }
  return bytes
}

export const longToBytes = (input: number): number[] => {
  if (typeof input !== 'number') {
    throw new Error('Numeric input is expected')
  }
  const bytes = new Array(7)
  for (let k = 7; k >= 0; k--) {
    bytes[k] = input & (255)
    input = input / 256
  }
  return bytes
}

export function concatUint8Arrays(...args: Uint8Array[]): Uint8Array {
  if (args.length < 2) {
    throw new Error('Two or more Uint8Array are expected')
  }

  if (!(args.every((arg) => arg instanceof Uint8Array))) {
    throw new Error('One of arguments is not a Uint8Array')
  }

  const count = args.length
  const sumLength = args.reduce((sum, arr) => sum + arr.length, 0)

  const result = new Uint8Array(sumLength)

  let curLength = 0

  for (let i = 0; i < count; i++) {
    result.set(args[i], curLength)
    curLength += args[i].length
  }

  return result

}
