/* eslint-disable promise/always-return */
/* eslint-disable import/prefer-default-export */
// actions.js
import axios from 'axios';
import {
  fetchData,
  fetchDataSuccess,
  fetchDataFailure,
  fetchDataEnd,
} from '../reducer/imageSlice';

export const useRemoteData = (
  dataSource: string,
  { page = 0, limit = 10 }: any = {},
) => {
  try {
    const url = `${dataSource}?_page=${page}&_limit=${limit}`;

    axios
      .get(url)
      .then((response) => {
        const { data } = response;
        return data;
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error);
  }
};

export const fetchDataList = (
  dataSource: string,
  { page = 0, limit = 10 }: any = {},
) => {
  return (dispatch: any) => {
    try {
      dispatch(fetchData());

      const url = `${dataSource}?_page=${page}&_limit=${limit}`;

      axios
        .get(url)
        // eslint-disable-next-line promise/always-return
        .then((response) => {
          const { data } = response;
          if (!data.length) dispatch(fetchDataEnd());
          else dispatch(fetchDataSuccess(data));
        })
        .catch((error) => {
          dispatch(fetchDataFailure(error));
        });
    } catch (error) {
      dispatch(fetchDataFailure());
      console.log(error);
    }
  };
};
