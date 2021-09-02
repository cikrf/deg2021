export type KeyPair = {
  privateKey: Uint8Array,
  publicKey: Uint8Array,
}

export type PointObj = {
  x: string,
  y: string,
}

export type Share = {
  idx: number,
  val: Uint8Array,
  pub: Uint8Array,
}
