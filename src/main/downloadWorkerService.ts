// resizeWorkerService.js
const { Worker } = require('worker_threads');
const sharp = require('sharp');

class DownloadWorkerService {
  constructor(maxConcurrentDownloads) {
    this.workerPool = Array.from(
      { length: maxConcurrentDownloads },
      () => new Worker(`${__dirname}/download-worker.js`),
    );
    // this.setupListeners();
  }

  // setupListeners() {
  //   this.workerPool.forEach((downloadWorker) => {
  //     downloadWorker.on('message', ({ buffer, error, index, ...others }) => {
  //       // Handle download completion or errors
  //       if (error) {
  //         console.error(`Error downloading image ${index}: ${error}`);
  //       } else {
  //         // Process the downloaded buffer or dispatch to other workers
  //         // For simplicity, we won't dispatch to other workers in this example
  //         console.log(`Downloaded image ${index}`);
  //       }
  //     });

  //     downloadWorker.on('error', (error) => {
  //       console.error(`Download Worker error: ${error.message}`);
  //     });

  //     downloadWorker.on('exit', (code) => {
  //       console.log(`Download Worker exited with code: ${code}`);
  //     });
  //   });
  // }

  downloadImage(item, index) {
    return new Promise((resolve) => {
      const downloadWorker = this.workerPool[index % this.workerPool.length];
      downloadWorker.postMessage(item);

      downloadWorker.once(
        'message',
        ({ buffer, error, index: resultIndex }) => {
          resolve({ buffer, error, index: resultIndex });
        },
      );
    });
  }
}

module.exports = DownloadWorkerService;
