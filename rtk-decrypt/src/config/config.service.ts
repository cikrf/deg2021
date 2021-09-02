import { readFileSync } from 'fs'
import { version } from '../../package.json'
import { Injectable } from '@nestjs/common'
import { parseJsonEnv } from '../utils/parse-json-env'
import { setConfig } from '../utils/set-config'
import * as bs58 from 'bs58'
import * as os from 'os'

setConfig()

const buildInfo = getBuildInfo()

type BuildInfo = {
  BUILD_ID: string,
  GIT_COMMIT: string,
  DOCKER_TAG: string,
}

function getBuildInfo(): BuildInfo {
  const buildDefault = {
    BUILD_ID: 'development',
    GIT_COMMIT: 'development',
    DOCKER_TAG: 'development',
  }
  try {
    const info = readFileSync('versions.json').toString()
    return {
      buildDefault,
      ...JSON.parse(info),
    }

  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('not found versions.json', err.message)
  }
  return buildDefault
}

export const isValidEnv = (env: { [key: string]: unknown }) => {
  return Object.keys(env).reduce((isValid: boolean, key: string) => {
    if (env[key] === undefined) {
      // eslint-disable-next-line no-console
      console.error(`Please set correct config/env variable: ${key}`)
      return false
    }
    return isValid
  }, true)
}

function getRequiredEnv() {
  return {
    POSTGRES_USER: process.env.POSTGRES_USER as string,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD as string,
    POSTGRES_DB: process.env.POSTGRES_DB as string,
    POSTGRES_PORT: process.env.POSTGRES_PORT,
    POSTGRES_HOST: process.env.POSTGRES_HOST as string,
    GRPC_ADDRESS: parseJsonEnv(process.env.GRPC_ADDRESS),
    PRIVATE_KEY: process.env.PRIVATE_KEY as string,
    PUBLIC_KEY: process.env.PUBLIC_KEY as string,
    CONTRACT_IMAGE: process.env.CONTRACT_IMAGE as string,
    CONTRACT_IMAGE_HASH: process.env.CONTRACT_IMAGE_HASH as string,
  }
}

function prepareEnv() {
  const requiredEnv = getRequiredEnv()

  if (!isValidEnv(requiredEnv)) {
    return process.exit(1)
  }

  return {
    ...requiredEnv,
    SHORT_CRYPTO_THREADS: process.env.SHORT_CRYPTO_THREADS || 'AUTO',
    PORT: process.env.PORT || 3000,
    GIT_COMMIT: buildInfo.GIT_COMMIT,
    BUILD_ID: buildInfo.BUILD_ID,
    DOCKER_TAG: buildInfo.DOCKER_TAG,
    POSTGRES_ENABLE_SSL: process.env.POSTGRES_ENABLE_SSL === 'true',
    TX_SUCCESS_TIMEOUT: process.env.TX_SUCCESS_TIMEOUT && +process.env.TX_SUCCESS_TIMEOUT || 120000,
    LOG_LEVEL: process.env.LOG_LEVEL,
    NODE_ENV: process.env.NODE_ENV,
    SWAGGER_BASE_PATH: process.env.SWAGGER_BASE_PATH || '/',
    DEV_START_FROM_BLOCK: process.env.DEV_START_FROM_BLOCK,
    DEV_DISABLE_STATUS_CHECK: process.env.DEV_DISABLE_STATUS_CHECK === 'true',
    DEAD_BLOCKCHAIN_TIMEOUT: process.env.DEAD_BLOCKCHAIN_TIMEOUT ? +process.env.DEAD_BLOCKCHAIN_TIMEOUT : 30000,
    MASTER_KEYS: process.env.MASTER_KEYS ? parseJsonEnv(process.env.MASTER_KEYS, 'MASTER_KEYS') : [process.env.PUBLIC_KEY],
    AES256_SECRET: process.env.AES256_SECRET || '',
    AUTH_SERVICE_ADDRESS: process.env.AUTH_SERVICE_ADDRESS,
    AUTH_SERVICE_TOKEN: process.env.AUTH_SERVICE_TOKEN,
    API_KEY: process.env.API_KEY,
    VALIDATION_CHUNK_SIZE: process.env.VALIDATION_CHUNK_SIZE && +process.env.VALIDATION_CHUNK_SIZE || 2000,
    SUM_CHUNK_SIZE: process.env.SUM_CHUNK_SIZE && +process.env.SUM_CHUNK_SIZE || 1000,
    MAX_QUEUE_LENGTH: process.env.MAX_QUEUE_LENGTH && +process.env.MAX_QUEUE_LENGTH || 2048,
    MAX_CONCURRENT_CALLS: process.env.MAX_CONCURRENT_CALLS && +process.env.MAX_CONCURRENT_CALLS || 1,
    LONG_CRYPTO_THREADS: process.env.LONG_CRYPTO_THREADS,
    SHORT_TASK_TIMEOUT: process.env.SHORT_TASK_TIMEOUT && +process.env.SHORT_TASK_TIMEOUT || 1000,
    LONG_TASK_TIMEOUT: process.env.LONG_TASK_TIMEOUT && +process.env.LONG_TASK_TIMEOUT || 120000,
    SERVICE_NAME: process.env.SERVICE_NAME || os.hostname(),
  }
}

@Injectable()
export class ConfigService {
  private readonly envConfig = prepareEnv()

  getValidationChunkSize() {
    return this.envConfig.VALIDATION_CHUNK_SIZE
  }

  getSumChunkSize() {
    return this.envConfig.SUM_CHUNK_SIZE
  }

  getMaxQueueLength() {
    return this.envConfig.MAX_QUEUE_LENGTH
  }

  getMaxConcurrentCalls() {
    return this.envConfig.MAX_CONCURRENT_CALLS
  }

  getAES256Secret() {
    return this.envConfig.AES256_SECRET
  }

  getServiceName() {
    return this.envConfig.SERVICE_NAME.slice(0, 16)
  }

  getShortCryptoThreads(): number {
    let threads = 1
    if (this.envConfig.SHORT_CRYPTO_THREADS === 'AUTO') {
      threads = os.cpus().length
    } else if (this.envConfig.SHORT_CRYPTO_THREADS && isFinite(+this.envConfig.SHORT_CRYPTO_THREADS)) {
      threads = +this.envConfig.SHORT_CRYPTO_THREADS
    } else if (process.env.RABBIT_MQ_ASYNC_SLOTS_COUNT && +process.env.RABBIT_MQ_ASYNC_SLOTS_COUNT > 0) {
      threads = +process.env.RABBIT_MQ_ASYNC_SLOTS_COUNT
    }
    return threads
  }

  getShortTaskTimeout(): number {
    return this.envConfig.SHORT_TASK_TIMEOUT
  }

  getLongTaskTimeout(): number {
    return this.envConfig.LONG_TASK_TIMEOUT
  }

  getLongCryptoThreads(): number {
    let threads = 1
    if (process.env.LONG_CRYPTO_THREADS && +process.env.LONG_CRYPTO_THREADS > 0) {
      threads = +process.env.LONG_CRYPTO_THREADS
    } else if (process.env.RABBIT_MQ_ASYNC_SLOTS_COUNT && +process.env.RABBIT_MQ_ASYNC_SLOTS_COUNT > 0) {
      threads = +process.env.RABBIT_MQ_ASYNC_SLOTS_COUNT
    }
    return threads
  }


  getContractImage() {
    return this.envConfig.CONTRACT_IMAGE
  }

  getContractImageHash() {
    return this.envConfig.CONTRACT_IMAGE_HASH
  }

  getGrpcAddresses() {
    return this.envConfig.GRPC_ADDRESS
  }

  getAuthServiceAddress() {
    return this.envConfig.AUTH_SERVICE_ADDRESS
  }

  getDeadBlockchainTimeout() {
    return this.envConfig.DEAD_BLOCKCHAIN_TIMEOUT
  }

  getAuthServiceToken() {
    return this.envConfig.AUTH_SERVICE_TOKEN as string
  }

  getApiKey() {
    return this.envConfig.API_KEY as string
  }

  getPort() {
    return Number(this.envConfig.PORT)
  }

  getLogLevel() {
    let logLevel = ['error', 'warn', 'log', 'debug']
    if (this.envConfig.LOG_LEVEL) {
      logLevel = this.envConfig.LOG_LEVEL.trim()
        .replace(/ +/g, '')
        .split(',')
        .map((s) => s.trim())
    }
    return logLevel
  }


  getTxSuccessTimeout() {
    return this.envConfig.TX_SUCCESS_TIMEOUT
  }

  getSwaggerBasePath() {
    return this.envConfig.SWAGGER_BASE_PATH || ''
  }

  getPgOptions() {
    return {
      host: this.envConfig.POSTGRES_HOST,
      port: Number(this.envConfig.POSTGRES_PORT),
      username: this.envConfig.POSTGRES_USER,
      password: this.envConfig.POSTGRES_PASSWORD,
      database: this.envConfig.POSTGRES_DB,
      ssl: this.envConfig.POSTGRES_ENABLE_SSL,
    }
  }

  getPublicKey() {
    return bs58.decode(this.envConfig.PUBLIC_KEY)
  }

  getPrivateKey() {
    return bs58.decode(this.envConfig.PRIVATE_KEY)
  }

  getMasterKeys() {
    return this.envConfig.MASTER_KEYS
  }


  getDevStartFromBlock() {
    return this.envConfig.DEV_START_FROM_BLOCK ? bs58.decode(this.envConfig.DEV_START_FROM_BLOCK) : undefined
  }

  getDisableStatusCheck() {
    return this.envConfig.DEV_DISABLE_STATUS_CHECK
  }

  getVersionInfo() {
    return {
      pid: process.pid,
      version,
      commit: this.envConfig.GIT_COMMIT,
      build: this.envConfig.BUILD_ID,
      tag: this.envConfig.DOCKER_TAG,
    }
  }

  getJsSDKDebugMode() {
    return this.getLogLevel().includes('debug') ? 'info' : 'none'
  }

  isDev() {
    return this.envConfig.NODE_ENV === 'development'
  }
}
