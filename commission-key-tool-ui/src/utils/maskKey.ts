export const stringifyKey = (key: Uint8Array) => {
  return Buffer.from(key).toString('hex').padStart(64, '0')
}

export const maskKey = (key: Uint8Array, lastCharsNum = 4) => {
  const lastChars = stringifyKey(key).substr(-lastCharsNum)
  return Array(64 - lastCharsNum).fill('*').join('') + lastChars
}
