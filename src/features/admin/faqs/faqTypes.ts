import { StatusType } from '../../../components/ui/StatusBadge';

export type FaqCategory =
  | 'general'
  | 'check_in_out'
  | 'dining'
  | 'wellness'
  | 'parking'
  | 'pets'
  | 'policies';

export interface AdminFaq {
  id: string;
  category: FaqCategory;
  questionEn: string;
  questionSv: string;
  answerEn: string;
  answerSv: string;
  displayOrder: number;
  status: StatusType;
  updatedAt: string;
  author?: string;
}

export const FAQ_CATEGORIES: { value: FaqCategory; labelEn: string; labelSv: string }[] = [
  { value: 'general', labelEn: 'General & Location', labelSv: 'Allmänt & Läge' },
  { value: 'check_in_out', labelEn: 'Check-in & Check-out', labelSv: 'In- & Utcheckning' },
  { value: 'dining', labelEn: 'Breakfast & Dining', labelSv: 'Frukost & Mat' },
  { value: 'wellness', labelEn: 'Pool & Wellness', labelSv: 'Pool & Relax' },
  { value: 'parking', labelEn: 'Parking & Transport', labelSv: 'Parkering & Transport' },
  { value: 'pets', labelEn: 'Pets & Families', labelSv: 'Husdjur & Familj' },
  { value: 'policies', labelEn: 'Policies & Payments', labelSv: 'Regler & Betalning' },
];
