const { app, BrowserWindow, ipcMain } = require('electron');

let mainWindow;
let lockWindow;
let inactivityTimer;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: __dirname + '/preload.js', // Use preload for secure IPC
      contextIsolation: true, // Enable context isolation
      enableRemoteModule: false, // Disable remote module
    },
  });

  mainWindow.loadURL('http://localhost:3000/dashboard');

  // Listen for 'lock-screen' events from the renderer process
  ipcMain.on('lock-screen', () => {
    console.log('Lock screen due to inactivity!');
    showLockScreen(); // Display the lock screen
  });
}

function showLockScreen() {
  if (lockWindow) return; // Prevent multiple lock screens

  // Create the lock screen window
  lockWindow = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreen: true, // Make the window cover the entire screen
    frame: false, // No title bar for a lock screen
    alwaysOnTop: true, // Ensure it's always on top
    resizable: false,
    movable: false,
    skipTaskbar: true, // Hide from taskbar
    modal: true, // Block interactions with other windows
    webPreferences: {
      contextIsolation: true,
    },
  });

  lockWindow.loadFile(__dirname + '/lock.html');

  // Prevent closing the lock screen manually
  lockWindow.setClosable(false);

  // Keep focus on the lock screen
  lockWindow.on('blur', () => {
    lockWindow.focus();
  });
}

function closeLockScreen() {
  if (lockWindow) {
    lockWindow.close();
    lockWindow = null;
  }
}

app.whenReady().then(() => {
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });

  // Reset inactivity timer when user activity resumes
  ipcMain.on('user-active', () => {
    closeLockScreen();
  });

  // Inactivity detection logic
  startInactivityTimer();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Function to start inactivity timer
function startInactivityTimer() {
  const resetInactivityTimer = () => {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      console.log('Inactivity detected. Locking screen.');
      showLockScreen();
    }, 30000000); // 5 minutes of inactivity
  };

  // Add listeners to reset the timer on activity
  ['mousemove', 'keydown', 'click'].forEach((event) => {
    mainWindow.webContents.on(event, resetInactivityTimer);
  });

  resetInactivityTimer(); // Initialize timer
}
