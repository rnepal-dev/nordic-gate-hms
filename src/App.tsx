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

function AppContent() {
  const { currentRoute } = useHotel();

  // Route matching
  const renderCurrentView = () => {
    if (currentRoute === '/') {
      return <HomeView />;
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
      return <DiningView />;
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

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5EF] text-[#25303A] antialiased selection:bg-[#F2C777]/30 selection:text-[#02070D]">
      {!isHmsView && <Navbar />}
      <main className="flex-1">
        {renderCurrentView()}
      </main>
      {!isHmsView && <Footer />}
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
