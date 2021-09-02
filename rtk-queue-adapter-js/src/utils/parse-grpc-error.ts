import { Metadata } from '@grpc/grpc-js'

export const parseGrpcError = (e: Error & { code?: number, metadata?: Metadata }) => {
  if (e && e.metadata) {
    return `ERROR ${e.metadata.get('error-code')}: ${e.metadata.get('error-message')}`
  } else if (e && e.message) {
    return `ERROR ${e.code}: ${e.message}`
  } else if (e) {
    return JSON.stringify(e)
  } else {
    return undefined
  }
}
