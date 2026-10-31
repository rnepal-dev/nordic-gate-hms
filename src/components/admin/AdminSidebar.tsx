import React from 'react';
import {
  LayoutDashboard,
  DoorClosed,
  BedDouble,
  UtensilsCrossed,
  Wine,
  HelpCircle,
  Sparkles,
  MessageSquareQuote,
  Waves,
  Tag,
  Image as ImageIcon,
  BookOpen,
  PhoneCall,
  ShieldAlert,
  Settings,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Hotel,
  X,
} from 'lucide-react';
import { useHotel } from '../../context/HotelContext';

export interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  label: string;
  route: string;
  icon: React.ReactNode;
  badge?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => {
  const { currentRoute, navigate } = useHotel();

  const navGroups: NavGroup[] = [
    {
      title: 'Overview',
      items: [
        {
          label: 'Dashboard',
          route: '/admin',
          icon: <LayoutDashboard className="w-4 h-4 shrink-0" />,
        },
      ],
    },
    {
      title: 'Room Management',
      items: [
        {
          label: 'Physical Rooms',
          route: '/admin/rooms',
          icon: <DoorClosed className="w-4 h-4 shrink-0" />,
        },
        {
          label: 'Room Types',
          route: '/admin/room-types',
          icon: <BedDouble className="w-4 h-4 shrink-0" />,
        },
        {
          label: 'Room Amenities',
          route: '/admin/room-amenities',
          icon: <Sparkles className="w-4 h-4 shrink-0" />,
        },
      ],
    },
    {
      title: 'Website Content',
      items: [
        {
          label: 'Restaurant & Dining',
          route: '/admin/dining',
          icon: <UtensilsCrossed className="w-4 h-4 shrink-0" />,
        },
        {
          label: 'Bar & Drinks',
          route: '/admin/bar',
          icon: <Wine className="w-4 h-4 shrink-0" />,
        },
        {
          label: 'FAQs',
          route: '/admin/faqs',
          icon: <HelpCircle className="w-4 h-4 shrink-0" />,
        },
        {
          label: 'Facilities & Amenities',
          route: '/admin/facilities',
          icon: <Sparkles className="w-4 h-4 shrink-0" />,
        },
        {
          label: 'Testimonials',
          route: '/admin/testimonials',
          icon: <MessageSquareQuote className="w-4 h-4 shrink-0" />,
        },
        {
          label: 'Spa & Wellness',
          route: '/admin/spa',
          icon: <Waves className="w-4 h-4 shrink-0" />,
        },
        {
          label: 'Offers & Packages',
          route: '/admin/offers',
          icon: <Tag className="w-4 h-4 shrink-0" />,
        },
        {
          label: 'Gallery & Media',
          route: '/admin/gallery',
          icon: <ImageIcon className="w-4 h-4 shrink-0" />,
        },
        {
          label: 'About Hotel',
          route: '/admin/about',
          icon: <BookOpen className="w-4 h-4 shrink-0" />,
        },
        {
          label: 'Contact & Hotel Info',
          route: '/admin/contact',
          icon: <PhoneCall className="w-4 h-4 shrink-0" />,
        },
        {
          label: 'Hotel Policies',
          route: '/admin/policies',
          icon: <ShieldAlert className="w-4 h-4 shrink-0" />,
        },
      ],
    },
    {
      title: 'Administration',
      items: [
        {
          label: 'Website Settings',
          route: '/admin/settings',
          icon: <Settings className="w-4 h-4 shrink-0" />,
        },
      ],
    },
  ];

  const handleNavigate = (route: string) => {
    navigate(route);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0D1A26] text-[#F8F5EF] select-none border-r border-[#0D1A26]/80">
      {/* Brand Header */}
      <div className="flex items-center justify-between h-18 px-4 border-b border-[#25303A]">
        <div
          onClick={() => handleNavigate('/admin')}
          className="flex items-center gap-2.5 cursor-pointer overflow-hidden"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#BF8641] to-[#8C5F27] flex items-center justify-center text-white shrink-0 shadow-xs">
            <Hotel className="w-5 h-5" />
          </div>
          {(!isCollapsed || mobileOpen) && (
            <div className="min-w-0 transition-opacity duration-200">
              <span className="font-brand-logo text-base tracking-wide text-[#F8F5EF] block truncate leading-tight">
                Nordic Gate
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] tracking-widest uppercase text-[#D3C8B9]">
                  CMS
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#BF8641]/25 text-[#F2C777] font-semibold">
                  v2.0
                </span>
              </div>
            </div>
          )}
        </div>

        {mobileOpen && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="p-1.5 text-stone-400 hover:text-white rounded-md cursor-pointer lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-4 px-2.5 space-y-6 scrollbar-thin">
        {navGroups.map((group) => (
          <div key={group.title}>
            {(!isCollapsed || mobileOpen) && (
              <p className="px-3 mb-2 text-[10px] font-bold tracking-wider uppercase text-stone-400">
                {group.title}
              </p>
            )}
            <ul className="space-y-1">
              {group.items.map((item) => {
                const isActive =
                  item.route === '/admin'
                    ? currentRoute === '/admin'
                    : currentRoute === item.route || currentRoute.startsWith(`${item.route}/`);

                return (
                  <li key={item.route}>
                    <button
                      type="button"
                      onClick={() => handleNavigate(item.route)}
                      title={isCollapsed && !mobileOpen ? item.label : undefined}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#BF8641] text-white shadow-xs'
                          : 'text-stone-300 hover:bg-[#25303A]/60 hover:text-white'
                      } ${isCollapsed && !mobileOpen ? 'justify-center px-0' : ''}`}
                    >
                      {item.icon}
                      {(!isCollapsed || mobileOpen) && (
                        <span className="truncate flex-1 text-left">
                          {item.label}
                        </span>
                      )}
                      {item.badge && (!isCollapsed || mobileOpen) && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/20 text-white font-bold">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom Switcher & Actions */}
      <div className="p-3 border-t border-[#25303A] space-y-1 bg-[#02070D]/40">
        <button
          type="button"
          onClick={() => navigate('/')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-stone-300 hover:bg-[#25303A]/70 hover:text-white transition-colors cursor-pointer ${
            isCollapsed && !mobileOpen ? 'justify-center px-0' : ''
          }`}
          title="Visit Public Website"
        >
          <ExternalLink className="w-4 h-4 shrink-0 text-[#F2C777]" />
          {(!isCollapsed || mobileOpen) && <span>View Live Website</span>}
        </button>

        <button
          type="button"
          onClick={() => navigate('/app')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-stone-300 hover:bg-[#25303A]/70 hover:text-white transition-colors cursor-pointer ${
            isCollapsed && !mobileOpen ? 'justify-center px-0' : ''
          }`}
          title="Hotel Operations HMS"
        >
          <Hotel className="w-4 h-4 shrink-0 text-[#BF8641]" />
          {(!isCollapsed || mobileOpen) && <span>Operations (HMS)</span>}
        </button>

        {/* Desktop Collapse Toggle */}
        <div className="hidden lg:block pt-2">
          <button
            type="button"
            onClick={onToggleCollapse}
            className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-stone-400 hover:text-white hover:bg-[#25303A]/50 transition-colors cursor-pointer ${
              isCollapsed ? 'justify-center px-0' : 'justify-between'
            }`}
          >
            {!isCollapsed && <span>Collapse Sidebar</span>}
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 transition-all duration-200 z-30 sticky top-0 h-screen ${
          isCollapsed ? 'w-18' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-[#02070D]/70 backdrop-blur-xs"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
