#!/usr/bin/env node

import * as yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { basename, resolve } from 'path'
import { mkdtemp } from 'fs/promises'
import * as rimraf from 'rimraf'
import { validate } from './validate'
import { log, logError } from './utils/log-utils'
import { unpackFile } from './unpack'
import { terminateWorkers } from './worker'
import { ValidationConfig } from './types'
import { getFiles } from './utils/get-files'
import { validateReceipt } from './validate-receipt'

(async () => {
  const argv = await yargs(hideBin(process.argv))
    .command('validate [contractId]', 'Проверить голосования', (yargs) => {
      return yargs
        .positional('contractId', {
          describe: 'Идентификатор голосования',
          type: 'string',
          demandOption: true,
        })
        .boolean('tx-sig')
        .boolean('blind-sig')
        .boolean('zkp')
        .boolean('debug')
    })
    .argv

  const command = argv['_'][0]

  let files: string[]

  switch (command) {
    case 'validate':

      const config: ValidationConfig = {
        debug: argv.debug !== undefined ? Boolean(argv.debug) : false,
        txSig: argv.txSig !== undefined ? Boolean(argv.txSig) : true,
        blindSig: argv.blindSig !== undefined ? Boolean(argv.blindSig) : true,
        zkp: argv.zkp !== undefined ? Boolean(argv.zkp) : true,
      }

      let contractIds: string[] = []
      if (argv.contractId) {
        files = await getFiles(resolve('.', 'files', `${argv.contractId}*.zip`))
        if (files.length === 0) {
          logError('Выгрузка транзакций голосования не найдена')
        } else {
          contractIds.push(argv.contractId)
        }
      } else {
        files = await getFiles(resolve('.', 'files', '*.zip'))
        files.map((filename) => {
          const contractId = basename(filename.split('_')[0])
          if (!contractIds.includes(contractId)) {
            contractIds.push(contractId)
          }
        })
      }

      for (const contractId of contractIds) {
        const tmpDir = await mkdtemp(`observer-tool-tmp-`)
        try {
          files = await getFiles(resolve('.', 'files', `${contractId}*.zip`))
          log(`\n\nПроверка голосования ${contractId}`)
          log('Распаковка архивов... ')
          for (const filename of files) {
            await unpackFile(filename, tmpDir)
          }
          log('Обработка файлов с транзакциями')
          await validate(contractId, tmpDir, config)
        } catch (e) {
          logError(e)
        }
        rimraf.sync(tmpDir)
      }

      break

    case 'validate-receipt':

      files = await getFiles(resolve('.', 'files', `*.json`))
      if (files.length === 0) {
        logError('Файлы для проверки не найдены')
      }

      for (const file of files) {
        await validateReceipt(file)
      }

      break
    default:
      logError('Требуется указать команду')
      break
  }
  terminateWorkers()
  process.exit(0)

})()

