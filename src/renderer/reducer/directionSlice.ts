import { createSlice } from '@reduxjs/toolkit';

export interface State {
  currentDirection: string;
}

const initialState: State = {
  currentDirection: '/Users',
};

export const directionSlice = createSlice({
  name: 'direction',
  initialState,
  reducers: {
    setCurrentDirection: (state, payload) => {
      state.currentDirection = payload.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setCurrentDirection } = directionSlice.actions;

export default directionSlice.reducer;
