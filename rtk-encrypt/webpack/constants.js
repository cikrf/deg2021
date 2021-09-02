const argv = require('yargs').argv
const path = require('path')

const SRC_DIR = path.resolve(__dirname, '../src')
const BUILD_DIR = path.resolve(__dirname, '../dist')
const isProduction = argv.mode === 'production'
const isDevelopment = argv.mode === 'development'

module.exports = {
  SRC_DIR,
  BUILD_DIR,
  isProduction,
  isDevelopment,
}
