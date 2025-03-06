const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 1000, // Aumentado para melhor visualização
        height: 700,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false, // Permite comunicação com o renderer.js
        }
    });

    win.loadFile(path.join(__dirname, 'views/index.html'));
    win.setMenu(null); // Remove menu padrão do Electron (opcional)
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') { // No macOS, manter o app aberto
        app.quit();
    }
});

