import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface CreateContactI {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export const contactUsApi = createApi({
  reducerPath: 'contactUsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/',
  }),
  tagTypes: ['Contactus'],
  endpoints: (builder) => ({
    createContactus: builder.mutation<void, CreateContactI>({
      query: (body) => ({
        url: '/website/api/contact/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Contactus'],
    }),
  }),
});

export const { useCreateContactusMutation } = contactUsApi;
