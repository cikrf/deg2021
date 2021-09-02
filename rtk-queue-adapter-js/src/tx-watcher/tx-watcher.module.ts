import { Module } from '@nestjs/common'
import { TxWatcherService } from './tx-watcher.service'
import { DatabaseModule } from '../database/database.module'
import { GrpcModule } from '../grpc/grpc.module'
import { LoggerModule } from '../logger/logger.module'
import { DB_CONNECTION_TOKEN, TX_REPOSITORY_TOKEN } from '../common.constants'
import { Connection } from 'typeorm'
import { Tx } from '../entities/tx.entity'
import { ConfigModule } from '../config/config.module'
import { TxWatcherController } from './tx-watcher.controller'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    GrpcModule,
    LoggerModule,
    AuthModule,
  ],
  controllers: [TxWatcherController],
  providers: [
    {
      provide: TX_REPOSITORY_TOKEN,
      useFactory: (connection: Connection) => connection.getRepository(Tx),
      inject: [DB_CONNECTION_TOKEN],
    },
    TxWatcherService,
  ],
})
export class TxWatcherModule {}
