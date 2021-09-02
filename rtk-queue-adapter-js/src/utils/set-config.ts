import { config } from 'dotenv'

export function setConfig() {
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
