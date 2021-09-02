
export enum AlgorithmName {
  GOST3410 = 'GOST R 34.10',
  GOST3411 = 'GOST R 34.11',
}

export interface AlgorithmHash {
  name: AlgorithmName;
  version: number;
  mode: 'HASH';
  length: number;
  procreator: 'CP';
  keySize: number;
}

export interface IAlgorithm {
  keySize: number;
  length: number;
  mode: 'SIGN';
  name: AlgorithmName;
  procreator: 'CP';
  version: number;
  namedCurve?: 'S-256-A';
  hash?: AlgorithmHash;
  id: string; // 'id-tc26-gost3410-12-256'
}
