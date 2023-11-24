import { createSlice } from '@reduxjs/toolkit';

export interface ImageState {
  data: Array<any>;
  isLoading: boolean;
  isError: boolean;
  isEnd: boolean;
  limit: number;
  page: number;
}

const initialState: ImageState = {
  data: [],
  isError: false,
  limit: 10,
  page: 0,
  isLoading: false,
  isEnd: false,
};

export const imageSlice = createSlice({
  name: 'image',
  initialState,
  reducers: {
    fetchData: (state) => {
      state.isLoading = true;
    },
    fetchDataSuccess: (state, payload) => {
      state.isLoading = false;
      state.page = state.page + 1;
      state.data = [...state.data, ...payload.payload];
    },
    fetchDataEnd: (state) => {
      state.isEnd = true;
    },
    fetchDataFailure: (state) => {
      state.isError = true;
    },
  },
});

// Action creators are generated for each case reducer function
export const { fetchData, fetchDataSuccess, fetchDataEnd, fetchDataFailure } =
  imageSlice.actions;

export default imageSlice.reducer;
