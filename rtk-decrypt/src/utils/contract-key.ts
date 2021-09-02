export const contractKey = (contractId: Uint8Array) => {
  return Buffer.from(contractId).toString('hex')
}
