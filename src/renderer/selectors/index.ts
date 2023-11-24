import { createSelector } from 'reselect';

const selectState = (state: any) => state;
const selectCurrentDirection = (state: any) => state.direction;

export const getImages = createSelector(selectState, (item) => item.image);

export const getCurrentDirection = createSelector(
  selectCurrentDirection,
  (item) => item.currentDirection,
);
