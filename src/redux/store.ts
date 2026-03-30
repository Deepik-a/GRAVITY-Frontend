import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import videoCallReducer from './slices/videoCallSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    videoCall: videoCallReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
