import { Module } from '@nestjs/common'
import { ConfigModule } from '../config/config.module'
import { LoggerModule } from '../logger/logger.module'
import { GrpcService } from './grpc.service'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    AuthModule,
  ],
  providers: [
    GrpcService,
  ],
  exports: [
    GrpcService,
  ],
})

export class GrpcModule {}
