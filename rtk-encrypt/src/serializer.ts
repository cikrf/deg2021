import { Bulletin as BulletinType } from './types'
import * as Proto from './proto/vote'

export const encode = (b: BulletinType): Uint8Array => {
  return Proto.Bulletin.encode(b).finish()
}

export const decode = (binary: Uint8Array) => {
  return Proto.Bulletin.decode(binary)
}
