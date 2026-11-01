import React from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  LogIn, 
  LogOut, 
  Bus, 
  Car, 
  ShieldCheck, 
  ExternalLink 
} from 'lucide-react';
import { useHotel } from '../../context/HotelContext.tsx';
import { HOTEL_NORDIC_GATE_PROPERTY } from '../../data/propertyData.ts';

export const ContactInformation: React.FC = () => {
  const { lang } = useHotel();
  const address = HOTEL_NORDIC_GATE_PROPERTY.address;
  const contact = HOTEL_NORDIC_GATE_PROPERTY.contact;

  return (
    <div className="bg-[#0D1A26] text-[#F8F5EF] rounded-2xl p-7 sm:p-9 border border-[#25303A] shadow-lg flex flex-col justify-between h-full">
      <div className="space-y-8">
        {/* Header / Brand identity */}
        <div>
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#BF8641] block mb-2">
            {lang === 'sv' ? 'Hotellinformation & Gästservice' : 'Hotel Information & Guest Concierge'}
          </span>
          <h2 className="font-brand-logo text-2xl sm:text-3xl text-white tracking-wide">
            Hotel Nordic Gate
          </h2>
          <p className="text-xs text-[#D3C8B9] mt-1 tracking-wider uppercase">
            Göteborg · {address.district.value}
          </p>
          <p className="text-xs sm:text-sm text-[#D3C8B9] mt-3 leading-relaxed">
            {lang === 'sv'
              ? 'Vår reception och gästservice på Gamla Tingstadsgatan är bemannad dygnet runt. Vi hjälper gärna till med rumsbokningar, transportråd och särskilda önskemål.'
              : 'Our front desk and concierge team on Gamla Tingstadsgatan are on duty 24/7. We are pleased to assist with reservations, transit advice, and bespoke stay arrangements.'}
          </p>
        </div>

        {/* Direct Contact Channels */}
        <div className="space-y-4 pt-2">
          {/* Address */}
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#BF8641] shrink-0 mt-0.5">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#D3C8B9]">
                {lang === 'sv' ? 'Besöksadress' : 'Physical Address'}
              </p>
              <p className="text-sm font-medium text-white mt-0.5">
                {address.street.value}
              </p>
              <p className="text-xs text-[#D3C8B9]/80">
                {address.postalCode.value} {address.city.value}, {address.country.value}
              </p>
            </div>
          </div>

          {/* Telephone */}
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#BF8641] shrink-0 mt-0.5">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#D3C8B9]">
                {lang === 'sv' ? 'Telefon (Reception dygnet runt)' : 'Telephone (24/7 Front Desk)'}
              </p>
              <a 
                href={`tel:${contact.phone.value.replace(/[^+\d]/g, '')}`}
                className="text-sm font-medium text-white hover:text-[#F2C777] transition-colors mt-0.5 inline-block"
              >
                {contact.phone.value}
              </a>
              <p className="text-[11px] text-[#D3C8B9]/70">
                {lang === 'sv' ? 'Direktlinje till reception & incheckning' : 'Direct line for reception & arrivals'}
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#BF8641] shrink-0 mt-0.5">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#D3C8B9]">
                {lang === 'sv' ? 'E-post' : 'Electronic Mail'}
              </p>
              <a 
                href={`mailto:${contact.email.value}`}
                className="text-sm font-medium text-white hover:text-[#F2C777] transition-colors mt-0.5 inline-block"
              >
                {contact.email.value}
              </a>
              <p className="text-[11px] text-[#D3C8B9]/70">
                info@hotelnordicgate.se · {lang === 'sv' ? 'Besvaras dagligen' : 'Inquiries answered daily'}
              </p>
            </div>
          </div>

          {/* Reception Hours */}
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#BF8641] shrink-0 mt-0.5">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#D3C8B9]">
                {lang === 'sv' ? 'Receptionens öppettider' : 'Reception Hours'}
              </p>
              <p className="text-sm font-medium text-white mt-0.5">
                {lang === 'sv' ? 'Öppet dygnet runt (24/7)' : 'Open 24 hours daily (24/7)'}
              </p>
              <p className="text-[11px] text-[#D3C8B9]/70">
                {lang === 'sv' ? 'Nattportier i tjänst från kl. 23:00' : 'Night porter on active duty from 23:00'}
              </p>
            </div>
          </div>
        </div>

        {/* Check-In / Check-Out Times Card */}
        <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-white/5 border border-white/10 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[#BF8641] font-semibold">
              <LogIn className="w-3.5 h-3.5" />
              <span>{lang === 'sv' ? 'Incheckning' : 'Check-In'}</span>
            </div>
            <p className="text-sm font-bold text-white">15:00 – 23:00</p>
            <p className="text-[10px] text-[#D3C8B9]">
              {lang === 'sv' ? 'Tidig ankomst på förfrågan' : 'Early arrival on request'}
            </p>
          </div>
          <div className="space-y-1 border-l border-white/10 pl-3">
            <div className="flex items-center gap-1.5 text-[#BF8641] font-semibold">
              <LogOut className="w-3.5 h-3.5" />
              <span>{lang === 'sv' ? 'Utcheckning' : 'Check-Out'}</span>
            </div>
            <p className="text-sm font-bold text-white">06:00 – 11:00</p>
            <p className="text-[10px] text-[#D3C8B9]">
              {lang === 'sv' ? 'Sen avresa i mån av plats' : 'Late checkout upon availability'}
            </p>
          </div>
        </div>

        {/* Transportation Highlights */}
        <div className="space-y-2.5 pt-1 text-xs text-[#D3C8B9]">
          <div className="flex items-start gap-2.5">
            <Bus className="w-4 h-4 text-[#BF8641] shrink-0 mt-0.5" />
            <span>
              <strong className="text-white">Balladgatan:</strong> {lang === 'sv' ? 'Direktbuss till Göteborgs Centralstation var 10:e minut (ca 10 min).' : 'Direct city bus to Gothenburg Central Station every 10 min (approx. 10 min).'}
            </span>
          </div>
          <div className="flex items-start gap-2.5">
            <Car className="w-4 h-4 text-[#BF8641] shrink-0 mt-0.5" />
            <span>
              <strong className="text-white">E6 / Tingstad:</strong> {lang === 'sv' ? 'Parkering på plats med Typ 2 laddpunkter för elbilar.' : 'On-site guest parking with Type 2 EV charging stations.'}
            </span>
          </div>
        </div>
      </div>

      {/* Verified property footer notice */}
      <div className="pt-8 mt-8 border-t border-white/10 flex items-center justify-between text-[11px] text-[#D3C8B9]/80">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#BF8641]" />
          <span>{lang === 'sv' ? 'Officiell gästservice' : 'Official Guest Concierge'}</span>
        </div>
        <a 
          href="https://maps.google.com/?q=Gamla+Tingstadsgatan+1+Goteborg" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[#F2C777] hover:text-white transition-colors"
        >
          <span>{lang === 'sv' ? 'Öppna i Google Maps' : 'Open in Maps'}</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
