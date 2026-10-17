import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext.tsx';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  qEn: string;
  qSv: string;
  aEn: string;
  aSv: string;
}

interface FaqAccordionProps {
  faqs: FaqItem[];
  title?: string;
}

export const FaqAccordion: React.FC<FaqAccordionProps> = ({ faqs, title }) => {
  const { lang } = useHotel();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#EDE7DC] p-6 lg:p-8 shadow-sm space-y-6">
      <div>
        <span className="text-xs uppercase tracking-[0.2em] text-[#BF8641] font-semibold">
          {lang === 'sv' ? 'Vanliga Frågor' : 'Questions & Answers'}
        </span>
        <h3 className="font-serif text-2xl lg:text-3xl text-[#02070D] mt-1 font-bold">
          {title || (lang === 'sv' ? 'Vanliga frågor inför din vistelse' : 'Frequently Asked Questions')}
        </h3>
      </div>

      <div className="divide-y divide-[#EDE7DC]">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div key={idx} className="py-4">
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full flex items-center justify-between text-left gap-4 font-serif text-base lg:text-lg font-bold text-[#02070D] hover:text-[#BF8641] transition-colors cursor-pointer"
                aria-expanded={isOpen}
              >
                <span>{lang === 'sv' ? faq.qSv : faq.qEn}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#BF8641] shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="mt-3 text-xs lg:text-sm text-[#25303A] leading-relaxed pl-1 bg-[#F8F5EF] p-4 rounded-xl border border-[#EDE7DC]">
                  {lang === 'sv' ? faq.aSv : faq.aEn}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
