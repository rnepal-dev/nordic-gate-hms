import React, { useState, useEffect } from 'react';
import { useHotel } from '../context/HotelContext.tsx';
import { HOTEL_IMAGES } from '../data/hotelData.ts';
import { 
  Coffee, 
  Clock, 
  Check, 
  ArrowRight, 
  UtensilsCrossed, 
  Wine, 
  Sparkles, 
  ShieldCheck, 
  Calendar,
  Users,
  GlassWater,
  Beer,
  Flame,
  Info
} from 'lucide-react';

interface DiningViewProps {
  initialTab?: 'all' | 'breakfast' | 'bistro' | 'bar';
}

export const DiningView: React.FC<DiningViewProps> = ({ initialTab = 'all' }) => {
  const { lang, navigate } = useHotel();
  const [activeFilter, setActiveFilter] = useState<'all' | 'breakfast' | 'bistro' | 'bar'>(initialTab);
  const [drinkCategory, setDrinkCategory] = useState<'cocktails' | 'wine' | 'beer' | 'spirits' | 'non_alcoholic' | 'snacks'>('cocktails');

  // Reservation form states
  const [reservationType, setReservationType] = useState<'restaurant' | 'bar'>('restaurant');
  const [tableDate, setTableDate] = useState('2026-10-26');
  const [tableTime, setTableTime] = useState('19:00');
  const [guestsCount, setGuestsCount] = useState(2);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Sync initial tab if route changes
  useEffect(() => {
    if (initialTab) {
      setActiveFilter(initialTab);
      if (initialTab === 'bar') {
        const barElement = document.getElementById('bar-drinks');
        if (barElement) {
          barElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  }, [initialTab]);

  const handleTableSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingConfirmed(true);
  };

  const handleScrollToBar = () => {
    setActiveFilter('all');
    setTimeout(() => {
      const barElement = document.getElementById('bar-drinks');
      if (barElement) {
        barElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  // 1. Evening Bistro Dinner Dishes (Preserved exactly)
  const dinnerDishes = [
    {
      nameSv: 'Klassiska Svenska Köttbullar',
      nameEn: 'Traditional Swedish Meatballs',
      descSv: 'Klassiska köttbullar med rårörda lingon, pressgurka, gräddsås och krämig potatispuré.',
      descEn: 'Swedish meatballs served with lingonberries, pickled cucumber, cream sauce, and mashed potatoes.',
      price: '195 kr',
      badgeSv: 'Klassiker',
      badgeEn: 'Classic',
    },
    {
      nameSv: 'Ugnsbakad Laxfilé från Västkusten',
      nameEn: 'Oven-Baked West Coast Salmon',
      descSv: 'Serveras med dillslungad potatis, hollandaisesås och krispiga gröna primörer.',
      descEn: 'Served with dill-tossed potatoes, warm hollandaise, and crisp market greens.',
      price: '245 kr',
      badgeSv: 'Fisk & Skaldjur',
      badgeEn: 'Seafood',
    },
    {
      nameSv: 'Nordic Gate Högrevsburgare (200g)',
      nameEn: 'Nordic Gate Prime Chuck Burger',
      descSv: 'Svensk högrev med lagrad Västerbottensost, karamelliserad lök, rökt majonnäs och krispiga pommes.',
      descEn: 'Swedish prime beef with aged Västerbottensost, caramelized onion, smoked aioli, and skin-on fries.',
      price: '215 kr',
      badgeSv: 'Populär',
      badgeEn: 'Popular',
    },
    {
      nameSv: 'Krämig Kantarell- & Svamppasta',
      nameEn: 'Creamy Chanterelle & Wild Mushroom Pasta',
      descSv: 'Färsk tagliatelle, stekta kantareller, vitlök, vitvinsås, riven parmesan och färsk timjan.',
      descEn: 'Fresh tagliatelle with pan-seared chanterelles, white wine cream, parmesan, and fresh thyme.',
      price: '195 kr',
      badgeSv: 'Vegetarisk',
      badgeEn: 'Vegetarian',
    },
  ];

  // 2. Bar & Drinks Menu Catalog
  const drinksData = {
    cocktails: [
      {
        nameSv: 'Nordic Gate Lingonberry Old Fashioned',
        nameEn: 'Nordic Gate Lingonberry Old Fashioned',
        descSv: 'Mackmyra svensk whisky, rårörda vilda lingon, Angostura bitter och flamberat apelsinskal över handskuren is.',
        descEn: 'Mackmyra Swedish single malt, wild Swedish lingonberries, Angostura bitters, and flamed orange peel.',
        price: '165 kr',
        tagSv: 'Signatur',
        tagEn: 'Signature',
      },
      {
        nameSv: 'Göteborg Botanical Gin & Tonic',
        nameEn: 'Gothenburg Botanical Gin & Tonic',
        descSv: 'Hernö ekologisk gin från Norrland, Arctic tonic water, färsk rosmarin, krossade enbär och färsk lime.',
        descEn: 'Hernö artisanal gin, premium Arctic tonic, fresh rosemary sprig, crushed juniper berries, and lime wheel.',
        price: '155 kr',
        tagSv: 'Klassiker',
        tagEn: 'Classic',
      },
      {
        nameSv: 'Akvavit & Fläderblomsspritz',
        nameEn: 'Aquavit & Elderflower Spritz',
        descSv: 'O.P. Anderson ekologisk akvavit, St. Germain fläderlikör, prosecco, färsk citronjuice och bubbelvatten.',
        descEn: 'O.P. Anderson organic aquavit, St. Germain elderflower, crisp prosecco, fresh lemon, and soda water.',
        price: '145 kr',
        tagSv: 'Frisk & Blommig',
        tagEn: 'Fresh & Floral',
      },
      {
        nameSv: 'Hjortron & Vanilj Sour',
        nameEn: 'Cloudberry & Vanilla Sour',
        descSv: 'Stockholms Bränneri vodka, gyllene hjortronlikör, nypressad citron, sockerlag och silkeslent äggviteskum.',
        descEn: 'Artisanal Swedish vodka, golden cloudberry liqueur, freshly squeezed lemon juice, and velvety foam.',
        price: '165 kr',
        tagSv: 'Säsong',
        tagEn: 'Seasonal',
      },
      {
        nameSv: 'Nordic Gate Espresso Martini',
        nameEn: 'Nordic Gate Espresso Martini',
        descSv: 'Dubbel espresso från Sjöstrand, ren svensk vodka, kaffelikör och rårörssirap skakad iskall.',
        descEn: 'Double shot of Sjöstrand espresso, Swedish grain vodka, coffee liqueur, and raw sugar syrup.',
        price: '155 kr',
        tagSv: 'Digestif',
        tagEn: 'Digestif',
      },
    ],
    wine: [
      {
        nameSv: 'Louis Roederer Collection 244 (Champagne)',
        nameEn: 'Louis Roederer Collection 244 (Champagne)',
        descSv: 'Frankrike · Elegant, frisk med toner av rostat bröd, krispiga äpplen och citrus. Perfekt till välkomstskål.',
        descEn: 'France · Balanced and energetic with toasted brioche, crisp green apples, and citrus minerality.',
        price: '195 kr / 1 150 kr',
        tagSv: 'Glas / Flaska',
        tagEn: 'Glass / Bottle',
      },
      {
        nameSv: 'Kullahalvön Svenskt Naturvin (Vitt)',
        nameEn: 'Kullahalvön Swedish Natural White Wine',
        descSv: 'Skåne, Sverige · Solaris-druva med hög mineralitet, krusbär, fläder och frisk nordisk syra.',
        descEn: 'Sweden · Solaris grape natural wine with vibrant gooseberry notes, elderflower, and crisp acidity.',
        price: '155 kr / 720 kr',
        tagSv: 'Lokalt Hantverk',
        tagEn: 'Local Craft',
      },
      {
        nameSv: 'Chablis Premier Cru, Domaine Laroche',
        nameEn: 'Chablis Premier Cru, Domaine Laroche',
        descSv: 'Bourgogne, Frankrike · 100% Chardonnay. Ren kalkstensmineralitet, vita persikor och runda smörtoner.',
        descEn: 'Burgundy, France · 100% Chardonnay with chalky minerality, white peach, and refined finish.',
        price: '165 kr / 820 kr',
        tagSv: 'Glas / Flaska',
        tagEn: 'Glass / Bottle',
      },
      {
        nameSv: 'Barolo Classico DOCG, Massolino',
        nameEn: 'Barolo Classico DOCG, Massolino',
        descSv: 'Piemonte, Italien · Nebbiolo. Nypon, torkade rosor, mörka körsbär, tobak och strama eleganta tanniner.',
        descEn: 'Piedmont, Italy · Nebbiolo with wild rose, dark cherries, dried herbs, and structured tannins.',
        price: '185 kr / 920 kr',
        tagSv: 'Glas / Flaska',
        tagEn: 'Glass / Bottle',
      },
    ],
    beer: [
      {
        nameSv: 'Stigbergets Göteborgs IPA (Fat, 40 cl)',
        nameEn: 'Stigbergets Gothenburg IPA (Draft, 40 cl)',
        descSv: 'Lokalt bryggt i Göteborgs hamn. Humlearomatisk med toner av grapefrukt, mango och tallbarr.',
        descEn: 'Locally brewed in Gothenburg harbour. Generously dry-hopped with notes of grapefruit, mango, and pine.',
        price: '92 kr',
        tagSv: 'Lokal Favorit',
        tagEn: 'Local Draught',
      },
      {
        nameSv: 'Poppels Bryggeri Session Pale Ale (Flaska, 33 cl)',
        nameEn: 'Poppels Brewery Session Pale Ale (33 cl)',
        descSv: 'Jonsered, Göteborg · Ekologiskt bryggd med frisk citruskaraktär och balanserad maltighet.',
        descEn: 'Gothenburg region · Organic session ale with refreshing citrus aromas and balanced malt backbone.',
        price: '88 kr',
        tagSv: 'Ekologisk',
        tagEn: 'Organic',
      },
      {
        nameSv: 'Carnegie Starkporter (Flaska, 33 cl)',
        nameEn: 'Carnegie Classic Porter (33 cl)',
        descSv: 'Göteborgsk bryggeriklassiker sedan 1836. Fyllig smak med rostad malt, mörk choklad och lakrits.',
        descEn: 'Historic Gothenburg heritage porter brewed since 1836. Rich roasted notes of cocoa and espresso.',
        price: '86 kr',
        tagSv: 'Kulturarv 1836',
        tagEn: 'Heritage 1836',
      },
      {
        nameSv: 'Kiviks Äppelcider Ekologisk Torr (33 cl)',
        nameEn: 'Kiviks Dry Organic Apple Cider (33 cl)',
        descSv: 'Österlen, Sverige · Vildjäst svensk äppelcider med frisk syra och krispig fruktighet.',
        descEn: 'Sweden · Artisanal Swedish cider fermented from orchard apples with clean, crisp finish.',
        price: '78 kr',
        tagSv: 'Glutenfri',
        tagEn: 'Gluten Free',
      },
    ],
    spirits: [
      {
        nameSv: 'Hernö Gin Hemsö / Navy Strength (4 cl)',
        nameEn: 'Hernö Gin Hemsö / Navy Strength (4 cl)',
        descSv: 'Världsmästarbelönt svensk gin med tydliga enbärstoner, korianderfrön och lingon.',
        descEn: 'World-awarded Swedish botanical gin with prominent juniper, coriander seeds, and lingonberries.',
        price: '140 kr',
        tagSv: 'Sverige',
        tagEn: 'Sweden',
      },
      {
        nameSv: 'Mackmyra Svensk Ek Single Malt Whisky (4 cl)',
        nameEn: 'Mackmyra Swedish Oak Single Malt (4 cl)',
        descSv: 'Lagrad på fat av svensk ek från Visingsö. Kryddig med vanilj, torkad frukt och rostade nötter.',
        descEn: 'Aged in Swedish oak casks. Spicy notes of toasted oak, vanilla pod, and autumn orchard fruit.',
        price: '150 kr',
        tagSv: 'Svensk Ek',
        tagEn: 'Swedish Oak',
      },
      {
        nameSv: 'O.P. Anderson Aquavit Original (4 cl)',
        nameEn: 'O.P. Anderson Aquavit Original (4 cl)',
        descSv: 'Klassisk svensk akvavit destillerad med kummin, anis och fänkål, lagrad på ekfat.',
        descEn: 'Traditional Swedish spirit distilled with caraway, anise, and fennel, oak-barrel mellowed.',
        price: '98 kr',
        tagSv: 'Tradition',
        tagEn: 'Tradition',
      },
      {
        nameSv: 'Diplomático Reserva Exclusiva Rom (4 cl)',
        nameEn: 'Diplomático Reserva Exclusiva Rum (4 cl)',
        descSv: 'Fyllig avec-rom lagrad upp till 12 år med toner av lönnsirap, apelsinskal och mörk choklad.',
        descEn: 'Smooth sipping rum aged up to 12 years with maple syrup, orange peel, and cocoa complexity.',
        price: '140 kr',
        tagSv: 'Avec',
        tagEn: 'Digestif',
      },
    ],
    non_alcoholic: [
      {
        nameSv: 'Kiviks Mousserande Äppelmust (Glas)',
        nameEn: 'Kiviks Sparkling Farm Apple Must (Glass)',
        descSv: '100% skånska äpplen, kallpressad och kolsyrad med naturlig sötma och frisk syra.',
        descEn: '100% Swedish orchard apples, cold-pressed and gently carbonated with vibrant acidity.',
        price: '65 kr',
        tagSv: 'Alkoholfri',
        tagEn: 'Non-Alcoholic',
      },
      {
        nameSv: 'Nordic Berry & Rosmarin Mocktail',
        nameEn: 'Nordic Berry & Rosemary Mocktail',
        descSv: 'Färska lingon, tranbär, rosmarinsirap, färskpressad lime och mousserande mineralvatten.',
        descEn: 'Fresh lingonberries, cranberries, house rosemary reduction, lime juice, and sparkling soda.',
        price: '85 kr',
        tagSv: 'Husets Mocktail',
        tagEn: 'House Mocktail',
      },
      {
        nameSv: 'Poppels Hoppy Non-Alcoholic Pale Ale (0.5%)',
        nameEn: 'Poppels Hoppy Non-Alcoholic Pale Ale (0.5%)',
        descSv: 'Smakrik alkoholfri öl med generös humlearom och frisk citrusbeska.',
        descEn: 'Flavorful non-alcoholic craft ale with generous hop aroma and clean citrus bitterness.',
        price: '62 kr',
        tagSv: 'Alkoholfri Öl',
        tagEn: 'Craft 0.5%',
      },
      {
        nameSv: 'Rescued Ingefära & Citrondryck',
        nameEn: 'Rescued Ginger & Lemon Botanical Soda',
        descSv: 'Hantverksmässigt tillverkad av räddad frukt. Rivig ingefära och frisk citronton.',
        descEn: 'Sustainable craft beverage made from rescued fruit with vibrant ginger zest and fresh lemon.',
        price: '55 kr',
        tagSv: 'Cirkulär',
        tagEn: 'Sustainable',
      },
    ],
    snacks: [
      {
        nameSv: 'Tryffelsaltade Marconamandlar',
        nameEn: 'Truffle-Salted Marcona Almonds',
        descSv: 'Varsamt rostade spanska mandlar vända i finaste havssalt och svart tryffelolja.',
        descEn: 'Lightly roasted Marcona almonds tossed in hand-harvested sea salt and black truffle oil.',
        price: '65 kr',
        tagSv: 'Vegetarisk',
        tagEn: 'Vegetarian',
      },
      {
        nameSv: 'Marinerade Nocellara-oliver',
        nameEn: 'Marinated Nocellara Olives',
        descSv: 'Smöriga sicilianska oliver marinerade med färska örter, citronzest och vitlök.',
        descEn: 'Buttery Sicilian green olives marinated with cold-pressed olive oil, herbs, and lemon peel.',
        price: '65 kr',
        tagSv: 'Vegansk',
        tagEn: 'Vegan',
      },
      {
        nameSv: 'Västerbottensost-snittar & Hjortrondip',
        nameEn: 'Aged Västerbottensost Sticks & Cloudberry Dip',
        descSv: 'Stavar av lagrad svensk ost med rårörd hjortronchutney och krispigt knäckebröd.',
        descEn: 'Aged Swedish sharp cheese sticks served with wild cloudberry chutney and artisan crispbread.',
        price: '85 kr',
        tagSv: 'Svensk Specialitet',
        tagEn: 'Swedish Specialty',
      },
      {
        nameSv: 'Charkbricka från Lokala Gårdar',
        nameEn: 'Artisanal Nordic Charcuterie Board',
        descSv: 'Svensk lufttorkad skinka, fänkålssalami, lagrad ost, cornichoner och grillat surdegsbröd.',
        descEn: 'Locally cured ham, Swedish fennel salami, aged cheese, cornichons, and toasted sourdough.',
        price: '165 kr',
        tagSv: 'Att Dela',
        tagEn: 'To Share',
      },
      {
        nameSv: 'Rökta Lantchips med Löjroms- & Gräslöksdip',
        nameEn: 'Smoked Crisps with Bleak Roe & Chive Dip',
        descSv: 'Grytfriterade potatischips serverade med Bottenvikens löjrom, smetana och rödlök.',
        descEn: 'Kettle-cooked crisps served with Kalix bleak roe, smetana, red onion, and fresh chives.',
        price: '115 kr',
        tagSv: 'Lyxsnack',
        tagEn: 'Delicacy',
      },
    ],
  };

  return (
    <div className="space-y-16 lg:space-y-24 pb-20">
      
      {/* 1. LUXURY HERO BANNER */}
      <section className="bg-[#0D1A26] text-[#F8F5EF] pt-14 pb-16 px-6 border-b border-[#BF8641]/20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#F2C777] font-semibold">
              <UtensilsCrossed className="w-4 h-4 text-[#F2C777]" />
              <span>{lang === 'sv' ? 'Frukost · Kvällsbistro · Loungebar' : 'Breakfast · Evening Bistro · Lounge Bar'}</span>
              <span aria-hidden="true" className="text-white/30">·</span>
              <span>Göteborg</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F8F5EF] leading-[1.15] text-balance">
              {lang === 'sv' 
                ? 'Skandinavisk Frukostbuffé, Kvällsbistro & Loungebar' 
                : 'Scandinavian Breakfast, Evening Bistro & Lounge Bar'}
            </h1>

            <p className="text-sm sm:text-base text-[#EDE7DC]/90 leading-relaxed font-light">
              {lang === 'sv'
                ? 'Njut av en generös ekologisk frukostbuffé varje morgon och välsmakande middagar i vår trivsamma hotellrestaurang. I loungebaren väntar signaturcocktails, utvalda viner och lokala hantverksöl från Göteborg tillsammans med smakfulla barsnacks.'
                : 'Enjoy a rich organic breakfast buffet every morning and satisfying evening meals in our welcoming hotel restaurant. Relax in the lounge bar with signature cocktails, fine wines, local Gothenburg craft beers, and savory bar bites.'}
            </p>

            {/* Timings row */}
            <div className="pt-1 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#D3C8B9] border-t border-white/10 pt-4">
              <div className="space-y-1">
                <span className="font-semibold text-[#F2C777] block text-[11px] uppercase tracking-wider">
                  {lang === 'sv' ? 'Ekologisk Frukost' : 'Organic Breakfast'}
                </span>
                <p className="leading-snug">Vardagar 06:30–09:30<br />Helger 07:00–10:30</p>
              </div>

              <div className="space-y-1">
                <span className="font-semibold text-[#F2C777] block text-[11px] uppercase tracking-wider">
                  {lang === 'sv' ? 'Kvällsrestaurang' : 'Evening Bistro'}
                </span>
                <p className="leading-snug">Mån–Lör 17:30–22:00<br />Middagsmeny & Klassiker</p>
              </div>

              <div className="space-y-1">
                <span className="font-semibold text-[#F2C777] block text-[11px] uppercase tracking-wider">
                  {lang === 'sv' ? 'Loungebar & Snacks' : 'Lounge Bar & Snacks'}
                </span>
                <p className="leading-snug">Mån–Tor 16:00–23:00<br />Fre–Lör 15:00–00:00 (Sön –22)</p>
              </div>
            </div>

            {/* Primary Action CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={handleScrollToBar}
                className="px-6 py-3.5 bg-[#BF8641] hover:bg-[#8C5F27] text-white text-xs sm:text-sm font-semibold uppercase tracking-wider rounded-lg transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Wine className="w-4 h-4 text-[#F2C777]" />
                <span>{lang === 'sv' ? 'Utforska Bar & Dryck' : 'Explore Bar & Drinks'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  const reserveEl = document.getElementById('table-reservation');
                  if (reserveEl) reserveEl.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3.5 border border-white/30 hover:border-white text-white hover:bg-white/10 text-xs sm:text-sm font-medium uppercase tracking-wider rounded-lg transition-all cursor-pointer"
              >
                {lang === 'sv' ? 'Boka Bord i Restaurangen' : 'Reserve a Table'}
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl border border-white/15">
              <img
                src={HOTEL_IMAGES.diningRestaurant}
                alt="Hotel Nordic Gate frukost och restaurang"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center justify-between text-xs text-[#D3C8B9] px-1">
              <span>{lang === 'sv' ? 'Skandinavisk restaurangsal' : 'Scandinavian dining hall'}</span>
              <span className="text-[#F2C777] font-semibold">{lang === 'sv' ? 'Frukost ingår för hotellgäster' : 'Breakfast included for guests'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK SECTION SELECTOR TABS */}
      <section className="max-w-7xl mx-auto px-6 -mt-8">
        <div className="bg-white p-2 rounded-2xl border border-[#D3C8B9] shadow-sm flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-[#0D1A26] text-[#F8F5EF] shadow-xs'
                  : 'text-[#25303A] hover:bg-[#F8F5EF]'
              }`}
            >
              {lang === 'sv' ? 'Alla Avdelningar' : 'All Departments'}
            </button>
            <button
              onClick={() => setActiveFilter('breakfast')}
              className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
                activeFilter === 'breakfast'
                  ? 'bg-[#0D1A26] text-[#F8F5EF] shadow-xs'
                  : 'text-[#25303A] hover:bg-[#F8F5EF]'
              }`}
            >
              {lang === 'sv' ? 'Ekologisk Frukost' : 'Organic Breakfast'}
            </button>
            <button
              onClick={() => setActiveFilter('bistro')}
              className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
                activeFilter === 'bistro'
                  ? 'bg-[#0D1A26] text-[#F8F5EF] shadow-xs'
                  : 'text-[#25303A] hover:bg-[#F8F5EF]'
              }`}
            >
              {lang === 'sv' ? 'Kvällsbistro' : 'Evening Bistro'}
            </button>
            <button
              onClick={() => setActiveFilter('bar')}
              className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeFilter === 'bar'
                  ? 'bg-[#0D1A26] text-[#F8F5EF] shadow-xs'
                  : 'text-[#25303A] hover:bg-[#F8F5EF]'
              }`}
            >
              <Wine className="w-3.5 h-3.5 text-[#BF8641]" />
              <span>{lang === 'sv' ? 'Loungebar & Dryck' : 'Bar & Drinks'}</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1 text-slate-500 text-[11px]">
            <Clock className="w-3.5 h-3.5 text-[#BF8641]" />
            <span>{lang === 'sv' ? 'Öppet dagligen för boende & externa gäster' : 'Open daily for hotel guests and visitors'}</span>
          </div>
        </div>
      </section>

      {/* 2. BREAKFAST SECTION (Warm Sand #EDE7DC Surface) */}
      {(activeFilter === 'all' || activeFilter === 'breakfast') && (
        <section className="bg-[#EDE7DC] py-16 border-y border-[#D3C8B9]">
          <div className="max-w-7xl mx-auto px-6 space-y-10">
            <div className="max-w-2xl space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-[#BF8641] font-semibold">
                {lang === 'sv' ? 'Ingår alltid för samtliga hotellgäster' : 'Always Included with Your Room'}
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-[#02070D]">
                {lang === 'sv' ? 'Den Skandinaviska Ekologiska Frukostbuffén' : 'Scandinavian Organic Breakfast Buffet'}
              </h2>
              <p className="text-sm text-[#25303A] leading-relaxed">
                {lang === 'sv'
                  ? 'Starta dagen på bästa sätt. Vår frukostbuffé bjuder på ett rikt urval av hälsosamma, ekologiska och närproducerade råvaror.'
                  : 'Start your morning with our generous Scandinavian breakfast spread featuring fresh, organic, and wholesome options.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#25303A]">
              <div className="p-6 bg-[#F8F5EF] rounded-2xl border border-[#D3C8B9] space-y-3 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-[#0D1A26] text-[#F2C777] flex items-center justify-center font-bold">
                  1
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-[#02070D]">
                  {lang === 'sv' ? 'Bageri & Pålägg' : 'Bakery & Deli'}
                </h3>
                <p className="leading-relaxed text-[#25303A]">
                  {lang === 'sv'
                    ? 'Nybakat surdegsbröd, frallor, klassiskt knäckebröd, ekologiskt smör, svenska ostar, skinka, kalkon och hemlagade fruktmarmelader.'
                    : 'Freshly baked sourdough breads, rolls, traditional crispbreads, cheeses, sliced cold cuts, and seasonal fruit preserves.'}
                </p>
              </div>

              <div className="p-6 bg-[#F8F5EF] rounded-2xl border border-[#D3C8B9] space-y-3 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-[#0D1A26] text-[#F2C777] flex items-center justify-center font-bold">
                  2
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-[#02070D]">
                  {lang === 'sv' ? 'Varma Klassiker' : 'Hot Breakfast Favourites'}
                </h3>
                <p className="leading-relaxed text-[#25303A]">
                  {lang === 'sv'
                    ? 'Krämig äggröra från frigående höns, krispigt stekt bacon, små goda frukostkorvar, bönor och varm havregrynsgröt.'
                    : 'Creamy free-range scrambled eggs, crispy bacon, breakfast sausages, baked beans, and warm rolled oats porridge.'}
                </p>
              </div>

              <div className="p-6 bg-[#F8F5EF] rounded-2xl border border-[#D3C8B9] space-y-3 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-[#0D1A26] text-[#F2C777] flex items-center justify-center font-bold">
                  3
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-[#02070D]">
                  {lang === 'sv' ? 'Specialkost & Allergiutbud' : 'Special Dietary Corner'}
                </h3>
                <p className="leading-relaxed text-[#25303A]">
                  {lang === 'sv'
                    ? 'Egen separat avdelning med glutenfritt bröd och flingor, laktosfria mejeriprodukter, samt växtbaserad havre- och sojadryck.'
                    : 'Dedicated section with gluten-free breads, lactose-free milk & yogurts, and plant-based vegan alternatives.'}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. EVENING BISTRO MENU (Warm Ivory #F8F5EF with refined cards) */}
      {(activeFilter === 'all' || activeFilter === 'bistro') && (
        <section className="max-w-7xl mx-auto px-6 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-[#EDE7DC]">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs uppercase tracking-[0.2em] text-[#BF8641] font-semibold">
                {lang === 'sv' ? 'Kvällsmeny i Bistron' : 'Evening Bistro Menu'}
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-[#02070D]">
                {lang === 'sv' ? 'Vällagat, enkelt och genuint gott' : 'Swedish Classics & European Favourites'}
              </h2>
              <p className="text-sm text-[#25303A]">
                {lang === 'sv'
                  ? 'Koppla av i restaurangen efter en händelserik dag i Göteborg med väl valda råvaror och drycker.'
                  : 'Relax in our restaurant after your day with satisfying flavours, craft beers, and good company.'}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-[#02070D] bg-[#EDE7DC] px-4 py-2 rounded-xl border border-[#D3C8B9]">
              <Clock className="w-4 h-4 text-[#BF8641]" />
              <span>Mån–Lör 17:30 – 22:00</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dinnerDishes.map((dish, idx) => (
              <div 
                key={idx}
                className="bg-white p-6 rounded-2xl border border-[#EDE7DC] space-y-3 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-[#02070D]">
                      {lang === 'sv' ? dish.nameSv : dish.nameEn}
                    </h3>
                    <span className="px-3 py-1 rounded-md text-[11px] font-semibold bg-[#EDE7DC] text-[#02070D] border border-[#D3C8B9] shrink-0">
                      {lang === 'sv' ? dish.badgeSv : dish.badgeEn}
                    </span>
                  </div>
                  <p className="text-xs text-[#25303A] mt-2 leading-relaxed">
                    {lang === 'sv' ? dish.descSv : dish.descEn}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#EDE7DC] flex items-center justify-between mt-2">
                  <span className="text-2xl font-bold text-[#02070D] tabular-nums">
                    {dish.price}
                  </span>
                  <span className="text-xs text-[#25303A]/70 font-medium">
                    {lang === 'sv' ? 'Inkl. 12% moms' : 'Incl. 12% VAT'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. DEDICATED BAR & DRINKS EXPERIENCE (Modern Nordic Heritage Luxury) */}
      {(activeFilter === 'all' || activeFilter === 'bar') && (
        <section id="bar-drinks" className="scroll-mt-24 space-y-12">
          
          {/* Bar Banner & Atmospheric Introduction */}
          <div className="bg-[#02070D] text-[#F8F5EF] py-16 px-6 border-y border-[#BF8641]/30 relative overflow-hidden">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#F2C777] font-semibold">
                  <Wine className="w-4 h-4 text-[#F2C777]" />
                  <span>{lang === 'sv' ? 'Loungebar & Hantverksdryck' : 'Lounge Bar & Craft Beverages'}</span>
                  <span aria-hidden="true" className="text-white/30">·</span>
                  <span>Hotel Nordic Gate</span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#F8F5EF] leading-snug">
                  {lang === 'sv'
                    ? 'Skandinavisk cocktailkonst, naturviner och lokala brygder'
                    : 'Scandinavian Mixology, Natural Wines & Gothenburg Craft Beers'}
                </h2>

                <p className="text-sm text-[#EDE7DC]/90 leading-relaxed font-light">
                  {lang === 'sv'
                    ? 'I vår eleganta loungebar möts gäster och göteborgare i en ombonad miljö präglad av läder, mässing och varm belysning. Vår dryckesmeny hyllar nordiska smaker med svenska destillat som Hernö Gin och Mackmyra, kombinerat med lokala hantverksöl och kurerade europeiska viner.'
                    : 'In our sophisticated lounge bar, guests unwind amidst leather seating, brushed brass, and warm amber illumination. Our drinks menu celebrates Nordic botanicals, world-awarded Swedish gins, single malts, natural wines, and locally brewed Gothenburg ales.'}
                </p>

                {/* Operating hours & bar food notice */}
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-3 text-xs text-[#D3C8B9]">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="font-semibold text-[#F2C777] uppercase tracking-wider text-[11px]">
                      {lang === 'sv' ? 'Barloungebuffert & Öppettider' : 'Bar Opening Hours'}
                    </span>
                    <span className="text-[10px] bg-[#BF8641] text-white px-2 py-0.5 rounded font-semibold">
                      {lang === 'sv' ? 'Barmeny & Snacks' : 'Bar Menu & Bites'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <span className="text-white font-medium block">Mån – Tor:</span>
                      <span className="text-[11px] text-white/70">16:00 – 23:00</span>
                    </div>
                    <div>
                      <span className="text-white font-medium block">Fre – Lör:</span>
                      <span className="text-[11px] text-white/70">15:00 – 00:00</span>
                    </div>
                    <div>
                      <span className="text-white font-medium block">Sön:</span>
                      <span className="text-[11px] text-white/70">16:00 – 22:00</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#EDE7DC]/70 italic pt-1">
                    {lang === 'sv'
                      ? 'Varm barmeny och kvällsrätter serveras fram till kl. 22:00 varje kväll.'
                      : 'Bar dinners and hot bites available until 22:00 daily.'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <button
                    onClick={() => {
                      setReservationType('bar');
                      const formEl = document.getElementById('table-reservation');
                      if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-6 py-3 bg-[#BF8641] hover:bg-[#8C5F27] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <Calendar className="w-4 h-4 text-[#F2C777]" />
                    <span>{lang === 'sv' ? 'Reservera Loungeplats' : 'Reserve Lounge Seating'}</span>
                  </button>

                  <div className="flex items-center gap-2 text-xs text-[#D3C8B9]">
                    <ShieldCheck className="w-4 h-4 text-[#F2C777]" />
                    <span>{lang === 'sv' ? 'Drop-in alltid välkommet i mån av plats' : 'Walk-ins always welcome'}</span>
                  </div>
                </div>
              </div>

              {/* Bar Photography Mosaic */}
              <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border border-white/15 relative group">
                  <img
                    src={HOTEL_IMAGES.barLounge}
                    alt="Hotel Nordic Gate Lounge Bar Interiör"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                    <span className="text-xs font-medium text-[#F8F5EF]">
                      {lang === 'sv' ? 'Ombonad hotellbar & lounge' : 'Sophisticated lounge & bar'}
                    </span>
                  </div>
                </div>

                <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border border-white/15 relative group">
                  <img
                    src={HOTEL_IMAGES.barDrinks}
                    alt="Nordic craft cocktail och drycker"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                    <span className="text-xs font-medium text-[#F8F5EF]">
                      {lang === 'sv' ? 'Signaturcocktails med svenska råvaror' : 'Artisanal cocktails with botanicals'}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Beverage Category Selector & Items Grid */}
          <div className="max-w-7xl mx-auto px-6 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-[#EDE7DC]">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-[0.2em] text-[#BF8641] font-semibold">
                  {lang === 'sv' ? 'Dryckessortiment & Barsnacks' : 'Beverage & Bar Snack Selection'}
                </span>
                <h3 className="text-2xl sm:text-3xl font-semibold text-[#02070D]">
                  {lang === 'sv' ? 'Kurerad Dryckesmeny' : 'Curated Drinks Menu'}
                </h3>
              </div>

              {/* Informational edit placeholder badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#EDE7DC] rounded-lg text-[11px] text-[#25303A] border border-[#D3C8B9]">
                <Info className="w-3.5 h-3.5 text-[#BF8641] shrink-0" />
                <span>
                  {lang === 'sv' 
                    ? 'Kandidatmeny: Priser och årgångar kan variera efter säsong' 
                    : 'Reference catalog: Vintages & selection subject to seasonal updates'}
                </span>
              </div>
            </div>

            {/* Category Filter Pills (Functional Buttons) */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setDrinkCategory('cocktails')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  drinkCategory === 'cocktails'
                    ? 'bg-[#0D1A26] text-[#F8F5EF] shadow-sm'
                    : 'bg-[#EDE7DC] text-[#25303A] hover:bg-white border border-[#D3C8B9]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#F2C777]" />
                <span>{lang === 'sv' ? 'Signaturcocktails' : 'Signature Cocktails'}</span>
              </button>

              <button
                type="button"
                onClick={() => setDrinkCategory('wine')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  drinkCategory === 'wine'
                    ? 'bg-[#0D1A26] text-[#F8F5EF] shadow-sm'
                    : 'bg-[#EDE7DC] text-[#25303A] hover:bg-white border border-[#D3C8B9]'
                }`}
              >
                <Wine className="w-3.5 h-3.5 text-[#F2C777]" />
                <span>{lang === 'sv' ? 'Vin & Champagne' : 'Wine & Champagne'}</span>
              </button>

              <button
                type="button"
                onClick={() => setDrinkCategory('beer')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  drinkCategory === 'beer'
                    ? 'bg-[#0D1A26] text-[#F8F5EF] shadow-sm'
                    : 'bg-[#EDE7DC] text-[#25303A] hover:bg-white border border-[#D3C8B9]'
                }`}
              >
                <Beer className="w-3.5 h-3.5 text-[#F2C777]" />
                <span>{lang === 'sv' ? 'Öl & Hantverkscider' : 'Beer & Craft Cider'}</span>
              </button>

              <button
                type="button"
                onClick={() => setDrinkCategory('spirits')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  drinkCategory === 'spirits'
                    ? 'bg-[#0D1A26] text-[#F8F5EF] shadow-sm'
                    : 'bg-[#EDE7DC] text-[#25303A] hover:bg-white border border-[#D3C8B9]'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-[#F2C777]" />
                <span>{lang === 'sv' ? 'Destillat & Avec' : 'Spirits & Digestifs'}</span>
              </button>

              <button
                type="button"
                onClick={() => setDrinkCategory('non_alcoholic')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  drinkCategory === 'non_alcoholic'
                    ? 'bg-[#0D1A26] text-[#F8F5EF] shadow-sm'
                    : 'bg-[#EDE7DC] text-[#25303A] hover:bg-white border border-[#D3C8B9]'
                }`}
              >
                <GlassWater className="w-3.5 h-3.5 text-[#F2C777]" />
                <span>{lang === 'sv' ? 'Alkoholfria Drycker' : 'Non-Alcoholic'}</span>
              </button>

              <button
                type="button"
                onClick={() => setDrinkCategory('snacks')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  drinkCategory === 'snacks'
                    ? 'bg-[#0D1A26] text-[#F8F5EF] shadow-sm'
                    : 'bg-[#EDE7DC] text-[#25303A] hover:bg-white border border-[#D3C8B9]'
                }`}
              >
                <UtensilsCrossed className="w-3.5 h-3.5 text-[#F2C777]" />
                <span>{lang === 'sv' ? 'Barsnacks & Smårätter' : 'Bar Snacks & Bites'}</span>
              </button>
            </div>

            {/* Rendered Drinks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {drinksData[drinkCategory].map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-2xl border border-[#EDE7DC] flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="text-base sm:text-lg font-semibold text-[#02070D] leading-snug">
                        {lang === 'sv' ? item.nameSv : item.nameEn}
                      </h4>
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#EDE7DC] text-[#BF8641] border border-[#D3C8B9] shrink-0">
                        {lang === 'sv' ? item.tagSv : item.tagEn}
                      </span>
                    </div>

                    <p className="text-xs text-[#25303A] leading-relaxed">
                      {lang === 'sv' ? item.descSv : item.descEn}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#EDE7DC] flex items-center justify-between mt-4">
                    <span className="text-xl font-bold text-[#02070D] tabular-nums font-brand-sans">
                      {item.price}
                    </span>
                    <span className="text-[11px] text-[#25303A]/60 font-medium">
                      {lang === 'sv' ? 'Inkl. 25% moms' : 'Incl. 25% VAT'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* 5. TABLE & LOUNGE RESERVATION FORM (Deep Navy #0D1A26 Section) */}
      <section id="table-reservation" className="max-w-4xl mx-auto px-6 scroll-mt-24">
        <div className="bg-[#0D1A26] text-[#F8F5EF] p-8 lg:p-12 rounded-2xl shadow-xl space-y-8 border border-[#BF8641]/30">
          <div className="space-y-2 text-center max-w-xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F2C777]">
              {lang === 'sv' ? 'Bords- och Loungebokning' : 'Table & Lounge Reservation'}
            </span>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-[#F8F5EF]">
              {lang === 'sv' ? 'Säkra din plats inför kvällen' : 'Reserve for Dinner or Lounge'}
            </h3>
            <p className="text-xs sm:text-sm text-[#D3C8B9]">
              {lang === 'sv'
                ? 'Boka middagsbord i restaurangen eller ett reserverat bord i loungebaren. Både hotellgäster och externa besökare är varmt välkomna.'
                : 'Reserve a dinner table in the restaurant or comfortable lounge seating in the bar. Hotel guests and visitors are warmly welcome.'}
            </p>
          </div>

          {/* Seating Type Selector */}
          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto p-1 bg-[#02070D] rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => setReservationType('restaurant')}
              className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                reservationType === 'restaurant'
                  ? 'bg-[#BF8641] text-white shadow-xs'
                  : 'text-[#D3C8B9] hover:text-white'
              }`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>{lang === 'sv' ? 'Restaurangbord' : 'Dinner Table'}</span>
            </button>

            <button
              type="button"
              onClick={() => setReservationType('bar')}
              className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                reservationType === 'bar'
                  ? 'bg-[#BF8641] text-white shadow-xs'
                  : 'text-[#D3C8B9] hover:text-white'
              }`}
            >
              <Wine className="w-3.5 h-3.5" />
              <span>{lang === 'sv' ? 'Loungebar' : 'Lounge Bar'}</span>
            </button>
          </div>

          {bookingConfirmed ? (
            <div className="p-8 bg-white/10 rounded-2xl text-center space-y-4 border border-[#F2C777]/40">
              <div className="w-12 h-12 rounded-full bg-[#BF8641] text-white flex items-center justify-center mx-auto shadow-md">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="text-xl sm:text-2xl font-semibold text-[#F8F5EF]">
                {lang === 'sv' ? 'Tack! Din bokning är bekräftad' : 'Thank you! Reservation confirmed'}
              </h4>
              <p className="text-xs sm:text-sm text-[#D3C8B9] max-w-md mx-auto">
                {lang === 'sv'
                  ? `${reservationType === 'restaurant' ? 'Middagsbord' : 'Loungeplats'} reserverat för ${guestsCount} gäster den ${tableDate} kl. ${tableTime}. Vi ser fram emot att välkomna dig till Hotel Nordic Gate!`
                  : `${reservationType === 'restaurant' ? 'Dinner table' : 'Lounge seating'} confirmed for ${guestsCount} guests on ${tableDate} at ${tableTime}. We look forward to welcoming you to Hotel Nordic Gate!`}
              </p>
              <button
                onClick={() => setBookingConfirmed(false)}
                className="text-xs font-semibold text-[#F2C777] hover:underline mt-2 cursor-pointer inline-block"
              >
                {lang === 'sv' ? 'Gör en ny bordsbokning' : 'Make another reservation'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleTableSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#D3C8B9] mb-1.5 font-bold">
                    {lang === 'sv' ? 'Datum' : 'Date'}
                  </label>
                  <input
                    type="date"
                    value={tableDate}
                    onChange={(e) => setTableDate(e.target.value)}
                    className="w-full bg-[#02070D] border border-white/20 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#F8F5EF] focus:outline-none focus:border-[#F2C777] cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#D3C8B9] mb-1.5 font-bold">
                    {lang === 'sv' ? 'Tid' : 'Time'}
                  </label>
                  <select
                    value={tableTime}
                    onChange={(e) => setTableTime(e.target.value)}
                    className="w-full bg-[#02070D] border border-white/20 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#F8F5EF] focus:outline-none focus:border-[#F2C777] cursor-pointer"
                  >
                    <option value="16:00">16:00 (Lounge)</option>
                    <option value="17:00">17:00 (Lounge)</option>
                    <option value="17:30">17:30</option>
                    <option value="18:00">18:00</option>
                    <option value="18:30">18:30</option>
                    <option value="19:00">19:00</option>
                    <option value="19:30">19:30</option>
                    <option value="20:00">20:00</option>
                    <option value="20:30">20:30</option>
                    <option value="21:00">21:00</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#D3C8B9] mb-1.5 font-bold">
                    {lang === 'sv' ? 'Antal gäster' : 'Guests'}
                  </label>
                  <select
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(Number(e.target.value))}
                    className="w-full bg-[#02070D] border border-white/20 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#F8F5EF] focus:outline-none focus:border-[#F2C777] cursor-pointer"
                  >
                    <option value={1}>1 {lang === 'sv' ? 'person' : 'guest'}</option>
                    <option value={2}>2 {lang === 'sv' ? 'personer' : 'guests'}</option>
                    <option value={3}>3 {lang === 'sv' ? 'personer' : 'guests'}</option>
                    <option value={4}>4 {lang === 'sv' ? 'personer' : 'guests'}</option>
                    <option value={5}>5 {lang === 'sv' ? 'personer' : 'guests'}</option>
                    <option value={6}>6+ {lang === 'sv' ? 'personer' : 'guests'}</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#BF8641] hover:bg-[#8C5F27] text-white text-xs lg:text-sm font-bold rounded-xl uppercase tracking-wider transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
              >
                <span>
                  {lang === 'sv' 
                    ? `Bekräfta ${reservationType === 'restaurant' ? 'Bordsbokning' : 'Loungebokning'}` 
                    : `Confirm ${reservationType === 'restaurant' ? 'Table Reservation' : 'Lounge Booking'}`}
                </span>
                <ArrowRight className="w-4 h-4 text-[#F2C777]" />
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
};
