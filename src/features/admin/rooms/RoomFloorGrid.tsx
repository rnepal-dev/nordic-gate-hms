import React, { useMemo } from 'react';
import { PhysicalRoom, ROOM_STATUS_CONFIG } from './roomTypes';
import { Edit2, Layers, BedDouble } from 'lucide-react';
import { loadAdminGallery } from '../../../data/adminMockData';
import { getPreferredRoomTypeImage } from '../gallery/galleryTypes';

export interface RoomFloorGridProps {
  rooms: PhysicalRoom[];
  onEditRoom: (room: PhysicalRoom) => void;
}

export const RoomFloorGrid: React.FC<RoomFloorGridProps> = ({
  rooms,
  onEditRoom,
}) => {
  const galleryItems = useMemo(() => loadAdminGallery(), []);

  // Group rooms by floor
  const floorGroups = React.useMemo(() => {
    const groups: Record<string, PhysicalRoom[]> = {};

    rooms.forEach((room) => {
      const floorKey = room.floor !== null && room.floor !== undefined ? `Floor ${room.floor}` : 'Unassigned Floor';
      if (!groups[floorKey]) {
        groups[floorKey] = [];
      }
      groups[floorKey].push(room);
    });

    // Sort room numbers within each group
    Object.keys(groups).forEach((key) => {
      groups[key].sort((a, b) => a.room_number.localeCompare(b.room_number, undefined, { numeric: true }));
    });

    // Sort floors logically
    return Object.entries(groups).sort(([a], [b]) => {
      if (a === 'Unassigned Floor') return 1;
      if (b === 'Unassigned Floor') return -1;
      const numA = parseInt(a.replace('Floor ', ''), 10) || 0;
      const numB = parseInt(b.replace('Floor ', ''), 10) || 0;
      return numA - numB;
    });
  }, [rooms]);

  if (rooms.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#D3C8B9] p-12 text-center">
        <Layers className="w-10 h-10 text-stone-300 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-[#02070D]">No rooms found</h3>
        <p className="text-xs text-[#5D6B78] mt-1">Try adjusting your filters or search query.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {floorGroups.map(([floorTitle, floorRooms]) => (
        <div
          key={floorTitle}
          className="bg-white rounded-2xl border border-[#D3C8B9] shadow-2xs overflow-hidden"
        >
          {/* Floor Header */}
          <div className="px-5 py-3.5 bg-[#F8F5EF] border-b border-[#EDE7DC] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#BF8641]" />
              <h3 className="text-sm font-bold text-[#0D1A26] tracking-tight">{floorTitle}</h3>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#EDE7DC] text-[#25303A] font-medium">
                {floorRooms.length} {floorRooms.length === 1 ? 'room' : 'rooms'}
              </span>
            </div>

            {/* Floor Status Quick Summary */}
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-emerald-700 text-[11px] font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {floorRooms.filter((r) => r.status === 'active').length} Active
              </span>
              <span className="flex items-center gap-1 text-amber-700 text-[11px] font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                {floorRooms.filter((r) => r.status === 'maintenance').length} Maint
              </span>
              <span className="flex items-center gap-1 text-rose-700 text-[11px] font-medium">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                {floorRooms.filter((r) => r.status === 'out_of_service').length} OOS
              </span>
            </div>
          </div>

          {/* Rooms Grid */}
          <div className="p-4 sm:p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {floorRooms.map((room) => {
              const statusCfg = ROOM_STATUS_CONFIG[room.status];
              const preferredImg = getPreferredRoomTypeImage(room.room_type, galleryItems);

              return (
                <div
                  key={room.id}
                  onClick={() => onEditRoom(room)}
                  className="group relative p-3 rounded-xl border border-[#EDE7DC] bg-white hover:border-[#BF8641] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between min-h-[116px]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {preferredImg ? (
                        <img
                          src={preferredImg.image_url}
                          alt={room.room_type_name}
                          className="w-9 h-9 rounded-lg object-cover shrink-0 border border-[#EDE7DC] shadow-2xs"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-[#F8F5EF] border border-dashed border-[#D3C8B9] flex items-center justify-center text-stone-300 shrink-0">
                          <BedDouble className="w-4 h-4" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <span className="font-mono text-base font-bold text-[#02070D] group-hover:text-[#BF8641] transition-colors block">
                          {room.room_number}
                        </span>
                        <p className="text-[11px] font-medium text-[#5D6B78] line-clamp-1">
                          {room.room_type_name}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditRoom(room);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-stone-400 hover:text-[#0D1A26] rounded transition-opacity shrink-0"
                      title="Edit room"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="pt-2 mt-2 border-t border-[#F8F5EF] flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${statusCfg.badgeBg} ${statusCfg.badgeText} border ${statusCfg.badgeBorder}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dotBg}`} />
                      <span>{statusCfg.label}</span>
                    </span>

                    {room.notes && (
                      <span
                        className="text-[10px] text-[#BF8641] font-mono"
                        title={room.notes}
                      >
                        Notes
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
