import { Inject, Module, OnModuleDestroy } from '@nestjs/common'
import { Connection } from 'typeorm'
import { ConfigModule } from '../config/config.module'
import { DB_CONNECTION_TOKEN, STREAMDB_CONNECTION_TOKEN } from '../common.constants'
import { databaseProviders } from './database.provider'


@Module({
  imports: [ConfigModule],
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule implements OnModuleDestroy {
  constructor(
    @Inject(DB_CONNECTION_TOKEN) private readonly dbConnection: Connection,
    @Inject(STREAMDB_CONNECTION_TOKEN) private readonly streamDbConnection: Connection,
  ) {}

  onModuleDestroy(): void {
    this.dbConnection.close()
    this.streamDbConnection.close()
  }
}
