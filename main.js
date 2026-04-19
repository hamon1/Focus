const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Store = require('electron-store').default;

const store = new Store();

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 400,
        height: 500,
        minWidth: 400,
        minHeight: 500,
        maxWidth: 700,
        alwaysOnTop: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
        transparent: true,
        frame: false,
    });

    mainWindow.loadFile('./renderer/components/Daygoal.html');
}

function ensureDefaultGoal() {
    let goals = store.get('big_goals');

    if (!goals || goals.length === 0) {
        const defaultGoal = {
        id: 'default_goal',
        title: 'Default Goal',
        total_focus_time: 0,
        created_at: new Date().toISOString()
        };

        store.set('big_goals', [defaultGoal]);
    }
    }

    app.whenReady().then(() => {
        ensureDefaultGoal();
        createWindow();
    });

ipcMain.handle('save-session', (event, session) => {
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