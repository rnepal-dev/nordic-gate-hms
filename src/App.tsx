import React from 'react';
import { HotelProvider, useHotel } from './context/HotelContext.tsx';
import { Navbar } from './components/layout/Navbar.tsx';
import { Footer } from './components/layout/Footer.tsx';
import { HomeView } from './views/HomeView.tsx';
import { RoomsView } from './views/RoomsView.tsx';
import { RoomDetailView } from './views/RoomDetailView.tsx';
import { DiningView } from './views/DiningView.tsx';
import { SpaView } from './views/SpaView.tsx';
import { OurStoryView } from './views/OurStoryView.tsx';
import { BookingEngineView } from './views/BookingEngineView.tsx';
import { GuestPortalView } from './views/GuestPortalView.tsx';
import { StaffDashboardView } from './views/StaffDashboardView.tsx';
import { FaqView } from './views/FaqView.tsx';
import { LoginView } from './views/LoginView.tsx';
import { ForgotPasswordView } from './views/ForgotPasswordView.tsx';
import { ResetPasswordView } from './views/ResetPasswordView.tsx';
import { UnauthorizedView } from './views/UnauthorizedView.tsx';

import { AdminLayout } from './components/admin/AdminLayout.tsx';
import { AdminDashboardView } from './features/admin/dashboard/AdminDashboardView.tsx';
import { FaqListView } from './features/admin/faqs/FaqListView.tsx';
import { FacilityListView } from './features/admin/facilities/FacilityListView.tsx';
import { GalleryListView } from './features/admin/gallery/GalleryListView.tsx';
import { RoomListView } from './features/admin/rooms/RoomListView.tsx';
import { RoomTypeListView } from './features/admin/room-types/RoomTypeListView.tsx';
import { RoomAmenityListView } from './features/admin/room-amenities/RoomAmenityListView.tsx';
import { ModulePlaceholderView } from './features/admin/common/ModulePlaceholderView.tsx';
import type { BreadcrumbItem } from './components/admin/AdminBreadcrumbs.tsx';

function AppContent() {
  const { currentRoute } = useHotel();

  // Helper to determine breadcrumbs and admin view
  const renderAdminView = () => {
    let breadcrumbs: BreadcrumbItem[] = [];
    let childView: React.ReactNode = null;

    if (currentRoute === '/admin' || currentRoute === '/admin/') {
      breadcrumbs = [{ label: 'Dashboard' }];
      childView = <AdminDashboardView />;
    } else if (currentRoute === '/admin/rooms' || currentRoute.startsWith('/admin/rooms/')) {
      breadcrumbs = [{ label: 'Physical Rooms', route: '/admin/rooms' }];
      childView = <RoomListView />;
    } else if (currentRoute === '/admin/room-types' || currentRoute.startsWith('/admin/room-types/')) {
      breadcrumbs = [{ label: 'Room Types', route: '/admin/room-types' }];
      childView = <RoomTypeListView />;
    } else if (currentRoute === '/admin/room-amenities' || currentRoute.startsWith('/admin/room-amenities/')) {
      breadcrumbs = [{ label: 'Room Amenities', route: '/admin/room-amenities' }];
      childView = <RoomAmenityListView />;
    } else if (currentRoute === '/admin/faqs' || currentRoute.startsWith('/admin/faqs/')) {
      breadcrumbs = [{ label: 'FAQs Management', route: '/admin/faqs' }];
      childView = <FaqListView />;
    } else if (currentRoute === '/admin/dining') {
      breadcrumbs = [{ label: 'Restaurant & Dining', route: '/admin/dining' }];
      childView = <ModulePlaceholderView moduleKey="dining" />;
    } else if (currentRoute === '/admin/bar') {
      breadcrumbs = [{ label: 'Bar & Drinks', route: '/admin/bar' }];
      childView = <ModulePlaceholderView moduleKey="bar" />;
    } else if (currentRoute === '/admin/facilities' || currentRoute.startsWith('/admin/facilities/')) {
      breadcrumbs = [{ label: 'Facilities & Amenities', route: '/admin/facilities' }];
      childView = <FacilityListView />;
    } else if (currentRoute === '/admin/testimonials') {
      breadcrumbs = [{ label: 'Testimonials & Reviews', route: '/admin/testimonials' }];
      childView = <ModulePlaceholderView moduleKey="testimonials" />;
    } else if (currentRoute === '/admin/spa') {
      breadcrumbs = [{ label: 'Spa & Wellness', route: '/admin/spa' }];
      childView = <ModulePlaceholderView moduleKey="spa" />;
    } else if (currentRoute === '/admin/offers') {
      breadcrumbs = [{ label: 'Offers & Packages', route: '/admin/offers' }];
      childView = <ModulePlaceholderView moduleKey="offers" />;
    } else if (currentRoute === '/admin/gallery' || currentRoute.startsWith('/admin/gallery/')) {
      breadcrumbs = [{ label: 'Hotel Gallery', route: '/admin/gallery' }];
      childView = <GalleryListView />;
    } else if (currentRoute === '/admin/about') {
      breadcrumbs = [{ label: 'About Hotel', route: '/admin/about' }];
      childView = <ModulePlaceholderView moduleKey="about" />;
    } else if (currentRoute === '/admin/contact') {
      breadcrumbs = [{ label: 'Contact & Hotel Info', route: '/admin/contact' }];
      childView = <ModulePlaceholderView moduleKey="contact" />;
    } else if (currentRoute === '/admin/policies') {
      breadcrumbs = [{ label: 'Hotel Policies', route: '/admin/policies' }];
      childView = <ModulePlaceholderView moduleKey="policies" />;
    } else if (currentRoute === '/admin/settings') {
      breadcrumbs = [{ label: 'Website Settings', route: '/admin/settings' }];
      childView = <ModulePlaceholderView moduleKey="settings" />;
    } else {
      // Fallback within admin
      breadcrumbs = [{ label: 'Dashboard' }];
      childView = <AdminDashboardView />;
    }

    return <AdminLayout breadcrumbs={breadcrumbs}>{childView}</AdminLayout>;
  };

  // Route matching
  const renderCurrentView = () => {
    if (currentRoute.startsWith('/admin')) {
      return renderAdminView();
    }
    if (currentRoute === '/') {
      return <HomeView />;
    }
    if (currentRoute === '/login' || currentRoute === '/auth') {
      return <LoginView />;
    }
    if (currentRoute === '/forgot-password') {
      return <ForgotPasswordView />;
    }
    if (currentRoute === '/reset-password') {
      return <ResetPasswordView />;
    }
    if (currentRoute === '/unauthorized' || currentRoute === '/access-denied') {
      return <UnauthorizedView />;
    }
    if (currentRoute === '/rooms') {
      return <RoomsView />;
    }
    if (currentRoute.startsWith('/rooms/')) {
      const slug = currentRoute.replace('/rooms/', '');
      return <RoomDetailView slug={slug} />;
    }
    if (currentRoute === '/faq' || currentRoute === '/hotel-info' || currentRoute === '/facilities' || currentRoute === '/contact') {
      return <FaqView />;
    }
    if (currentRoute === '/dining' || currentRoute === '/restaurant') {
      return <DiningView initialTab="all" />;
    }
    if (currentRoute === '/bar' || currentRoute === '/drinks') {
      return <DiningView initialTab="bar" />;
    }
    if (currentRoute === '/spa' || currentRoute === '/wellness') {
      return <SpaView />;
    }
    if (currentRoute === '/our-story' || currentRoute === '/about') {
      return <OurStoryView />;
    }
    if (currentRoute === '/booking') {
      return <BookingEngineView />;
    }
    if (currentRoute === '/guest') {
      return <GuestPortalView />;
    }
    if (currentRoute.startsWith('/app')) {
      return <StaffDashboardView />;
    }

    // Default fallback to Home
    return <HomeView />;
  };

  const isHmsView = currentRoute.startsWith('/app');
  const isAdminView = currentRoute.startsWith('/admin');
  const isDedicatedAuthView = 
    currentRoute === '/login' || 
    currentRoute === '/auth' || 
    currentRoute === '/forgot-password' || 
    currentRoute === '/reset-password' || 
    currentRoute === '/unauthorized' || 
    currentRoute === '/access-denied';

  const hidePublicChrome = isHmsView || isDedicatedAuthView || isAdminView;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5EF] text-[#25303A] antialiased selection:bg-[#F2C777]/30 selection:text-[#02070D]">
      {!hidePublicChrome && <Navbar />}
      <main className="flex-1">
        {renderCurrentView()}
      </main>
      {!hidePublicChrome && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <HotelProvider>
      <AppContent />
    </HotelProvider>
  );
}
