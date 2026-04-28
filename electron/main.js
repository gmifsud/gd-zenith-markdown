const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs/promises');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: '#1e1e1e',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Load the built index.html
  // We assume the electron process is run from the root, so index.html is in root
  win.loadFile('index.html');
};

app.whenReady().then(() => {
  // IPC Handlers
  ipcMain.handle('read-file', async (event, filePath) => {
    return await fs.readFile(filePath, 'utf-8');
  });

  ipcMain.handle('write-file', async (event, filePath, content) => {
    return await fs.writeFile(filePath, content, 'utf-8');
  });

  ipcMain.handle('read-directory', async (event, dirPath) => {
    try {
      const names = await fs.readdir(dirPath);
      return names.map(name => ({
        id: path.join(dirPath, name),
        name,
        type: name.includes('.') ? 'file' : 'folder'
      }));
    } catch (e) {
      console.error(e);
      return [];
    }
  });

  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});