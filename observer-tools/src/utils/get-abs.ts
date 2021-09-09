import { Bulletin } from '@wavesenterprise/rtk-encrypt/dist/types'
import { SumAB } from '../types'

export const getABs = ({ questions }: Bulletin): SumAB => {
  return questions.map(({ options }) => {
    return options.map((o) => {
      return {
        A: o.A as Buffer,
        B: o.B as Buffer,
      }
    })
  })
}
