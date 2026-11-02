export type BookingStatus =
  | 'pending_payment'
  | 'confirmed'
  | 'cancelled'
  | 'expired'
  | 'checked_in'
  | 'checked_out'
  | 'no_show';

export interface AvailabilityRequest {
  check_in: string; // YYYY-MM-DD
  check_out: string; // YYYY-MM-DD
  adults: number;
  children: number;
}

export interface AvailableRoomRatePlan {
  rate_plan_id: number;
  rate_plan_name: string;
  rate_plan_code: string;
  cancellation_policy: 'flexible' | 'non_refundable';
  free_cancellation_deadline_hours: number | null;
  breakfast_included: boolean;
  pool_included: boolean;
  total_price: string;
  nightly_average: string;
  currency: string;
  minimum_stay: number;
  is_available: boolean;
  nightly_breakdown?: {
    stay_date: string;
    price: string;
    currency: string;
  }[];
}

export interface AvailableRoomType {
  room_type_id: number;
  room_type_name: string;
  room_type_slug: string;
  description: string;
  max_occupancy: number;
  bed_configuration: Record<string, number | string>;
  size_sqm: string | null;
  amenities: string;
  image_url?: string;
  available_rooms_count: number;
  starting_price: string;
  currency: string;
  rate_plans: AvailableRoomRatePlan[];
}

export interface AvailabilityResponse {
  check_in: string;
  check_out: string;
  nights: number;
  adults: number;
  children: number;
  available_room_types: AvailableRoomType[];
}

export interface ReservationCreate {
  room_type_id: number;
  rate_plan_id: number;
  check_in: string;
  check_out: string;
  adults: number;
  children: number;
  guest_first_name: string;
  guest_last_name: string;
  guest_email: string;
  guest_phone: string;
  special_requests: string;
  guest_country: string;
  accept_booking_terms: boolean;
  booking_terms_version: string;
}

export interface ReservationResponse {
  booking_reference: string;
  status: BookingStatus;
  total_amount: string;
  tax_amount: string;
  currency: string;
  created_at: string;
  expires_at?: string;
  guest_name: string;
  guest_email: string;
  check_in: string;
  check_out: string;
  number_of_nights: number;
  room_type_name: string;
  rate_plan_name: string;
  payment_status: 'pending' | 'paid' | 'failed';
}

export interface MyBookingsQuery {
  page?: number;
  page_size?: number;
}

export interface MyBookingList {
  booking_reference: string;
  check_in: string;
  check_out: string;
  number_of_nights: number;
  status: BookingStatus;
  total_amount: string;
  currency: string;
  created_at: string;
}

export interface PaginatedBookings {
  count: number;
  next: string | null;
  previous: string | null;
  results: MyBookingList[];
}

export interface BookingRoomItem {
  room_type_id: number;
  room_type_name: string;
  rate_plan_id: number;
  rate_plan_name: string;
  adults: number;
  children: number;
  breakfast_included: boolean;
  pool_included: boolean;
  room_subtotal: string;
  taxes: string;
  room_total: string;
  cancellation_policy_snapshot: string;
  free_cancellation_deadline_snapshot: string | null;
  nightly_rates: {
    stay_date: string;
    amount_including_tax: string;
    tax_amount: string;
    currency: string;
  }[];
}

export interface MyBookingDetail {
  booking_reference: string;
  status: BookingStatus;
  source: string;
  check_in: string;
  check_out: string;
  number_of_nights: number;
  currency: string;
  subtotal: string;
  taxes: string;
  total_amount: string;
  special_requests: string;
  guest_first_name: string;
  guest_last_name: string;
  guest_email: string;
  guest_phone: string;
  guest_country: string;
  expires_at: string | null;
  confirmed_at: string | null;
  cancelled_at: string | null;
  booking_rooms: BookingRoomItem[];
  payment_status: string;
  refund_status: string | null;
}

export interface GuestBookingStatusRequest {
  booking_reference: string;
  token: string;
}

export interface GuestCancellationRequest {
  booking_reference: string;
  token: string;
}

export interface RegisteredCancellationRequest {
  booking_reference: string;
}

export interface CancellationLinkRequest {
  booking_reference: string;
  email: string;
}

export interface CancellationResponse {
  success: boolean;
  status: BookingStatus;
  message: string;
  cancelled_at: string;
}
