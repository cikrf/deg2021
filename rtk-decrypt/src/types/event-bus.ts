import { EventEmitter } from 'events'
import { StrictEventEmitter } from 'nest-emitter'
import { Block } from '../entities/block.entity'
import { Tx } from '../entities/tx.entity'

type Events = {
  blockReceived: (block: Block, txs: Tx[]) => Promise<void>,
  notFound: () => Promise<void>,
  rollback: (signature: Uint8Array) => Promise<void>,
  blockParsed: (height: number) => Promise<void>,
  connected: () => Promise<void>,
  pauseSync: () => Promise<void>,
  resumeSync: () => Promise<void>,
  startSync: (signature: Uint8Array | undefined) => Promise<void>,
  synced: () => Promise<void>,
  syncing: () => Promise<void>,
}

export type EventBus = StrictEventEmitter<EventEmitter, Events>
