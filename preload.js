const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    getGoals: () => ipcRenderer.invoke('get-goals'),
    saveSession: (data) => ipcRenderer.invoke('save-session', data),
    getSessions: () => ipcRenderer.invoke('get-sessions'),
});