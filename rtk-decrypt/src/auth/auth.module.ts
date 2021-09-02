import { HttpModule, Module } from '@nestjs/common'
import { ConfigModule } from '../config/config.module'
import { AuthService } from './auth.service'
import { LoggerModule } from '../logger/logger.module'

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    LoggerModule,
  ],
  providers: [
    AuthService,
  ],
  exports: [AuthService],
})

export class AuthModule {}
