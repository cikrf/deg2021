// @ts-ignore
import { GostEngine as gostEngine } from '@wavesenterprise/crypto-gost-js/dist/CryptoGost'

const MAX_SIGN_ATTEMPTS = 20

const algorithmGostSign = {
  name: 'GOST R 34.10',
  version: 2012,
  mode: 'SIGN',
  length: 256,
  procreator: 'CP',
  keySize: 32,
  namedCurve: 'S-256-A',
  hash:
    {
      name: 'GOST R 34.11',
      version: 2012,
      mode: 'HASH',
      length: 256,
      procreator: 'CP',
      keySize: 32,
    },
  id: 'id-tc26-gost3410-12-256',
}

export const gostSign = (privateKey: Uint8Array, dataBytes: Uint8Array, attempts: number = 1): Uint8Array => {
  try {
    const GostSign = gostEngine.getGostSign({ ...algorithmGostSign })
    return GostSign.sign(privateKey, dataBytes)
  } catch (err) {
    if (attempts < MAX_SIGN_ATTEMPTS) {
      return gostSign(privateKey, dataBytes, attempts + 1)
    }
    err.message = (err.message || '') + ` failed to sign transaction ${attempts} times`
    throw err
  }
}

export const gostVerify = (publicKey: Uint8Array, signature: Uint8Array, data: Uint8Array) => {
  const GostSign = gostEngine.getGostSign({ ...algorithmGostSign })
  return GostSign.verify(publicKey, signature, data)
}

export const gostId = (data: Uint8Array | string): Uint8Array => {
  if (typeof data === 'string') {
    data = Buffer.from(data)
  }
  const GostDigest = gostEngine.getGostDigest({
    name: 'GOST R 34.11',
  })
  return new Uint8Array(GostDigest.digest(data))
}
