export type NodeConfig = {
  additionalFee: { [key: string]: number },
  minimumFee: { [key: string]: number },
  gostCrypto: boolean,
  chainId: number,
}

export enum GrpcClientStatus {
  'disconnected' = 'disconnected',
  'ready' = 'ready',
  'connecting' = 'connecting',
  'banned' = 'banned',
  'utxFull' = 'utxFull',
}
