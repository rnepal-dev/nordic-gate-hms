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

function AppContent() {
  const { currentRoute } = useHotel();

  // Route matching
  const renderCurrentView = () => {
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
  const isDedicatedAuthView = 
    currentRoute === '/login' || 
    currentRoute === '/auth' || 
    currentRoute === '/forgot-password' || 
    currentRoute === '/reset-password' || 
    currentRoute === '/unauthorized' || 
    currentRoute === '/access-denied';

  const hidePublicChrome = isHmsView || isDedicatedAuthView;

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
