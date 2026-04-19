const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    saveSession: (data) => ipcRenderer.invoke('save-session', data),
    getSessions: () => ipcRenderer.invoke('get-sessions'),
});