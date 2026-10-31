import { AdminFaq } from '../features/admin/faqs/faqTypes';
import { ApiFacilityItem, getCategoryDisplay } from '../features/admin/facilities/facilityTypes';
import { ApiGalleryItem, getGalleryCategoryDisplay, getRoomTypeName } from '../features/admin/gallery/galleryTypes';
import { RoomAmenity, generateAmenitySlug } from '../features/admin/room-amenities/amenityTypes';
import { RoomType, generateRoomTypeSlug } from '../features/admin/room-types/roomTypeTypes';
import { PhysicalRoom } from '../features/admin/rooms/roomTypes';
import { HOTEL_FAQS, CANDIDATE_FACILITIES } from './propertyData';
import { HOTEL_IMAGES } from './hotelData';

// ==========================================
// FAQS SEED DATA & STORAGE
// ==========================================
export const INITIAL_ADMIN_FAQS: AdminFaq[] = [
  {
    id: 1,
    category: 'check_in_out',
    question: HOTEL_FAQS[0].qEn,
    questionSv: HOTEL_FAQS[0].qSv,
    answer: HOTEL_FAQS[0].aEn,
    answerSv: HOTEL_FAQS[0].aSv,
    display_order: 1,
    status: 'published',
    updatedAt: '2026-10-24 14:30',
    created_at: '2026-10-01 10:00',
    updated_at: '2026-10-24 14:30',
    author: 'Astrid Lindgren',
  },
  {
    id: 2,
    category: 'dining',
    question: HOTEL_FAQS[1].qEn,
    questionSv: HOTEL_FAQS[1].qSv,
    answer: HOTEL_FAQS[1].aEn,
    answerSv: HOTEL_FAQS[1].aSv,
    display_order: 2,
    status: 'published',
    updatedAt: '2026-10-25 09:15',
    created_at: '2026-10-01 10:00',
    updated_at: '2026-10-25 09:15',
    author: 'Henrik Larsson',
  },
  {
    id: 3,
    category: 'wellness',
    question: HOTEL_FAQS[2].qEn,
    questionSv: HOTEL_FAQS[2].qSv,
    answer: HOTEL_FAQS[2].aEn,
    answerSv: HOTEL_FAQS[2].aSv,
    display_order: 3,
    status: 'published',
    updatedAt: '2026-10-25 11:20',
    created_at: '2026-10-02 11:00',
    updated_at: '2026-10-25 11:20',
    author: 'Astrid Lindgren',
  },
  {
    id: 4,
    category: 'parking',
    question: HOTEL_FAQS[3].qEn,
    questionSv: HOTEL_FAQS[3].qSv,
    answer: HOTEL_FAQS[3].aEn,
    answerSv: HOTEL_FAQS[3].aSv,
    display_order: 4,
    status: 'published',
    updatedAt: '2026-10-25 16:40',
    created_at: '2026-10-02 11:00',
    updated_at: '2026-10-25 16:40',
    author: 'Admin Staff',
  },
  {
    id: 5,
    category: 'pets',
    question: HOTEL_FAQS[4].qEn,
    questionSv: HOTEL_FAQS[4].qSv,
    answer: HOTEL_FAQS[4].aEn,
    answerSv: HOTEL_FAQS[4].aSv,
    display_order: 5,
    status: 'published',
    updatedAt: '2026-10-26 08:05',
    created_at: '2026-10-03 12:00',
    updated_at: '2026-10-26 08:05',
    author: 'Reception Team',
  },
  {
    id: 6,
    category: 'general',
    question: HOTEL_FAQS[5].qEn,
    questionSv: HOTEL_FAQS[5].qSv,
    answer: HOTEL_FAQS[5].aEn,
    answerSv: HOTEL_FAQS[5].aSv,
    display_order: 6,
    status: 'published',
    updatedAt: '2026-10-26 12:10',
    created_at: '2026-10-03 12:00',
    updated_at: '2026-10-26 12:10',
    author: 'Henrik Larsson',
  },
  {
    id: 7,
    category: 'policies',
    question: HOTEL_FAQS[6].qEn,
    questionSv: HOTEL_FAQS[6].qSv,
    answer: HOTEL_FAQS[6].aEn,
    answerSv: HOTEL_FAQS[6].aSv,
    display_order: 7,
    status: 'published',
    updatedAt: '2026-10-26 15:30',
    created_at: '2026-10-04 14:00',
    updated_at: '2026-10-26 15:30',
    author: 'Finance Director',
  },
  {
    id: 8,
    category: 'pets',
    question: HOTEL_FAQS[7].qEn,
    questionSv: HOTEL_FAQS[7].qSv,
    answer: HOTEL_FAQS[7].aEn,
    answerSv: HOTEL_FAQS[7].aSv,
    display_order: 8,
    status: 'draft',
    updatedAt: '2026-10-27 10:00',
    created_at: '2026-10-04 14:00',
    updated_at: '2026-10-27 10:00',
    author: 'Front Desk',
  },
  {
    id: 9,
    category: 'general',
    question: 'Do you offer luggage storage before check-in or after check-out?',
    questionSv: 'Erbjuder ni bagageförvaring före incheckning eller efter utcheckning?',
    answer: 'Yes, secure luggage storage is available free of charge at the reception 24 hours a day.',
    answerSv: 'Ja, kostnadsfri och låst bagageförvaring finns i receptionen dygnet runt.',
    display_order: 9,
    status: 'published',
    updatedAt: '2026-10-27 14:15',
    created_at: '2026-10-05 09:00',
    updated_at: '2026-10-27 14:15',
    author: 'Front Desk',
  },
  {
    id: 10,
    category: 'dining',
    question: 'Are children allowed in the bar area in the evening?',
    questionSv: 'Är barn tillåtna i barområdet under kvällstid?',
    answer: 'Families are welcome to dine and enjoy non-alcoholic beverages in the lounge and bar until 21:00.',
    answerSv: 'Familjer är välkomna att äta och avnjuta alkoholfria drycker i loungen och baren fram till kl. 21:00.',
    display_order: 10,
    status: 'draft',
    updatedAt: '2026-10-27 17:00',
    created_at: '2026-10-05 09:00',
    updated_at: '2026-10-27 17:00',
    author: 'Bar Manager',
  },
];

const FAQ_STORAGE_KEY = 'nordic_gate_admin_faqs_v2';

export const loadAdminFaqs = (): AdminFaq[] => {
  try {
    const raw = localStorage.getItem(FAQ_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to load FAQs from storage:', err);
  }
  return INITIAL_ADMIN_FAQS;
};

export const saveAdminFaqs = (faqs: AdminFaq[]): void => {
  try {
    localStorage.setItem(FAQ_STORAGE_KEY, JSON.stringify(faqs));
  } catch (err) {
    console.error('Failed to save FAQs to storage:', err);
  }
};

// ==========================================
// FACILITIES SEED DATA & STORAGE
// ==========================================
export const INITIAL_ADMIN_FACILITIES: ApiFacilityItem[] = [
  {
    id: 1,
    name: 'Heated Indoor Swimming Pool',
    slug: 'heated-indoor-swimming-pool',
    category: 'wellness',
    category_display: getCategoryDisplay('wellness'),
    description: 'Indoor heated pool maintained at comfortable 28°C for year-round guest relaxation.',
    icon: 'waves',
    is_available: true,
    is_free: true,
    requires_reservation: false,
    additional_information: 'Open 06:00 – 22:00 daily. Complimentary towels available poolside.',
    display_order: 1,
  },
  {
    id: 2,
    name: 'Finnish Sauna & Relaxation Lounge',
    slug: 'finnish-sauna-relaxation-lounge',
    category: 'wellness',
    category_display: getCategoryDisplay('wellness'),
    description: 'Traditional dry Nordic sauna with cedar benches and cold water foot basins.',
    icon: 'flame',
    is_available: true,
    is_free: true,
    requires_reservation: false,
    additional_information: 'Separate men & women sections plus scheduled communal sessions.',
    display_order: 2,
  },
  {
    id: 3,
    name: 'Scandinavian Organic Breakfast Buffet',
    slug: 'scandinavian-organic-breakfast-buffet',
    category: 'dining',
    category_display: getCategoryDisplay('dining'),
    description: 'Generous hot and cold Scandinavian buffet including organic produce, freshly baked bread, and specialty tea/coffee.',
    icon: 'coffee',
    is_available: true,
    is_free: true,
    requires_reservation: false,
    additional_information: 'Served 06:30–10:00 (weekdays) and 07:30–11:00 (weekends). Dietary and vegan alternatives available.',
    display_order: 3,
  },
  {
    id: 4,
    name: 'Nordic Bistro & Cocktail Bar',
    slug: 'nordic-bistro-cocktail-bar',
    category: 'dining',
    category_display: getCategoryDisplay('dining'),
    description: 'A la carte dinners featuring West Coast fish, classic Swedish meatballs, and Swedish craft spirits.',
    icon: 'utensils',
    is_available: true,
    is_free: false,
    requires_reservation: true,
    additional_information: 'Kitchen open 17:30 – 22:00. Table reservations recommended on weekends.',
    display_order: 4,
  },
  {
    id: 5,
    name: 'High-Speed Wi-Fi 6',
    slug: 'high-speed-wi-fi-6',
    category: 'connectivity',
    category_display: getCategoryDisplay('connectivity'),
    description: 'Complimentary enterprise-grade fiber wireless internet across all guest rooms and public spaces.',
    icon: 'wifi',
    is_available: true,
    is_free: true,
    requires_reservation: false,
    additional_information: 'No password required; seamless 1-click portal connection.',
    display_order: 5,
  },
  {
    id: 6,
    name: 'On-Site Private Parking & EV Charging',
    slug: 'on-site-private-parking-ev-charging',
    category: 'transport',
    category_display: getCategoryDisplay('transport'),
    description: 'Secure surface and heated garage parking directly on property with Type 2 electric vehicle chargers.',
    icon: 'parking',
    is_available: true,
    is_free: false,
    requires_reservation: false,
    additional_information: '195 SEK/night. EV charging billed separately via EasyPark app.',
    display_order: 6,
  },
  {
    id: 7,
    name: 'Partner Gym Membership Access',
    slug: 'partner-gym-membership-access',
    category: 'wellness',
    category_display: getCategoryDisplay('wellness'),
    description: 'Full complimentary access to nearby 24/7 fitness facility located a 4-minute walk from the hotel entrance.',
    icon: 'dumbbell',
    is_available: true,
    is_free: true,
    requires_reservation: true,
    additional_information: 'Collect complimentary digital key fob at front desk before visiting.',
    display_order: 7,
  },
  {
    id: 8,
    name: '24-Hour Reception & Concierge',
    slug: '24-hour-reception-concierge',
    category: 'services',
    category_display: getCategoryDisplay('services'),
    description: 'Round-the-clock front desk assistance, wake-up calls, taxi bookings, and local Gothenburg travel tips.',
    icon: 'clock',
    is_available: true,
    is_free: true,
    requires_reservation: false,
    additional_information: 'Multilingual staff speaking Swedish, English, and German.',
    display_order: 8,
  },
  {
    id: 9,
    name: 'Balladgatan City Bus Transit Link',
    slug: 'balladgatan-city-bus-transit-link',
    category: 'transport',
    category_display: getCategoryDisplay('transport'),
    description: 'Direct Västtrafik bus connection located immediately across the street, reaching Gothenburg Central Station in 10 minutes.',
    icon: 'bus',
    is_available: true,
    is_free: false,
    requires_reservation: false,
    additional_information: 'Bus tickets can be purchased via Västtrafik To Go app.',
    display_order: 9,
  },
];

const FACILITIES_STORAGE_KEY = 'nordic_gate_admin_facilities_v1';

export const loadAdminFacilities = (): ApiFacilityItem[] => {
  try {
    const raw = localStorage.getItem(FACILITIES_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to load facilities from storage:', err);
  }
  return INITIAL_ADMIN_FACILITIES;
};

export const saveAdminFacilities = (facilities: ApiFacilityItem[]): void => {
  try {
    localStorage.setItem(FACILITIES_STORAGE_KEY, JSON.stringify(facilities));
  } catch (err) {
    console.error('Failed to save facilities to storage:', err);
  }
};

// ==========================================
// HOTEL GALLERY SEED DATA & STORAGE
// ==========================================
export const INITIAL_ADMIN_GALLERY: ApiGalleryItem[] = [
  {
    id: 1,
    title: 'Hotel Nordic Gate Exterior at Twilight',
    description: 'Architectural facade capturing Scandinavian heritage against dusk sky at Gamla Tingstadsgatan 1.',
    image_url: HOTEL_IMAGES.facadeHero,
    category: 'exterior',
    category_display: getGalleryCategoryDisplay('exterior'),
    is_featured: true,
    room_type: null,
    room_type_name: null,
    display_order: 1,
    created_at: '2026-10-15 14:00',
  },
  {
    id: 2,
    title: 'Heritage Suite Drawing Room & Fireplace',
    description: 'Restored 1888 Gustafian mouldings, herringbone parquet, and bespoke king bed setting.',
    image_url: HOTEL_IMAGES.heritageSuite,
    category: 'rooms',
    category_display: getGalleryCategoryDisplay('rooms'),
    is_featured: true,
    room_type: 4, // Superior Double tier / Heritage
    room_type_name: getRoomTypeName(4),
    display_order: 2,
    created_at: '2026-10-16 11:30',
  },
  {
    id: 3,
    title: 'Deluxe Canal View Window Daybed',
    description: 'Deep cushioned window embrasure with wool throws overlooking the waterway.',
    image_url: HOTEL_IMAGES.deluxeCanal,
    category: 'rooms',
    category_display: getGalleryCategoryDisplay('rooms'),
    is_featured: false,
    room_type: 3, // Standard Twin
    room_type_name: getRoomTypeName(3),
    display_order: 3,
    created_at: '2026-10-17 09:45',
  },
  {
    id: 4,
    title: 'Nordic Restaurant & Dining Hall',
    description: 'Warm lighting and oak timber tables for evening dinners and Scandinavian organic breakfast.',
    image_url: HOTEL_IMAGES.diningRestaurant,
    category: 'dining',
    category_display: getGalleryCategoryDisplay('dining'),
    is_featured: true,
    room_type: null,
    room_type_name: null,
    display_order: 4,
    created_at: '2026-10-18 16:20',
  },
  {
    id: 5,
    title: 'Heated Indoor Swimming Pool & Sauna',
    description: 'Limestone surrounds and clear heated waters for restorative relaxation.',
    image_url: HOTEL_IMAGES.spaWellness,
    category: 'wellness',
    category_display: getGalleryCategoryDisplay('wellness'),
    is_featured: true,
    room_type: null,
    room_type_name: null,
    display_order: 5,
    created_at: '2026-10-19 13:10',
  },
  {
    id: 6,
    title: 'Cocktail Lounge & Evening Bar',
    description: 'Plush velvet seating and warm brass details for intimate evening conversations.',
    image_url: HOTEL_IMAGES.barLounge,
    category: 'bar',
    category_display: getGalleryCategoryDisplay('bar'),
    is_featured: false,
    room_type: null,
    room_type_name: null,
    display_order: 6,
    created_at: '2026-10-20 18:00',
  },
  {
    id: 7,
    title: 'Artisanal Craft Spirits & Nordic Cocktails',
    description: 'Handcrafted Swedish botanical gin, lingonberry syrups, and locally sourced botanicals.',
    image_url: HOTEL_IMAGES.barDrinks,
    category: 'bar',
    category_display: getGalleryCategoryDisplay('bar'),
    is_featured: false,
    room_type: null,
    room_type_name: null,
    display_order: 7,
    created_at: '2026-10-21 17:30',
  },
  {
    id: 8,
    title: 'Family Room Double Bed & Living Area',
    description: 'Spacious setup with comfortable bedding tailored for traveling families.',
    image_url: HOTEL_IMAGES.deluxeCanal,
    category: 'rooms',
    category_display: getGalleryCategoryDisplay('rooms'),
    is_featured: false,
    room_type: 5, // Family Room
    room_type_name: getRoomTypeName(5),
    display_order: 8,
    created_at: '2026-10-22 12:00',
  },
];

const GALLERY_STORAGE_KEY = 'nordic_gate_admin_gallery_v1';

export const loadAdminGallery = (): ApiGalleryItem[] => {
  try {
    const raw = localStorage.getItem(GALLERY_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to load gallery from storage:', err);
  }
  return INITIAL_ADMIN_GALLERY;
};

export const saveAdminGallery = (items: ApiGalleryItem[]): void => {
  try {
    localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save gallery to storage:', err);
  }
};

// ==========================================
// ROOM AMENITIES SEED DATA & STORAGE
// ==========================================
export const INITIAL_ROOM_AMENITIES: RoomAmenity[] = [
  {
    id: 1,
    name: 'High-Speed Wi-Fi 6',
    slug: 'high-speed-wi-fi-6',
    icon: 'wifi',
    description: 'Complimentary high-speed fiber wireless internet across all guest rooms and suites.',
    is_active: true,
    display_order: 1,
  },
  {
    id: 2,
    name: 'Scandinavian Breakfast Buffet',
    slug: 'scandinavian-breakfast-buffet',
    icon: 'coffee',
    description: 'Daily organic hot and cold buffet included with fresh bread and Nordic specialties.',
    is_active: true,
    display_order: 2,
  },
  {
    id: 3,
    name: 'Heated Pool & Sauna Access',
    slug: 'heated-pool-sauna-access',
    icon: 'waves',
    description: 'Complimentary access to our 28°C indoor pool, Finnish sauna, and relaxation lounge.',
    is_active: true,
    display_order: 3,
  },
  {
    id: 4,
    name: 'Hansgrohe Rain Shower',
    slug: 'hansgrohe-rain-shower',
    icon: 'bath',
    description: 'Spacious walk-in shower with Hansgrohe thermostatic mixer and luxury organic toiletries.',
    is_active: true,
    display_order: 4,
  },
  {
    id: 5,
    name: 'Sjöstrand Brass Espresso Machine',
    slug: 'sjostrand-brass-espresso-machine',
    icon: 'coffee',
    description: 'In-room Swedish brass espresso machine with organic compostable coffee capsules.',
    is_active: true,
    display_order: 5,
  },
  {
    id: 6,
    name: 'Solid Oak Workstation',
    slug: 'solid-oak-workstation',
    icon: 'bed',
    description: 'Ergonomic oak work desk with dedicated reading lamp and universal power hub.',
    is_active: true,
    display_order: 6,
  },
  {
    id: 7,
    name: 'Smart 4K UHD Display',
    slug: 'smart-4k-uhd-display',
    icon: 'tv',
    description: '43-inch 4K UHD smart screen with wireless casting, international channels, and Chromecast.',
    is_active: true,
    display_order: 7,
  },
  {
    id: 8,
    name: 'Waffle Robes & Slippers',
    slug: 'waffle-robes-slippers',
    icon: 'sparkles',
    description: 'Pure Swedish waffle bathrobes and soft terry slippers for optimal relaxation.',
    is_active: true,
    display_order: 8,
  },
  {
    id: 9,
    name: 'Silent Mini Refrigerator',
    slug: 'silent-mini-refrigerator',
    icon: 'snowflake',
    description: 'Quiet in-room refrigerator for keeping beverages and refreshments chilled.',
    is_active: true,
    display_order: 9,
  },
  {
    id: 10,
    name: 'Individual Climate Control',
    slug: 'individual-climate-control',
    icon: 'snowflake',
    description: 'Silent thermostatic temperature regulation with personalized heating and cooling.',
    is_active: true,
    display_order: 10,
  },
];

const ROOM_AMENITIES_STORAGE_KEY = 'nordic_gate_room_amenities_v1';

export const loadRoomAmenities = (): RoomAmenity[] => {
  try {
    const raw = localStorage.getItem(ROOM_AMENITIES_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to load room amenities from storage:', err);
  }
  return INITIAL_ROOM_AMENITIES;
};

export const saveRoomAmenities = (items: RoomAmenity[]): void => {
  try {
    localStorage.setItem(ROOM_AMENITIES_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save room amenities to storage:', err);
  }
};

// ==========================================
// ROOM TYPES SEED DATA & STORAGE
// ==========================================
export const INITIAL_ROOM_TYPES: RoomType[] = [
  {
    id: 1,
    name: 'Compact Double Room',
    slug: 'compact-double-room',
    description: 'Intimate and functional double room featuring modern Scandinavian minimalism, premium Queen bed, and private en-suite bathroom.',
    max_occupancy: 2,
    bed_configuration: { queen_bed: 1 },
    size_sqm: '14.00',
    amenities: 'High-Speed Wi-Fi 6, Scandinavian Breakfast Buffet, Heated Pool & Sauna Access, Hansgrohe Rain Shower, Smart 4K UHD Display, Individual Climate Control',
    amenity_ids: [1, 2, 3, 4, 7, 10],
    is_active: true,
    created_at: '2026-10-10 09:00',
    updated_at: '2026-10-24 11:20',
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
    amenity_ids: [1, 2, 3, 4, 6, 7],
    is_active: true,
    created_at: '2026-10-10 09:30',
    updated_at: '2026-10-24 11:45',
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
    amenity_ids: [1, 2, 3, 4, 6, 7, 9, 10],
    is_active: true,
    created_at: '2026-10-11 10:15',
    updated_at: '2026-10-25 14:10',
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
    amenity_ids: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    is_active: true,
    created_at: '2026-10-11 11:00',
    updated_at: '2026-10-26 16:30',
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
    amenity_ids: [1, 2, 3, 4, 7, 9, 10],
    is_active: true,
    created_at: '2026-10-12 14:00',
    updated_at: '2026-10-27 12:00',
  },
];

const ROOM_TYPES_STORAGE_KEY = 'nordic_gate_room_types_v1';

export const loadRoomTypes = (): RoomType[] => {
  try {
    const raw = localStorage.getItem(ROOM_TYPES_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to load room types from storage:', err);
  }
  return INITIAL_ROOM_TYPES;
};

export const saveRoomTypes = (items: RoomType[]): void => {
  try {
    localStorage.setItem(ROOM_TYPES_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save room types to storage:', err);
  }
};

// ==========================================
// PHYSICAL ROOMS SEED DATA & STORAGE
// ==========================================
export const INITIAL_ROOMS: PhysicalRoom[] = [
  // Floor 1
  {
    id: 1,
    room_number: '101',
    room_type: 1,
    room_type_name: 'Compact Double Room',
    floor: 1,
    status: 'active',
    notes: 'Ground floor west wing, quiet courtyard garden aspect.',
    created_at: '2026-10-15 08:30',
    updated_at: '2026-10-25 10:00',
  },
  {
    id: 2,
    room_number: '102',
    room_type: 2,
    room_type_name: 'Compact Twin Room',
    floor: 1,
    status: 'active',
    notes: 'Close to elevator and lobby entrance.',
    created_at: '2026-10-15 08:35',
    updated_at: '2026-10-25 10:05',
  },
  {
    id: 3,
    room_number: '103',
    room_type: 5,
    room_type_name: 'Family Room',
    floor: 1,
    status: 'active',
    notes: 'Spacious family layout directly adjacent to indoor heated pool hallway.',
    created_at: '2026-10-15 08:40',
    updated_at: '2026-10-26 09:15',
  },
  {
    id: 4,
    room_number: '104',
    room_type: 1,
    room_type_name: 'Compact Double Room',
    floor: 1,
    status: 'maintenance',
    notes: 'Scheduled thermostatic mixer inspection and routine paint touch-up.',
    created_at: '2026-10-15 08:45',
    updated_at: '2026-10-27 14:00',
  },
  {
    id: 5,
    room_number: '105',
    room_type: 2,
    room_type_name: 'Compact Twin Room',
    floor: 1,
    status: 'active',
    notes: 'Wheelchair-accessible doorway and adapted bathroom fixtures.',
    created_at: '2026-10-15 08:50',
    updated_at: '2026-10-25 10:20',
  },
  {
    id: 6,
    room_number: '106',
    room_type: 5,
    room_type_name: 'Family Room',
    floor: 1,
    status: 'active',
    notes: 'Extra crib space available upon advance guest request.',
    created_at: '2026-10-15 08:55',
    updated_at: '2026-10-25 10:25',
  },

  // Floor 2
  {
    id: 7,
    room_number: '201',
    room_type: 1,
    room_type_name: 'Compact Double Room',
    floor: 2,
    status: 'active',
    notes: 'Courtyard view with afternoon natural daylight.',
    created_at: '2026-10-15 09:00',
    updated_at: '2026-10-26 11:00',
  },
  {
    id: 8,
    room_number: '202',
    room_type: 2,
    room_type_name: 'Compact Twin Room',
    floor: 2,
    status: 'active',
    notes: 'Standard twin setup with double desk lamps.',
    created_at: '2026-10-15 09:05',
    updated_at: '2026-10-26 11:05',
  },
  {
    id: 9,
    room_number: '203',
    room_type: 3,
    room_type_name: 'Standard Twin Room',
    floor: 2,
    status: 'active',
    notes: 'Quiet position at the end of the east corridor.',
    created_at: '2026-10-15 09:10',
    updated_at: '2026-10-26 11:10',
  },
  {
    id: 10,
    room_number: '204',
    room_type: 3,
    room_type_name: 'Standard Twin Room',
    floor: 2,
    status: 'active',
    notes: 'Refreshed hardwood parquet and new reading chairs.',
    created_at: '2026-10-15 09:15',
    updated_at: '2026-10-26 11:15',
  },
  {
    id: 11,
    room_number: '205',
    room_type: 5,
    room_type_name: 'Family Room',
    floor: 2,
    status: 'active',
    notes: 'Family room with bunk beds; popular with weekend guests.',
    created_at: '2026-10-15 09:20',
    updated_at: '2026-10-26 11:20',
  },
  {
    id: 12,
    room_number: '206',
    room_type: 1,
    room_type_name: 'Compact Double Room',
    floor: 2,
    status: 'out_of_service',
    notes: 'Full flooring refurbishment and acoustic ceiling replacement.',
    created_at: '2026-10-15 09:25',
    updated_at: '2026-10-28 08:30',
  },

  // Floor 3
  {
    id: 13,
    room_number: '301',
    room_type: 4,
    room_type_name: 'Superior Double Room',
    floor: 3,
    status: 'active',
    notes: 'Bel étage superior room with bespoke King bed and lounge armchair.',
    created_at: '2026-10-15 09:30',
    updated_at: '2026-10-27 10:00',
  },
  {
    id: 14,
    room_number: '302',
    room_type: 4,
    room_type_name: 'Superior Double Room',
    floor: 3,
    status: 'active',
    notes: 'Spacious layout with double wardrobe and espresso bar.',
    created_at: '2026-10-15 09:35',
    updated_at: '2026-10-27 10:05',
  },
  {
    id: 15,
    room_number: '303',
    room_type: 3,
    room_type_name: 'Standard Twin Room',
    floor: 3,
    status: 'active',
    notes: 'Overlooks Gamla Tingstadsgatan boulevard.',
    created_at: '2026-10-15 09:40',
    updated_at: '2026-10-27 10:10',
  },
  {
    id: 16,
    room_number: '304',
    room_type: 1,
    room_type_name: 'Compact Double Room',
    floor: 3,
    status: 'active',
    notes: 'Standard double configuration on mid-floor.',
    created_at: '2026-10-15 09:45',
    updated_at: '2026-10-27 10:15',
  },
  {
    id: 17,
    room_number: '305',
    room_type: 2,
    room_type_name: 'Compact Twin Room',
    floor: 3,
    status: 'maintenance',
    notes: 'Window insulation seal replacement by engineering team.',
    created_at: '2026-10-15 09:50',
    updated_at: '2026-10-28 13:00',
  },

  // Floor 4
  {
    id: 18,
    room_number: '401',
    room_type: 4,
    room_type_name: 'Superior Double Room',
    floor: 4,
    status: 'active',
    notes: 'Quiet high floor superior room with panoramic city view.',
    created_at: '2026-10-15 10:00',
    updated_at: '2026-10-27 15:00',
  },
  {
    id: 19,
    room_number: '402',
    room_type: 4,
    room_type_name: 'Superior Double Room',
    floor: 4,
    status: 'active',
    notes: 'Includes Hansgrohe rain shower and waffle robes.',
    created_at: '2026-10-15 10:05',
    updated_at: '2026-10-27 15:05',
  },
  {
    id: 20,
    room_number: '403',
    room_type: 3,
    room_type_name: 'Standard Twin Room',
    floor: 4,
    status: 'active',
    notes: 'East side with morning sunlight.',
    created_at: '2026-10-15 10:10',
    updated_at: '2026-10-27 15:10',
  },
  {
    id: 21,
    room_number: '404',
    room_type: 1,
    room_type_name: 'Compact Double Room',
    floor: 4,
    status: 'active',
    notes: 'High floor compact double room.',
    created_at: '2026-10-15 10:15',
    updated_at: '2026-10-27 15:15',
  },

  // Floor 5
  {
    id: 22,
    room_number: '501',
    room_type: 4,
    room_type_name: 'Superior Double Room',
    floor: 5,
    status: 'active',
    notes: 'Top floor suite with vaulted ceilings and Gothenburg skyline views.',
    created_at: '2026-10-15 10:30',
    updated_at: '2026-10-28 09:00',
  },
  {
    id: 23,
    room_number: '502',
    room_type: 4,
    room_type_name: 'Superior Double Room',
    floor: 5,
    status: 'active',
    notes: 'Top floor penthouse placement with premium espresso bar.',
    created_at: '2026-10-15 10:35',
    updated_at: '2026-10-28 09:05',
  },
  {
    id: 24,
    room_number: '503',
    room_type: 3,
    room_type_name: 'Standard Twin Room',
    floor: 5,
    status: 'active',
    notes: 'Quiet top-floor twin room away from elevators.',
    created_at: '2026-10-15 10:40',
    updated_at: '2026-10-28 09:10',
  },
  {
    id: 25,
    room_number: '504',
    room_type: 3,
    room_type_name: 'Standard Twin Room',
    floor: 5,
    status: 'active',
    notes: 'Panoramic north view across Gothenburg harbor waters.',
    created_at: '2026-10-15 10:45',
    updated_at: '2026-10-28 09:15',
  },
];

const ROOMS_STORAGE_KEY = 'nordic_gate_physical_rooms_v1';

export const loadRooms = (): PhysicalRoom[] => {
  try {
    const raw = localStorage.getItem(ROOMS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to load physical rooms from storage:', err);
  }
  return INITIAL_ROOMS;
};

export const saveRooms = (items: PhysicalRoom[]): void => {
  try {
    localStorage.setItem(ROOMS_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save physical rooms to storage:', err);
  }
};

