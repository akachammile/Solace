import { app, BrowserWindow, dialog, ipcMain, type OpenDialogOptions } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { IPC_CHANNELS } from '../shared/constants/ipc-channels'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function registerIpcHandlers() {
  ipcMain.handle(IPC_CHANNELS.system.getAppInfo, () => ({
    appName: app.getName(),
    appVersion: app.getVersion(),
    electronVersion: process.versions.electron,
    chromeVersion: process.versions.chrome,
    nodeVersion: process.versions.node,
    platform: process.platform,
  }))

  ipcMain.handle(IPC_CHANNELS.system.ping, () => 'pong from main')

  ipcMain.handle(IPC_CHANNELS.system.selectDirectory, async () => {
    const dialogOptions: OpenDialogOptions = {
      properties: ['openDirectory'],
    }

    const result = win
      ? await dialog.showOpenDialog(win, dialogOptions)
      : await dialog.showOpenDialog(dialogOptions)

    if (result.canceled || result.filePaths.length === 0) {
      return null
    }

    return result.filePaths[0]
  })

  ipcMain.handle(IPC_CHANNELS.window.minimize, () => {
    win?.minimize()
  })

  ipcMain.handle(IPC_CHANNELS.window.toggleMaximize, () => {
    if (!win) {
      return
    }

    if (win.isMaximized()) {
      win.unmaximize()
      return
    }

    win.maximize()
  })

  ipcMain.handle(IPC_CHANNELS.window.close, () => {
    win?.close()
  })
}

function createWindow() {
  const publicPath = process.env.VITE_PUBLIC ?? RENDERER_DIST

  win = new BrowserWindow({
    width: 1080,
    height: 670,
    minWidth: 800,
    minHeight: 600,

    autoHideMenuBar: true,
    frame: false,
    icon: path.join(publicPath, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  win.setMenuBarVisibility(false)

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(() => {
  registerIpcHandlers()
  createWindow()
})
