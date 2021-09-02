import { logLevel } from 'kafkajs'
import { LoggerService } from '../logger/logger.service'

export const kafkaLogCreator = (loggerService: LoggerService) => (level: logLevel) => ({ log }: any) => {
  switch (level) {
    case logLevel.ERROR:
    case logLevel.NOTHING:
      return loggerService.error(JSON.stringify(log))
    case logLevel.WARN:
      return loggerService.warn(JSON.stringify(log))
    case logLevel.INFO:
      return loggerService.log(JSON.stringify(log))
    case logLevel.DEBUG:
      return loggerService.debug(JSON.stringify(log))
  }
}
