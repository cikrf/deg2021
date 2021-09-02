const { config } = require('dotenv')
const { Client } = require('pg')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

config()

const dbNames = [process.env.POSTGRES_DB]

const pg = new Client({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: 'postgres',
  password: process.env.POSTGRES_PASSWORD,
  port: +process.env.POSTGRES_PORT,
  ssl: false,
})

rl.question(`Recreate databases ${dbNames.join(', ')} (Y/n) ? `, (answer) => {
  if (answer.toLowerCase().trim() === 'y') {
    pg.connect(async () => {
      for (const dbName of dbNames) {
        try {
          await pg.query(`DROP DATABASE "${dbName}"`)
          // eslint-disable-next-line no-empty
        } catch (e) {}
        await pg.query(`CREATE DATABASE "${dbName}"`)
        console.log(`Recreated ${dbName}.`)
      }
      process.exit(0)
    })
  } else {
    console.log('Cancelled')
  }

  rl.close()
})
