const { app, BrowserWindow } = require('electron');
const path = require('path');
const http = require('http');
const fs = require('fs');

let mainWindow;
let server;

// MIME types dictionary for static assets
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain',
};

function startLocalServer(outDir, callback) {
  server = http.createServer((req, res) => {
    try {
      let reqPath = decodeURIComponent(req.url.split('?')[0]);
      if (reqPath === '/' || reqPath === '') {
        reqPath = '/index.html';
      }

      let filePath = path.join(outDir, reqPath);

      // Handle directory routes with trailing slash
      if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
      } else if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
        filePath = filePath + '.html';
      }

      // If file does not exist, fallback to index.html (SPA routing)
      if (!fs.existsSync(filePath)) {
        filePath = path.join(outDir, 'index.html');
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('File not found');
        } else {
          res.writeHead(200, {
            'Content-Type': contentType,
            'Cache-Control': 'no-cache',
          });
          res.end(data);
        }
      });
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal server error: ' + e.message);
    }
  });

  // Listen on random available port on localhost only
  server.listen(0, '127.0.0.1', () => {
    const port = server.address().port;
    callback(port);
  });
}

function createWindow(port) {
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 868,
    minWidth: 1024,
    minHeight: 700,
    title: 'DIGISMART - AI Public Communication Command Center',
    backgroundColor: '#0B1120',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadURL(`http://127.0.0.1:${port}`);

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  // Determine correct out directory path (both development & packaged production)
  let outDir = path.join(__dirname, '..', 'out');
  if (!fs.existsSync(outDir)) {
    outDir = path.join(__dirname, 'out');
  }

  startLocalServer(outDir, (port) => {
    createWindow(port);
  });

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0 && server) {
      const port = server.address().port;
      createWindow(port);
    }
  });
});

app.on('window-all-closed', function () {
  if (server) {
    server.close();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
