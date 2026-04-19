const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Store = require('electron-store').default;

const store = new Store();

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

ipcMain.handle('save-session', (event, data) => {
    const sessions = store.get('sessions', []);
    sessions.push(session);
    store.set('sessions', sessions);
});

ipcMain.handle('get-goals', () => {
    return store.get('big_goals', []);
});

ipcMain.handle('get-sessions', () => {
    return store.getAll();
});