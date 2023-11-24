/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';
const fs = require('fs');

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

const acceptList = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico'];

export const isImage = (item: any) => {
  const { fileExtension } = item;

  return acceptList.findIndex((type) => type === fileExtension) !== -1;
};

export function ensureDirExistsAndWritable(dir) {
  if (fs.existsSync(dir)) {
    try {
      fs.accessSync(dir, fs.constants.R_OK);
    } catch (e) {
      console.error('Cannot access directory');
      return false;
    }
  } else {
    try {
      fs.mkdirSync(dir);
    } catch (e) {
      if (e.code == 'EACCES') {
        console.log('Cannot create directory');
      } else {
        console.log(e.code);
      }
      return false;
    }
  }
  return true;
}
