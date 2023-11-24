const sharp = require('sharp');
const { parentPort } = require('worker_threads');

parentPort.on('message', async ({ filePath, buffer, index, ...others }) => {
  try {
    const thumbSize = await sharp(buffer || filePath)
      .resize(320, 320)
      .jpeg()
      .toBuffer();
    console.log('processing done:', filePath);

    parentPort.postMessage({ filePath, thumbSize, index, ...others });
  } catch (error) {
    console.error(`Error in worker: ${error.message} ${filePath}`);
    parentPort.postMessage({ error: error.message, index, filePath });
  } finally {
    // Send an "exit" signal back to the parent thread
    // parentPort.postMessage({ exit: true });
  }
});
