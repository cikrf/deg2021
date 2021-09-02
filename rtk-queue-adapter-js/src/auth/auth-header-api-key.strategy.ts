import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import Strategy from 'passport-headerapikey'
import { ConfigService } from '../config/config.service'
import { createHash } from 'crypto'

@Injectable()
export class HeaderApiKeyStrategy extends PassportStrategy(Strategy, 'apiKey') {
  constructor(
    private readonly configService: ConfigService,
  ) {
    super({ header: 'X-API-KEY', prefix: '' },
      true,
      (apiKey: string, done: any) => {
        return this.validate(apiKey, done)
      })
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  validate = (inputApiKey: string, done: (error: Error | null, data: any) => {}) => {
    const restApiKey = this.configService.getRestApiKey()
    const hash = createHash('sha256').update(inputApiKey).digest()
    if (restApiKey === hash.toString('hex') || !restApiKey) {
      done(null, true)
    }
    done(new UnauthorizedException(), null)
  }
}
