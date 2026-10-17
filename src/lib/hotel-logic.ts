import type { RoomInventoryItem, Reservation, OccupancyStatus, CleanlinessStatus, MaintenanceStatus } from '../types/hotel.ts';

export interface HotelKPIs {
  totalRooms: number;
  occupiedRooms: number;
  reservedRooms: number;
  availableRooms: number;
  occupancyRatePct: number;
  todayArrivals: number;
  todayDepartures: number;
  inHouseGuests: number;
  dirtyRooms: number;
  cleaningRooms: number;
  inspectedRooms: number;
  outOfServiceRooms: number;
  dailyRoomRevenueSEK: number;
  adrSEK: number; // Average Daily Rate
  revParSEK: number; // Revenue Per Available Room
}

export function validateBookingDates(checkIn: string, checkOut: string): { isValid: boolean; error?: string } {
  if (!checkIn) {
    return { isValid: false, error: 'Incheckningsdatum måste anges' };
  }
  if (!checkOut) {
    return { isValid: false, error: 'Utcheckningsdatum måste anges' };
  }

  const start = new Date(checkIn);
  const end = new Date(checkOut);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { isValid: false, error: 'Ogiltigt datumformat' };
  }

  if (end <= start) {
    return { isValid: false, error: 'Utcheckning måste ske efter incheckningsdatum' };
  }

  return { isValid: true };
}

/**
 * Calculates operational KPIs for hotel dashboard
 */
export function calculateHotelKPIs(
  rooms: RoomInventoryItem[],
  reservations: Reservation[],
  currentDateStr: string = '2026-10-17'
): HotelKPIs {
  const totalRooms = rooms.length;
  
  let occupiedRooms = 0;
  let reservedRooms = 0;
  let availableRooms = 0;
  let dirtyRooms = 0;
  let cleaningRooms = 0;
  let inspectedRooms = 0;
  let outOfServiceRooms = 0;

  for (const r of rooms) {
    if (r.maintenanceStatus === 'out_of_service') {
      outOfServiceRooms++;
    }
    if (r.occupancyStatus === 'occupied') occupiedRooms++;
    else if (r.occupancyStatus === 'reserved') reservedRooms++;
    else if (r.maintenanceStatus === 'operational') availableRooms++;

    if (r.cleanlinessStatus === 'dirty') dirtyRooms++;
    else if (r.cleanlinessStatus === 'cleaning') cleaningRooms++;
    else if (r.cleanlinessStatus === 'inspected' || r.cleanlinessStatus === 'clean') inspectedRooms++;
  }

  const activeReservations = reservations.filter(res => res.status !== 'cancelled');
  
  let todayArrivals = 0;
  let todayDepartures = 0;
  let inHouseGuests = 0;
  let activeBookingsRevenue = 0;

  for (const res of activeReservations) {
    if (res.checkInDate === currentDateStr && res.status === 'confirmed') {
      todayArrivals++;
    }
    if (res.checkOutDate === currentDateStr && res.status === 'checked_in') {
      todayDepartures++;
    }
    if (res.status === 'checked_in') {
      inHouseGuests += (res.adults + (res.children || 0));
    }
    if (res.status === 'checked_in' || res.status === 'confirmed') {
      activeBookingsRevenue += Math.round(res.totalSEK / Math.max(1, res.nights));
    }
  }

  const occupancyRatePct = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
  const adrSEK = occupiedRooms > 0 ? Math.round(activeBookingsRevenue / occupiedRooms) : 0;
  const revParSEK = totalRooms > 0 ? Math.round(activeBookingsRevenue / totalRooms) : 0;

  return {
    totalRooms,
    occupiedRooms,
    reservedRooms,
    availableRooms,
    occupancyRatePct,
    todayArrivals,
    todayDepartures,
    inHouseGuests,
    dirtyRooms,
    cleaningRooms,
    inspectedRooms,
    outOfServiceRooms,
    dailyRoomRevenueSEK: activeBookingsRevenue,
    adrSEK,
    revParSEK,
  };
}

/**
 * Clean multi-dimensional status transitions for front desk and housekeeping
 */
export function transitionRoomStatus(
  room: RoomInventoryItem,
  action: 
    | 'check_in' 
    | 'check_out' 
    | 'start_cleaning' 
    | 'finish_cleaning' 
    | 'inspect' 
    | 'set_out_of_service' 
    | 'restore_service',
  guestName?: string,
  reservationId?: string
): RoomInventoryItem {
  const updated = { ...room };

  switch (action) {
    case 'check_in':
      updated.occupancyStatus = 'occupied';
      updated.currentGuestName = guestName;
      updated.currentReservationId = reservationId;
      break;

    case 'check_out':
      updated.occupancyStatus = 'available';
      updated.cleanlinessStatus = 'dirty'; // Checkout automatically marks room as dirty
      updated.currentGuestName = undefined;
      updated.currentReservationId = undefined;
      break;

    case 'start_cleaning':
      updated.cleanlinessStatus = 'cleaning';
      break;

    case 'finish_cleaning':
      updated.cleanlinessStatus = 'clean';
      break;

    case 'inspect':
      updated.cleanlinessStatus = 'inspected';
      break;

    case 'set_out_of_service':
      updated.maintenanceStatus = 'out_of_service';
      break;

    case 'restore_service':
      updated.maintenanceStatus = 'operational';
      break;
  }

  return updated;
}
