/* eslint-disable promise/catch-or-return */
/* eslint-disable no-loop-func */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */

import { ensureDirExistsAndWritable } from './util';

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
const path = require('path');
const MenuBuilder = require('./menu');
const util = require('./util');
const { now, omit } = require('lodash');
const { isImage } = require('./util');
const { fetchingData } = require('./fetchingData');
const axios = require('axios');
const log = require('electron-log');
const fs = require('fs');

const { app, BrowserWindow, shell, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');

const ResizeWorkerService = require('./resizeService');
const DownloadWorkerService = require('./downloadWorkerService');

const resizeService = new ResizeWorkerService(1);
const downloadWorker = new DownloadWorkerService(1);
class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
  }
}

let mainWindow = null;

const itemsPerPage = 10;
ipcMain.on(
  'get-content-with-path',
  async (event, { folderPath, page }: { folderPath: string; page: number }) => {
    const fileList = await fs.promises.readdir(folderPath);
    const totalFiles = fileList.length;
    const start = page * itemsPerPage;
    const end = Math.min(start + itemsPerPage, totalFiles);

    // Function to send a page of data to the renderer
    const sendPage = async () => {
      // const start = pageNumber * itemsPerPage;
      // const end = Math.min(start + itemsPerPage, totalFiles);
      const pageData = fileList.slice(start, end);

      const filteredPage = [];

      for (const fileName of pageData) {
        const filePath = path.join(folderPath, fileName);
        const stats = fs.statSync(filePath);
        const fileContent =
          stats.isFile() && (await fs.promises.readFile(filePath));

        filteredPage.push({
          id: stats.ino,
          title: fileName,
          fileSize: stats.size,
          filePath,
          modificationTime: stats.mtime,
          isDirectory: stats.isDirectory(),
          isFile: stats.isFile(),
          fileExtension: path.extname(fileName),
          fileContent:
            fileContent &&
            `data:image/jpeg;base64,${fileContent.toString('base64')}`,
        });
      }

      // console.log('filteredPage', filteredPage);
      // console.log('filteredPage length', page, filteredPage.length);
      event.reply('get-content-with-path-success', filteredPage);

      // if (end < totalFiles) {
      //   // More data is available, request the next page
      //   sendPage(pageNumber + 1);
      // }
    };
    // console.log('end: ', end, ', total files: ', totalFiles);

    if (end <= totalFiles) {
      sendPage();
    }
  },
);

ipcMain.on(
  'get-content-with-url-with-resizing',
  async (
    event,
    {
      dataSource,
      page = 0,
      limit = 10,
    }: { dataSource: string; page: number; limit: number },
  ) => {
    try {
      const response = await fetchingData({ dataSource, page, limit });
      const pageItems = [];
      let index = 0;
      for (const item of response) {
        let contentType = '';

        let initData = {
          ...item,
        };

        try {
          const rs = await axios.head(item.url);
          contentType = rs.headers['content-type'];
          const fileSize = rs.headers['content-length'];

          initData = {
            ...initData,
            fileSize,
          };
        } catch (error) {
          /* empty */
        }

        const isImageType = contentType && contentType.startsWith('image/');

        if (isImageType) {
          const { buffer } = await downloadWorker.downloadImage(
            item.url,
            index,
          );

          const startTime = now();
          const { thumbSize } = await resizeService.resizeImage(buffer, index);

          const bufferData = Buffer.from(thumbSize);

          const endTime = now();

          console.log(endTime - startTime, 'ms');

          initData = {
            ...omit(initData, 'url'),
            isFile: true,
            fileExtension: '.jpeg',
            resizeSize:
              Buffer.byteLength(
                `data:image/jpeg;base64,${bufferData.toString('base64')}`,
                'base64',
              ) / 1024,
            fileContent:
              !!bufferData &&
              `data:image/jpeg;base64,${bufferData.toString('base64')}`,
          };
          pageItems.push(initData);
        } else {
          initData = {
            ...omit(initData, 'url'),
          };
          pageItems.push(initData);
        }
        index = index + 1;
      }

      console.log('on reply: ', page);
      event.reply('get-content-with-path-success', pageItems);
    } catch (error) {
      console.log(error);
    }
  },
);

ipcMain.on(
  'get-content-with-path-enhance-with-resizing',
  async (event, { folderPath, page = 0, limit: itemsPerPage = 10 }) => {
    try {
      if (!ensureDirExistsAndWritable(folderPath))
        return event.reply(
          'get-content-with-path-error',
          'Cannot access directory',
        );

      const fileList = await fs.promises.readdir(folderPath);
      const totalFiles = fileList.length;
      const start = page * itemsPerPage;
      const end = Math.min(start + itemsPerPage, totalFiles);

      let workerIndex = 0;

      const startTime = now();

      const sendPage = async () => {
        const pageData = fileList.slice(start, end);
        const promises = [];

        for (const fileName of pageData) {
          const filePath = path.join(folderPath, fileName);
          const stats = await fs.promises.stat(filePath);
          const isImageType =
            stats.isFile() &&
            isImage({ fileExtension: path.extname(fileName) });
          const initData = {
            id: stats.ino,
            title: fileName,
            fileSize: stats.size,
            filePath,
            modificationTime: stats.mtime,
            isDirectory: stats.isDirectory(),
            isFile: stats.isFile(),
            fileExtension: path.extname(fileName),
          };

          const newProcess = new Promise((resolve) => {
            if (isImageType) {
              resizeService
                .resizeImage(filePath, workerIndex)
                .then(({ thumbSize, error }) => {
                  const bufferData = Buffer.from(thumbSize);

                  if (error) {
                    console.error(
                      `Error resizing image ${path.extname(
                        fileName,
                      )}: ${error}`,
                    );
                    resolve(initData);
                  } else {
                    resolve({
                      ...initData,
                      resizeSize:
                        Buffer.byteLength(
                          `data:image/jpeg;base64,${bufferData.toString(
                            'base64',
                          )}`,
                          'base64',
                        ) / 1024,
                      fileContent:
                        thumbSize &&
                        `data:image/jpeg;base64,${bufferData.toString(
                          'base64',
                        )}`,
                    });
                  }
                });
            } else {
              resolve(initData);
            }
          });
          workerIndex = workerIndex + 1;

          promises.push(newProcess);
        }

        const rs = await Promise.all(promises);

        const endTime = now();

        console.log(
          '--- replying page with time: ',
          page,
          endTime - startTime,
          'ms',
        );

        event.reply('get-content-with-path-success', rs);
      };

      if (end <= totalFiles) {
        sendPage();
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle the error, e.g., send an error response to the main thread
    }
  },
);
ipcMain.on('get-files', async (event, { folderPath, page }) => {
  if (page >= 1) return event.reply('get-content-with-path-success', []);
  console.log('----------------- get-files: ', page);

  try {
    const files = await fs.promises.readdir(folderPath);
    const fileList = [];

    let index = 0;
    for (const fileName of files) {
      index = index + 1;
      // console.log(folderPath, fileName)
      const filePath = path.join(folderPath, fileName);
      // const a = await getImageSize(filePath);

      const stats = await fs.promises.stat(filePath);
      const fileContent =
        stats.isFile() && (await fs.promises.readFile(filePath));

      fileList.push({
        id: stats.ino,
        title: fileName,
        fileSize: stats.size,
        filePath,
        modificationTime: stats.mtime,
        isDirectory: stats.isDirectory(),
        isFile: stats.isFile(),
        fileExtension: path.extname(fileName),
        fileContent:
          fileContent &&
          `data:image/jpeg;base64,${fileContent.toString('base64')}`,
      });
    }

    console.log('done!');

    event.reply('get-content-with-path-success', fileList);
  } catch (error) {
    console.error('Error reading files:', error);
    event.reply('files-read-error', error?.message);
  }
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  // if (isDebug) {
  //   await installExtensions();
  // }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(util.resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  // mainWindow.webContents.once('dom-ready', async () => {
  //   await installExtension([REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS])
  //     .then((name) => console.log(`Added Extension-------:  ${name}`))
  //     .catch((err) => console.log('An error occurred-------: ', err))
  //     .finally(() => {
  //       mainWindow.webContents.openDevTools();
  //     });
  // });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
