import userReducer from './user/userSlice';
import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
  reducer: {
    user: userReducer
  },
  devTools: true
})

export type RootState = ReturnType<typeof store.getState>