import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RatePlan, NightlyRate, NightlyRatesQuery } from './pricingTypes.ts';

export const pricingApi = createApi({
  reducerPath: 'pricingApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/',
  }),
  tagTypes: ['RatePlans', 'NightlyRates'],
  endpoints: (builder) => ({
    getRatePlans: builder.query<RatePlan[], void>({
      query: () => '/pricing/api/rate-plans/',
      providesTags: ['RatePlans'],
    }),
    getRatePlanById: builder.query<RatePlan, number>({
      query: (id) => `/pricing/api/rate-plans/${id}/`,
      providesTags: (_res, _err, id) => [{ type: 'RatePlans', id }],
    }),
    getNightlyRates: builder.query<NightlyRate[], NightlyRatesQuery>({
      query: (params) => {
        const query = new URLSearchParams();
        if (params.room_type) query.append('room_type', params.room_type.toString());
        if (params.rate_plan) query.append('rate_plan', params.rate_plan.toString());
        if (params.start_date) query.append('start_date', params.start_date);
        if (params.end_date) query.append('end_date', params.end_date);
        const qStr = query.toString();
        return `/pricing/api/nightly-rates/${qStr ? `?${qStr}` : ''}`;
      },
      providesTags: ['NightlyRates'],
    }),
  }),
});

export const {
  useGetRatePlansQuery,
  useGetRatePlanByIdQuery,
  useGetNightlyRatesQuery,
} = pricingApi;
