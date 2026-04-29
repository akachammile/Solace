import { app, BrowserWindow, dialog, ipcMain, screen, type OpenDialogOptions, type Rectangle } from 'electron'
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
// │ │ └── preload.js
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null
let dimOverlayWindows: BrowserWindow[] = []

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

  ipcMain.handle(IPC_CHANNELS.window.toggleDimOverlay, () => {
    toggleDimOverlay()
  })

  ipcMain.handle(IPC_CHANNELS.window.close, () => {
    win?.close()
  })
}

function createOverlayHtml(hole: Rectangle | null) {
  const holeStyle = hole
    ? `
      .hole {
        position: fixed;
        left: ${hole.x}px;
        top: ${hole.y}px;
        width: ${hole.width}px;
        height: ${hole.height}px;
        border-radius: 14px;
        box-shadow: 0 0 0 9999px rgba(12, 12, 12, 0.64);
        outline: 1px solid rgba(255, 255, 255, 0.2);
      }
    `
    : 'body { background: rgba(12, 12, 12, 0.64); }'

  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          html,
          body {
            width: 100%;
            height: 100%;
            margin: 0;
            overflow: hidden;
            background: transparent;
            pointer-events: none;
          }
          ${holeStyle}
        </style>
      </head>
      <body>${hole ? '<div class="hole"></div>' : ''}</body>
    </html>
  `
}

function closeDimOverlay() {
  dimOverlayWindows.forEach((overlayWindow) => {
    if (!overlayWindow.isDestroyed()) {
      overlayWindow.close()
    }
  })
  dimOverlayWindows = []
}

function showDimOverlay() {
  if (!win) {
    return
  }

  closeDimOverlay()

  const windowBounds = win.getBounds()
  const displays = screen.getAllDisplays()

  dimOverlayWindows = displays.map((display) => {
    const displayBounds = display.bounds
    const overlaps =
      windowBounds.x < displayBounds.x + displayBounds.width &&
      windowBounds.x + windowBounds.width > displayBounds.x &&
      windowBounds.y < displayBounds.y + displayBounds.height &&
      windowBounds.y + windowBounds.height > displayBounds.y

    const hole = overlaps
      ? {
          x: Math.max(windowBounds.x - displayBounds.x, 0),
          y: Math.max(windowBounds.y - displayBounds.y, 0),
          width: Math.min(windowBounds.width, displayBounds.width),
          height: Math.min(windowBounds.height, displayBounds.height),
        }
      : null

    const overlayWindow = new BrowserWindow({
      ...displayBounds,
      frame: false,
      transparent: true,
      resizable: false,
      movable: false,
      focusable: false,
      show: false,
      skipTaskbar: true,
      alwaysOnTop: true,
      webPreferences: {
        sandbox: true,
      },
    })

    overlayWindow.setIgnoreMouseEvents(true)
    overlayWindow.setAlwaysOnTop(true, 'screen-saver')
    overlayWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(createOverlayHtml(hole))}`)
    overlayWindow.once('ready-to-show', () => overlayWindow.showInactive())

    return overlayWindow
  })

  win.moveTop()
}

function toggleDimOverlay() {
  if (dimOverlayWindows.length > 0) {
    closeDimOverlay()
    return
  }

  showDimOverlay()
}

function createWindow() {
  win = new BrowserWindow({
    width: 1080,
    height: 670,
    minWidth: 800,
    minHeight: 600,

    autoHideMenuBar: true,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  win.setMenuBarVisibility(false)
  win.on('move', () => {
    if (dimOverlayWindows.length > 0) {
      showDimOverlay()
    }
  })
  win.on('resize', () => {
    if (dimOverlayWindows.length > 0) {
      showDimOverlay()
    }
  })
  win.on('closed', closeDimOverlay)

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
