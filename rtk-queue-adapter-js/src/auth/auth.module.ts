import { HttpModule, Module } from '@nestjs/common'
import { ConfigModule } from '../config/config.module'
import { LoggerModule } from '../logger/logger.module'
import { HeaderApiKeyStrategy } from './auth-header-api-key.strategy'

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    LoggerModule,
  ],
  providers: [
    HeaderApiKeyStrategy,
  ],
})

export class AuthModule {}
