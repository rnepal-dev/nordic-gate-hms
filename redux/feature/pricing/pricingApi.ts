import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { 
  RatePlan, 
  RatePlanPayload, 
  NightlyRate, 
  NightlyRatePayload, 
  NightlyRatesQuery 
} from './pricingTypes.ts';

export const pricingApi = createApi({
  reducerPath: 'pricingApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/',
  }),
  tagTypes: ['RatePlans', 'NightlyRates'],
  endpoints: (builder) => ({
    getRatePlans: builder.query<RatePlan[], void>({
      query: () => '/pricing/api/rate-plans/',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'RatePlans' as const, id })),
              { type: 'RatePlans', id: 'LIST' },
            ]
          : [{ type: 'RatePlans', id: 'LIST' }],
    }),
    getRatePlanById: builder.query<RatePlan, number>({
      query: (id) => `/pricing/api/rate-plans/${id}/`,
      providesTags: (_res, _err, id) => [{ type: 'RatePlans', id }],
    }),
    createRatePlan: builder.mutation<RatePlan, RatePlanPayload>({
      query: (body) => ({
        url: '/pricing/api/rate-plans/',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'RatePlans', id: 'LIST' }],
    }),
    updateRatePlan: builder.mutation<RatePlan, { id: number; data: Partial<RatePlanPayload> }>({
      query: ({ id, data }) => ({
        url: `/pricing/api/rate-plans/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: 'RatePlans', id },
        { type: 'RatePlans', id: 'LIST' },
        { type: 'NightlyRates', id: 'LIST' },
      ],
    }),
    getNightlyRates: builder.query<NightlyRate[], NightlyRatesQuery | void>({
      query: (params) => {
        const query = new URLSearchParams();
        if (params) {
          if (params.room_type) query.append('room_type', params.room_type.toString());
          if (params.rate_plan) query.append('rate_plan', params.rate_plan.toString());
          if (params.start_date) query.append('start_date', params.start_date);
          if (params.end_date) query.append('end_date', params.end_date);
          if (params.stay_date) query.append('stay_date', params.stay_date);
        }
        const qStr = query.toString();
        return `/pricing/api/nightly-rates/${qStr ? `?${qStr}` : ''}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'NightlyRates' as const, id })),
              { type: 'NightlyRates', id: 'LIST' },
            ]
          : [{ type: 'NightlyRates', id: 'LIST' }],
    }),
    getNightlyRateById: builder.query<NightlyRate, number>({
      query: (id) => `/pricing/api/nightly-rates/${id}/`,
      providesTags: (_res, _err, id) => [{ type: 'NightlyRates', id }],
    }),
    createNightlyRate: builder.mutation<NightlyRate, NightlyRatePayload>({
      query: (body) => ({
        url: '/pricing/api/nightly-rates/',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'NightlyRates', id: 'LIST' }],
    }),
    updateNightlyRate: builder.mutation<NightlyRate, { id: number; data: Partial<NightlyRatePayload> }>({
      query: ({ id, data }) => ({
        url: `/pricing/api/nightly-rates/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: 'NightlyRates', id },
        { type: 'NightlyRates', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetRatePlansQuery,
  useGetRatePlanByIdQuery,
  useCreateRatePlanMutation,
  useUpdateRatePlanMutation,
  useGetNightlyRatesQuery,
  useGetNightlyRateByIdQuery,
  useCreateNightlyRateMutation,
  useUpdateNightlyRateMutation,
} = pricingApi;
