// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu} = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Mac OS X Menu Bar Code
const isMac = process.platform === "darwin";
const template = [
    // { role: 'appMenu' }
    ...(process.platform === 'darwin' ? [{
      label: app.getName(),
      submenu: [{
          role: 'about'
        },
        {
          type: 'separator'
        },
        {
          role: 'services'
        },
        {
          type: 'separator'
        },
        {
          role: 'hide'
        },
        {
          role: 'hideothers'
        },
        {
          role: 'unhide'
        },
        {
          type: 'separator'
        },
        {
          role: 'quit'
        }
      ]
    }] : []),
    // { role: 'fileMenu' }
    {
      label: 'File',
      submenu: [
        {
          label: "New Window",
          click() {
            if (mainWindow === null){
              createWindow();
              Menu.setApplicationMenu(Menu.buildFromTemplate(template));
            }
          },
          accelerator: 'Cmd+N'
        },
        isMac ? {
          role: 'close'
        } : {
          role: 'quit'
        },
      ]
    },
    // { role: 'editMenu' }
    {
      label: 'Edit',
      submenu: [{
          role: 'undo'
        },
        {
          role: 'redo'
        },
        {
          type: 'separator'
        },
        {
          role: 'cut'
        },
        {
          role: 'copy'
        },
        {
          role: 'paste'
        },
        ...(isMac ? [{
            role: 'pasteAndMatchStyle'
          },
          {
            role: 'delete'
          },
          {
            role: 'selectAll'
          },
          {
            type: 'separator'
          },
          {
            label: 'Speech',
            submenu: [{
                role: 'startspeaking'
              },
              {
                role: 'stopspeaking'
              }
            ]
          }
        ] : [{
            role: 'delete'
          },
          {
            type: 'separator'
          },
          {
            role: 'selectAll'
          }
        ])
      ]
    },
    // { role: 'viewMenu' }
    {
      label: 'View',
      submenu: [{
          role: 'reload'
        },
        {
          role: 'forcereload'
        },
        {
          type: 'separator'
        },
        {
          role: 'resetzoom'
        },
        {
          role: 'zoomin'
        },
        {
          role: 'toggledevtools'
        },
        {
          role: 'zoomout'
        },
        {
          type: 'separator'
        },
        {
          role: 'togglefullscreen'
        }
      ]
    },
    // { role: 'windowMenu' }
    {
      label: 'Window',
      submenu: [{
          role: 'minimize'
        },
        {
          role: 'zoom'
        },
        ...(isMac ? [{
            type: 'separator'
          },
          {
            role: 'front'
          },
          {
            type: 'separator'
          },
          {
            role: 'window'
          }
        ] : [{
          role: 'close'
        }])
      ]
    }  
];


function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 876,
    height: 996,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow();
  // Add Menu Bar
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
});