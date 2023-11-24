import { now } from 'lodash';

export function resizeImage(imageURL: string) {
  return new Promise((resolve, reject) => {
    const startTime = now();

    const imageDescription = 'The Mozilla logo';

    const downloadedImg = new Image();
    downloadedImg.crossOrigin = 'anonymous';

    downloadedImg.addEventListener('load', () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      const maxDimension = 150;
      const aspectRatio = downloadedImg.width / downloadedImg.height;

      let newWidth, newHeight;

      if (aspectRatio > 1) {
        newWidth = maxDimension;
        newHeight = maxDimension / aspectRatio;
      } else {
        newWidth = maxDimension * aspectRatio;
        newHeight = maxDimension;
      }

      canvas.width = 320;
      canvas.height = 320;

      context?.drawImage(downloadedImg, 0, 0, 320, 320);

      try {
        const dataURL = canvas.toDataURL('image/jpeg');
        const endTime = now();

        console.log(
          'run time from: ',
          downloadedImg.width,
          'x',
          downloadedImg.height,
          endTime - startTime,
        );
        resolve(dataURL);
      } catch (err) {
        reject(`Error: ${err}`);
      }
    });

    downloadedImg.alt = imageDescription;
    downloadedImg.src = imageURL;
  });
}
