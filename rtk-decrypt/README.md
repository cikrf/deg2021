# Voting decrypt service

## How to deploy

1. Create empty databases
2. Specify listed below environment variables with your values:

```
# DEV variable, start from specified block
DEV_START_FROM_BLOCK=2VQjZ7SCkUT5v4G95oNfxn9viTnNRzMBz7dk42hX5JSCuGdnYUwgShwcvAV68ScjzfErwevW8k76yzXUoyU2cphv
DEV_DISABLE_STATUS_CHECK=false

# keypair
PRIVATE_KEY=D2DEgsBiBXXT6467qumQVyfzFu8Gn3dZRACPUh2h55Va
PUBLIC_KEY=883ZWFJJRgfXptL4Qa1CuDgwjb9Wioepzmk5auBM46fjevRNpw6JpeEsj837ZKmroEJ359vT3LErfDno4WKwsPm
AES256_SECRET=secret

# public keys of this and backup master
MASTER_KEYS=["883ZWFJJRgfXptL4Qa1CuDgwjb9Wioepzmk5auBM46fjevRNpw6JpeEsj837ZKmroEJ359vT3LErfDno4WKwsPm"]
 
# contract settings
CONTRACT_IMAGE=voting/voting-contract
CONTRACT_IMAGE_HASH=eebd8a75be2bdf95b960664502516d2b1dee49142f17adb7c7f547ea367874dc
 
# settings
SWAGGER_BASE_PATH=/
TX_SUCCESS_TIMEOUT=120000
LOG_LEVEL="error, warn, log, debug"
 
# database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=123456
POSTGRES_DB=decrypt
POSTGRES_PORT=5432
POSTGRES_HOST=127.0.0.1
POSTGRES_ENABLE_SSL=false
 
# number of worker threads for cryptography
SHORT_CRYPTO_THREADS=AUTO
LONG_CRYPTO_THREADS=10

# node rest & grpc address
NODE_ADDRESS=
GRPC_ADDRESS=
 
# auth settings
API_KEY=vostok
AUTH_SERVICE_ADDRESS=
AUTH_SERVICE_TOKEN=1111V4DygyWY7YsiIVtje24tO0hC4heKHjH7utASQxlkqNsFzBT9F9KpVwUVrXXl

# rabbit mq config
RABBIT_MQ_URI=amqp://user:password@localhost:5672
RABBIT_MQ_EXCHANGE=voting
RABBIT_MQ_INCOMING_QUEUE=incoming
RABBIT_MQ_OUTCOMING_QUEUE=outcoming
RABBIT_MQ_OUTCOMING_ROUTING_KEY=outcoming

# counter tuning
COUNTER_CHUNK_SIZE=2048
SUM_CHUNK_SIZE=512
MAX_QUEUE_LENGTH=4096
MAX_CONCURRENT_CALLS=1
```

3. Run docker

## Environment params list

### Required

```
POSTGRES_USER - string
POSTGRES_PASSWORD - string
POSTGRES_DB - string
POSTGRES_PORT - string
POSTGRES_HOST - string
NODE_ADDRESS - string
GRPC_ADDRESS - json array of strings for each decrypt instance 
PRIVATE_KEY - string
PUBLIC_KEY - string
CONTRACT_IMAGE - string
CONTRACT_IMAGE_HASH - string
```

### Optional

```
PORT - number
MASTER_KEYS - array of public keys of backup master 
AES256_SECRET - secret for AES256 encryption
POSTGRES_ENABLE_SSL - boolean
TX_SUCCESS_TIMEOUT - number (default 120000),
DEAD_BLOCKCHAIN_TIMEOUT - number (default 120000)
LOG_LEVEL - list of showed log levels. E.g error, warn, log, debug
NODE_ENV - development or production (default: production)
DEV_START_FROM_BLOCK - start from block with specified signature
DEV_DISABLE_STATUS_CHECK - check poll status before start task
AUTH_SERVICE_TOKEN - string
AUTH_SERVICE_ADDRESS - string
API_KEY - string
RABBIT_MQ_URI - string
RABBIT_MQ_EXCHANGE - string
RABBIT_MQ_INCOMING_QUEUE - string
RABBIT_MQ_OUTCOMING_QUEUE - string
RABBIT_MQ_OUTCOMING_ROUTING_KEY - string
RABBIT_MQ_ASYNC_SLOTS_COUNT - number
VALIDATION_CHUNK_SIZE - number of votes processing on valiataion
SUM_CHUNK_SIZE - number of votes processing on sum
MAX_QUEUE_LENGTH - number of votes stored in queue to stop pg stream
MAX_CONCURRENT_CALLS - number of concurrent calls per worker
SHORT_CRYPTO_THREADS - number
LONG_CRYPTO_THREADS - number
```

### Changelog

* v1.1

```
Pefomance optimization
Lot of fixes
```

* v1.0

```
Init release of GRPC decrypt with embedded cryptolib
```
