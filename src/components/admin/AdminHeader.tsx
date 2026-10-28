import React, { useState } from 'react';
import {
  Menu,
  Bell,
  Search,
  User,
  LogOut,
  ChevronDown,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useHotel } from '../../context/HotelContext';
import { AdminBreadcrumbs, BreadcrumbItem } from './AdminBreadcrumbs';

export interface AdminHeaderProps {
  onOpenMobileSidebar: () => void;
  breadcrumbs?: BreadcrumbItem[];
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onOpenMobileSidebar,
  breadcrumbs = [],
}) => {
  const { currentUser, logout, navigate } = useHotel();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const notifications = [
    {
      id: '1',
      title: 'FAQ item published',
      time: '12m ago',
      read: false,
    },
    {
      id: '2',
      title: 'New room photo synced to CDN',
      time: '1h ago',
      read: true,
    },
    {
      id: '3',
      title: 'Dining menu revision saved',
      time: '3h ago',
      read: true,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-20 w-full h-16 bg-white border-b border-[#EDE7DC] px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle + Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 text-stone-600 hover:text-[#0D1A26] hover:bg-[#F8F5EF] rounded-lg cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block min-w-0">
          <AdminBreadcrumbs items={breadcrumbs} />
        </div>
      </div>

      {/* Right: Search, Notifications, Profile */}
      <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
        {/* Quick global search */}
        <div className="hidden md:flex items-center relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Quick search CMS..."
            className="pl-8 pr-3 py-1.5 text-xs bg-[#F8F5EF]/80 border border-[#D3C8B9] rounded-lg text-[#0D1A26] placeholder-stone-400 w-48 lg:w-60 focus:bg-white focus:outline-none focus:border-[#BF8641] transition-all"
          />
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setProfileOpen(false);
            }}
            className="relative p-2 text-stone-500 hover:text-[#0D1A26] hover:bg-[#F8F5EF] rounded-lg transition-colors cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#BF8641] ring-2 ring-white" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-[#EDE7DC] p-3 text-xs z-30 animate-in fade-in duration-100">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#EDE7DC]">
                <span className="font-bold text-[#0D1A26]">Notifications</span>
                <span className="text-[10px] text-[#BF8641] font-semibold">
                  1 unread
                </span>
              </div>
              <div className="space-y-2">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2 rounded-lg transition-colors ${
                      n.read ? 'hover:bg-[#F8F5EF]/60' : 'bg-amber-50/60'
                    }`}
                  >
                    <p className="font-medium text-[#0D1A26]">{n.title}</p>
                    <p className="text-[10px] text-stone-400 mt-0.5">{n.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotificationsOpen(false);
            }}
            className="flex items-center gap-2.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg hover:bg-[#F8F5EF] transition-colors border border-transparent hover:border-[#EDE7DC] cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-[#0D1A26] text-[#F2C777] flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              {currentUser?.name ? currentUser.name.charAt(0) : 'A'}
            </div>
            <div className="hidden sm:block text-left min-w-0">
              <p className="text-xs font-bold text-[#0D1A26] truncate leading-tight">
                {currentUser?.name || 'Hotel Admin'}
              </p>
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#BF8641]" />
                <span className="text-[10px] text-[#5D6B78] uppercase tracking-wider font-semibold">
                  CMS Master
                </span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-stone-400 hidden sm:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-[#EDE7DC] p-2 text-xs z-30 animate-in fade-in duration-100">
              <div className="px-3 py-2 border-b border-[#EDE7DC] mb-1">
                <p className="font-bold text-[#0D1A26]">{currentUser?.name || 'Administrator'}</p>
                <p className="text-[11px] text-stone-400 truncate">
                  {currentUser?.email || 'admin@nordicgate.se'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false);
                  navigate('/admin/settings');
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-stone-600 hover:text-[#0D1A26] hover:bg-[#F8F5EF] text-left cursor-pointer"
              >
                <User className="w-4 h-4 text-stone-400" />
                <span>Admin Settings</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false);
                  navigate('/app');
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-stone-600 hover:text-[#0D1A26] hover:bg-[#F8F5EF] text-left cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-[#BF8641]" />
                <span>Switch to HMS</span>
              </button>

              <div className="border-t border-[#EDE7DC] my-1" />

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 text-left font-medium cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
