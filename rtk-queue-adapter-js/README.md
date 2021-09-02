# Queue apadter

## How to deploy

1. Create empty database
2. Specify listed below environment variables with your values:

```

# path to env file, .enf if not specified 
#### PATH_TO_ENV=.env

# Port of REST api
PORT=3010

# array of nodes and api-keys (format ["url;apikey", ...])
NODES_CONFIG=

# treshhold when pause broadcasting
UTX_LIMIT=5000

# how many transaction processing in broadcast tick
GRPC_CHUNK_SIZE=1000

# grpc identifier of client
SERVICE_NAME=queue-adapter

# timeout before rebroadcast in ms
PENDING_TIMEOUT=300000

# max number of rebroadcast
MAX_REBROADCAST_NUM=5

# timeout before grpc reconnect in ms
NODE_BAN_TIMEOUT=300000

# root path of swagger
SWAGGER_BASE_PATH=/

# enabled log levels
LOG_LEVEL="error, warn, log, debug, verbose"

# kafka settings
# addresses of brokers
KAFKA_BROKERS=["address"]

# Kafka SASL username/password
KAFKA_USERNAME=
KAFKA_PASSWORD=

# number of kafka customers to read transactions
KAFKA_CONSUMERS=5

# how many partition to process at the same time
KAFKA_CONCURRENCY=4


# consumer groups
KAFKA_CONSUMER_GROUP_VOTES=votes
KAFKA_CONSUMER_GROUP_BLOCKCHAIN=blockchain

# start from earliest commited offset (default: true)
KAFKA_FROM_BEGINNING=true

# topics with votes and blockchain from kloader
# this is a topic filled by kloader with mined transactions
# adapter read it with one consumer
KAFKA_VOTE_TOPIC=topic_votes
KAFKA_BLOCKCHAIN_TOPIC= topic_blockchain

# database settings
POSTGRES_USER=postgres \
POSTGRES_PASSWORD=123456 \
POSTGRES_DB=adapter \
POSTGRES_PORT=5432 \
POSTGRES_HOST=127.0.0.1 \
POSTGRES_ENABLE_SSL=false
```









