// resizeWorkerService.js
const { Worker } = require('worker_threads');
const sharp = require('sharp');

class ResizeWorkerService {
  constructor(maxConcurrentDownloads) {
    this.workerPool = Array.from(
      { length: maxConcurrentDownloads },
      () => new Worker(`${__dirname}/resize-worker.js`),
    );
    // this.setupListeners();
  }

  // setupListeners() {
  //   this.workerPool.forEach((resizeWorker) => {
  //     resizeWorker.on('message', ({ buffer, error, index, ...others }) => {
  //       // Handle download completion or errors
  //       if (error) {
  //         console.error(`Error downloading image ${index}: ${error}`);
  //       } else {
  //         // Process the downloaded buffer or dispatch to other workers
  //         // For simplicity, we won't dispatch to other workers in this example
  //         console.log(`Downloaded image ${index}`);
  //       }
  //     });

  //     resizeWorker.on('error', (error) => {
  //       console.error(`Download Worker error: ${error.message}`);
  //     });

  //     resizeWorker.on('exit', (code) => {
  //       console.log(`Download Worker exited with code: ${code}`);
  //     });
  //   });
  // }

  resizeImage(filePath, index) {
    return new Promise((resolve) => {
      const resizedWorker = this.workerPool[index % this.workerPool.length];
      resizedWorker.postMessage({ filePath, index });
      resizedWorker.on(
        'message',
        ({ thumbSize, error, index: resultIndex, filePath: filePathCb }) => {
          if (filePathCb !== filePath) return;

          resolve({ thumbSize, error, index: resultIndex });
        },
      );
    });
  }
}

module.exports = ResizeWorkerService;
