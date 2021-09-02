import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { LoggerModule } from '../logger/logger.module'
import { EventEmitter } from 'events'
import { NestEmitterModule } from 'nest-emitter'
import { ConfigModule } from '../config/config.module'
import { MasterModule } from '../master/master.module'
import { ScheduleModule } from '@nestjs/schedule'
import { BlockchainModule } from '../blockchain/blockchain.module'
import { CounterModule } from '../counter/counter.module'

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    NestEmitterModule.forRoot(new EventEmitter()),
    ScheduleModule.forRoot(),
    BlockchainModule,
    MasterModule,
    CounterModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
