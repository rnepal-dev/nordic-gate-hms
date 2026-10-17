import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { 
  RoomCategory, 
  RoomInventoryItem, 
  Reservation, 
  StaffRole, 
  StaffMember,
  RoomTierId 
} from '../types/hotel.ts';
import { 
  ROOM_CATEGORIES, 
  INITIAL_ROOMS, 
  INITIAL_RESERVATIONS, 
  STAFF_ROSTER 
} from '../data/hotelData.ts';
import { transitionRoomStatus } from '../lib/hotel-logic.ts';

export interface SearchCriteria {
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  roomsCount: number;
  promoCode: string;
}

interface HotelContextType {
  lang: 'sv' | 'en';
  setLang: (lang: 'sv' | 'en') => void;
  currentRoute: string;
  navigate: (route: string, params?: Record<string, any>) => void;
  searchCriteria: SearchCriteria;
  setSearchCriteria: React.Dispatch<React.SetStateAction<SearchCriteria>>;
  rooms: RoomInventoryItem[];
  reservations: Reservation[];
  roomCategories: RoomCategory[];
  staffList: StaffMember[];
  activeStaffRole: StaffRole;
  setActiveStaffRole: (role: StaffRole) => void;
  comparisonRoomIds: RoomTierId[];
  toggleCompareRoom: (id: RoomTierId) => void;
  clearComparison: () => void;
  activeBookingRef: string | null;
  setActiveBookingRef: (ref: string | null) => void;
  
  // Actions
  addReservation: (res: Reservation) => void;
  cancelReservation: (id: string) => boolean;
  checkInReservation: (resId: string, roomNumber: string) => void;
  checkOutReservation: (resId: string) => void;
  updateRoomHousekeeping: (roomNumber: string, status: 'start_cleaning' | 'finish_cleaning' | 'inspect') => void;
  toggleMaintenance: (roomNumber: string) => void;
}

const defaultSearch: SearchCriteria = {
  checkIn: '2026-10-24',
  checkOut: '2026-10-26',
  adults: 2,
  children: 0,
  roomsCount: 1,
  promoCode: '',
};

const HotelContext = createContext<HotelContextType | null>(null);

export function HotelProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<'sv' | 'en'>('sv');
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>(defaultSearch);
  const [rooms, setRooms] = useState<RoomInventoryItem[]>(INITIAL_ROOMS);
  const [reservations, setReservations] = useState<Reservation[]>(INITIAL_RESERVATIONS);
  const [comparisonRoomIds, setComparisonRoomIds] = useState<RoomTierId[]>(['heritage-suite', 'deluxe-canal']);
  const [activeStaffRole, setActiveStaffRole] = useState<StaffRole>('manager');
  const [activeBookingRef, setActiveBookingRef] = useState<string | null>('SH-88492');

  // Sync browser popstate
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (route: string, params?: Record<string, any>) => {
    window.history.pushState(params || {}, '', route);
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleCompareRoom = (id: RoomTierId) => {
    setComparisonRoomIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      }
      if (prev.length >= 4) {
        return [...prev.slice(1), id]; // keep max 4
      }
      return [...prev, id];
    });
  };

  const clearComparison = () => {
    setComparisonRoomIds([]);
  };

  const addReservation = (newRes: Reservation) => {
    setReservations(prev => [newRes, ...prev]);
    // Also reserve room if assigned
    if (newRes.assignedRoomNumber) {
      setRooms(prev => prev.map(r => {
        if (r.roomNumber === newRes.assignedRoomNumber) {
          return {
            ...r,
            occupancyStatus: 'reserved',
            currentGuestName: newRes.guestName,
            currentReservationId: newRes.bookingReference,
          };
        }
        return r;
      }));
    }
  };

  const cancelReservation = (id: string): boolean => {
    let targetRef = '';
    let targetRoomNum: string | undefined;

    setReservations(prev => prev.map(res => {
      if (res.id === id || res.bookingReference === id) {
        targetRef = res.bookingReference;
        targetRoomNum = res.assignedRoomNumber;
        return { ...res, status: 'cancelled' };
      }
      return res;
    }));

    if (targetRoomNum) {
      setRooms(prev => prev.map(r => {
        if (r.roomNumber === targetRoomNum) {
          return {
            ...r,
            occupancyStatus: 'available',
            currentGuestName: undefined,
            currentReservationId: undefined,
          };
        }
        return r;
      }));
    }

    return true;
  };

  const checkInReservation = (resId: string, roomNumber: string) => {
    let guestName = '';
    let bookingRef = '';

    setReservations(prev => prev.map(res => {
      if (res.id === resId || res.bookingReference === resId) {
        guestName = res.guestName;
        bookingRef = res.bookingReference;
        return { ...res, status: 'checked_in', assignedRoomNumber: roomNumber };
      }
      return res;
    }));

    setRooms(prev => prev.map(r => {
      if (r.roomNumber === roomNumber) {
        return transitionRoomStatus(r, 'check_in', guestName, bookingRef);
      }
      return r;
    }));
  };

  const checkOutReservation = (resId: string) => {
    let targetRoomNum: string | undefined;

    setReservations(prev => prev.map(res => {
      if (res.id === resId || res.bookingReference === resId) {
        targetRoomNum = res.assignedRoomNumber;
        return { ...res, status: 'checked_out' };
      }
      return res;
    }));

    if (targetRoomNum) {
      setRooms(prev => prev.map(r => {
        if (r.roomNumber === targetRoomNum) {
          return transitionRoomStatus(r, 'check_out');
        }
        return r;
      }));
    }
  };

  const updateRoomHousekeeping = (roomNumber: string, status: 'start_cleaning' | 'finish_cleaning' | 'inspect') => {
    setRooms(prev => prev.map(r => {
      if (r.roomNumber === roomNumber) {
        return transitionRoomStatus(r, status);
      }
      return r;
    }));
  };

  const toggleMaintenance = (roomNumber: string) => {
    setRooms(prev => prev.map(r => {
      if (r.roomNumber === roomNumber) {
        const action = r.maintenanceStatus === 'out_of_service' ? 'restore_service' : 'set_out_of_service';
        return transitionRoomStatus(r, action);
      }
      return r;
    }));
  };

  const value = useMemo(() => ({
    lang,
    setLang,
    currentRoute,
    navigate,
    searchCriteria,
    setSearchCriteria,
    rooms,
    reservations,
    roomCategories: ROOM_CATEGORIES,
    staffList: STAFF_ROSTER,
    activeStaffRole,
    setActiveStaffRole,
    comparisonRoomIds,
    toggleCompareRoom,
    clearComparison,
    activeBookingRef,
    setActiveBookingRef,
    addReservation,
    cancelReservation,
    checkInReservation,
    checkOutReservation,
    updateRoomHousekeeping,
    toggleMaintenance,
  }), [
    lang, 
    currentRoute, 
    searchCriteria, 
    rooms, 
    reservations, 
    comparisonRoomIds, 
    activeStaffRole, 
    activeBookingRef
  ]);

  return (
    <HotelContext.Provider value={value}>
      {children}
    </HotelContext.Provider>
  );
}

export function useHotel() {
  const context = useContext(HotelContext);
  if (!context) {
    throw new Error('useHotel must be used within a HotelProvider');
  }
  return context;
}
