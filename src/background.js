'use strict'

import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'
const path = require('path')

const { autoUpdater } = require('electron-updater');

import { formatBytes } from './helpers/HelperFunctions';

const remote = require('@electron/remote/main');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

// temporary fix for allowing xmlhttprequests (webSecurity: false)
app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  // Create the browser window.

  remote.initialize()

  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false,
      // nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    frame: false,
    backgroundColor: '#222222'
  })

  remote.enable(win.webContents);

  win.webContents.on('new-window', function(e, url) {
    e.preventDefault();
    require('electron').shell.openExternal(url);
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools({ mode: "detach" })
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => {
    win = null
  })

}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

ipcMain.on('requestVersion', (event) => {
  event.sender.send('version', { version: app.getVersion() });
});

ipcMain.on('checkForUpdate', () => {
  if (!isDevelopment) {
    autoUpdater.checkForUpdates();
  } else {
    console.log('We are in dev-environment. Skipping update check...');
  }
});

autoUpdater.on('update-available', () => {
  win.webContents.send('updateInfo', {
    updateStatus: 'Update available',
    updateLoading: true,
    updateReady: false
  });
});

// autoUpdater.on('update-not-available', () => {
//   win.webContents.send('update_not_available');
// });

// autoUpdater.on('checking-for-update', () => {
//   win.webContents.send('checking_for_update');
//   console.log('Checking for updates...');
// });

autoUpdater.on('update-downloaded', () => {
  win.webContents.send('updateInfo', {
    updateStatus: null,
    updateLoading: false,
    updateReady: true
  });
});

autoUpdater.on('download-progress', (progressObj) => {
  let log_message = 'Downloading update ' + Math.round(progressObj.percent) + '% (' + formatBytes(progressObj.transferred) + "/" + formatBytes(progressObj.total) + ' @' + formatBytes(progressObj.bytesPerSecond) + '/s)';

  win.webContents.send('updateInfo', {
    updateStatus: log_message,
    updateLoading: true,
    updateReady: false
  });
});

ipcMain.on('restartForUpdate', () => {
  autoUpdater.quitAndInstall();
});
