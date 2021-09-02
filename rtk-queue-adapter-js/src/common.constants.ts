export const AUTHORIZED_FETCH = 'AUTHORIZED_FETCH'
export const GRPC_CLIENT = 'GRPC_CLIENT'
export const KAFKA_PRODUCER = 'KAFKA_PRODUCER'
export const DB_CONNECTION_TOKEN = 'DB_CONNECTION_TOKEN'
export const TX_OBSERVER_DB_CONNECTION_TOKEN = 'TX_OBSERVER_DB_CONNECTION_TOKEN'
export const BLOCK_REPOSITORY_TOKEN = 'BLOCK_REPOSITORY_TOKEN'
export const TX_REPOSITORY_TOKEN = 'TX_REPOSITORY_TOKEN'
export const ROLLBACK_REPOSITORY_TOKEN = 'ROLLBACK_REPOSITORY_TOKEN'
export const KAFKA_TOKEN = 'KAFKA_TOKEN'

export const MAX_TXS_PER_QUERY = 2000
export const DEAD_GRPC_TIMEOUT = 120000
export const MAX_DEAD_GRPC_WARNINGS = 5
export const TX_POOL_TTL = 300000
export const CONTRACT_CACHE_TTL = 300000
export const MAX_GRPC_CONNECTION_TRIES = 10
export const GRPC_RECONNECT_TIMEOUT = 1000
export const GRPC_OPTIONS = {
  'grpc.keepalive_time_ms': 60000,
  'grpc.keepalive_timeout_ms': 5000,
  'grpc.keepalive_permit_without_calls': 1,
  'grpc.http2.max_pings_without_data': 0,
  'grpc.http2.min_time_between_pings_ms': 10000,
  'grpc.http2.min_ping_interval_without_data_ms': 5000,
  'grpc.max_receive_message_length': 1024 * 1024 * 64,
}

