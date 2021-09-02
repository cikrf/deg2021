import { Module } from '@nestjs/common'
import { CounterService } from './counter.service'
import { LoggerModule } from '../logger/logger.module'
import { BlockchainModule } from '../blockchain/blockchain.module'
import { DB_CONNECTION_TOKEN, VOTE_REPOSITORY_TOKEN } from '../common.constants'
import { Connection } from 'typeorm'
import { DatabaseModule } from '../database/database.module'
import { CryptoModule } from '../crypto/crypto.module'
import { Vote } from '../entities/vote.entity'
import { ConfigModule } from '../config/config.module'
import { CounterController } from './counter.controller'

@Module({
  imports: [
    LoggerModule,
    BlockchainModule,
    DatabaseModule,
    CryptoModule,
    ConfigModule,
  ],
  controllers: [CounterController],
  providers: [
    CounterService,
    {
      provide: VOTE_REPOSITORY_TOKEN,
      useFactory: (connection: Connection) => connection.getRepository(Vote),
      inject: [DB_CONNECTION_TOKEN],
    },
  ],
  exports: [CounterService],
})
export class CounterModule {}
