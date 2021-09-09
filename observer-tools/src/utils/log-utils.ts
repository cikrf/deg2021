import * as chalk from 'chalk'

const logLevel = ['error', 'log', 'verbose']

export const log = (message: string) => {
  if (logLevel.includes('log')) {
    console.log(message)
  }
}

export const logVerbose = (message: string) => {
  if (logLevel.includes('verbose')) {
    console.log(chalk.blueBright(message))
  }
}

export const logError = (message: string) => {
  if (logLevel.includes('error')) {
    console.log(chalk.red(message))
  }
}
