import React, { useState, useMemo } from 'react';
import { useHotel } from '../context/HotelContext.tsx';
import { calculateHotelKPIs } from '../lib/hotel-logic.ts';
import { formatSEK } from '../lib/pricing.ts';
import type { RoomInventoryItem, StaffRole } from '../types/hotel.ts';
import { 
  Building2, 
  Bed, 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Wrench, 
  LogOut, 
  ArrowRight, 
  Search,
  Filter,
  Check,
  RefreshCw,
  Home,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const StaffDashboardView: React.FC = () => {
  const { 
    lang, 
    rooms, 
    reservations, 
    roomCategories, 
    staffList, 
    activeStaffRole, 
    setActiveStaffRole,
    checkInReservation,
    checkOutReservation,
    updateRoomHousekeeping,
    toggleMaintenance,
    navigate 
  } = useHotel();

  const [activeTab, setActiveTab] = useState<'overview' | 'rooms' | 'frontdesk' | 'housekeeping' | 'reservations'>('overview');
  const [selectedFloor, setSelectedFloor] = useState<number>(0);
  const [cleanlinessFilter, setCleanlinessFilter] = useState<string>('all');
  const [reservationSearch, setReservationSearch] = useState<string>('');

  // Selected reservation for check-in action
  const [selectedResForCheckIn, setSelectedResForCheckIn] = useState<string | null>(null);
  const [assignedRoomForCheckIn, setAssignedRoomForCheckIn] = useState<string>('');

  const kpis = useMemo(() => {
    return calculateHotelKPIs(rooms, reservations, '2026-10-17');
  }, [rooms, reservations]);

  // Filtered rooms
  const displayRooms = useMemo(() => {
    return rooms.filter(r => {
      if (selectedFloor > 0 && r.floor !== selectedFloor) return false;
      if (cleanlinessFilter !== 'all' && r.cleanlinessStatus !== cleanlinessFilter) return false;
      return true;
    });
  }, [rooms, selectedFloor, cleanlinessFilter]);

  // Today arrivals & departures
  const todayArrivals = reservations.filter(r => r.checkInDate === '2026-10-17' && r.status === 'confirmed');
  const todayDepartures = reservations.filter(r => r.checkOutDate === '2026-10-17' && r.status === 'checked_in');
  const inHouseGuests = reservations.filter(r => r.status === 'checked_in');

  const handleCheckInSubmit = (resId: string) => {
    if (!assignedRoomForCheckIn) return;
    checkInReservation(resId, assignedRoomForCheckIn);
    setSelectedResForCheckIn(null);
    setAssignedRoomForCheckIn('');
  };

  return (
    <div className="min-h-screen bg-[#F8F5EF] flex flex-col">
      
      {/* Top Staff Navigation Header */}
      <header className="bg-[#0D1A26] text-white border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-xs text-[#D3C8B9] hover:text-[#F2C777] transition-colors cursor-pointer py-1 px-2 border border-white/10 rounded"
              title="Gå till gästwebbplatsen"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Gästwebb</span>
            </button>
            <div className="h-4 w-px bg-white/20" />
            <div>
              <span className="font-serif text-lg tracking-wide text-[#F8F5EF]">
                Hotel Nordic Gate HMS
              </span>
              <span className="hidden sm:inline-block text-[10px] tracking-wider text-[#F2C777] ml-2 uppercase">
                Gothenburg Property · Operations
              </span>
            </div>
          </div>

          {/* Role selector & Date */}
          <div className="flex items-center gap-4 text-xs">
            <div className="hidden md:flex items-center gap-1.5 text-stone-300">
              <Calendar className="w-3.5 h-3.5 text-[#F2C777]" />
              <span className="tabular-nums">Lördag 17 Okt 2026</span>
            </div>

            {/* Staff Role Switcher */}
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
              <ShieldCheck className="w-4 h-4 text-[#F2C777]" />
              <span className="text-[11px] text-stone-300 hidden sm:inline">Roll:</span>
              <select
                value={activeStaffRole}
                onChange={(e) => setActiveStaffRole(e.target.value as StaffRole)}
                className="bg-transparent text-white font-medium text-xs focus:outline-none cursor-pointer"
              >
                <option value="owner" className="bg-[#0D1A26]">Hotellägare (Super Admin)</option>
                <option value="manager" className="bg-[#0D1A26]">Hotellchef (General Manager)</option>
                <option value="receptionist" className="bg-[#0D1A26]">Receptionist (Front Desk)</option>
                <option value="housekeeping_lead" className="bg-[#0D1A26]">Housekeeping Supervisor</option>
                <option value="accountant" className="bg-[#0D1A26]">Ekonom / Redovisning</option>
              </select>
            </div>
          </div>

        </div>

        {/* Tab Navigation Row */}
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-2 overflow-x-auto text-xs border-t border-white/5 py-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 font-medium transition-colors rounded cursor-pointer whitespace-nowrap ${
              activeTab === 'overview' ? 'bg-[#BF8641] text-white font-bold' : 'text-stone-300 hover:text-white'
            }`}
          >
            Översikt & KPI
          </button>
          <button
            onClick={() => setActiveTab('rooms')}
            className={`px-4 py-2 font-medium transition-colors rounded cursor-pointer whitespace-nowrap ${
              activeTab === 'rooms' ? 'bg-[#BF8641] text-white font-bold' : 'text-stone-300 hover:text-white'
            }`}
          >
            Rumsöversikt (48 rum)
          </button>
          <button
            onClick={() => setActiveTab('frontdesk')}
            className={`px-4 py-2 font-medium transition-colors rounded cursor-pointer whitespace-nowrap ${
              activeTab === 'frontdesk' ? 'bg-[#BF8641] text-white font-bold' : 'text-stone-300 hover:text-white'
            }`}
          >
            Reception & Incheckning ({todayArrivals.length} ankomster)
          </button>
          <button
            onClick={() => setActiveTab('housekeeping')}
            className={`px-4 py-2 font-medium transition-colors rounded cursor-pointer whitespace-nowrap ${
              activeTab === 'housekeeping' ? 'bg-[#BF8641] text-white font-bold' : 'text-stone-300 hover:text-white'
            }`}
          >
            Städ & Housekeeping ({kpis.dirtyRooms + kpis.cleaningRooms} aktiva)
          </button>
          <button
            onClick={() => setActiveTab('reservations')}
            className={`px-4 py-2 font-medium transition-colors rounded cursor-pointer whitespace-nowrap ${
              activeTab === 'reservations' ? 'bg-[#BF8641] text-white font-bold' : 'text-stone-300 hover:text-white'
            }`}
          >
            Bokningsregister ({reservations.length})
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full space-y-8">
        
        {/* TAB 1: OVERVIEW & KPIS */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* KPI Cards Row (Tabular figures per rule D) */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              
              <div className="bg-white p-4 rounded-xl border border-[#EDE7DC] shadow-sm">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">Beläggning</span>
                <span className="font-serif text-3xl font-bold text-slate-900 tabular-nums">{kpis.occupancyRatePct}%</span>
                <span className="text-[10px] text-slate-500 block mt-1">{kpis.occupiedRooms} av {kpis.totalRooms} rum</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#EDE7DC] shadow-sm">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">Dagens Ankomster</span>
                <span className="font-serif text-3xl font-bold text-[#BF8641] tabular-nums">{todayArrivals.length}</span>
                <span className="text-[10px] text-slate-500 block mt-1">Incheckningar kvar</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#EDE7DC] shadow-sm">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">Dagens Avresor</span>
                <span className="font-serif text-3xl font-bold text-slate-900 tabular-nums">{todayDepartures.length}</span>
                <span className="text-[10px] text-slate-500 block mt-1">Utcheckningar idag</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#EDE7DC] shadow-sm">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">Gäster i Huset</span>
                <span className="font-serif text-3xl font-bold text-slate-900 tabular-nums">{kpis.inHouseGuests}</span>
                <span className="text-[10px] text-slate-500 block mt-1">Boende gäster</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#EDE7DC] shadow-sm">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">ADR (Snittpris)</span>
                <span className="font-serif text-2xl font-bold text-slate-900 tabular-nums">{formatSEK(kpis.adrSEK, 'sv')}</span>
                <span className="text-[10px] text-slate-500 block mt-1">Per sålt rum</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#EDE7DC] shadow-sm">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">RevPAR</span>
                <span className="font-serif text-2xl font-bold text-[#BF8641] tabular-nums">{formatSEK(kpis.revParSEK, 'sv')}</span>
                <span className="text-[10px] text-slate-500 block mt-1">Per tillgängligt rum</span>
              </div>

            </div>

            {/* Two-column operational focus */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left 7 cols: Today's Front Desk Queue */}
              <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-[#EDE7DC] shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <h3 className="font-serif text-xl font-bold text-slate-900">
                    Väntande Ankomster Idag (17 Okt)
                  </h3>
                  <button
                    onClick={() => setActiveTab('frontdesk')}
                    className="text-xs text-[#BF8641] hover:underline font-semibold cursor-pointer"
                  >
                    Öppna Receptionspanel →
                  </button>
                </div>

                {todayArrivals.length > 0 ? (
                  <div className="divide-y divide-neutral-100 text-xs">
                    {todayArrivals.map((res) => {
                      const resRoom = roomCategories.find(c => c.id === res.roomCategoryId);

                      return (
                        <div key={res.id} className="py-3 flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-sm">{res.guestName}</span>
                              <span className="font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded">{res.bookingReference}</span>
                            </div>
                            <p className="text-slate-500 mt-0.5">
                              {resRoom?.nameSv} · {res.nights} nätter · {res.adults} vuxna
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              setActiveTab('frontdesk');
                              setSelectedResForCheckIn(res.id);
                            }}
                            className="px-3 py-1.5 bg-[#BF8641] hover:bg-[#8C5F27] text-white font-semibold rounded text-xs cursor-pointer"
                          >
                            Checka In
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 py-4">Inga fler ankomster väntar idag.</p>
                )}
              </div>

              {/* Right 5 cols: Housekeeping Status Summary */}
              <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-[#EDE7DC] shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <h3 className="font-serif text-xl font-bold text-slate-900">
                    Städstatus Hotell
                  </h3>
                  <button
                    onClick={() => setActiveTab('housekeeping')}
                    className="text-xs text-[#BF8641] hover:underline font-semibold cursor-pointer"
                  >
                    Städlista →
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center p-2.5 bg-emerald-50 rounded border border-emerald-100">
                    <span className="font-medium text-emerald-800">Inspekterade & Klara för gäst:</span>
                    <span className="font-bold text-emerald-900 text-sm tabular-nums">{kpis.inspectedRooms} rum</span>
                  </div>

                  <div className="flex justify-between items-center p-2.5 bg-blue-50 rounded border border-blue-100">
                    <span className="font-medium text-blue-800">Pågående städning:</span>
                    <span className="font-bold text-blue-900 text-sm tabular-nums">{kpis.cleaningRooms} rum</span>
                  </div>

                  <div className="flex justify-between items-center p-2.5 bg-amber-50 rounded border border-amber-100">
                    <span className="font-medium text-amber-800">Smutsiga (Behöver städas):</span>
                    <span className="font-bold text-amber-900 text-sm tabular-nums">{kpis.dirtyRooms} rum</span>
                  </div>

                  <div className="flex justify-between items-center p-2.5 bg-rose-50 rounded border border-rose-100">
                    <span className="font-medium text-rose-800">Avställda (Underhåll):</span>
                    <span className="font-bold text-rose-900 text-sm tabular-nums">{kpis.outOfServiceRooms} rum</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: ROOM MANAGEMENT (48 ROOM MATRIX) */}
        {activeTab === 'rooms' && (
          <div className="space-y-6">
            
            {/* Filter controls */}
            <div className="bg-white p-4 rounded-xl border border-[#EDE7DC] flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-600">Våning:</span>
                <div className="flex gap-1 bg-[#F8F5EF] p-1 rounded">
                  <button
                    onClick={() => setSelectedFloor(0)}
                    className={`px-3 py-1 rounded cursor-pointer ${selectedFloor === 0 ? 'bg-[#0D1A26] text-white font-bold' : 'text-slate-700'}`}
                  >
                    Alla (48)
                  </button>
                  <button
                    onClick={() => setSelectedFloor(1)}
                    className={`px-3 py-1 rounded cursor-pointer ${selectedFloor === 1 ? 'bg-[#0D1A26] text-white font-bold' : 'text-slate-700'}`}
                  >
                    Plan 1 (101-116)
                  </button>
                  <button
                    onClick={() => setSelectedFloor(2)}
                    className={`px-3 py-1 rounded cursor-pointer ${selectedFloor === 2 ? 'bg-[#0D1A26] text-white font-bold' : 'text-slate-700'}`}
                  >
                    Plan 2 (201-216)
                  </button>
                  <button
                    onClick={() => setSelectedFloor(3)}
                    className={`px-3 py-1 rounded cursor-pointer ${selectedFloor === 3 ? 'bg-[#0D1A26] text-white font-bold' : 'text-slate-700'}`}
                  >
                    Plan 3 (301-316)
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-600">Städstatus:</span>
                <select
                  value={cleanlinessFilter}
                  onChange={(e) => setCleanlinessFilter(e.target.value)}
                  className="bg-[#F8F5EF] border border-neutral-300 rounded p-1.5 focus:outline-none cursor-pointer"
                >
                  <option value="all">Alla statusar</option>
                  <option value="inspected">Inspekterad & Ren</option>
                  <option value="cleaning">Pågående städ</option>
                  <option value="dirty">Smutsig</option>
                  <option value="out_of_service">Ur funktion</option>
                </select>
              </div>
            </div>

            {/* 48 Room Visual Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {displayRooms.map((r) => {
                const isOccupied = r.occupancyStatus === 'occupied';
                const isDirty = r.cleanlinessStatus === 'dirty';
                const isCleaning = r.cleanlinessStatus === 'cleaning';
                const isOOS = r.maintenanceStatus === 'out_of_service';

                return (
                  <div
                    key={r.roomNumber}
                    className={`p-3 rounded-lg border flex flex-col justify-between transition-all ${
                      isOOS
                        ? 'bg-rose-50 border-rose-200'
                        : isOccupied
                        ? 'bg-slate-100 border-slate-300'
                        : 'bg-white border-[#EDE7DC] hover:border-[#BF8641]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-serif text-lg font-bold text-slate-900">{r.roomNumber}</span>
                        <span className="text-[10px] text-slate-500 font-medium">Pl {r.floor}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate">{r.categoryId}</p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-neutral-100 text-[10px] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Belagd:</span>
                        <span className={`font-semibold ${isOccupied ? 'text-blue-700' : 'text-emerald-700'}`}>
                          {isOccupied ? 'Upptagen' : 'Ledig'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Städ:</span>
                        <span className={`font-medium ${
                          isDirty ? 'text-amber-700' : isCleaning ? 'text-blue-700' : 'text-emerald-700'
                        }`}>
                          {r.cleanlinessStatus}
                        </span>
                      </div>
                    </div>

                    {/* Quick action controls */}
                    <div className="mt-2 pt-2 border-t border-neutral-100 flex items-center justify-between gap-1">
                      {isDirty && (
                        <button
                          onClick={() => updateRoomHousekeeping(r.roomNumber, 'start_cleaning')}
                          className="w-full py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 text-[10px] rounded font-semibold cursor-pointer text-center"
                        >
                          Starta städ
                        </button>
                      )}
                      {isCleaning && (
                        <button
                          onClick={() => updateRoomHousekeeping(r.roomNumber, 'finish_cleaning')}
                          className="w-full py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-[10px] rounded font-semibold cursor-pointer text-center"
                        >
                          Klar
                        </button>
                      )}
                      {r.cleanlinessStatus === 'clean' && (
                        <button
                          onClick={() => updateRoomHousekeeping(r.roomNumber, 'inspect')}
                          className="w-full py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] rounded font-semibold cursor-pointer text-center"
                        >
                          Godkänn
                        </button>
                      )}
                      {r.cleanlinessStatus === 'inspected' && !isOccupied && (
                        <span className="text-[10px] text-emerald-700 w-full text-center font-bold">Klar ✓</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* TAB 3: FRONT DESK CHECK-IN WORKFLOW */}
        {activeTab === 'frontdesk' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Arrivals list */}
              <div className="lg:col-span-6 bg-white p-6 rounded-xl border border-[#EDE7DC] shadow-sm space-y-4">
                <h3 className="font-serif text-xl font-bold text-slate-900">
                  Dagens Ankomster & Incheckning
                </h3>
                <p className="text-xs text-slate-500">
                  Välj en ankommande gäst för att tilldela ett rent rum och genomföra incheckning.
                </p>

                <div className="space-y-3 pt-2">
                  {todayArrivals.map((res) => {
                    const isSelected = selectedResForCheckIn === res.id;
                    const cat = roomCategories.find(c => c.id === res.roomCategoryId);

                    return (
                      <div
                        key={res.id}
                        onClick={() => setSelectedResForCheckIn(res.id)}
                        className={`p-4 rounded-lg border transition-all cursor-pointer ${
                          isSelected ? 'border-[#BF8641] bg-[#F8F5EF] ring-1 ring-[#BF8641]' : 'border-neutral-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between text-xs">
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{res.guestName}</p>
                            <p className="text-slate-500">{cat?.nameSv} · {res.nights} nätter ({res.checkInDate} – {res.checkOutDate})</p>
                            {res.specialRequests && (
                              <p className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded mt-1 text-[11px]">
                                Önskemål: {res.specialRequests}
                              </p>
                            )}
                          </div>
                          <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded">
                            {res.bookingReference}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Check-in Action Card */}
              <div className="lg:col-span-6 bg-white p-6 rounded-xl border border-[#EDE7DC] shadow-sm space-y-6">
                <h3 className="font-serif text-xl font-bold text-slate-900">
                  Genomför Incheckning
                </h3>

                {selectedResForCheckIn ? (
                  <div className="space-y-4 text-xs">
                    <div className="p-3 bg-[#F8F5EF] rounded-lg">
                      <span className="text-slate-500 block">Vald gäst:</span>
                      <span className="font-bold text-slate-900 text-sm">
                        {reservations.find(r => r.id === selectedResForCheckIn)?.guestName}
                      </span>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Välj ledigt, städat rum för tilldelning:
                      </label>
                      <select
                        value={assignedRoomForCheckIn}
                        onChange={(e) => setAssignedRoomForCheckIn(e.target.value)}
                        className="w-full bg-[#F8F5EF] border border-neutral-300 rounded p-2.5 text-xs text-slate-800 focus:outline-none cursor-pointer"
                      >
                        <option value="">-- Välj rumsnummer --</option>
                        {rooms
                          .filter(r => r.occupancyStatus === 'available' && r.maintenanceStatus === 'operational')
                          .map(r => (
                            <option key={r.roomNumber} value={r.roomNumber}>
                              Rum {r.roomNumber} (Plan {r.floor} · {r.categoryId} · {r.cleanlinessStatus})
                            </option>
                          ))}
                      </select>
                    </div>

                    <button
                      disabled={!assignedRoomForCheckIn}
                      onClick={() => handleCheckInSubmit(selectedResForCheckIn)}
                      className="w-full py-3 bg-[#BF8641] hover:bg-[#8C5F27] disabled:opacity-40 text-white font-semibold uppercase tracking-wider rounded transition-colors cursor-pointer"
                    >
                      Slutför incheckning & lämna ut nyckelkort
                    </button>
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    Välj en gäst i listan till vänster för att starta incheckningsflödet.
                  </div>
                )}

                {/* In-house guests for check-out */}
                <div className="pt-6 border-t border-neutral-100 space-y-3">
                  <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-700">
                    Boende Gäster (In-house) — Utcheckning
                  </h4>

                  <div className="divide-y divide-neutral-100 text-xs max-h-60 overflow-y-auto">
                    {inHouseGuests.map(res => (
                      <div key={res.id} className="py-2.5 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-slate-900">{res.guestName}</p>
                          <p className="text-slate-500">Rum {res.assignedRoomNumber} · Utcheckning: {res.checkOutDate}</p>
                        </div>
                        <button
                          onClick={() => checkOutReservation(res.id)}
                          className="px-3 py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold rounded text-xs cursor-pointer"
                        >
                          Checka Ut
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* TAB 4: HOUSEKEEPING BOARD */}
        {activeTab === 'housekeeping' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-2xl text-slate-900">
                  Städ- och Housekeepingtavla
                </h3>
                <p className="text-xs text-slate-500">
                  Realtidssynkronisering mellan städpersonal och reception.
                </p>
              </div>
            </div>

            {/* Kanban-style 3 columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Column 1: Dirty */}
              <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-amber-900">1. Smutsiga rum</span>
                  <span className="text-xs font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                    {rooms.filter(r => r.cleanlinessStatus === 'dirty').length}
                  </span>
                </div>

                <div className="space-y-2">
                  {rooms.filter(r => r.cleanlinessStatus === 'dirty').map(r => (
                    <div key={r.roomNumber} className="bg-white p-3 rounded-lg border border-amber-100 shadow-sm text-xs space-y-2">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>Rum {r.roomNumber}</span>
                        <span className="text-slate-500 text-[11px]">Våning {r.floor}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">{r.categoryId}</p>
                      <button
                        onClick={() => updateRoomHousekeeping(r.roomNumber, 'start_cleaning')}
                        className="w-full py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded font-medium text-xs cursor-pointer"
                      >
                        Starta städning →
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 2: Cleaning in progress */}
              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-blue-900">2. Pågående städning</span>
                  <span className="text-xs font-bold bg-blue-200 text-blue-900 px-2 py-0.5 rounded-full">
                    {rooms.filter(r => r.cleanlinessStatus === 'cleaning').length}
                  </span>
                </div>

                <div className="space-y-2">
                  {rooms.filter(r => r.cleanlinessStatus === 'cleaning').map(r => (
                    <div key={r.roomNumber} className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm text-xs space-y-2">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>Rum {r.roomNumber}</span>
                        <span className="text-slate-500 text-[11px]">Våning {r.floor}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">{r.categoryId}</p>
                      <button
                        onClick={() => updateRoomHousekeeping(r.roomNumber, 'finish_cleaning')}
                        className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-xs cursor-pointer"
                      >
                        Markera som klar ✓
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 3: Ready / Inspected */}
              <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-emerald-900">3. Inspekterade & Klara</span>
                  <span className="text-xs font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                    {rooms.filter(r => r.cleanlinessStatus === 'inspected' || r.cleanlinessStatus === 'clean').length}
                  </span>
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {rooms.filter(r => r.cleanlinessStatus === 'inspected' || r.cleanlinessStatus === 'clean').map(r => (
                    <div key={r.roomNumber} className="bg-white p-2.5 rounded-lg border border-emerald-100 shadow-sm text-xs flex justify-between items-center">
                      <span className="font-bold text-slate-900">Rum {r.roomNumber}</span>
                      <span className="text-emerald-700 text-[11px] font-semibold">Redo för gäst ✓</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 5: RESERVATIONS REGISTRY */}
        {activeTab === 'reservations' && (
          <div className="bg-white p-6 rounded-xl border border-[#EDE7DC] shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="font-serif text-xl font-bold text-slate-900">
                Bokningsregister ({reservations.length} reservationer)
              </h3>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Sök gästnamn eller bokningsnummer..."
                  value={reservationSearch}
                  onChange={(e) => setReservationSearch(e.target.value)}
                  className="pl-9 pr-3 py-1.5 bg-[#F8F5EF] border border-neutral-300 rounded text-xs focus:outline-none w-64"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-3">Bokningsnr</th>
                    <th className="py-3 px-3">Gäst</th>
                    <th className="py-3 px-3">Datum</th>
                    <th className="py-3 px-3">Rum</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Belopp (inkl. moms)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-slate-700">
                  {reservations
                    .filter(res => {
                      if (!reservationSearch) return true;
                      const q = reservationSearch.toLowerCase();
                      return res.guestName.toLowerCase().includes(q) || res.bookingReference.toLowerCase().includes(q);
                    })
                    .map(res => (
                      <tr key={res.id} className="hover:bg-slate-50">
                        <td className="py-3 px-3 font-mono font-bold text-slate-900">{res.bookingReference}</td>
                        <td className="py-3 px-3">
                          <p className="font-semibold text-slate-900">{res.guestName}</p>
                          <p className="text-[11px] text-slate-400">{res.guestEmail}</p>
                        </td>
                        <td className="py-3 px-3">
                          {res.checkInDate} → {res.checkOutDate} ({res.nights} n)
                        </td>
                        <td className="py-3 px-3">
                          {res.assignedRoomNumber ? `Rum ${res.assignedRoomNumber}` : res.roomCategoryId}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            res.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                            res.status === 'checked_in' ? 'bg-blue-100 text-blue-800' :
                            res.status === 'checked_out' ? 'bg-slate-100 text-slate-700' :
                            'bg-rose-100 text-rose-800'
                          }`}>
                            {res.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                          {formatSEK(res.totalSEK, 'sv')}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

    </div>
  );
};
