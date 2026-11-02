import { configureStore } from '@reduxjs/toolkit';
import { contactUsApi } from './feature/others/contactUs/contactUsApi.ts';
import { pricingApi } from './feature/pricing/pricingApi.ts';
import { bookingApi } from './feature/bookings/bookingApi.ts';

export const store = configureStore({
  reducer: {
    [contactUsApi.reducerPath]: contactUsApi.reducer,
    [pricingApi.reducerPath]: pricingApi.reducer,
    [bookingApi.reducerPath]: bookingApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      contactUsApi.middleware,
      pricingApi.middleware,
      bookingApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
