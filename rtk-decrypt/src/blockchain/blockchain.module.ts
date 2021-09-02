import { Module } from '@nestjs/common'
import { ConfigModule } from '../config/config.module'
import { BlockchainService } from './blockchain.service'
import { DatabaseModule } from '../database/database.module'
import {
  BLOCK_REPOSITORY_TOKEN,
  DB_CONNECTION_TOKEN,
  TX_REPOSITORY_TOKEN,
  VOTE_REPOSITORY_TOKEN,
} from '../common.constants'
import { Connection } from 'typeorm'
import { Block } from '../entities/block.entity'
import { Tx } from '../entities/tx.entity'
import { LoggerModule } from '../logger/logger.module'
import { Vote } from '../entities/vote.entity'

@Module({
  imports: [
    LoggerModule,
    ConfigModule,
    DatabaseModule,
  ],
  providers: [
    {
      provide: BLOCK_REPOSITORY_TOKEN,
      useFactory: (connection: Connection) => connection.getRepository(Block),
      inject: [DB_CONNECTION_TOKEN],
    },
    {
      provide: TX_REPOSITORY_TOKEN,
      useFactory: (connection: Connection) => connection.getRepository(Tx),
      inject: [DB_CONNECTION_TOKEN],
    },
    {
      provide: VOTE_REPOSITORY_TOKEN,
      useFactory: (connection: Connection) => connection.getRepository(Vote),
      inject: [DB_CONNECTION_TOKEN],
    },
    BlockchainService,
  ],
  exports: [BlockchainService],
})
export class BlockchainModule {}
