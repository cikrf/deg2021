/* eslint-disable no-console */

const { encrypt, encode, decode, validateBulletin } = require('../dist')

const mainKey = '0390c5f39d37648da4307007323234f425845bd9175d8fba5bcda20f5f1bff433a'

const encryptOptions = {
  mainKey: '0390c5f39d37648da4307007323234f425845bd9175d8fba5bcda20f5f1bff433a',
  dimension: [
    { min: 1, max: 2, options: 5 },
  ],
  bulletin: [[0, 0, 0, 0, 1]],
  validation: false,
}

const encrypted = encrypt(encryptOptions)
const binary = encode(encrypted)
const decoded = decode(binary)
const binarySize = binary.length

console.log(binary.toString('hex'))
console.log(`Protobuf: ${binarySize}`)
console.log(`Validation: ${JSON.stringify(validateBulletin(binary, mainKey, [[1, 2, 5]]))}`)
