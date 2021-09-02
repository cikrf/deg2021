import { Module } from '@nestjs/common'
import { ConfigModule } from '../config/config.module'
import { LoggerModule } from '../logger/logger.module'
import { Tx } from '../entities/tx.entity'
import { DB_CONNECTION_TOKEN, TX_REPOSITORY_TOKEN } from '../common.constants'
import { Connection } from 'typeorm'
import { DatabaseModule } from '../database/database.module'
import { KafkaProvider } from './kafka.provider'
import { TxStatusUpdaterService } from './tx-status-updater.service'
import { TxReaderService } from './tx-reader.service'

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    DatabaseModule,
  ],
  providers: [
    {
      provide: TX_REPOSITORY_TOKEN,
      useFactory: (connection: Connection) => connection.getRepository(Tx),
      inject: [DB_CONNECTION_TOKEN],
    },
    TxReaderService,
    TxStatusUpdaterService,
    KafkaProvider,
  ],
  exports: [],
})

export class KafkaModule {}
