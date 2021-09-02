import { DB_CONNECTION_TOKEN } from '../common.constants'
import { ConfigService } from '../config/config.service'
import { createConnection } from 'typeorm'
import { join } from 'path'

export const databaseProviders = [
  {
    provide: DB_CONNECTION_TOKEN,
    useFactory: (configService: ConfigService) => {
      return createConnection({
        type: 'postgres',
        name: 'default',
        ...configService.getPgOptions(),
        entities: [join(__dirname, '..', '/entities/*.entity{.ts,.js}')],
        migrations: [join(__dirname, '..', 'migrations/*{.ts,.js}')],
        migrationsRun: true,
      })
    },
    inject: [ConfigService],
  },
]
