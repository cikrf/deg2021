import { Module } from '@nestjs/common'
import { CryptoService } from './crypto.service'
import { LoggerModule } from '../logger/logger.module'
import { ConfigModule } from '../config/config.module'

@Module({
  imports: [LoggerModule, ConfigModule],
  providers: [CryptoService],
  exports: [CryptoService],
})
export class CryptoModule {}
