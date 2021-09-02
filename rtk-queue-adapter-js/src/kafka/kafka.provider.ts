import { readdirSync, readFileSync } from 'fs'
import { extname, resolve } from 'path'
import { KAFKA_TOKEN } from '../common.constants'
import { Kafka } from 'kafkajs'
import { kafkaLogCreator } from '../utils/kafka-log-creator'
import { ConfigService } from '../config/config.service'
import { LoggerService } from '../logger/logger.service'

export const KafkaProvider = {
  provide: KAFKA_TOKEN,
  useFactory: (configService: ConfigService, loggerService: LoggerService): Kafka => {
    const certs: { ca: Buffer[], cert: Buffer[], key: Buffer[] } = { ca: [], cert: [], key: [] }
    readdirSync('./certs')
      .map((filename) => {
        const data = readFileSync(resolve('.', 'certs', filename))
        switch (extname(filename)) {
          case '.crt':
            certs.ca.push(data)
            break
          case '.pem':
            certs.cert.push(data)
            break
          case '.key':
            certs.key.push(data)
            break
        }
      })
    const brokers = configService.getKafkaBrokers()

    return new Kafka({
      brokers,
      logCreator: kafkaLogCreator(loggerService),
      ssl: {
        rejectUnauthorized: true,
        ...certs,
      },
      sasl: {
        mechanism: 'plain', // scram-sha-256 or scram-sha-512
        username: configService.getKafkaUsername(),
        password: configService.getKafkaPassword(),
      },
    })
  },
  inject: [ConfigService, LoggerService],
}
