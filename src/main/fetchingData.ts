const axios = require('axios');

const fetchingData = async ({ dataSource, page, limit = 10 }) => {
  try {
    const response = await axios.get(
      `${dataSource}?_page=${page}&_limit=${limit}`,
    );
    return response.data;
  } catch (error) {
    console.log('axios fetching failed: ', error);
  }
  // const response1 = fetch.get(dataSource, { page });
};

module.exports = { fetchingData };
