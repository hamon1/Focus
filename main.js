const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const store = require('./db/store');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 400,
        height: 600,
        minWidth: 400,
        minHeight: 600,
        alwaysOnTop: true,
        webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        },
        transparent: true,
        frame: false,
    });

    mainWindow.loadFile('./renderer/components/Daygoal.html');
}

app.whenReady().then(createWindow);

// 데이터 저장
ipcMain.handle('save-session', (event, data) => {
    store.save(data);
});

// 데이터 조회
ipcMain.handle('get-sessions', () => {
    return store.getAll();
});