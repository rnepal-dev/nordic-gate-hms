import { AdminFaq } from '../features/admin/faqs/faqTypes';
import { HOTEL_FAQS } from './propertyData';

// Generate rich initial FAQ records from real HOTEL_FAQS
export const INITIAL_ADMIN_FAQS: AdminFaq[] = [
  {
    id: 'faq-1',
    category: 'check_in_out',
    questionEn: HOTEL_FAQS[0].qEn,
    questionSv: HOTEL_FAQS[0].qSv,
    answerEn: HOTEL_FAQS[0].aEn,
    answerSv: HOTEL_FAQS[0].aSv,
    displayOrder: 1,
    status: 'published',
    updatedAt: '2026-10-24 14:30',
    author: 'Astrid Lindgren',
  },
  {
    id: 'faq-2',
    category: 'dining',
    questionEn: HOTEL_FAQS[1].qEn,
    questionSv: HOTEL_FAQS[1].qSv,
    answerEn: HOTEL_FAQS[1].aEn,
    answerSv: HOTEL_FAQS[1].aSv,
    displayOrder: 2,
    status: 'published',
    updatedAt: '2026-10-25 09:15',
    author: 'Henrik Larsson',
  },
  {
    id: 'faq-3',
    category: 'wellness',
    questionEn: HOTEL_FAQS[2].qEn,
    questionSv: HOTEL_FAQS[2].qSv,
    answerEn: HOTEL_FAQS[2].aEn,
    answerSv: HOTEL_FAQS[2].aSv,
    displayOrder: 3,
    status: 'published',
    updatedAt: '2026-10-25 11:20',
    author: 'Astrid Lindgren',
  },
  {
    id: 'faq-4',
    category: 'parking',
    questionEn: HOTEL_FAQS[3].qEn,
    questionSv: HOTEL_FAQS[3].qSv,
    answerEn: HOTEL_FAQS[3].aEn,
    answerSv: HOTEL_FAQS[3].aSv,
    displayOrder: 4,
    status: 'published',
    updatedAt: '2026-10-25 16:40',
    author: 'Admin Staff',
  },
  {
    id: 'faq-5',
    category: 'pets',
    questionEn: HOTEL_FAQS[4].qEn,
    questionSv: HOTEL_FAQS[4].qSv,
    answerEn: HOTEL_FAQS[4].aEn,
    answerSv: HOTEL_FAQS[4].aSv,
    displayOrder: 5,
    status: 'published',
    updatedAt: '2026-10-26 08:05',
    author: 'Reception Team',
  },
  {
    id: 'faq-6',
    category: 'general',
    questionEn: HOTEL_FAQS[5].qEn,
    questionSv: HOTEL_FAQS[5].qSv,
    answerEn: HOTEL_FAQS[5].aEn,
    answerSv: HOTEL_FAQS[5].aSv,
    displayOrder: 6,
    status: 'published',
    updatedAt: '2026-10-26 12:10',
    author: 'Henrik Larsson',
  },
  {
    id: 'faq-7',
    category: 'policies',
    questionEn: HOTEL_FAQS[6].qEn,
    questionSv: HOTEL_FAQS[6].qSv,
    answerEn: HOTEL_FAQS[6].aEn,
    answerSv: HOTEL_FAQS[6].aSv,
    displayOrder: 7,
    status: 'published',
    updatedAt: '2026-10-26 15:30',
    author: 'Finance Director',
  },
  {
    id: 'faq-8',
    category: 'pets',
    questionEn: HOTEL_FAQS[7].qEn,
    questionSv: HOTEL_FAQS[7].qSv,
    answerEn: HOTEL_FAQS[7].aEn,
    answerSv: HOTEL_FAQS[7].aSv,
    displayOrder: 8,
    status: 'draft',
    updatedAt: '2026-10-27 10:00',
    author: 'Front Desk',
  },
  {
    id: 'faq-9',
    category: 'general',
    questionEn: 'Do you offer luggage storage before check-in or after check-out?',
    questionSv: 'Erbjuder ni bagageförvaring före incheckning eller efter utcheckning?',
    answerEn: 'Yes, secure luggage storage is available free of charge at the reception 24 hours a day.',
    answerSv: 'Ja, kostnadsfri och låst bagageförvaring finns i receptionen dygnet runt.',
    displayOrder: 9,
    status: 'published',
    updatedAt: '2026-10-27 14:15',
    author: 'Front Desk',
  },
  {
    id: 'faq-10',
    category: 'dining',
    questionEn: 'Are children allowed in the bar area in the evening?',
    questionSv: 'Är barn tillåtna i barområdet under kvällstid?',
    answerEn: 'Families are welcome to dine and enjoy non-alcoholic beverages in the lounge and bar until 21:00.',
    answerSv: 'Familjer är välkomna att äta och avnjuta alkoholfria drycker i loungen och baren fram till kl. 21:00.',
    displayOrder: 10,
    status: 'draft',
    updatedAt: '2026-10-27 17:00',
    author: 'Bar Manager',
  },
];

// Helper to load and save FAQs to localStorage for live interactive CRUD feel
const FAQ_STORAGE_KEY = 'nordic_gate_admin_faqs';

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

// Summary metrics for Admin Dashboard
export interface AdminDashboardMetrics {
  totalRooms: number;
  activeRooms: number;
  totalFaqs: number;
  publishedFaqs: number;
  diningItems: number;
  mediaAssets: number;
  lastUpdated: string;
}

export const ADMIN_DASHBOARD_METRICS: AdminDashboardMetrics = {
  totalRooms: 5,
  activeRooms: 5,
  totalFaqs: 10,
  publishedFaqs: 8,
  diningItems: 24,
  mediaAssets: 38,
  lastUpdated: 'Today at 17:00 CET',
};
