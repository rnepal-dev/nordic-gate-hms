export type CancellationPolicy = 'flexible' | 'non_refundable';

export interface RatePlan {
  id: number;
  name: string;
  code: string;
  description: string;
  cancellation_policy: CancellationPolicy;
  free_cancellation_deadline_hours: number | null;
  breakfast_included: boolean;
  pool_included: boolean;
  is_active: boolean;
  room_types: number[];
  created_at: string;
  updated_at: string;
}

export interface RatePlanPayload {
  name: string;
  code: string;
  description?: string;
  cancellation_policy: CancellationPolicy;
  free_cancellation_deadline_hours: number | null;
  breakfast_included: boolean;
  pool_included: boolean;
  is_active: boolean;
  room_types: number[];
}

export interface NightlyRate {
  id: number;
  room_type: number;
  room_type_name: string;
  rate_plan: number;
  rate_plan_name: string;
  stay_date: string; // YYYY-MM-DD
  price: string; // decimal string from backend e.g. "1295.00"
  currency: string;
  minimum_stay: number;
  is_closed_to_arrival: boolean;
  is_closed_to_departure: boolean;
  created_at: string;
  updated_at: string;
}

export interface NightlyRatePayload {
  room_type: number;
  rate_plan: number;
  stay_date: string;
  price: string; // decimal string e.g. "1295.00"
  currency: string;
  minimum_stay: number;
  is_closed_to_arrival: boolean;
  is_closed_to_departure: boolean;
}

export interface NightlyRatesQuery {
  room_type?: number;
  rate_plan?: number;
  start_date?: string;
  end_date?: string;
  stay_date?: string;
}
