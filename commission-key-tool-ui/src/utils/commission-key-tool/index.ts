/* eslint-disable no-console */
import { RuToken } from './rutoken'
import { Crypto } from './crypto'
import { Share } from './types'

class RutokenWrapper {

  private _rutoken: RuToken = new RuToken()

  waitInitialization(): Promise<RuToken> {
    return new Promise(resolve => {
      try {
        const rutoken = new RuToken()
        rutoken.initialize()
        resolve(rutoken)
      } catch (e) {
        if (e.name !== 'NativeError' && e.message !== 'Parameter 1  MUST be Buffer' && e.method !== '' && e.nativeStack !== '') {
          return
        }
        setTimeout(() => {
          resolve(this.waitInitialization())
        }, 1000)
      }
    })
  }

  waitDisconnect(): Promise<void> {
    return new Promise(resolve => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((this._rutoken!.getSlots() as any).innerItems.length === 0) {
        resolve()
      } else {
        setTimeout(() => {
          resolve(this.waitDisconnect())
        }, 1000)
      }
    })
  }
}

export const waitForRutokenConnect = () => {
  const rutokenWrapper = new RutokenWrapper()
  return rutokenWrapper.waitInitialization()
}

export const waitForRutokenDisconnect = () => {
  const rutokenWrapper = new RutokenWrapper()
  return rutokenWrapper.waitDisconnect()
}

export const clearToken = async (password: string) => {
  const rutoken = await waitForRutokenConnect()
  rutoken.connect(password)
  rutoken.clear()
  rutoken.disconnect()
}

export const changePassword = async (oldPassword: string, newPassword: string) => {
  const rutoken = await waitForRutokenConnect()
  rutoken.connect(oldPassword)
  rutoken.session.setPin(oldPassword, newPassword)
  rutoken.disconnect()
}

export const generateKey = async (fragmentsCount: number, restoreCount: number) => {
  const rutoken = await waitForRutokenConnect()
  const n = fragmentsCount
  const k = restoreCount
  const crypto = new Crypto(rutoken.randomBytes)
  const { publicKey, privateKey } = crypto.generateKeyPair()
  const shares = crypto.splitPrivateKey(privateKey, k!, n!)
  return {
    publicKey,
    privateKey,
    shares: shares.map((share) => ({
      ...share,
      pub: publicKey,
    })),
  }
}

export const writeShare = async (share: Share, password: string) => {
  const rutoken = await waitForRutokenConnect()
  rutoken.connect(password)
  rutoken.clear()
  rutoken.writeShare(share)
  rutoken.disconnect()
}

export const restoreKey = async (shares: Share[]) => {
  const rutoken = await waitForRutokenConnect()
  const crypto = new Crypto(rutoken.randomBytes)
  return crypto.restorePrivateKey(shares)
}

export const getPublicFromPrivate = async (privateKey: Uint8Array) => {
  const rutoken = await waitForRutokenConnect()
  const crypto = new Crypto(rutoken.randomBytes)
  return crypto.getPublicKey(privateKey)
}

export const readShare = async (password: string) => {
  const rutoken = await waitForRutokenConnect()
  rutoken.connect(password)
  const share = rutoken.readShares()[0]
  rutoken.disconnect()
  return share
}
