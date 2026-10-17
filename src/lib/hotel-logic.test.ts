import test from 'node:test';
import assert from 'node:assert/strict';
import { validateBookingDates, calculateHotelKPIs, transitionRoomStatus } from './hotel-logic.ts';
import type { RoomInventoryItem, Reservation } from '../types/hotel.ts';

test('validateBookingDates enforces checkout after checkin', () => {
  assert.equal(validateBookingDates('2026-10-20', '2026-10-22').isValid, true);
  assert.equal(validateBookingDates('2026-10-22', '2026-10-20').isValid, false);
  assert.equal(validateBookingDates('2026-10-20', '2026-10-20').isValid, false);
  assert.equal(validateBookingDates('', '2026-10-20').isValid, false);
});

test('transitionRoomStatus correctly updates room state on check-in and check-out', () => {
  const initialRoom: RoomInventoryItem = {
    roomNumber: '204',
    floor: 2,
    categoryId: 'deluxe-canal',
    occupancyStatus: 'available',
    cleanlinessStatus: 'inspected',
    maintenanceStatus: 'operational',
  };

  const checkedIn = transitionRoomStatus(initialRoom, 'check_in', 'Astrid Lindgren', 'SH-1002');
  assert.equal(checkedIn.occupancyStatus, 'occupied');
  assert.equal(checkedIn.currentGuestName, 'Astrid Lindgren');

  // When guest checks out, room becomes available & dirty
  const checkedOut = transitionRoomStatus(checkedIn, 'check_out');
  assert.equal(checkedOut.occupancyStatus, 'available');
  assert.equal(checkedOut.cleanlinessStatus, 'dirty');
  assert.equal(checkedOut.currentGuestName, undefined);

  // Housekeeper finishes cleaning
  const cleaned = transitionRoomStatus(checkedOut, 'finish_cleaning');
  assert.equal(cleaned.cleanlinessStatus, 'clean');

  // Supervisor inspects
  const inspected = transitionRoomStatus(cleaned, 'inspect');
  assert.equal(inspected.cleanlinessStatus, 'inspected');
});

test('calculateHotelKPIs computes accurate occupancy and rates', () => {
  const sampleRooms: RoomInventoryItem[] = [
    { roomNumber: '101', floor: 1, categoryId: 'classic-room', occupancyStatus: 'occupied', cleanlinessStatus: 'clean', maintenanceStatus: 'operational' },
    { roomNumber: '102', floor: 1, categoryId: 'classic-room', occupancyStatus: 'occupied', cleanlinessStatus: 'clean', maintenanceStatus: 'operational' },
    { roomNumber: '103', floor: 1, categoryId: 'superior-room', occupancyStatus: 'available', cleanlinessStatus: 'inspected', maintenanceStatus: 'operational' },
    { roomNumber: '104', floor: 1, categoryId: 'deluxe-canal', occupancyStatus: 'available', cleanlinessStatus: 'dirty', maintenanceStatus: 'operational' },
  ];

  const sampleReservations: Reservation[] = [
    {
      id: 'res-1',
      bookingReference: 'SH-1001',
      guestName: 'Gustaf Ekman',
      guestEmail: 'gustaf@example.se',
      guestPhone: '+46701234567',
      guestCountry: 'Sweden',
      roomCategoryId: 'classic-room',
      assignedRoomNumber: '101',
      checkInDate: '2026-10-15',
      checkOutDate: '2026-10-18',
      nights: 3,
      adults: 2,
      children: 0,
      ratePlanId: 'flexible',
      extras: [],
      status: 'checked_in',
      totalSEK: 6000,
      vatRoomSEK: 643,
      vatExtrasSEK: 0,
      paymentStatus: 'paid',
      source: 'direct_website',
      createdAt: '2026-10-10',
    },
    {
      id: 'res-2',
      bookingReference: 'SH-1002',
      guestName: 'Klara Sjöberg',
      guestEmail: 'klara@example.se',
      guestPhone: '+46709876543',
      guestCountry: 'Sweden',
      roomCategoryId: 'classic-room',
      assignedRoomNumber: '102',
      checkInDate: '2026-10-16',
      checkOutDate: '2026-10-19',
      nights: 3,
      adults: 1,
      children: 0,
      ratePlanId: 'flexible',
      extras: [],
      status: 'checked_in',
      totalSEK: 6000,
      vatRoomSEK: 643,
      vatExtrasSEK: 0,
      paymentStatus: 'paid',
      source: 'direct_website',
      createdAt: '2026-10-12',
    },
  ];

  const kpis = calculateHotelKPIs(sampleRooms, sampleReservations, '2026-10-17');
  assert.equal(kpis.totalRooms, 4);
  assert.equal(kpis.occupiedRooms, 2);
  assert.equal(kpis.occupancyRatePct, 50);
  assert.equal(kpis.inHouseGuests, 3);
  assert.equal(kpis.dirtyRooms, 1);
  assert.equal(kpis.dailyRoomRevenueSEK, 4000); // 2000 per night for res-1 + 2000 per night for res-2
  assert.equal(kpis.adrSEK, 2000); // 4000 / 2 occupied rooms
  assert.equal(kpis.revParSEK, 1000); // 4000 / 4 total rooms
});
