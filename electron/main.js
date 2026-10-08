// CampusEats for Windows: the same web app (../www, copied to ./app at build
// time) in its own window.
//
// The app uses path routes (/tabs/menu) under <base href="/">, which a plain
// file:// load can't serve. So it is served from a private app:// origin
// that falls back to index.html for any route that isn't a real file.
const { app, BrowserWindow, protocol, net, shell } = require('electron');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const WEB_ROOT = path.join(__dirname, 'app');
const ORIGIN = 'app://campuseats';

protocol.registerSchemesAsPrivileged([{
  scheme: 'app',
  // standard + secure: a normal origin, so sessionStorage, fetch and CORS
  // calls to the API behave as they do on the website.
  privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true }
}]);

function serve(request) {
  const { pathname } = new URL(request.url);
  const file = path.normalize(path.join(WEB_ROOT, decodeURIComponent(pathname)));
  const isAsset = file.startsWith(WEB_ROOT + path.sep) &&
    fs.existsSync(file) && fs.statSync(file).isFile();
  return net.fetch(pathToFileURL(isAsset ? file : path.join(WEB_ROOT, 'index.html')).toString());
}

function openOutside(url) {
  if (/^https?:\/\//.test(url)) shell.openExternal(url);
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 820,
    minWidth: 380,
    minHeight: 600,
    title: 'CampusEats',
    // Same colour as the splash, so there is no white flash before it paints.
    backgroundColor: '#85310f',
    show: false,
    autoHideMenuBar: true,
    webPreferences: { contextIsolation: true, sandbox: true }
  });

  win.once('ready-to-show', () => win.show());

  // Links to other sites open in the default browser, not inside the app.
  win.webContents.setWindowOpenHandler(({ url }) => {
    openOutside(url);
    return { action: 'deny' };
  });
  win.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith(ORIGIN)) {
      event.preventDefault();
      openOutside(url);
    }
  });

  win.loadURL(`${ORIGIN}/`);
}

// One window only: opening the app again focuses the one already running.
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => {
    const [win] = BrowserWindow.getAllWindows();
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });

  app.whenReady().then(() => {
    protocol.handle('app', serve);
    createWindow();
  });

  app.on('window-all-closed', () => app.quit());
}
