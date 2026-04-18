const { app, BrowserWindow } = require('electron');

function createWindow() {
    const win = new BrowserWindow({
        width: 1000,
        height: 800,

        transparent: true,
        frame: false,
        backgroundColor: '#00000000',

        webPreferences: {
        nodeIntegration: false, 
        contextIsolation: true,
        }
    });
    win.loadFile('index.html');
}

app.whenReady().then(createWindow);