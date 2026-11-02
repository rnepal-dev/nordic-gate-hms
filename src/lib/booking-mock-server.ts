/**
 * Dev API Mock Server for Bookings and Pricing APIs
 * Provides authoritative responses during Vite development and browser verification.
 */
import type { IncomingMessage, ServerResponse } from 'http';
import { calculateCalendarNights, generateStayDates, parseDateOnly } from './date-logic.ts';

interface StoredBookingRecord {
  booking_reference: string;
  room_type_id: number;
  room_type_name: string;
  rate_plan_id: number;
  rate_plan_name: string;
  check_in: string;
  check_out: string;
  number_of_nights: number;
  adults: number;
  children: number;
  guest_first_name: string;
  guest_last_name: string;
  guest_email: string;
  guest_phone: string;
  guest_country: string;
  special_requests: string;
  status: 'pending_payment' | 'confirmed' | 'cancelled' | 'expired' | 'checked_in' | 'checked_out' | 'no_show';
  source: string;
  currency: string;
  subtotal: string;
  taxes: string;
  total_amount: string;
  created_at: string;
  expires_at: string | null;
  confirmed_at: string | null;
  cancelled_at: string | null;
  payment_status: string;
  refund_status: string | null;
  guest_token: string;
}

const ROOM_TYPES_DATA = [
  {
    id: 1,
    name: 'Compact Double Room',
    slug: 'compact-double-room',
    description: 'Designed for comfort and rest, featuring a Queen-size bed, sleek bathroom with Hansgrohe rain shower, work alcove, and fiber Wi-Fi.',
    max_occupancy: 2,
    bed_configuration: { queen_bed: 1 },
    size_sqm: '14.00',
    amenities: 'High-Speed Wi-Fi 6, Scandinavian Breakfast Buffet, Heated Pool & Sauna Access, Hansgrohe Rain Shower, Smart 4K UHD Display, Individual Climate Control',
    base_price: 1295,
    image_url: '/src/assets/images/room_compact_double.jpg',
  },
  {
    id: 2,
    name: 'Compact Twin Room',
    slug: 'compact-twin-room',
    description: 'Practical twin room tailored for business travelers and friends, with two single beds, work desk, and streamlined storage.',
    max_occupancy: 2,
    bed_configuration: { single_bed: 2 },
    size_sqm: '14.00',
    amenities: 'High-Speed Wi-Fi 6, Scandinavian Breakfast Buffet, Heated Pool & Sauna Access, Hansgrohe Rain Shower, Solid Oak Workstation, Smart 4K UHD Display',
    base_price: 1295,
    image_url: '/src/assets/images/room_compact_twin.jpg',
  },
  {
    id: 3,
    name: 'Standard Twin Room',
    slug: 'standard-twin-room',
    description: 'Spacious twin accommodations with comfortable seating corner, two 90cm twin beds, writing desk, and refrigerator.',
    max_occupancy: 2,
    bed_configuration: { twin_bed: 2 },
    size_sqm: '18.00',
    amenities: 'High-Speed Wi-Fi 6, Scandinavian Breakfast Buffet, Heated Pool & Sauna Access, Hansgrohe Rain Shower, Solid Oak Workstation, Smart 4K UHD Display, Silent Mini Refrigerator, Individual Climate Control',
    base_price: 1650,
    image_url: '/src/assets/images/room_standard_twin.jpg',
  },
  {
    id: 4,
    name: 'Superior Double Room',
    slug: 'superior-double-room',
    description: 'Enhanced Nordic comfort with plush King bedding, lounge seating armchair, Sjöstrand brass espresso bar, bathrobes, and slippers.',
    max_occupancy: 3,
    bed_configuration: { king_bed: 1, lounge_armchair: 1 },
    size_sqm: '22.50',
    amenities: 'High-Speed Wi-Fi 6, Scandinavian Breakfast Buffet, Heated Pool & Sauna Access, Hansgrohe Rain Shower, Sjöstrand Brass Espresso Machine, Solid Oak Workstation, Smart 4K UHD Display, Waffle Robes & Slippers, Silent Mini Refrigerator, Individual Climate Control',
    base_price: 2150,
    image_url: '/src/assets/images/room_superior_double.jpg',
  },
  {
    id: 5,
    name: 'Family Room',
    slug: 'family-room',
    description: 'Flexible sanctuary designed for families traveling together, featuring one double bed plus bunk beds or convertible sofa bed.',
    max_occupancy: 4,
    bed_configuration: { double_bed: 1, bunk_bed: 1 },
    size_sqm: '25.00',
    amenities: 'High-Speed Wi-Fi 6, Scandinavian Breakfast Buffet, Heated Pool & Sauna Access, Hansgrohe Rain Shower, Smart 4K UHD Display, Silent Mini Refrigerator, Individual Climate Control',
    base_price: 2650,
    image_url: '/src/assets/images/room_family.jpg',
  },
];

const RATE_PLANS_DATA = [
  {
    id: 1,
    name: 'Flexible Heritage Rate',
    code: 'FLEX',
    description: 'Complimentary cancellation up to 24 hours prior to arrival. Includes breakfast buffet and pool entrance.',
    cancellation_policy: 'flexible' as const,
    free_cancellation_deadline_hours: 24,
    breakfast_included: true,
    pool_included: true,
    is_active: true,
    multiplier: 1.0,
    room_types: [1, 2, 3, 4, 5],
    created_at: '2026-10-01T08:00:00Z',
    updated_at: '2026-10-20T12:00:00Z',
  },
  {
    id: 2,
    name: 'Advance Purchase — 15% Saver',
    code: 'ADV15',
    description: 'Non-refundable rate with best price guarantee. Includes breakfast buffet and pool entrance.',
    cancellation_policy: 'non_refundable' as const,
    free_cancellation_deadline_hours: null,
    breakfast_included: true,
    pool_included: true,
    is_active: true,
    multiplier: 0.85,
    room_types: [1, 2, 3, 4, 5],
    created_at: '2026-10-01T08:00:00Z',
    updated_at: '2026-10-20T12:00:00Z',
  },
  {
    id: 3,
    name: 'Stay & Dine Gastronomy Package',
    code: 'DINE',
    description: 'Includes 3-course dinner in the Bistro, daily breakfast buffet, and pool & sauna admission.',
    cancellation_policy: 'flexible' as const,
    free_cancellation_deadline_hours: 48,
    breakfast_included: true,
    pool_included: true,
    is_active: true,
    multiplier: 1.35,
    room_types: [3, 4, 5],
    created_at: '2026-10-01T08:00:00Z',
    updated_at: '2026-10-20T12:00:00Z',
  },
];

// In-memory bookings store initialized with real historical/active bookings
const BOOKINGS_STORE: StoredBookingRecord[] = [
  {
    booking_reference: 'SH-88492',
    room_type_id: 4,
    room_type_name: 'Superior Double Room',
    rate_plan_id: 1,
    rate_plan_name: 'Flexible Heritage Rate',
    check_in: '2026-10-24',
    check_out: '2026-10-26',
    number_of_nights: 2,
    adults: 2,
    children: 0,
    guest_first_name: 'Carl',
    guest_last_name: 'von Linné',
    guest_email: 'carl.linne@botanik.se',
    guest_phone: '+46 70 123 45 67',
    guest_country: 'Sweden',
    special_requests: 'Quiet high floor requested, quiet courtyard view.',
    status: 'confirmed',
    source: 'direct_website',
    currency: 'SEK',
    subtotal: '3839.29',
    taxes: '460.71',
    total_amount: '4300.00',
    created_at: '2026-10-15T10:30:00Z',
    expires_at: null,
    confirmed_at: '2026-10-15T10:35:00Z',
    cancelled_at: null,
    payment_status: 'paid',
    refund_status: null,
    guest_token: 'tok_carl88492',
  },
  {
    booking_reference: 'SH-91204',
    room_type_id: 5,
    room_type_name: 'Family Room',
    rate_plan_id: 1,
    rate_plan_name: 'Flexible Heritage Rate',
    check_in: '2026-11-05',
    check_out: '2026-11-08',
    number_of_nights: 3,
    adults: 2,
    children: 2,
    guest_first_name: 'Astrid',
    guest_last_name: 'Lindgren',
    guest_email: 'astrid.lindgren@nordicgate.se',
    guest_phone: '+46 70 987 65 43',
    guest_country: 'Sweden',
    special_requests: 'Baby crib requested for child.',
    status: 'confirmed',
    source: 'direct_website',
    currency: 'SEK',
    subtotal: '7102.68',
    taxes: '852.32',
    total_amount: '7950.00',
    created_at: '2026-10-28T14:15:00Z',
    expires_at: null,
    confirmed_at: '2026-10-28T14:20:00Z',
    cancelled_at: null,
    payment_status: 'paid',
    refund_status: null,
    guest_token: 'tok_astrid91204',
  },
  {
    booking_reference: 'SH-74190',
    room_type_id: 1,
    room_type_name: 'Compact Double Room',
    rate_plan_id: 2,
    rate_plan_name: 'Advance Purchase — 15% Saver',
    check_in: '2026-09-12',
    check_out: '2026-09-14',
    number_of_nights: 2,
    adults: 1,
    children: 0,
    guest_first_name: 'Henrik',
    guest_last_name: 'Larsson',
    guest_email: 'henrik.larsson@football.se',
    guest_phone: '+46 70 555 44 33',
    guest_country: 'Sweden',
    special_requests: '',
    status: 'checked_out',
    source: 'direct_website',
    currency: 'SEK',
    subtotal: '1965.18',
    taxes: '235.82',
    total_amount: '2201.00',
    created_at: '2026-09-01T09:00:00Z',
    expires_at: null,
    confirmed_at: '2026-09-01T09:05:00Z',
    cancelled_at: null,
    payment_status: 'paid',
    refund_status: null,
    guest_token: 'tok_henrik74190',
  },
];

export function handleDevBookingApi(req: IncomingMessage, res: ServerResponse): boolean {
  const urlObj = new URL(req.url || '', 'http://localhost');
  const pathname = urlObj.pathname;
  const method = req.method || 'GET';

  // Helper JSON sender
  const sendJson = (status: number, data: unknown) => {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
  };

  // 1. GET /pricing/api/rate-plans/
  if (pathname === '/pricing/api/rate-plans/' && method === 'GET') {
    const plans = RATE_PLANS_DATA.map(({ multiplier, ...rest }) => rest);
    sendJson(200, plans);
    return true;
  }

  // 2. GET /pricing/api/rate-plans/{id}/
  const ratePlanMatch = pathname.match(/^\/pricing\/api\/rate-plans\/(\d+)\/?$/);
  if (ratePlanMatch && method === 'GET') {
    const planId = parseInt(ratePlanMatch[1], 10);
    const plan = RATE_PLANS_DATA.find((p) => p.id === planId);
    if (!plan) {
      sendJson(404, { detail: 'Rate plan not found.' });
      return true;
    }
    const { multiplier, ...rest } = plan;
    sendJson(200, rest);
    return true;
  }

  // 3. GET /pricing/api/nightly-rates/
  if (pathname === '/pricing/api/nightly-rates/' && method === 'GET') {
    const roomTypeId = parseInt(urlObj.searchParams.get('room_type') || '1', 10);
    const ratePlanId = parseInt(urlObj.searchParams.get('rate_plan') || '1', 10);
    const startDate = urlObj.searchParams.get('start_date') || '2026-10-24';
    const endDate = urlObj.searchParams.get('end_date') || '2026-10-26';

    const roomType = ROOM_TYPES_DATA.find((r) => r.id === roomTypeId) || ROOM_TYPES_DATA[0];
    const ratePlan = RATE_PLANS_DATA.find((p) => p.id === ratePlanId) || RATE_PLANS_DATA[0];

    const dates = generateStayDates(startDate, endDate);
    const nightlyRates = dates.map((stayDate, idx) => {
      // Slightly higher weekend rate for Friday / Saturday
      const dayOfWeek = new Date(stayDate).getUTCDay();
      const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;
      const baseAdjusted = roomType.base_price + (isWeekend ? 150 : 0);
      const computedPrice = Math.round(baseAdjusted * ratePlan.multiplier);

      return {
        id: idx + 1,
        room_type: roomType.id,
        room_type_name: roomType.name,
        rate_plan: ratePlan.id,
        rate_plan_name: ratePlan.name,
        stay_date: stayDate,
        price: computedPrice.toFixed(2),
        currency: 'SEK',
        minimum_stay: 1,
        is_closed_to_arrival: false,
        is_closed_to_departure: false,
        created_at: '2026-10-01T08:00:00Z',
        updated_at: '2026-10-20T12:00:00Z',
      };
    });

    sendJson(200, nightlyRates);
    return true;
  }

  // 4. GET /bookings/api/availability/
  if (pathname === '/bookings/api/availability/' && method === 'GET') {
    const checkIn = urlObj.searchParams.get('check_in') || '2026-10-24';
    const checkOut = urlObj.searchParams.get('check_out') || '2026-10-26';
    const adults = parseInt(urlObj.searchParams.get('adults') || '2', 10);
    const children = parseInt(urlObj.searchParams.get('children') || '0', 10);
    const totalGuests = adults + children;

    const nights = calculateCalendarNights(checkIn, checkOut);
    const stayDates = generateStayDates(checkIn, checkOut);

    // Filter room types by capacity
    const eligibleRoomTypes = ROOM_TYPES_DATA.filter((r) => r.max_occupancy >= totalGuests);

    const availableRoomTypes = eligibleRoomTypes.map((rt) => {
      // Find eligible rate plans for this room type
      const applicableRatePlans = RATE_PLANS_DATA.filter((rp) => rp.room_types.includes(rt.id));

      const plans = applicableRatePlans.map((rp) => {
        let total = 0;
        const breakdown = stayDates.map((d) => {
          const dayOfWeek = new Date(d).getUTCDay();
          const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;
          const baseAdjusted = rt.base_price + (isWeekend ? 150 : 0);
          const price = Math.round(baseAdjusted * rp.multiplier);
          total += price;
          return {
            stay_date: d,
            price: price.toFixed(2),
            currency: 'SEK',
          };
        });

        const avg = Math.round(total / nights);

        return {
          rate_plan_id: rp.id,
          rate_plan_name: rp.name,
          rate_plan_code: rp.code,
          cancellation_policy: rp.cancellation_policy,
          free_cancellation_deadline_hours: rp.free_cancellation_deadline_hours,
          breakfast_included: rp.breakfast_included,
          pool_included: rp.pool_included,
          total_price: total.toFixed(2),
          nightly_average: avg.toFixed(2),
          currency: 'SEK',
          minimum_stay: 1,
          is_available: true,
          nightly_breakdown: breakdown,
        };
      });

      const startingPrice = plans.length > 0 ? plans[0].nightly_average : rt.base_price.toFixed(2);

      return {
        room_type_id: rt.id,
        room_type_name: rt.name,
        room_type_slug: rt.slug,
        description: rt.description,
        max_occupancy: rt.max_occupancy,
        bed_configuration: rt.bed_configuration,
        size_sqm: rt.size_sqm,
        amenities: rt.amenities,
        image_url: rt.image_url,
        available_rooms_count: 5,
        starting_price: startingPrice,
        currency: 'SEK',
        rate_plans: plans,
      };
    });

    sendJson(200, {
      check_in: checkIn,
      check_out: checkOut,
      nights,
      adults,
      children,
      available_room_types: availableRoomTypes,
    });
    return true;
  }

  // 5. POST /bookings/api/reservations/
  if (pathname === '/bookings/api/reservations/' && method === 'POST') {
    let bodyStr = '';
    req.on('data', (c) => {
      bodyStr += c;
    });
    req.on('end', () => {
      try {
        const body = JSON.parse(bodyStr);

        if (!body.accept_booking_terms) {
          sendJson(400, {
            accept_booking_terms: ['You must accept the hotel booking terms to proceed.'],
          });
          return;
        }

        if (
          !body.room_type_id ||
          !body.rate_plan_id ||
          !body.guest_first_name ||
          !body.guest_last_name ||
          !body.guest_email ||
          !body.guest_phone ||
          !body.guest_country
        ) {
          sendJson(400, {
            detail: 'Missing required guest or booking reservation fields.',
          });
          return;
        }

        const roomType = ROOM_TYPES_DATA.find((r) => r.id === body.room_type_id) || ROOM_TYPES_DATA[0];
        const ratePlan = RATE_PLANS_DATA.find((p) => p.id === body.rate_plan_id) || RATE_PLANS_DATA[0];
        const nights = calculateCalendarNights(body.check_in, body.check_out);

        const stayDates = generateStayDates(body.check_in, body.check_out);
        let total = 0;
        stayDates.forEach((d) => {
          const dayOfWeek = new Date(d).getUTCDay();
          const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;
          const price = Math.round((roomType.base_price + (isWeekend ? 150 : 0)) * ratePlan.multiplier);
          total += price;
        });

        // Swedish hotel VAT: 12%
        const vat = Math.round(total * (0.12 / 1.12));
        const subtotal = total - vat;

        const bookingRef = `SH-${Math.floor(10000 + Math.random() * 90000)}`;
        const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 min hold for payment

        const newBooking: StoredBookingRecord = {
          booking_reference: bookingRef,
          room_type_id: roomType.id,
          room_type_name: roomType.name,
          rate_plan_id: ratePlan.id,
          rate_plan_name: ratePlan.name,
          check_in: body.check_in,
          check_out: body.check_out,
          number_of_nights: nights,
          adults: body.adults,
          children: body.children,
          guest_first_name: body.guest_first_name.trim(),
          guest_last_name: body.guest_last_name.trim(),
          guest_email: body.guest_email.trim(),
          guest_phone: body.guest_phone.trim(),
          guest_country: body.guest_country.trim(),
          special_requests: body.special_requests || '',
          status: 'pending_payment',
          source: 'direct_website',
          currency: 'SEK',
          subtotal: subtotal.toFixed(2),
          taxes: vat.toFixed(2),
          total_amount: total.toFixed(2),
          created_at: new Date().toISOString(),
          expires_at: expiresAt,
          confirmed_at: null,
          cancelled_at: null,
          payment_status: 'pending',
          refund_status: null,
          guest_token: `tok_${bookingRef.toLowerCase()}`,
        };

        BOOKINGS_STORE.unshift(newBooking);

        sendJson(201, {
          booking_reference: bookingRef,
          status: 'pending_payment',
          total_amount: total.toFixed(2),
          tax_amount: vat.toFixed(2),
          currency: 'SEK',
          created_at: newBooking.created_at,
          expires_at: expiresAt,
          guest_name: `${newBooking.guest_first_name} ${newBooking.guest_last_name}`,
          guest_email: newBooking.guest_email,
          check_in: newBooking.check_in,
          check_out: newBooking.check_out,
          number_of_nights: nights,
          room_type_name: roomType.name,
          rate_plan_name: ratePlan.name,
          payment_status: 'pending',
        });
      } catch {
        sendJson(400, { detail: 'Invalid JSON payload' });
      }
    });
    return true;
  }

  // 6. GET /bookings/api/my-bookings/
  if (pathname === '/bookings/api/my-bookings/' && method === 'GET') {
    const page = parseInt(urlObj.searchParams.get('page') || '1', 10);
    const pageSize = parseInt(urlObj.searchParams.get('page_size') || '10', 10);

    const start = (page - 1) * pageSize;
    const paginated = BOOKINGS_STORE.slice(start, start + pageSize).map((b) => ({
      booking_reference: b.booking_reference,
      check_in: b.check_in,
      check_out: b.check_out,
      number_of_nights: b.number_of_nights,
      status: b.status,
      total_amount: b.total_amount,
      currency: b.currency,
      created_at: b.created_at,
    }));

    sendJson(200, {
      count: BOOKINGS_STORE.length,
      next: start + pageSize < BOOKINGS_STORE.length ? `/bookings/api/my-bookings/?page=${page + 1}` : null,
      previous: page > 1 ? `/bookings/api/my-bookings/?page=${page - 1}` : null,
      results: paginated,
    });
    return true;
  }

  // 7. GET /bookings/api/my-bookings/{booking_reference}/
  const myBookingDetailMatch = pathname.match(/^\/bookings\/api\/my-bookings\/([A-Za-z0-9_-]+)\/?$/);
  if (myBookingDetailMatch && method === 'GET') {
    const ref = myBookingDetailMatch[1];
    const booking = BOOKINGS_STORE.find((b) => b.booking_reference.toLowerCase() === ref.toLowerCase());
    if (!booking) {
      sendJson(404, { detail: `Booking reference "${ref}" not found.` });
      return true;
    }

    const ratePlan = RATE_PLANS_DATA.find((p) => p.id === booking.rate_plan_id) || RATE_PLANS_DATA[0];
    const stayDates = generateStayDates(booking.check_in, booking.check_out);

    const nightlyRates = stayDates.map((d) => {
      const dayOfWeek = new Date(d).getUTCDay();
      const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;
      const amountIncTax = Math.round((2150 + (isWeekend ? 150 : 0)) * ratePlan.multiplier);
      const taxAmt = Math.round(amountIncTax * (0.12 / 1.12));
      return {
        stay_date: d,
        amount_including_tax: amountIncTax.toFixed(2),
        tax_amount: taxAmt.toFixed(2),
        currency: booking.currency,
      };
    });

    sendJson(200, {
      booking_reference: booking.booking_reference,
      status: booking.status,
      source: booking.source,
      check_in: booking.check_in,
      check_out: booking.check_out,
      number_of_nights: booking.number_of_nights,
      currency: booking.currency,
      subtotal: booking.subtotal,
      taxes: booking.taxes,
      total_amount: booking.total_amount,
      special_requests: booking.special_requests,
      guest_first_name: booking.guest_first_name,
      guest_last_name: booking.guest_last_name,
      guest_email: booking.guest_email,
      guest_phone: booking.guest_phone,
      guest_country: booking.guest_country,
      expires_at: booking.expires_at,
      confirmed_at: booking.confirmed_at,
      cancelled_at: booking.cancelled_at,
      booking_rooms: [
        {
          room_type_id: booking.room_type_id,
          room_type_name: booking.room_type_name,
          rate_plan_id: booking.rate_plan_id,
          rate_plan_name: booking.rate_plan_name,
          adults: booking.adults,
          children: booking.children,
          breakfast_included: ratePlan.breakfast_included,
          pool_included: ratePlan.pool_included,
          room_subtotal: booking.subtotal,
          taxes: booking.taxes,
          room_total: booking.total_amount,
          cancellation_policy_snapshot:
            ratePlan.cancellation_policy === 'flexible'
              ? 'Free cancellation up to 24 hours prior to check-in (15:00 CET).'
              : 'Non-refundable reservation. No refunds on cancellation.',
          free_cancellation_deadline_snapshot:
            ratePlan.cancellation_policy === 'flexible' ? `${booking.check_in}T15:00:00Z` : null,
          nightly_rates: nightlyRates,
        },
      ],
      payment_status: booking.payment_status,
      refund_status: booking.refund_status,
    });
    return true;
  }

  // 8. POST /bookings/api/guest-status/
  if (pathname === '/bookings/api/guest-status/' && method === 'POST') {
    let bodyStr = '';
    req.on('data', (c) => (bodyStr += c));
    req.on('end', () => {
      try {
        const body = JSON.parse(bodyStr);
        const booking = BOOKINGS_STORE.find((b) => b.booking_reference.toLowerCase() === (body.booking_reference || '').toLowerCase());
        if (!booking) {
          sendJson(404, { detail: 'No booking found matching reference.' });
          return;
        }
        sendJson(200, {
          booking_reference: booking.booking_reference,
          status: booking.status,
          guest_first_name: booking.guest_first_name,
          guest_last_name: booking.guest_last_name,
          check_in: booking.check_in,
          check_out: booking.check_out,
          total_amount: booking.total_amount,
          currency: booking.currency,
        });
      } catch {
        sendJson(400, { detail: 'Invalid JSON' });
      }
    });
    return true;
  }

  // 9. POST /bookings/api/cancellations/registered/
  if (pathname === '/bookings/api/cancellations/registered/' && method === 'POST') {
    let bodyStr = '';
    req.on('data', (c) => (bodyStr += c));
    req.on('end', () => {
      try {
        const body = JSON.parse(bodyStr);
        const booking = BOOKINGS_STORE.find((b) => b.booking_reference.toLowerCase() === (body.booking_reference || '').toLowerCase());
        if (!booking) {
          sendJson(404, { detail: 'Booking not found.' });
          return;
        }
        booking.status = 'cancelled';
        booking.cancelled_at = new Date().toISOString();
        sendJson(200, {
          success: true,
          status: 'cancelled',
          message: `Reservation ${booking.booking_reference} has been successfully cancelled.`,
          cancelled_at: booking.cancelled_at,
        });
      } catch {
        sendJson(400, { detail: 'Invalid JSON' });
      }
    });
    return true;
  }

  // 10. POST /bookings/api/cancellations/guest/
  if (pathname === '/bookings/api/cancellations/guest/' && method === 'POST') {
    let bodyStr = '';
    req.on('data', (c) => (bodyStr += c));
    req.on('end', () => {
      try {
        const body = JSON.parse(bodyStr);
        const booking = BOOKINGS_STORE.find((b) => b.booking_reference.toLowerCase() === (body.booking_reference || '').toLowerCase());
        if (!booking) {
          sendJson(404, { detail: 'Booking not found.' });
          return;
        }
        booking.status = 'cancelled';
        booking.cancelled_at = new Date().toISOString();
        sendJson(200, {
          success: true,
          status: 'cancelled',
          message: `Reservation ${booking.booking_reference} has been cancelled via guest token.`,
          cancelled_at: booking.cancelled_at,
        });
      } catch {
        sendJson(400, { detail: 'Invalid JSON' });
      }
    });
    return true;
  }

  // 11. POST /bookings/api/cancellations/request-link/
  if (pathname === '/bookings/api/cancellations/request-link/' && method === 'POST') {
    sendJson(200, {
      message: 'If a matching booking was found, a secure cancellation link has been sent to your email address.',
    });
    return true;
  }

  return false;
}
