import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  HOTEL_NORDIC_GATE_PROPERTY, 
  RECONCILIATION_TABLE, 
  CANDIDATE_ROOM_CATALOG,
  HOTEL_POLICIES,
  CANDIDATE_FACILITIES,
  TRANSPORT_DETAILS
} from './propertyData.ts';

test('property model enforces Hotel Nordic Gate brand and verifiable metadata', () => {
  assert.equal(HOTEL_NORDIC_GATE_PROPERTY.brandName.value, 'Hotel Nordic Gate');
  assert.equal(HOTEL_NORDIC_GATE_PROPERTY.brandName.status, 'confirmed_for_nordic_gate');
  assert.equal(HOTEL_NORDIC_GATE_PROPERTY.address.street.value, 'Gamla Tingstadsgatan 1');
  assert.equal(HOTEL_NORDIC_GATE_PROPERTY.address.street.status, 'reported_for_reference_property');
});

test('reconciliation table covers all 7 required domains', () => {
  const domains = RECONCILIATION_TABLE.map(r => r.domain);
  assert.ok(domains.includes('Brand & Identity'));
  assert.ok(domains.includes('Location & Address'));
  assert.ok(domains.includes('Wellness & Pool'));
  assert.ok(domains.includes('Dining & Breakfast'));
  assert.ok(domains.includes('Room Catalog'));
  assert.ok(domains.includes('Policies'));
  assert.ok(domains.includes('Parking & Transport'));
  assert.equal(RECONCILIATION_TABLE.length >= 7, true);
});

test('candidate room catalog contains 5 reference room categories with valid capacities', () => {
  const expectedIds = [
    'compact-double',
    'compact-twin',
    'standard-twin',
    'superior-double',
    'family-room',
  ];

  const actualIds = CANDIDATE_ROOM_CATALOG.map(r => r.id);
  for (const id of expectedIds) {
    assert.ok(actualIds.includes(id), `Missing room id ${id}`);
  }

  // Family room should accommodate adults and children
  const familyRoom = CANDIDATE_ROOM_CATALOG.find(r => r.id === 'family-room');
  assert.ok(familyRoom);
  assert.equal(familyRoom.maxGuests >= 4, true);
  assert.equal(familyRoom.childCapacity >= 2, true);
});

test('hotel policies accurately encode reported reference timings', () => {
  const checkInPolicy = HOTEL_POLICIES.find(p => p.key === 'check_in');
  const checkOutPolicy = HOTEL_POLICIES.find(p => p.key === 'check_out');

  assert.ok(checkInPolicy);
  assert.equal(checkInPolicy.valueSv, '15:00 – 23:00');

  assert.ok(checkOutPolicy);
  assert.equal(checkOutPolicy.valueSv, '06:00 – 11:00');
});

test('candidate facilities include wellness, dining, parking, and accessibility', () => {
  const pool = CANDIDATE_FACILITIES.find(f => f.id === 'fac-pool');
  const sauna = CANDIDATE_FACILITIES.find(f => f.id === 'fac-sauna');
  const jacuzzi = CANDIDATE_FACILITIES.find(f => f.id === 'fac-jacuzzi');
  const breakfast = CANDIDATE_FACILITIES.find(f => f.id === 'fac-breakfast');
  const dietary = CANDIDATE_FACILITIES.find(f => f.id === 'fac-dietary');
  const restaurant = CANDIDATE_FACILITIES.find(f => f.id === 'fac-restaurant');
  const bar = CANDIDATE_FACILITIES.find(f => f.id === 'fac-bar');
  const parking = CANDIDATE_FACILITIES.find(f => f.id === 'fac-parking');
  const wifi = CANDIDATE_FACILITIES.find(f => f.id === 'fac-wifi');
  const pets = CANDIDATE_FACILITIES.find(f => f.id === 'fac-pets');
  const family = CANDIDATE_FACILITIES.find(f => f.id === 'fac-family');
  const nonSmoking = CANDIDATE_FACILITIES.find(f => f.id === 'fac-non-smoking');
  const accessible = CANDIDATE_FACILITIES.find(f => f.id === 'fac-accessible');
  const reception = CANDIDATE_FACILITIES.find(f => f.id === 'fac-reception');
  const luggage = CANDIDATE_FACILITIES.find(f => f.id === 'fac-luggage');
  const express = CANDIDATE_FACILITIES.find(f => f.id === 'fac-express');
  const gym = CANDIDATE_FACILITIES.find(f => f.id === 'fac-gym');

  assert.ok(pool, 'Pool facility missing');
  assert.ok(sauna, 'Sauna facility missing');
  assert.ok(jacuzzi, 'Jacuzzi facility missing');
  assert.ok(breakfast, 'Breakfast facility missing');
  assert.ok(dietary, 'Dietary breakfast missing');
  assert.ok(restaurant, 'Restaurant missing');
  assert.ok(bar, 'Bar missing');
  assert.ok(parking, 'Parking facility missing');
  assert.ok(wifi, 'Free Wi-Fi missing');
  assert.ok(pets, 'Pet-friendly facility missing');
  assert.ok(family, 'Family rooms facility missing');
  assert.ok(nonSmoking, 'Non-smoking rooms missing');
  assert.ok(accessible, 'Accessible facilities missing');
  assert.ok(reception, 'Reception missing');
  assert.ok(luggage, 'Luggage storage missing');
  assert.ok(express, 'Express check-in/out missing');
  assert.ok(gym, 'Gym partner facility missing');

  assert.equal(pool.status, 'reported_for_reference_property');
  assert.equal(CANDIDATE_FACILITIES.length >= 17, true);
});

test('transport details include Balladgatan bus transit to Gothenburg Central Station', () => {
  const bus = TRANSPORT_DETAILS.find(t => t.modeEn.includes('City Bus'));
  assert.ok(bus);
  assert.ok(bus.descriptionSv.includes('Balladgatan'));
});
