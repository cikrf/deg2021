import { Module } from '@nestjs/common'
import { RabbitMQClient } from '../rabbit-mq'
import { RabbitMQConfig } from '../types/general'
import { MasterController } from './master.controller'
import { MasterService } from './master.service'
import { LoggerModule } from '../logger/logger.module'
import { ConfigModule } from '../config/config.module'
import { GrpcModule } from '../grpc/grpc.module'
import { AuthModule } from '../auth/auth.module'
import { DB_CONNECTION_TOKEN, MASTER_REPOSITORY_TOKEN, RABBIT_MQ_PUBLISHER_CONFIG_TOKEN } from '../common.constants'
import { Connection } from 'typeorm'
import { Master } from '../entities/master.entity'
import { DatabaseModule } from '../database/database.module'
import { CryptoModule } from '../crypto/crypto.module'
import { BlockchainModule } from '../blockchain/blockchain.module'
import { CounterModule } from '../counter/counter.module'

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    GrpcModule,
    AuthModule,
    DatabaseModule,
    BlockchainModule,
    CryptoModule,
    CounterModule,
  ],
  controllers: [
    MasterController,
  ],
  providers: [
    MasterService,
    {
      provide: MASTER_REPOSITORY_TOKEN,
      useFactory: (connection: Connection) => connection.getRepository(Master),
      inject: [DB_CONNECTION_TOKEN],
    },
    RabbitMQClient,
    {
      provide: RABBIT_MQ_PUBLISHER_CONFIG_TOKEN,
      useValue: {
        exchange: process.env.RABBIT_MQ_EXCHANGE!,
        outcomingQueue: process.env.RABBIT_MQ_OUTCOMING_QUEUE!,
        incomingQueue: process.env.RABBIT_MQ_INCOMING_QUEUE!,
        uri: process.env.RABBIT_MQ_URI!,
      } as RabbitMQConfig,
    },
  ],
})
export class MasterModule {}
