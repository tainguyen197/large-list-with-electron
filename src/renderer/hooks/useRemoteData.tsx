import axios from 'axios';
import { useEffect, useState } from 'react';

export const useRemoteData = (
  dataSource: string,
  { page = 0, limit = 10 }: any = {},
) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    try {
      const url = `${dataSource}?_page=${page}&_limit=${limit}`;

      axios
        .get(url)
        .then((response) => {
          const { data } = response;

          setData(data);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, dataSource]);

  return { data };
};

export const useRemoteTypeData = (
  dataSource: string,
  { page = 0 }: any = {},
) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(dataSource, { method: 'HEAD' })
      .then((response) => {
        const contentType = response.headers.get('Content-Type');
        console.log('Content-Type:', contentType);

        // Check the content type to determine the image format
        if (contentType && contentType.startsWith('image/')) {
          const imageFormat = contentType.replace('image/', '');
          console.log('Image Format:', imageFormat);
          setData(data);
        } else {
          console.log('Not an image.');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, dataSource]);

  return { data };
};
