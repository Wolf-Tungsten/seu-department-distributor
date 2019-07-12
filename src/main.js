const { app, BrowserWindow, Menu, shell } = require('electron');
const { dialog, ipcMain } = require('electron');


const { processStudent } = require('./core');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, visualizeWindow;

const createWindow = () => {
  //Menu.setApplicationMenu(null);   //隐藏menu
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 500,
    height: 310,
    resizable: false,
    maximizable: false,
    minimizable: false
  });


  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

};

let pathname = {};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
ipcMain.on('start', async (sys) => {
  if (pathname.path1 == undefined || pathname.path3 == undefined) {
    //mainWindow.webContents.send('getflag', false);
    dialog.showMessageBox({
      type: 'error', title: '数据不完整', message: `请正确选择输入数据`, buttons: ['对不起，我错了'
      ]
    })
    return;
  }
  if (pathname.path2 == undefined) {
    pathname.path2 = pathname.path1;
  }


  console.log(pathname);

  let proc = new Promise((resolve) => {

    let result = processStudent(pathname.path1, pathname.path2, pathname.path3);
    resolve()
    dialog.showMessageBox({
      type: 'info', title: '处理完成', message: `分配成功，结果已保存至：${pathname.path3}`, buttons: ['结果可视化', '打开输出位置',
        '关闭'
      ]
    }, (buttonIndex) => {
      if (buttonIndex === 0) {
        // Create the browser window.
        visualizeWindow = new BrowserWindow({
          width: 1220,
          height: 830,
          resizable: false,
          maximizable: false,
          minimizable: false
        });
        visualizeWindow.loadURL(`file://${__dirname}/visualize.html`);
        visualizeWindow.webContents.openDevTools();
        visualizeWindow.on('closed', () => {
          visualizeWindow = null;
        });
        setInterval(()=>{
          visualizeWindow.webContents.send('data', result)
          console.log(result)
        }, 3000)
        
      }
      if (buttonIndex === 1) {
        shell.showItemInFolder(pathname.path3)
      }
      pathname = {};
    })

    //mainWindow.webContents.send('finish', true);
  })

  proc.then(console.log('ok'));

});

ipcMain.on('open-dialog1', function (event, p) {
  dialog.showOpenDialog({
    filters: [{ name: '未分配数据', extensions: ['xls', 'xlsx'] }],
    properties: ['openFile']
  }, function (files) {
    if (files) {// 如果有选中
      // 发送选择的对象给子进程
      // event.sender.send('selectedItem', files[0])

      pathname.path1 = files[0];
    }
  });
});

ipcMain.on('open-dialog2', function (event, p) {
  dialog.showOpenDialog({
    filters: [{ name: '已分配数据', extensions: ['xls', 'xlsx'] }],
    properties: ['openFile']
  }, function (files) {
    if (files) {// 如果有选中
      // 发送选择的对象给子进程
      // event.sender.send('selectedItem', files[0])
      pathname.path2 = files[0];

    }
  });
});

ipcMain.on('save-dialog3', function (event, p) {
  dialog.showSaveDialog({
    filters: [{ name: '分配结果数据', extensions: ['xlsx'] }],
    properties: [p]
  }, function (files) {
    if (files) {// 如果有选中
      // 发送选择的对象给子进程
      // event.sender.send('selectedItem', files[0])
      pathname.path3 = files;

    }
  });
});

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.


