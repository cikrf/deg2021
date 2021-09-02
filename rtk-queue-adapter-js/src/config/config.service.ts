import { readFileSync } from 'fs'
import { version } from '../../package.json'
import { Injectable } from '@nestjs/common'
import { setConfig } from '../utils/set-config'
import * as os from 'os'
import { parseJsonEnv } from '../utils/parse-json-env'

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
    KAFKA_USERNAME: process.env.KAFKA_USERNAME as string,
    KAFKA_PASSWORD: process.env.KAFKA_PASSWORD as string,
    KAFKA_BROKERS: parseJsonEnv(process.env.KAFKA_BROKERS, 'KAFKA_BROKERS'),
    KAFKA_VOTE_TOPIC: process.env.KAFKA_VOTE_TOPIC as string,
    KAFKA_BLOCKCHAIN_TOPIC: process.env.KAFKA_BLOCKCHAIN_TOPIC as string,
    KAFKA_CONSUMER_GROUP_VOTES: process.env.KAFKA_CONSUMER_GROUP_VOTES as string,
    KAFKA_CONSUMER_GROUP_BLOCKCHAIN: process.env.KAFKA_CONSUMER_GROUP_BLOCKCHAIN as string,
    NODES_CONFIG: parseJsonEnv(process.env.NODES_CONFIG, 'NODES_CONFIG'),
  }
}

function prepareEnv() {
  const requiredEnv = getRequiredEnv()

  if (!isValidEnv(requiredEnv)) {
    return process.exit(1)
  }

  return {
    ...requiredEnv,
    POSTGRES_ENABLE_SSL: process.env.POSTGRES_ENABLE_SSL === 'true',
    SWAGGER_BASE_PATH: process.env.SWAGGER_BASE_PATH || '/',
    API_KEY: process.env.API_KEY,
    GIT_COMMIT: buildInfo.GIT_COMMIT,
    BUILD_ID: buildInfo.BUILD_ID,
    DOCKER_TAG: buildInfo.DOCKER_TAG,
    LOG_LEVEL: process.env.LOG_LEVEL,
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT || 3000,
    SERVICE_NAME: process.env.SERVICE_NAME || os.hostname(),
    KAFKA_CONSUMERS: process.env.KAFKA_CONSUMERS && +process.env.KAFKA_CONSUMERS || 1,
    KAFKA_CONCURRENCY: process.env.KAFKA_CONCURRENCY && +process.env.KAFKA_CONCURRENCY || 1,
    KAFKA_FROM_BEGINNING: process.env.KAFKA_FROM_BEGINNING ? process.env.KAFKA_FROM_BEGINNING === 'true' : true,
    UTX_LIMIT: process.env.UTX_LIMIT && +process.env.UTX_LIMIT || 1000,
    GRPC_CHUNK_SIZE: process.env.GRPC_CHUNK_SIZE && +process.env.GRPC_CHUNK_SIZE || 100,
    PENDING_TIMEOUT: process.env.PENDING_TIMEOUT && +process.env.PENDING_TIMEOUT || 300000,
    MAX_REBROADCAST_NUM: process.env.MAX_REBROADCAST_NUM && +process.env.MAX_REBROADCAST_NUM || 5,
    NODE_BAN_TIMEOUT: process.env.NODE_BAN_TIMEOUT && +process.env.NODE_BAN_TIMEOUT || 300000,
    REST_API_KEY: process.env.REST_API_KEY,
  }
}

@Injectable()
export class ConfigService {
  private readonly envConfig = prepareEnv()

  getKafkaBrokers() {
    return this.envConfig.KAFKA_BROKERS
  }

  getKafkaVoteTopic() {
    return this.envConfig.KAFKA_VOTE_TOPIC
  }

  getRestApiKey() {
    return this.envConfig.REST_API_KEY as string
  }

  getKafkaBlockchainTopic() {
    return this.envConfig.KAFKA_BLOCKCHAIN_TOPIC
  }

  getKafkaConsumerGroupVotes() {
    return this.envConfig.KAFKA_CONSUMER_GROUP_VOTES
  }

  getKafkaConsumerGroupBlockchain() {
    return this.envConfig.KAFKA_CONSUMER_GROUP_BLOCKCHAIN
  }

  getKafkaFromBeginning() {
    return this.envConfig.KAFKA_FROM_BEGINNING
  }

  getKafkaConsumers() {
    return this.envConfig.KAFKA_CONSUMERS
  }

  getKafkaConcurrency() {
    return this.envConfig.KAFKA_CONCURRENCY
  }

  getKafkaUsername() {
    return this.envConfig.KAFKA_USERNAME
  }

  getKafkaPassword() {
    return this.envConfig.KAFKA_PASSWORD
  }

  getPendingTimeout() {
    return this.envConfig.PENDING_TIMEOUT
  }

  getMaxRebroadcatNum() {
    return this.envConfig.MAX_REBROADCAST_NUM
  }

  getNodeBanTimeout() {
    return this.envConfig.NODE_BAN_TIMEOUT
  }

  getNodesConfig(): Array<{ address: string, apiKey: string }> {
    return this.envConfig.NODES_CONFIG
      .map((n: string) => {
        const s = n.split(';')
        return {
          address: s[0],
          apiKey: s[1],
        }
      })
  }

  getUtxLimit(): number {
    return this.envConfig.UTX_LIMIT
  }

  getGrpcChunkSize(): number {
    return this.envConfig.GRPC_CHUNK_SIZE
  }

  getServiceName() {
    return this.envConfig.SERVICE_NAME.substr(0, 16)
  }

  getLogLevel() {
    let logLevel = ['error', 'warn', 'log', 'debug']
    if (this.envConfig.LOG_LEVEL) {
      logLevel = this.envConfig.LOG_LEVEL.trim().replace(/ +/g, '').split(',').map((s) => s.trim())
    }
    return logLevel
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

  getSwaggerBasePath() {
    return this.envConfig.SWAGGER_BASE_PATH || ''
  }

  getPort() {
    return Number(this.envConfig.PORT)
  }

  isDev() {
    return this.envConfig.NODE_ENV === 'development'
  }
}
