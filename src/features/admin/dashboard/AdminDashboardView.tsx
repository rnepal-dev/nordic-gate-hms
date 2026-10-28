import React from 'react';
import {
  BedDouble,
  HelpCircle,
  UtensilsCrossed,
  Image as ImageIcon,
  ArrowRight,
  Plus,
  Clock,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  FileText,
  Wine,
} from 'lucide-react';
import { useHotel } from '../../../context/HotelContext';
import { AdminPageHeader } from '../../../components/admin/AdminPageHeader';
import { Button } from '../../../components/ui/Button';
import { loadAdminFaqs, loadAdminFacilities, loadAdminGallery } from '../../../data/adminMockData';

export const AdminDashboardView: React.FC = () => {
  const { navigate } = useHotel();
  const faqs = loadAdminFaqs();
  const facilities = loadAdminFacilities();
  const gallery = loadAdminGallery();
  const publishedFaqsCount = faqs.filter((f) => f.status === 'published').length;
  const availableFacilitiesCount = facilities.filter((f) => f.is_available).length;

  const statCards = [
    {
      title: 'Facilities & Amenities',
      count: facilities.length,
      subtitle: `${availableFacilitiesCount} active on property`,
      icon: <Sparkles className="w-5 h-5 text-[#BF8641]" />,
      route: '/admin/facilities',
      badge: 'Live',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      title: 'FAQs & Guidance',
      count: faqs.length,
      subtitle: `${publishedFaqsCount} published live`,
      icon: <HelpCircle className="w-5 h-5 text-[#BF8641]" />,
      route: '/admin/faqs',
      badge: `${faqs.length} Total`,
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      title: 'Dining & Menus',
      count: 24,
      subtitle: 'Breakfast, Dinner & Bar',
      icon: <UtensilsCrossed className="w-5 h-5 text-[#BF8641]" />,
      route: '/admin/dining',
      badge: 'Synced',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      title: 'Hotel Gallery',
      count: gallery.length,
      subtitle: `${gallery.filter((g) => g.is_featured).length} featured photos`,
      icon: <ImageIcon className="w-5 h-5 text-[#BF8641]" />,
      route: '/admin/gallery',
      badge: 'Optimized',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
  ];

  const recentActivity = [
    {
      id: 1,
      module: 'FAQs',
      action: 'Updated check-in/out policies (SV & EN)',
      user: 'Astrid Lindgren',
      time: '12m ago',
      icon: <HelpCircle className="w-4 h-4 text-[#BF8641]" />,
    },
    {
      id: 2,
      module: 'Dining & Bar',
      action: 'Added organic Swedish breakfast dietary tags',
      user: 'Henrik Larsson',
      time: '1h ago',
      icon: <UtensilsCrossed className="w-4 h-4 text-[#BF8641]" />,
    },
    {
      id: 3,
      module: 'Bar & Drinks',
      action: 'Refreshed Nordic artisanal craft cocktail prices',
      user: 'Bar Manager',
      time: '3h ago',
      icon: <Wine className="w-4 h-4 text-[#BF8641]" />,
    },
    {
      id: 4,
      module: 'Rooms',
      action: 'Verified Balladgatan transit distance on room cards',
      user: 'Admin Staff',
      time: 'Yesterday',
      icon: <BedDouble className="w-4 h-4 text-[#BF8641]" />,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <AdminPageHeader
        title="Hotel Nordic Gate CMS"
        subtitle="Manage public hotel website copy, accommodations, bilingual texts, and guest services."
        badge={
          <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Website Live
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="md"
              leftIcon={<ExternalLink className="w-4 h-4" />}
              onClick={() => navigate('/')}
            >
              View Live Website
            </Button>
            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => navigate('/admin/faqs')}
            >
              Add New FAQ
            </Button>
          </div>
        }
      />

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((card) => (
          <div
            key={card.title}
            onClick={() => navigate(card.route)}
            className="group bg-white p-5 rounded-xl border border-[#EDE7DC] shadow-xs hover:border-[#BF8641] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#F8F5EF] flex items-center justify-center border border-[#EDE7DC] group-hover:bg-[#EDE7DC]/60 transition-colors">
                  {card.icon}
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${card.badgeColor}`}
                >
                  {card.badge}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-[#0D1A26] tracking-tight">
                {card.count}
              </h3>
              <p className="text-sm font-semibold text-[#0D1A26] mt-0.5">
                {card.title}
              </p>
              <p className="text-xs text-[#5D6B78] mt-1">{card.subtitle}</p>
            </div>

            <div className="pt-4 mt-4 border-t border-[#EDE7DC]/70 flex items-center justify-between text-xs font-semibold text-[#BF8641] group-hover:text-[#8C5F27]">
              <span>Manage module</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout: Quick Actions + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left 2 Cols: Content Modules Quick Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#0D1A26] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#BF8641]" />
              Website Content Modules
            </h2>
            <span className="text-xs text-[#5D6B78]">
              Select a module to edit live content
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {[
              {
                title: 'FAQs & Guest Help',
                desc: 'Bilingual questions on check-in, parking, pool, and breakfast.',
                route: '/admin/faqs',
                icon: <HelpCircle className="w-5 h-5 text-[#BF8641]" />,
              },
              {
                title: 'Rooms & Suites',
                desc: 'Rates, bed configurations, square meters, and amenities.',
                route: '/admin/rooms',
                icon: <BedDouble className="w-5 h-5 text-[#BF8641]" />,
              },
              {
                title: 'Restaurant & Dining',
                desc: 'Organic Scandinavian breakfast buffet and dinner menus.',
                route: '/admin/dining',
                icon: <UtensilsCrossed className="w-5 h-5 text-[#BF8641]" />,
              },
              {
                title: 'Bar & Drinks',
                desc: 'Signature cocktails, Swedish craft beers, and bar snacks.',
                route: '/admin/bar',
                icon: <Wine className="w-5 h-5 text-[#BF8641]" />,
              },
              {
                title: 'Facilities & Wellness',
                desc: 'Heated indoor pool, Finnish sauna, jacuzzi, and partner gym.',
                route: '/admin/facilities',
                icon: <Sparkles className="w-5 h-5 text-[#BF8641]" />,
              },
              {
                title: 'Hotel Policies',
                desc: 'Cash-free policies, check-in times, pet fee rules.',
                route: '/admin/policies',
                icon: <ShieldCheck className="w-5 h-5 text-[#BF8641]" />,
              },
            ].map((module) => (
              <div
                key={module.title}
                onClick={() => navigate(module.route)}
                className="p-4 bg-white rounded-xl border border-[#EDE7DC] hover:border-[#BF8641] transition-all cursor-pointer group flex items-start gap-3.5"
              >
                <div className="p-2.5 rounded-lg bg-[#F8F5EF] text-[#BF8641] group-hover:bg-[#EDE7DC]/80 transition-colors shrink-0">
                  {module.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs sm:text-sm font-bold text-[#0D1A26] group-hover:text-[#BF8641] transition-colors truncate">
                      {module.title}
                    </h3>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-[#BF8641] transition-all group-hover:translate-x-0.5 shrink-0" />
                  </div>
                  <p className="text-xs text-[#5D6B78] mt-1 line-clamp-2 leading-relaxed">
                    {module.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Recent Updates & Publishing Status */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-[#EDE7DC] p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#EDE7DC] mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#BF8641]" />
                Recent CMS Changes
              </h3>
            </div>

            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 text-xs">
                  <div className="p-1.5 rounded-md bg-[#F8F5EF] text-[#BF8641] shrink-0 mt-0.5">
                    {activity.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[#0D1A26] leading-tight">
                      {activity.action}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-[#5D6B78]">
                      <span>{activity.user}</span>
                      <span>·</span>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Environment Information */}
          <div className="bg-[#0D1A26] text-[#F8F5EF] rounded-xl p-5 border border-[#25303A] shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F2C777] mb-2">
              System Environment
            </h4>
            <div className="space-y-2 text-xs text-stone-300">
              <div className="flex justify-between py-1 border-b border-white/10">
                <span className="text-stone-400">CMS Engine:</span>
                <span className="font-semibold text-white">Vite / React 19</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/10">
                <span className="text-stone-400">Primary Font:</span>
                <span className="font-semibold text-white">Plus Jakarta Sans</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/10">
                <span className="text-stone-400">Bilingual Engine:</span>
                <span className="font-semibold text-white">SV (Primary) / EN</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-stone-400">Property Location:</span>
                <span className="font-semibold text-white truncate max-w-[150px]">
                  Gamla Tingstadsgatan 1
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
