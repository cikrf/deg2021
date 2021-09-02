import { Injectable, Logger, Scope } from '@nestjs/common'
import { ConfigService } from '../config/config.service'

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends Logger {
  private level: { [key: string]: boolean } = {
    error: false,
    warn: false,
    log: false,
    debug: false,
    verbose: false,
  }

  private timers: Map<string, number> = new Map()

  constructor(private readonly configService: ConfigService) {
    super()
    const logLevel = this.configService.getLogLevel()
    logLevel.map((level) => (this.level[level] = true))
    this.setContext(LoggerService.name)
  }

  setContext(context: string) {
    super.setContext(context)
  }

  error(message: unknown, trace?: string, context?: string): void {
    if (!this.level.error) {return}
    super.error(message, trace, context)
  }

  warn(message: unknown, context?: string): void {
    if (!this.level.warn) {return}
    super.warn(message, context)
  }

  log(message: unknown, context?: string): void {
    if (!this.level.log) {return}
    super.log(message, context)
  }

  debug(message: unknown, context?: string): void {
    if (!this.level.debug) {return}
    super.debug(message, context)
  }

  verbose(message: unknown, context?: string): void {
    if (!this.level.verbose) {return}
    super.verbose(message, context)
  }

  time(id: string, label: string) {
    const key = id + label
    if (this.timers.has(key)) {
      this.error(`Label ${label} already exist`)
    } else {
      this.timers.set(key, Date.now())
    }
  }

  timeEnd(id: string, label: string, message?: string, precision: number = 3) {
    const key = id + label
    const start = this.timers.get(key)
    if (!start) {
      this.error(`Label ${label} not found`)
    } else {
      const diff = Date.now() - start
      const formatted = (diff / 1000).toFixed(precision)
      let text = `[${label}] ${formatted}s`
      if (message) {
        text += ` / ${message}`
      }
      this.debug(text)
      this.timers.delete(key)
    }
  }

  setLogLevel(level: string, value: boolean): void {
    if (Object.keys(this.level).includes(level)) {
      this.level[level] = value
    } else {
      // eslint-disable-next-line no-console
      console.log('Wrong log level')
    }
    super.log(this.level, 'LoggerService')
  }
}
