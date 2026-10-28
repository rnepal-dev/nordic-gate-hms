import type { AuthUser, LoginRole } from '../types/hotel.ts';

export interface DemoLoginPreset {
  role: LoginRole;
  labelSv: string;
  labelEn: string;
  badgeSv: string;
  badgeEn: string;
  descSv: string;
  descEn: string;
  defaultEmail: string;
  defaultPassword: string;
  user: AuthUser;
  destination: string;
  destinationLabelSv: string;
  destinationLabelEn: string;
}

export const DEMO_LOGIN_PRESETS: Record<LoginRole, DemoLoginPreset> = {
  guest: {
    role: 'guest',
    labelSv: 'Gäst / Privatperson',
    labelEn: 'Guest / Traveler',
    badgeSv: 'Gästportal',
    badgeEn: 'Guest Portal',
    descSv: 'Få tillgång till din hotellvistelse, ankomstönskemål, kuddmeny och digitalt kvitto.',
    descEn: 'Access your reservation details, arrival preferences, pillow menu, and digital folios.',
    defaultEmail: 'carl.linne@goteborg.se',
    defaultPassword: 'NordicGate2026!',
    destination: '/guest',
    destinationLabelSv: 'Mina Sidor · Gästportal',
    destinationLabelEn: 'My Stays · Guest Portal',
    user: {
      id: 'guest-carl',
      name: 'Carl von Linné',
      email: 'carl.linne@goteborg.se',
      role: 'guest',
      roleTitle: 'Boende Gäst · Göteborg',
      badge: 'Gästkonto',
      bookingRef: 'SH-88492',
      roomNumber: '301',
      lastLogin: 'Idag, 18:45',
    },
  },
  front_desk: {
    role: 'front_desk',
    labelSv: 'Reception / Front Desk',
    labelEn: 'Front Desk / Reception',
    badgeSv: 'Reception & Service',
    badgeEn: 'Front Desk & Service',
    descSv: 'Hantera in- & utcheckningar, rumsnycklar, betalningar och daglig gästservice.',
    descEn: 'Manage daily arrivals, guest check-in/out, key cards, and reception services.',
    defaultEmail: 'reception@nordicgate.se',
    defaultPassword: 'FrontDesk2026!',
    destination: '/app',
    destinationLabelSv: 'HMS · Receptionspanel',
    destinationLabelEn: 'HMS · Front Desk Console',
    user: {
      id: 'staff-3',
      name: 'Klara Sjöstrand',
      email: 'reception@nordicgate.se',
      role: 'front_desk',
      roleTitle: 'Front Desk Lead / Receptionist',
      badge: 'Receptionist',
      department: 'Front Office',
      lastLogin: 'Idag, 19:10',
    },
  },
  admin: {
    role: 'admin',
    labelSv: 'Hotellchef / Administratör',
    labelEn: 'Admin / General Manager',
    badgeSv: 'Administration & HMS',
    badgeEn: 'Management & HMS',
    descSv: 'Översikt över fastighetens beläggning, RevPAR, ADR, städledning och bokningsflöden.',
    descEn: 'Comprehensive overview of property occupancy, RevPAR, ADR, housekeeping, and revenue.',
    defaultEmail: 'admin@nordicgate.se',
    defaultPassword: 'AdminGate2026!',
    destination: '/admin',
    destinationLabelSv: 'CMS · Webbplatsadministration & CMS',
    destinationLabelEn: 'CMS · Website Admin & Content Management',
    user: {
      id: 'staff-1',
      name: 'Astrid Lindqvist',
      email: 'admin@nordicgate.se',
      role: 'admin',
      roleTitle: 'Hotelldirektör / Hotellägare',
      badge: 'Super Admin',
      department: 'Executive Management',
      lastLogin: 'Idag, 19:15',
    },
  },
};
