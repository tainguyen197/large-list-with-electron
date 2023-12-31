import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import imageSlice from './imageSlice';
import directionSlice from './directionSlice';

export const store = configureStore({
  reducer: {
    image: imageSlice,
    direction: directionSlice,
  },
  middleware: [thunk],
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
