import { Module } from '@nestjs/common'
import { ConfigModule } from '../config/config.module'
import { databaseProviders } from './database.provider'

@Module({
  imports: [ConfigModule],
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
