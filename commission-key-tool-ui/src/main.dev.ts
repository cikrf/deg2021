/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build:main`, this file is compiled to
 * `./src/main.prod.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable'
import 'regenerator-runtime/runtime'
import path from 'path'
import { app, BrowserWindow, dialog, ipcMain } from 'electron'
import {
  changePassword,
  clearToken,
  generateKey,
  getPublicFromPrivate,
  readShare,
  restoreKey,
  waitForRutokenConnect,
  waitForRutokenDisconnect,
  writeShare,
} from './utils/commission-key-tool'
import * as fs from 'fs/promises'
import MenuBuilder from './menu'
import { stringifyKey } from './utils/maskKey'

let mainWindow: BrowserWindow | null = null

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support')
  sourceMapSupport.install()
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')()
}

const installExtensions = () => {
  const installer = require('electron-devtools-installer')
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS
  const extensions = ['REACT_DEVELOPER_TOOLS']

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log)
}

const createWindow = async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions()
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../assets')

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths)
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1280,
    height: 900,
    icon: getAssetPath('icon.png'),
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })
  mainWindow.maximize()

  mainWindow.loadURL(`file://${__dirname}/index.html`)


  const menuBuilder = new MenuBuilder(mainWindow)
  menuBuilder.buildMenu()

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined')
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize()
    } else {
      mainWindow.show()
      mainWindow.focus()
    }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

/**
 * Add event listeners...
 */

ipcMain.on('wait-rutoken-connected', async (event) => {
  await waitForRutokenConnect()
  event.reply('rutoken-connected')
})

ipcMain.on('wait-rutoken-disconnected', async (event) => {
  await waitForRutokenDisconnect()
  event.reply('rutoken-disconnected')
})

ipcMain.handle('change-password', async (event, args) => {
  const { oldPassword, newPassword } = args
  try {
    await changePassword(oldPassword, newPassword)
    return {
      success: true,
    }
  } catch (e) {
    console.log(e)
    return {
      success: false,
      errorCode: e.code,
    }
  }
})

ipcMain.handle('clear-token', async (event, args) => {
  const { password } = args
  try {
    await clearToken(password)
    return {
      success: true,
    }
  } catch (e) {
    console.log(e)
    return {
      success: false,
      errorCode: e.code,
    }
  }
})

ipcMain.handle('generate-key', async (event, args) => {
  const { fragmentsCount, restoreCount } = args
  try {
    const result = await generateKey(fragmentsCount, restoreCount)
    return {
      success: true,
      result,
    }
  } catch (e) {
    console.log(e)
    return {
      success: false,
      errorCode: e.code,
    }
  }
})

ipcMain.handle('write-share', async (event, args) => {
  const { password, share } = args
  try {
    const result = await writeShare(share, password)
    return {
      success: true,
      result,
    }
  } catch (e) {
    console.log(e)
    return {
      success: false,
      errorCode: e.code,
    }
  }
})

ipcMain.handle('open-directory', async () => {
  if (!mainWindow) {
    return
  }
  try {
    const result = await dialog.showOpenDialogSync(mainWindow, {
      properties: ['openDirectory'],
    })
    return {
      success: true,
      result: result ? result[0] : null,
    }
  } catch (e) {
    console.log(e)
    return {
      success: false,
      errorCode: e.code,
    }
  }
})

ipcMain.handle('write-public-key', async (event, args) => {
  const { path: keyPath, key } = args
  const keyStr = stringifyKey(key)
  try {
    await fs.writeFile(path.join(keyPath, `public_key_${keyStr.substr(-4)}.txt`), keyStr)
    return {
      success: true,
    }
  } catch (e) {
    console.log(e)
    return {
      success: false,
      errorCode: e.code,
    }
  }
})

ipcMain.handle('write-private-key', async (event, args) => {
  const { path: keyPath, key } = args
  const keyStr = stringifyKey(key)
  try {
    await fs.writeFile(path.join(keyPath, `private_key_${keyStr.substr(-4)}.txt`), keyStr)
    return {
      success: true,
    }
  } catch (e) {
    console.log(e)
    return {
      success: false,
      errorCode: e.code,
    }
  }
})

ipcMain.handle('read-share', async (event, args) => {
  const { password } = args
  try {
    const result = await readShare(password)
    if (!result) {
      return {
        success: false,
      }
    }
    return {
      success: true,
      result,
    }
  } catch (e) {
    console.log(e)
    return {
      success: false,
      errorCode: e.code,
    }
  }
})

ipcMain.handle('restore-key', async (event, args) => {
  const { shares } = args
  try {
    const result = await restoreKey(shares)
    const publicKey = await getPublicFromPrivate(result)
    if (!publicKey.equals(Buffer.from(shares[0].pub))) {
      return {
        success: false,
      }
    }
    return {
      success: true,
      result,
    }
  } catch (e) {
    console.log(e)
    return {
      success: false,
      errorCode: e.code,
    }
  }
})

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.whenReady().then(createWindow).catch(console.log)

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})
