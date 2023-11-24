/* eslint-disable operator-assignment */
/* eslint-disable no-use-before-define */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import sharp from 'sharp';
import log from 'electron-log';
import MenuBuilder from './menu';
import * as util from './util';
import { now, omit } from 'lodash';
import isImage from '../renderer/utils/isImage';
const fetch = require('node-fetch');
const fs = require('fs');
const {
  default: installExtension,
  REDUX_DEVTOOLS,
  REACT_DEVELOPER_TOOLS,
} = require('electron-devtools-installer');

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    // autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

const itemsPerPage = 10;

ipcMain.on(
  'get-content-with-path',
  async (
    event,
    { folderPath, page = 0 }: { folderPath: string; page: number },
  ) => {
    const fileList = await fs.promises.readdir(folderPath);
    const totalFiles = fileList.length;
    const start = page * itemsPerPage;
    const end = Math.min(start + itemsPerPage, totalFiles);

    console.log('page:', page);

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
    { urlList, page = 0 }: { urlList: Array<string>; page: number },
  ) => {
    const filteredPage = [];

    for (const item of urlList) {
      let thumbSize;
      const response = await fetch(item?.url, { method: 'HEAD' });
      const contentType = response.headers.get('Content-Type');

      const isImageType = contentType && contentType.startsWith('image/');

      const startTime = now();

      if (isImageType)
        try {
          const bufferImg = await fetch(item?.url).then((rs) => rs.buffer());

          thumbSize = (
            await sharp(bufferImg).resize(320, 320).jpeg().toBuffer()
          ).toString('base64');
        } catch (error) {
          console.log('error', error);
        }

      const endTime = now();
      console.log(endTime - startTime, 'ms');

      filteredPage.push({
        fileContent: !!thumbSize && `data:image/jpeg;base64,${thumbSize}`,
        ...omit(item, 'url'),
      });
    }

    console.log('on reply: ', page);
    event.reply('get-content-with-path-success', filteredPage);
  },
);

ipcMain.on(
  'get-content-with-path-enhance-with-resizing',
  async (
    event,
    { folderPath, page = 0 }: { folderPath: string; page: number },
  ) => {
    const fileList = await fs.promises.readdir(folderPath);
    const totalFiles = fileList.length;
    const start = page * itemsPerPage;
    const end = Math.min(start + itemsPerPage, totalFiles);

    const memoryUsage = process.memoryUsage();
    console.log(`Memory usage: ${JSON.stringify(memoryUsage)}`);

    console.log('page:', page);

    const sendPage = async () => {
      const pageData = fileList.slice(start, end);

      const filteredPage = [];

      for (const fileName of pageData) {
        const filePath = path.join(folderPath, fileName);
        const stats = fs.statSync(filePath);

        const startTime = now();

        const fileContent =
          stats.isFile() && isImage({ fileExtension: path.extname(fileName) });

        let thumbSize;

        try {
          thumbSize =
            fileContent &&
            (await sharp(filePath).resize(320, 320).jpeg().toBuffer()).toString(
              'base64',
            );
        } catch (error) {
          console.log(error);
        }

        const endTime = now();

        console.log(endTime - startTime, 'ms');

        filteredPage.push({
          id: stats.ino,
          title: fileName,
          fileSize: stats.size,
          filePath,
          modificationTime: stats.mtime,
          isDirectory: stats.isDirectory(),
          isFile: stats.isFile(),
          fileExtension: path.extname(fileName),
          fileContent: !!thumbSize && `data:image/jpeg;base64,${thumbSize}`,
        });
      }

      // console.log('filteredPage length', page, filteredPage.length);
      console.log('on reply: ', page);
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

ipcMain.on('get-files', async (event, { folderPath }) => {
  console.log('----------------- get-files: ', folderPath);
  let num = 0;

  try {
    const files = await fs.promises.readdir(folderPath);
    const fileList = [];

    console.log('---------- num: ', fileList);

    for (const fileName of files) {
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

      // console.log(
      //   'processing convert size...',
      //   stats.size,
      //   fileContent.toString('base64').length,
      // );
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

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
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

  mainWindow.webContents.once('dom-ready', async () => {
    await installExtension([REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS])
      .then((name) => console.log(`Added Extension-------:  ${name}`))
      .catch((err) => console.log('An error occurred-------: ', err))
      .finally(() => {
        mainWindow.webContents.openDevTools();
      });
  });

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

/**
 * Add event listeners...
 */

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

const getImageSize = async (filePath) => {
  try {
    console.log(filePath);
    const stats = await fs.promises.stat(filePath);
    const fileContent = await fs.promises.readFile(filePath);

    // Get the size of the file on disk
    console.log('File size on disk:', stats.size, 'bytes');

    // Convert the binary data to a base64 string
    const base64String = fileContent.toString('base64');

    // Get the size of the base64-encoded data
    const base64Size = base64String.length;

    console.log(
      'Base64-encoded image size:',
      fileContent.toString('base64').length,
      'bytes',
    );
  } catch (error) {
    console.error('Error:', error.message);
  }
};
