import { AdminFaq } from '../features/admin/faqs/faqTypes';
import { ApiFacilityItem, getCategoryDisplay } from '../features/admin/facilities/facilityTypes';
import { ApiGalleryItem, getGalleryCategoryDisplay, getRoomTypeName } from '../features/admin/gallery/galleryTypes';
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
