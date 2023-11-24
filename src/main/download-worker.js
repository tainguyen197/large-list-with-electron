const axios = require('axios');
const { parentPort } = require('worker_threads');

parentPort.on('message', async (url) => {
  try {
    const response = await axios.get(url);

    parentPort.postMessage({
      buffer: Buffer.from(response.data),
    });
  } catch (error) {
    parentPort.postMessage({ error: error.message });
  } finally {
    // process.exit(0);
  }
});
