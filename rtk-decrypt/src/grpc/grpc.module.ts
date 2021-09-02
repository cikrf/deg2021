import { Module } from '@nestjs/common'
import { GrpcProvider } from './grpc.provider'
import { GrpcService } from './grpc.service'
import { ConfigModule } from '../config/config.module'
import { LoggerModule } from '../logger/logger.module'
import { AuthModule } from '../auth/auth.module'
import { BroadcastService } from './broadcast.service'

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    AuthModule,
  ],
  providers: [
    BroadcastService,
    GrpcService,
    GrpcProvider,
  ],
  exports: [
    BroadcastService,
    GrpcService,
    GrpcProvider,
  ],
})

export class GrpcModule {}
