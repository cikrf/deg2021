import { getDateFromStr } from './date-utils'
import { ContractState, Tx, VotingOperation } from '../types'

export const getContractState = (txs: Tx[]): ContractState => {
  const state = txs.reduce((acc, { diff, params, operation }) => {
    if (operation === VotingOperation.decryption) {
      const key = Object.keys(diff)[0]
      diff[key] = params.decryption
    }
    if (operation === VotingOperation.commissionDecryption) {
      diff.COMMISSION_DECRYPTION = params.decryption
    }
    return { ...acc, ...diff }
  }, {}) as any

  const keys = Object.entries(state)
  for (const [key, value] of keys) {
    if (['VOTING_BASE', 'VOTERS_LIST_REGISTRATORS', 'SERVERS', 'RESULTS'].includes(key)) {
      state[key] = JSON.parse(value as string)
    } else {
      state[key] = state[key]
    }

    if (key === 'VOTING_BASE' && state.VOTING_BASE.dateStart) {
      state.VOTING_BASE.dateStart = getDateFromStr(state.VOTING_BASE.dateStart as any)
    }
    if (key === 'VOTING_BASE' && state.VOTING_BASE.dateEnd) {
      state.VOTING_BASE.dateEnd = getDateFromStr(state.VOTING_BASE.dateEnd as any)
    }
  }

  return state

}
