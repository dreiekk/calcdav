
console.log('preload.js');

import { ipcRenderer } from 'electron'
window.ipcRenderer = ipcRenderer

require('./menuHandler2')();
