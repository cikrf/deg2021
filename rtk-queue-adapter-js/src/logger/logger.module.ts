import { Module } from '@nestjs/common'
import { LoggerService } from './logger.service'
import { ConfigModule } from '../config/config.module'

@Module({
  imports: [ConfigModule],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
