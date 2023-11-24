/* eslint-disable import/prefer-default-export */
// actions.js
import { setCurrentDirection } from '../reducer/directionSlice';

// Thunk Action
export const setDirectionWorking = (direction: string) => {
  return (dispatch: any) => {
    dispatch(setCurrentDirection(direction));
  };
};
