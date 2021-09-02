import { Module } from '@nestjs/common'
import { ConfigModule } from '../config/config.module'
import { AppController } from './app.controller'
import { GrpcModule } from '../grpc/grpc.module'
import { TxWatcherModule } from '../tx-watcher/tx-watcher.module'
import { KafkaModule } from '../kafka/kafka.module'

@Module({
  imports: [
    ConfigModule,
    KafkaModule,
    GrpcModule,
    TxWatcherModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
