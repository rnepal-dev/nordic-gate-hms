import { configureStore } from '@reduxjs/toolkit';
import { contactUsApi } from './feature/others/contactUs/contactUsApi.ts';

export const store = configureStore({
  reducer: {
    [contactUsApi.reducerPath]: contactUsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(contactUsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
