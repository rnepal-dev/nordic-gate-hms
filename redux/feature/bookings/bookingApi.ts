import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  AvailabilityRequest,
  AvailabilityResponse,
  ReservationCreate,
  ReservationResponse,
  MyBookingsQuery,
  PaginatedBookings,
  MyBookingDetail,
  GuestBookingStatusRequest,
  GuestCancellationRequest,
  RegisteredCancellationRequest,
  CancellationLinkRequest,
  CancellationResponse,
} from './bookingTypes.ts';

export const bookingApi = createApi({
  reducerPath: 'bookingApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/',
  }),
  tagTypes: ['Availability', 'Reservations', 'MyBookings', 'BookingDetail'],
  endpoints: (builder) => ({
    getAvailability: builder.query<AvailabilityResponse, AvailabilityRequest>({
      query: (params) => {
        const query = new URLSearchParams({
          check_in: params.check_in,
          check_out: params.check_out,
          adults: params.adults.toString(),
          children: params.children.toString(),
        });
        return `/bookings/api/availability/?${query.toString()}`;
      },
      providesTags: ['Availability'],
    }),
    createReservation: builder.mutation<ReservationResponse, ReservationCreate>({
      query: (body) => ({
        url: '/bookings/api/reservations/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Availability', 'MyBookings'],
    }),
    getMyBookings: builder.query<PaginatedBookings, MyBookingsQuery | void>({
      query: (params) => {
        const query = new URLSearchParams();
        if (params && params.page) query.append('page', params.page.toString());
        if (params && params.page_size) query.append('page_size', params.page_size.toString());
        const qStr = query.toString();
        return `/bookings/api/my-bookings/${qStr ? `?${qStr}` : ''}`;
      },
      providesTags: ['MyBookings'],
    }),
    getMyBookingDetail: builder.query<MyBookingDetail, string>({
      query: (bookingRef) => `/bookings/api/my-bookings/${bookingRef}/`,
      providesTags: (_res, _err, ref) => [{ type: 'BookingDetail', id: ref }],
    }),
    getGuestBookingStatus: builder.mutation<MyBookingDetail, GuestBookingStatusRequest>({
      query: (body) => ({
        url: '/bookings/api/guest-status/',
        method: 'POST',
        body,
      }),
    }),
    cancelGuestBooking: builder.mutation<CancellationResponse, GuestCancellationRequest>({
      query: (body) => ({
        url: '/bookings/api/cancellations/guest/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['MyBookings', 'Availability'],
    }),
    cancelRegisteredBooking: builder.mutation<CancellationResponse, RegisteredCancellationRequest>({
      query: (body) => ({
        url: '/bookings/api/cancellations/registered/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['MyBookings', 'Availability'],
    }),
    requestCancellationLink: builder.mutation<{ message: string }, CancellationLinkRequest>({
      query: (body) => ({
        url: '/bookings/api/cancellations/request-link/',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useGetAvailabilityQuery,
  useLazyGetAvailabilityQuery,
  useCreateReservationMutation,
  useGetMyBookingsQuery,
  useGetMyBookingDetailQuery,
  useGetGuestBookingStatusMutation,
  useCancelGuestBookingMutation,
  useCancelRegisteredBookingMutation,
  useRequestCancellationLinkMutation,
} = bookingApi;
