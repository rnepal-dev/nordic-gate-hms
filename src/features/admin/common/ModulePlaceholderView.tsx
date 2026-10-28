import React from 'react';
import {
  BedDouble,
  UtensilsCrossed,
  Wine,
  Sparkles,
  MessageSquareQuote,
  Waves,
  Tag,
  Image as ImageIcon,
  BookOpen,
  PhoneCall,
  ShieldAlert,
  Settings,
  Plus,
  Edit2,
  ExternalLink,
  CheckCircle,
} from 'lucide-react';
import { useHotel } from '../../../context/HotelContext';
import { AdminPageHeader } from '../../../components/admin/AdminPageHeader';
import { Button } from '../../../components/ui/Button';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { useToast } from '../../../components/ui/Toast';

export interface ModuleConfig {
  title: string;
  subtitle: string;
  moduleKey: string;
  icon: React.ReactNode;
  publicRoute?: string;
  items: {
    id: string;
    title: string;
    secondary: string;
    badge?: string;
    status: 'published' | 'draft' | 'archived';
    updatedAt: string;
  }[];
}

const MODULE_CONFIGS: Record<string, ModuleConfig> = {
  rooms: {
    title: 'Rooms & Suites Management',
    subtitle: 'Manage hotel room categories, pricing, bed configurations, square meters, and amenity lists.',
    moduleKey: 'rooms',
    icon: <BedDouble className="w-5 h-5 text-[#BF8641]" />,
    publicRoute: '/rooms',
    items: [
      {
        id: 'room-1',
        title: 'Compact Double Room',
        secondary: '14 m² · 1 Queen Bed · Max 2 guests · Private bathroom & TV',
        badge: '1 295 SEK/night',
        status: 'published',
        updatedAt: '2026-10-26 14:00',
      },
      {
        id: 'room-2',
        title: 'Compact Twin Room',
        secondary: '14 m² · 2 Single Beds (90cm) · Max 2 guests · Desk & Free Wi-Fi',
        badge: '1 295 SEK/night',
        status: 'published',
        updatedAt: '2026-10-26 14:15',
      },
      {
        id: 'room-3',
        title: 'Standard Twin Room',
        secondary: '18 m² · 2 Twin Beds · Max 2 guests · Armchair & Coffee station',
        badge: '1 495 SEK/night',
        status: 'published',
        updatedAt: '2026-10-26 14:30',
      },
      {
        id: 'room-4',
        title: 'Superior Double Room',
        secondary: '22 m² · King Bed · Max 2 guests · Lounge seating & Bathrobes',
        badge: '1 795 SEK/night',
        status: 'published',
        updatedAt: '2026-10-26 15:00',
      },
      {
        id: 'room-5',
        title: 'Family Room',
        secondary: '25 m² · Double Bed + Bunk Bed · Max 4 guests · Family-friendly layout',
        badge: '2 195 SEK/night',
        status: 'published',
        updatedAt: '2026-10-26 15:30',
      },
    ],
  },
  dining: {
    title: 'Restaurant & Dining Management',
    subtitle: 'Configure Scandinavian organic breakfast buffet details, dinner menus, and dietary options.',
    moduleKey: 'dining',
    icon: <UtensilsCrossed className="w-5 h-5 text-[#BF8641]" />,
    publicRoute: '/dining',
    items: [
      {
        id: 'dining-1',
        title: 'Organic Scandinavian Breakfast Buffet',
        secondary: '06:30 – 10:00 (Weekdays) · 07:30 – 11:00 (Weekends) · Complimentary for guests',
        badge: 'Buffet',
        status: 'published',
        updatedAt: '2026-10-25 10:00',
      },
      {
        id: 'dining-2',
        title: 'Evening A La Carte Nordic Bistro',
        secondary: '17:30 – 22:00 · Seasonal West Coast fish, Swedish meatballs, vegetarian options',
        badge: 'Dinner',
        status: 'published',
        updatedAt: '2026-10-25 11:30',
      },
      {
        id: 'dining-3',
        title: 'Dietary Options & Allergens Guidance',
        secondary: 'Dedicated gluten-free bread corner, oat milk, vegan cheeses, and nut-safe prep',
        badge: 'Allergens',
        status: 'published',
        updatedAt: '2026-10-25 12:00',
      },
    ],
  },
  bar: {
    title: 'Bar & Drinks Management',
    subtitle: 'Manage lounge cocktails, local Gothenburg craft breweries, wine selections, and bar snacks.',
    moduleKey: 'bar',
    icon: <Wine className="w-5 h-5 text-[#BF8641]" />,
    publicRoute: '/bar',
    items: [
      {
        id: 'bar-1',
        title: 'Nordic Botanical Gin & Tonic',
        secondary: 'Stockholms Bränneri Dry Gin, Lingonberry tonic, fresh rosemary · 165 SEK',
        badge: 'Signature',
        status: 'published',
        updatedAt: '2026-10-26 17:00',
      },
      {
        id: 'bar-2',
        title: 'Gothenburg Craft Beer Selection',
        secondary: 'Stigbergets Brewery IPA, Poppels Session IPA on draught · 98 SEK',
        badge: 'Craft Beer',
        status: 'published',
        updatedAt: '2026-10-26 17:15',
      },
      {
        id: 'bar-3',
        title: 'Artisanal Bar Snacks & Charcuterie',
        secondary: 'Swedish Västerbottensost crostini, smoked almonds, cured elk sausage · 85 SEK',
        badge: 'Snacks',
        status: 'published',
        updatedAt: '2026-10-26 17:30',
      },
    ],
  },
  facilities: {
    title: 'Facilities & Amenities Management',
    subtitle: 'Maintain public records for hotel facilities, opening times, accessibility, and partners.',
    moduleKey: 'facilities',
    icon: <Sparkles className="w-5 h-5 text-[#BF8641]" />,
    publicRoute: '/faq',
    items: [
      {
        id: 'fac-1',
        title: 'Heated Indoor Swimming Pool',
        secondary: '06:00 – 22:00 Daily · 28°C temperature · Accessible entrance steps',
        badge: 'On-site',
        status: 'published',
        updatedAt: '2026-10-24 16:00',
      },
      {
        id: 'fac-2',
        title: 'Finnish Sauna & Relaxation Room',
        secondary: 'Separate men & women sections + communal family hours',
        badge: 'Wellness',
        status: 'published',
        updatedAt: '2026-10-24 16:30',
      },
      {
        id: 'fac-3',
        title: 'Local Partner Gym Partnership',
        secondary: 'Full gym access located 4-minute walk away · Free pass from front desk',
        badge: 'Partner',
        status: 'published',
        updatedAt: '2026-10-24 17:00',
      },
    ],
  },
  testimonials: {
    title: 'Guest Testimonials & Reviews',
    subtitle: 'Curate authentic guest reviews, star ratings, and quotes displayed on the website.',
    moduleKey: 'testimonials',
    icon: <MessageSquareQuote className="w-5 h-5 text-[#BF8641]" />,
    items: [
      {
        id: 'rev-1',
        title: '“Outstanding breakfast and seamless transit into central Gothenburg”',
        secondary: 'Erik S., Stockholm · Verified Guest · 5/5 Stars',
        badge: 'Featured',
        status: 'published',
        updatedAt: '2026-10-26 09:00',
      },
      {
        id: 'rev-2',
        title: '“The indoor pool was a huge hit with the kids after a day at Liseberg”',
        secondary: 'Karin & Johan M., Oslo · Family Room Stay · 5/5 Stars',
        badge: 'Family',
        status: 'published',
        updatedAt: '2026-10-25 18:20',
      },
    ],
  },
  spa: {
    title: 'Spa & Wellness Management',
    subtitle: 'Manage pool hours, sauna protocols, jacuzzi maintenance notices, and wellness guidelines.',
    moduleKey: 'spa',
    icon: <Waves className="w-5 h-5 text-[#BF8641]" />,
    publicRoute: '/spa',
    items: [
      {
        id: 'spa-1',
        title: 'Indoor Pool & Hot Tub Facilities',
        secondary: 'Opening hours 06:00 – 22:00 · Towels available poolside for hotel guests',
        badge: 'Pool Area',
        status: 'published',
        updatedAt: '2026-10-24 14:00',
      },
      {
        id: 'spa-2',
        title: 'Nordic Sauna Rituals & Schedule',
        secondary: 'Evening aromatherapy infusion sessions on Friday & Saturday at 18:00',
        badge: 'Sauna',
        status: 'published',
        updatedAt: '2026-10-24 14:30',
      },
    ],
  },
  offers: {
    title: 'Offers & Packages Management',
    subtitle: 'Create promotional stays, Liseberg packages, weekend getaways, and seasonal deals.',
    moduleKey: 'offers',
    icon: <Tag className="w-5 h-5 text-[#BF8641]" />,
    items: [
      {
        id: 'offer-1',
        title: 'Gothenburg Weekend Explorer Package',
        secondary: 'Includes 2 nights, organic breakfast, 24h city transit card, and welcome drink',
        badge: 'Package',
        status: 'published',
        updatedAt: '2026-10-25 13:00',
      },
      {
        id: 'offer-2',
        title: 'Liseberg Amusement Park Family Deal',
        secondary: 'Family room stay + pool access + flexible cancellation',
        badge: 'Seasonal',
        status: 'published',
        updatedAt: '2026-10-25 13:30',
      },
    ],
  },
  gallery: {
    title: 'Gallery & Media Management',
    subtitle: 'Upload and organize high-resolution hotel photography, room photos, and Gothenburg visuals.',
    moduleKey: 'gallery',
    icon: <ImageIcon className="w-5 h-5 text-[#BF8641]" />,
    items: [
      {
        id: 'med-1',
        title: 'Hotel Exterior & Entrance Twilight',
        secondary: 'High-res WebP · 2400x1600 · Gamla Tingstadsgatan 1',
        badge: 'Hero Image',
        status: 'published',
        updatedAt: '2026-10-23 11:00',
      },
      {
        id: 'med-2',
        title: 'Superior Double King Bed & Nordic Armchair',
        secondary: 'Interior lighting · Plus Jakarta Sans palette harmony',
        badge: 'Rooms',
        status: 'published',
        updatedAt: '2026-10-23 11:30',
      },
      {
        id: 'med-3',
        title: 'Scandinavian Breakfast Spread & Coffee',
        secondary: 'Fresh pastries, organic fruit, West Coast seafood selection',
        badge: 'Dining',
        status: 'published',
        updatedAt: '2026-10-23 12:00',
      },
    ],
  },
  about: {
    title: 'About Hotel & Our Story',
    subtitle: 'Manage hotel heritage, Scandinavian hospitality values, and Gothenburg neighborhood information.',
    moduleKey: 'about',
    icon: <BookOpen className="w-5 h-5 text-[#BF8641]" />,
    publicRoute: '/our-story',
    items: [
      {
        id: 'abt-1',
        title: 'Our Story & Brand Philosophy',
        secondary: 'Warm Nordic hospitality, sustainable practices, and accessible city convenience',
        badge: 'Story',
        status: 'published',
        updatedAt: '2026-10-22 10:00',
      },
      {
        id: 'abt-2',
        title: 'Sustainability & Organic Commitments',
        secondary: 'Certified organic breakfast components, energy-efficient LED, waste reduction',
        badge: 'Eco',
        status: 'published',
        updatedAt: '2026-10-22 10:30',
      },
    ],
  },
  contact: {
    title: 'Contact & Hotel Information',
    subtitle: 'Manage public phone numbers, reception email, street address, and transit directions.',
    moduleKey: 'contact',
    icon: <PhoneCall className="w-5 h-5 text-[#BF8641]" />,
    items: [
      {
        id: 'cnt-1',
        title: 'Front Desk & General Inquiries',
        secondary: 'Phone: +46 (0)31 772 80 00 · Email: info@hotelnordicgate.se · Open 24/7',
        badge: 'Direct Line',
        status: 'published',
        updatedAt: '2026-10-21 16:00',
      },
      {
        id: 'cnt-2',
        title: 'Address & Transit Instructions',
        secondary: 'Gamla Tingstadsgatan 1, 402 76 Göteborg · Balladgatan Bus Stop directly opposite',
        badge: 'Location',
        status: 'published',
        updatedAt: '2026-10-21 16:30',
      },
    ],
  },
  policies: {
    title: 'Hotel Policies Management',
    subtitle: 'Manage cash-free payment policy, check-in rules, cancellation windows, and pet terms.',
    moduleKey: 'policies',
    icon: <ShieldAlert className="w-5 h-5 text-[#BF8641]" />,
    items: [
      {
        id: 'pol-1',
        title: 'Cash-Free Payment Policy',
        secondary: 'Hotel Nordic Gate is entirely cash-free. Major credit/debit cards accepted.',
        badge: 'Payment',
        status: 'published',
        updatedAt: '2026-10-20 12:00',
      },
      {
        id: 'pol-2',
        title: 'Check-In & Check-Out Policy',
        secondary: 'Check-in from 15:00 to 23:00. Check-out from 06:00 to 11:00.',
        badge: 'Timings',
        status: 'published',
        updatedAt: '2026-10-20 12:30',
      },
      {
        id: 'pol-3',
        title: 'Pet Policy & Cleaning Surcharge',
        secondary: 'Pets welcome upon advance notice in designated pet rooms. Surcharge applies.',
        badge: 'Pets',
        status: 'published',
        updatedAt: '2026-10-20 13:00',
      },
    ],
  },
  settings: {
    title: 'Website & CMS Settings',
    subtitle: 'Manage primary hotel branding, SEO meta defaults, contact emails, and localization.',
    moduleKey: 'settings',
    icon: <Settings className="w-5 h-5 text-[#BF8641]" />,
    items: [
      {
        id: 'set-1',
        title: 'Site Identity & Brand Typography',
        secondary: 'Hotel Nordic Gate · Plus Jakarta Sans font family · Gothenburg, Sweden',
        badge: 'Branding',
        status: 'published',
        updatedAt: '2026-10-27 18:00',
      },
      {
        id: 'set-2',
        title: 'Bilingual Localization Settings',
        secondary: 'Default: Svenska (SV) · Secondary: English (EN) · Currency: SEK',
        badge: 'i18n',
        status: 'published',
        updatedAt: '2026-10-27 18:15',
      },
      {
        id: 'set-3',
        title: 'Booking Engine Linkage',
        secondary: 'Connected to client-side reservation state with live SEK pricing calculations',
        badge: 'Booking Engine',
        status: 'published',
        updatedAt: '2026-10-27 18:30',
      },
    ],
  },
};

export const ModulePlaceholderView: React.FC<{ moduleKey: string }> = ({
  moduleKey,
}) => {
  const { navigate } = useHotel();
  const { showToast } = useToast();

  const config = MODULE_CONFIGS[moduleKey] || {
    title: `${moduleKey.charAt(0).toUpperCase() + moduleKey.slice(1)} Management`,
    subtitle: 'Content module workspace.',
    moduleKey,
    icon: <Settings className="w-5 h-5 text-[#BF8641]" />,
    items: [],
  };

  const handleActionToast = (itemTitle: string) => {
    showToast({
      type: 'info',
      title: 'Editor Ready',
      message: `Opened editor for "${itemTitle}". Live CRUD wiring ready.`,
    });
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={config.title}
        subtitle={config.subtitle}
        badge={
          <span className="text-xs font-bold px-2.5 py-1 bg-[#BF8641]/15 text-[#BF8641] rounded-full">
            {config.items.length} Items
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            {config.publicRoute && (
              <Button
                variant="outline"
                size="md"
                leftIcon={<ExternalLink className="w-4 h-4" />}
                onClick={() => navigate(config.publicRoute!)}
              >
                View on Website
              </Button>
            )}
            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() =>
                showToast({
                  type: 'info',
                  title: 'Create Item',
                  message: `New item creation modal opened for ${config.title}.`,
                })
              }
            >
              Add New Item
            </Button>
          </div>
        }
      />

      <div className="bg-white rounded-xl border border-[#EDE7DC] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#EDE7DC] bg-[#F8F5EF]/50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-[#0D1A26]">
            {config.icon}
            <span>Published Records & Drafts</span>
          </div>
          <span className="text-[11px] text-[#5D6B78]">
            Showing {config.items.length} records
          </span>
        </div>

        <div className="divide-y divide-[#EDE7DC]/70">
          {config.items.map((item) => (
            <div
              key={item.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F8F5EF]/40 transition-colors"
            >
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-bold text-[#0D1A26]">
                    {item.title}
                  </h3>
                  {item.badge && (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#EDE7DC] text-[#0D1A26]">
                      {item.badge}
                    </span>
                  )}
                  <StatusBadge status={item.status} />
                </div>
                <p className="text-xs text-[#5D6B78] leading-relaxed">
                  {item.secondary}
                </p>
                <p className="text-[10px] text-stone-400">
                  Last updated {item.updatedAt}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Edit2 className="w-3.5 h-3.5" />}
                  onClick={() => handleActionToast(item.title)}
                >
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
