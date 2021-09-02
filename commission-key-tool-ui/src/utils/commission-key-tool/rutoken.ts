import * as graphene from 'graphene-pk11'
import { Session } from 'graphene-pk11'
import { join, resolve } from 'path'
import { Share } from './types'

let _rutoken: graphene.Module | null = null

const getRutoken = () => {
  if (_rutoken) {
    return _rutoken
  }
  let libPath

  const libDir = process.env.NODE_ENV === 'development'
    ? resolve(join(__dirname, 'lib'))
    : resolve(join(__dirname, '..', 'lib'))

  switch (process.platform) {
    case 'win32':
      libPath = join(libDir, 'rtpkcs11ecp.dll')
      break
    case 'darwin':
      libPath = join(libDir, 'librtpkcs11ecp.dylib')
      break
    case 'linux':
      libPath = join(libDir, 'librtpkcs11ecp.so')
      break
    default:
      libPath = join(libDir, 'librtpkcs11ecp.so')
      break
  }

  const rutoken = graphene.Module.load(libPath, 'RuToken')
  _rutoken = rutoken
  return rutoken
}

const APPLICATION_TOKEN = 'commission-tool'

// 3 label // 16 application // 17 value

export class ConnectionError extends Error {
}

export class RuToken {

  private _session: Session | null = null

  constructor() {
    this.randomBytes = this.randomBytes.bind(this)
  }

  getSlots() {
    return getRutoken().getSlots()
  }

  initialize() {
    getRutoken().initialize()
    this.session = getRutoken().getSlots(0).open(6)
  }

  connect(pin: string = '12345678') {
    this.session = getRutoken().getSlots(0).open(6)
    this.session.login(pin)
  }

  get session() {
    if (!this._session) {
      throw new ConnectionError('RuToken not connected')
    }
    return this._session
  }

  set session(session: Session) {
    this._session = session
  }

  writeShare(share: Share) {
    return this.session.create({
      class: graphene.ObjectClass.DATA,
      token: true,
      label: `share:${share.idx}`,
      private: true,
      application: APPLICATION_TOKEN,
      value: Buffer.from(Buffer.from(share.pub).toString('hex') + Buffer.from(share.val).toString('hex'), 'hex'),
    })
  }

  readShares() {
    const shares: Share[] = []
    const datas = this.session.find({ class: graphene.ObjectClass.DATA })
    for (const data of datas) {
      if (data.getAttribute(16).toString() === APPLICATION_TOKEN) {
        const val = Buffer.from(data.getAttribute(17)).toString('hex')
        shares.push({
          idx: +data.getAttribute(3).toString().replace('share:', ''),
          val: Buffer.from(val.slice(66), 'hex'),
          pub: Buffer.from(val.slice(0, 66), 'hex'),
        })
      }
    }
    return shares
  }

  clear() {
    this.session.clear()
  }

  randomBytes(size: number = 32) {
    return getRutoken().getSlots(0).open(6).generateRandom(size)
  }

  disconnect() {
    this.session.logout()
    getRutoken().getSlots(0).closeAll()
    this._session = null
  }
}
