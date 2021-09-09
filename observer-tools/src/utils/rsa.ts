import * as BN from 'bn.js'
import { streebog256 } from '@wavesenterprise/rtk-encrypt/dist/streebog'

export const FDH = (message: Buffer, n: Buffer, bitCount: number = 4096): Buffer => {
  if (bitCount % 256 !== 0) {
    throw new Error('Wrong bit count!!!')
  }

  if (n[0] % 0x80 === 0) {
    throw new Error('significant bit must be 1')
  }

  const hashes = []

  let iv = 0
  const blockCount = bitCount / 256
  const firstBlock = new BN(n.slice(0, 32))
  while (true) {
    const bytes = Buffer.from([...message, ...n, 1, iv])
    const hash = streebog256(bytes)
    iv++
    if (firstBlock.cmp(new BN(hash)) >= 0) {
      hashes[0] = hash
      break
    }
  }

  for (let i = 0; i < blockCount - 1; i++) {
    const bytes = Buffer.from([...message, ...n, 0, iv + i])
    const hash = streebog256(bytes)
    hashes.push(hash)
  }
  return Buffer.concat(hashes)
}

function modPow(a: any, b: any, n: any) {
  a = a % n
  let result = 1n
  let x = a
  while (b > 0) {
    const leastSignificantBit = b % 2n
    b = b / 2n
    if (leastSignificantBit === 1n) {
      result = result * x
      result = result % n
    }
    x = x * x
    x = x % n
  }
  return result
}

export const verifySignature = (modulo: BN, publicExp: BN, message: Buffer, signature: Buffer) => {
  const e = BigInt(publicExp.toString())
  const n = BigInt(modulo.toString())
  const padded = FDH(message, modulo.toBuffer('be'), 4096)
  const data = BigInt(new BN(signature).toString())
  const m1 = modPow(data, e, n)

  // console.logVerbose(modulo.toString('hex'))
  // console.logVerbose(m1, new BN(padded.toString('hex'), 'hex').toString())

  return BigInt(new BN(padded).toString()) === m1
}
