import { resolve } from 'path'
import * as readline from 'readline'
import * as fs from 'fs'
import { parseLine } from './utils/parse-line'
import { BulletinsSum, ContractState, SumAB, Tx, ValidationConfig, ValidationResult, VOTERS_TX_OPERATIONS, VotingOperation } from './types'
import { execSync } from 'child_process'
import { log, logError, logVerbose } from './utils/log-utils'
import { isEqual } from 'lodash'
import { fromHex } from './utils/utils'
import { addVotesChunk, calculateResults, chunkSize, validateBlindSignature, validateBulletin, validateDecryption, validateTxSignature } from './worker'
import { progress } from './utils/progress'
import { getContractState } from './utils/get-contract-state'
import { decode } from '@wavesenterprise/rtk-encrypt/dist'
import { getABs } from './utils/get-abs'
import { getFiles } from './utils/get-files'

export const validate = async (contractId: string, dir: string, config: ValidationConfig) => {
  const files = await getFiles(resolve(dir, `*.csv`))

  if (files.length === 0) {
    logError('Файлы с транзакциями указанного голосования не найден')
    process.exit(0)
  }

  const stateTxs: Tx[] = []
  const txsBuffer: Tx[] = []
  const sum: BulletinsSum = {
    acc: [],
    valid: 0,
  }

  const rollbackTxs: string[] = []

  let txNum = +execSync(`cat *.csv | wc -l`, { cwd: dir }).toString()
  let curIdx = 0
  let contractState: ContractState = {}

  log('Проверка служебных транзакций и роллбеков...')
  for (const filename of files) {
    const fileStream = fs.createReadStream(filename)
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    })
    for await (const line of rl) {
      const tx = parseLine(line, contractId)

      if (!VOTERS_TX_OPERATIONS.includes(tx.operation)) {
        if (await validateTxSignature(tx)) {
          logVerbose(`${tx.nestedTxId.padStart(44, ' ')}: Подпись транзакции корректна`)
          if (!tx.rolledback) {
            stateTxs.push(tx)
          }
        } else {
          logError(`${tx.nestedTxId.padStart(44, ' ')}: Неверная подпись транзакции`)
        }
      }

      if (tx.rolledback) {
        rollbackTxs.push(tx.nestedTxId)
      }

    }
    contractState = getContractState(stateTxs)
    rl.close()
    fileStream.close()
  }

  if (!contractState.MAIN_KEY) {
    logError('Ошибка валидации голосования: не найден главный ключ')
  }

  if (!contractState.VOTING_BASE) {
    logError('Ошибка валидации голосования: не найдена конфигурация')
  }

  const mainKey = contractState.MAIN_KEY
  const dimension = contractState.VOTING_BASE.dimension

  log('Проверка бюллетеней...')
  for (const filename of files) {
    const fileStream = fs.createReadStream(filename, {
      start: 0,
    })
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    })
    for await (const line of rl) {
      const tx = parseLine(line, contractId)
      curIdx++

      if (VOTERS_TX_OPERATIONS.includes(tx.operation)) {
        txsBuffer.push(tx)
        if (txsBuffer.length > chunkSize) {
          await validateAndSumVotersTxs(config, txsBuffer, rollbackTxs, contractState, mainKey, dimension, sum)
        }
      }
      progress('Обработка транзакций', curIdx, txNum)
    }
    rl.close()
    fileStream.close()
  }
  await validateAndSumVotersTxs(config, txsBuffer, rollbackTxs, contractState, mainKey, dimension, sum)

  if (sum.valid) {
    await checkSum(config, sum.acc as SumAB, contractState, sum.valid)
  }

}

async function validateAndSumVotersTxs(config: ValidationConfig, txsBuffer: Tx[], rollbackTxs: string[], contractState: ContractState, mainKey: string, dimension: number[][], sum: BulletinsSum) {
  const txs = txsBuffer.splice(0, chunkSize)
  const promises = txs.map(async (tx): Promise<ValidationResult> => {

    if (config.txSig) {
      if (!await validateTxSignature(tx)) {
        logError(`${tx.nestedTxId.padStart(44, ' ')}: Неверная подпись транзакции`)
        return {
          txId: tx.nestedTxId,
          operation: tx.operation,
          valid: false,
        }
      } else {
        logVerbose(`${tx.nestedTxId.padStart(44, ' ')}: Подпись транзакции корректна`)
      }
    }

    if (tx.operation === VotingOperation.vote) {
      if (config.blindSig) {
        if (!await validateBlindSignature(contractState, tx)) {
          logError(`${tx.nestedTxId.padStart(44, ' ')}: Слепая подпись не прошла проверку`)
          return {
            txId: tx.nestedTxId,
            operation: tx.operation,
            valid: false,
          }
        } else {
          logVerbose(`${tx.nestedTxId.padStart(44, ' ')}: Слепая подпись корректна`)
        }
      }

      if (config.zkp) {
        const res = await validateBulletin(tx, mainKey, dimension)
        if (!res.valid) {
          logError(`${res.txId.padStart(44, ' ')}: Некорректный ZKP`)
        } else {
          logVerbose(`${res.txId.padStart(44, ' ')}: Проверка ZKP успешна`)
        }
        return {
          ...res,
          operation: tx.operation,
        }
      }
    }

    return {
      txId: tx.nestedTxId,
      operation: tx.operation,
      valid: true,
    }
  })

  const result = await Promise.all(promises)

  const toSum = result
    .filter((r) => r.valid)
    .filter((r) => r.operation === VotingOperation.vote)
    .filter((r) => !rollbackTxs.includes(r.txId))
    .map((r) => txs.find((t) => t.nestedTxId === r.txId)!)
    .map((b) => Buffer.from(b.params.vote, 'base64'))
    .map((b) => decode(b))
    .map((b) => getABs(b))

  if (toSum.length) {
    sum.valid += toSum.length

    if (sum.acc.length) {
      toSum.push(sum.acc)
    }
    sum.acc = await addVotesChunk(toSum as SumAB[], dimension.map(((d: any) => d[2])))
  }

}

async function checkSum(config: ValidationConfig, sumABs: SumAB, contractState: ContractState, validNum: number) {
  const dimension = contractState.VOTING_BASE.dimension.map((o: any[]) => o[2])
  log('Зашифрованная сумма подсчитана.')

  let masterPublicKey
  let masterDecryption
  let commissionDecryption
  let commissionPublicKey
  Object.entries(contractState).map(([key, value]) => {
    if (key === 'DKG_KEY' && typeof value === 'string') {
      masterPublicKey = fromHex(value)
    } else if (key === 'COMMISSION_KEY' && typeof value === 'string') {
      commissionPublicKey = fromHex(value)
    } else if (key.indexOf('DECRYPTION_') > -1 && typeof value === 'string') {
      masterDecryption = JSON.parse(value)
    } else if (key === 'COMMISSION_DECRYPTION' && typeof value === 'string') {
      commissionDecryption = JSON.parse(value)
    }
  })

  log(`Количество валидных бюллетеней: ${validNum}`)
  if (config.debug) {
    const result = contractState.RESULTS.map((question: number[]) => question.reduce((acc, option) => acc + option), 0)
    log(`Сумма из результатов ${JSON.stringify(result)}`)
  }

  if (masterDecryption && commissionDecryption && masterPublicKey && commissionPublicKey) {
    try {
      await validateDecryption(sumABs, dimension, masterPublicKey, masterDecryption)
      log('Расшифровка сервера корректна.')
    } catch (e) {
      throw new Error('Расшифровка сервера некорректна.')
    }
    try {
      await validateDecryption(sumABs, dimension, commissionPublicKey, commissionDecryption)
      log('Расшифровка комиссии корректна.')
    } catch (e) {
      throw new Error('Расшифровка комиссии некорректна.')
    }
  } else {
    throw new Error('Не хватает данных для проверки расшифровок.')
  }
  log(`\nПодсчет результата...`)

  const calculated = await calculateResults(
    sumABs,
    dimension,
    validNum,
    {
      publicKey: masterPublicKey,
      decryption: masterDecryption,
    },
    {
      publicKey: commissionPublicKey,
      decryption: commissionDecryption,
    },
  )

  log(`Результат из блокчейна: ${JSON.stringify(contractState.RESULTS)}`)
  log(`Подсчитанный результат: ${JSON.stringify(calculated)}`)
  if (isEqual(calculated, contractState.RESULTS)) {
    log('Результаты равны.')
  } else {
    logError('Результаты не совпадают')
  }
}
