export type RoomTierId = 
  | 'classic-room'
  | 'superior-room'
  | 'deluxe-canal'
  | 'junior-suite'
  | 'heritage-suite';

export interface RoomCategory {
  id: RoomTierId;
  slug: string;
  name: string;
  nameSv: string;
  tagline: string;
  taglineSv: string;
  description: string;
  descriptionSv: string;
  dimensionsM2: number;
  maxGuests: number;
  bedType: string;
  bedTypeSv: string;
  view: string;
  viewSv: string;
  floor: string;
  startingPriceSEK: number;
  image: string;
  additionalImages: string[];
  amenities: {
    key: string;
    labelEn: string;
    labelSv: string;
  }[];
  featured: boolean;
}

export type OccupancyStatus = 'available' | 'occupied' | 'reserved';
export type CleanlinessStatus = 'clean' | 'dirty' | 'cleaning' | 'inspected';
export type MaintenanceStatus = 'operational' | 'out_of_service';

export interface RoomInventoryItem {
  roomNumber: string;
  floor: 1 | 2 | 3;
  categoryId: RoomTierId;
  occupancyStatus: OccupancyStatus;
  cleanlinessStatus: CleanlinessStatus;
  maintenanceStatus: MaintenanceStatus;
  currentGuestName?: string;
  currentReservationId?: string;
  notes?: string;
}

export type RatePlanId = 'flexible' | 'advance_saver' | 'stay_and_dine' | 'spa_retreat';

export interface RatePlan {
  id: RatePlanId;
  name: string;
  nameSv: string;
  multiplier: number;
  cancellationPolicy: string;
  cancellationPolicySv: string;
  includesBreakfast: boolean;
  includesSpa: boolean;
  includesDinner: boolean;
}

export interface BookingExtra {
  id: string;
  name: string;
  nameSv: string;
  priceSEK: number;
  vatRate: number; // 0.25 (25%) or 0.12 (12%)
  unitDescription: string;
  unitDescriptionSv: string;
}

export interface SelectedExtra {
  id: string;
  name: string;
  priceSEK: number;
  vatRate: number;
  count: number;
}

export type ReservationStatus = 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
export type PaymentStatus = 'paid' | 'deposit_paid' | 'pay_at_hotel';
export type OnlinePaymentMethod = 'card' | 'swish' | 'klarna' | 'apple_pay';

export interface Reservation {
  id: string;
  bookingReference: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestCountry: string;
  roomCategoryId: RoomTierId;
  assignedRoomNumber?: string;
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  nights: number;
  adults: number;
  children: number;
  ratePlanId: RatePlanId;
  extras: SelectedExtra[];
  specialRequests?: string;
  status: ReservationStatus;
  totalSEK: number;
  vatRoomSEK: number;
  vatExtrasSEK: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: OnlinePaymentMethod;
  paymentTransactionId?: string;
  paymentCardMask?: string;
  paymentPaidAt?: string;
  source: 'direct_website' | 'phone' | 'walk_in' | 'corporate';
  createdAt: string;
}

export type StaffRole = 
  | 'owner' 
  | 'manager' 
  | 'receptionist' 
  | 'reservations_agent' 
  | 'housekeeping_lead' 
  | 'housekeeper' 
  | 'accountant';

export interface StaffMember {
  id: string;
  name: string;
  role: StaffRole;
  roleTitle: string;
  department: string;
  shift: string;
  active: boolean;
}

export type LoginRole = 'guest' | 'front_desk' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: LoginRole;
  roleTitle: string;
  badge: string;
  bookingRef?: string;
  roomNumber?: string;
  department?: string;
  lastLogin?: string;
}
