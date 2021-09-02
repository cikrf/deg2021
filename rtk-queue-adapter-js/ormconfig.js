require('ts-node').register()
const { config } = require('dotenv')
const { join } = require('path')

function setConfig () {
  const envConfig = config()
  if (
    envConfig.error === undefined &&
    envConfig.parsed !== undefined &&
    Object.keys(envConfig.parsed).length === 1 &&
    envConfig.parsed.hasOwnProperty('PATH_TO_ENV')
  ) {
    config({ path: `${envConfig.parsed.PATH_TO_ENV}` })
  }
}

setConfig()

const POSTGRES_USER = process.env.POSTGRES_USER || 'postgres'
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || '123456'
const POSTGRES_DB = process.env.POSTGRES_DB || 'adapter'
const POSTGRES_PORT = process.env.POSTGRES_PORT || '5432'
const POSTGRES_HOST = process.env.POSTGRES_HOST || '127.0.0.1'

module.exports = {
  type: 'postgres',
  port: POSTGRES_PORT,
  host: POSTGRES_HOST,
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
  logging: ['log', 'info', 'warn', 'error'],
  entities: [join(__dirname, 'src', '/**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, 'src/migrations/*{.ts,.js}')],
  cli: {
    migrationsDir: 'src/migrations',
    entitiesDir: 'src/entities'
  }
}
