import * as EC from 'elliptic'

export type Point = Uint8Array
export type Scalar = Uint8Array

export type BasePoint = EC.curve.base.BasePoint

export type EncryptParams = {
  mainKey: string,
  bulletin: number[][],
  dimension: QuestionConfig[],
  validation?: boolean,
}

export type QuestionConfig = {
  min: number,
  max: number,
  options: number,
}

export type RangeProof = {
  A: Point,
  B: Point,
  As: Point[],
  Bs: Point[],
  c: Scalar[],
  r: Scalar[],
}

export type Question = {
  options: RangeProof[],
  sum: RangeProof
}

export type Bulletin = {
  questions: Question[]
}
