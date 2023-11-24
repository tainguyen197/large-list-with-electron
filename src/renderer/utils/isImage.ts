const acceptList = [
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.bmp',
  '.svg',
  '.webp',
  '.ico',
  '.tga',
  '.hdr',
  '.pcx',
  '.nef',
  '.cr2',
  '.eps',
  '.avif',
  '.wbmp',
  '.heic',
];

const isImage = (item: any) => {
  const { fileExtension } = item;

  return acceptList.findIndex((type) => type === fileExtension) !== -1;
};

export default isImage;
