import {
  app,
  BrowserWindow
} from 'electron';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webSecurity: false,
    webPreferences: {
      webSecurity: false,
      nativeWindowOpen: false,
      nodeIntegration: true // 注入node模块
    }
  });

  // and load the index.html of the app. 为你的应用加载index.html
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  // Open the DevTools. 打开开发者工具
  //  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  // const c_T = globalShortcut.register('CommandOrControl+T', () => {
  //   mainWindow.webContents.toggleDevTools();
  // })
  // const c_S = globalShortcut.register('ControlOrAlt+S', () => {
  //   $(".apipost_Send").trigger("click");
  // })
  // const a_S = globalShortcut.register('CommandOrControl+S', () => {
  //   $(".apipost_Save").trigger("click");
  // })

  // if (!c_T || !c_S || !a_S) {
  //   console.log('registration failed')
  // }

  // // 检查快捷键是否注册成功
  // console.log("~~~~~~~~~~~", globalShortcut.isRegistered('CommandOrControl+T'))
};

// This method will be called when Electron has finished Electron会在初始化完成并且准备好创建浏览器窗口时调用这个方法
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
  // 注销所有快捷键
  // globalShortcut.unregisterAll()
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});


const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // 当运行第二个实例时,将会聚焦到mainWindow这个窗口
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
      mainWindow.show()
    }
  })
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.