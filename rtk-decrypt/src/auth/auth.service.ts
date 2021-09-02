import { HttpService, Injectable } from '@nestjs/common'
import { ConfigService } from '../config/config.service'
import { LoggerService } from '../logger/logger.service'

export enum AUTH_MODE {
  UNAUTHORIZED = 'UNAUTHORIZED',
  API_KEY = 'API_KEY',
  JWT = 'JWT'
}

@Injectable()
export class AuthService {
  private readonly mode: AUTH_MODE

  constructor(
    private readonly configService: ConfigService,
    private readonly loggerService: LoggerService,
    private readonly httpService: HttpService,
  ) {
    this.loggerService.setContext(AuthService.name)

    if (this.configService.getApiKey()) {
      this.mode = AUTH_MODE.API_KEY
    } else if (this.configService.getAuthServiceToken() && this.configService.getAuthServiceAddress()) {
      this.mode = AUTH_MODE.JWT
    } else {
      this.mode = AUTH_MODE.UNAUTHORIZED
    }
    this.loggerService.warn(`Authorization mode ${this.mode}`)
  }

  getMode(): AUTH_MODE {
    return this.mode
  }

  getApiKey() {
    return this.configService.getApiKey()
  }

  async getTokens() {
    const { data } = await this.httpService.post(
      `${this.configService.getAuthServiceAddress()}/v1/auth/token`,
      {},
      {
        headers: {
          Authorization: `bearer ${this.configService.getAuthServiceToken()}`,
        },
      },
    ).toPromise()
    return data
  }

  async refreshTokens(token: string) {
    const { data } = await this.httpService
      .post(`${this.configService.getAuthServiceAddress()}/v1/auth/refresh`, { token })
      .toPromise()
    return data
  }
}
