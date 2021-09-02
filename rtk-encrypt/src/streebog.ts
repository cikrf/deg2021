const { GostEngine: gostEngine } = require('@wavesenterprise/crypto-gost-js')

export const streebog256 = (data: Buffer) => {
  const streebog = gostEngine.getGostDigest(
    { name: 'GOST R 34.11', length: 256, version: 2012 },
  )
  return Buffer.from(streebog.digest(data))
}
