const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('digismartDesktop', {
  platform: process.platform,
  version: '2.0.0',
});
