const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Store = require('electron-store').default;

const store = new Store();

let mainWindow;

const MODES = {
    MINI: { width: 200, height: 300 },
    TIMER: { width: 300, height: 500 },
    FULL: { width: 700, height: 500 }
};

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 300,
        height: 500,
        // minWidth: 300,
        // minHeight: 500,
        maxWidth: 700,
        maxHeight: 500,

        resizable: false,

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

ipcMain.handle('set-mode', (event, mode) => {
    const win = BrowserWindow.getFocusedWindow();
    const size = MODES[mode];

    if (!win || !size) return;

    win.setSize(size.width, size.height);
});

function createPopUpWindow() {
    const memeWin = new BrowserWindow({
        width: 200,
        height: 200,
        transparent: true,
        frame: false,
        alwaysOnTop: true,
        resizable: false,
        hasShadow: false,
        focusable: false,
        skipTaskbar: true
    });
    memeWin.loadFile('./renderer/components/Popup.html');
}
