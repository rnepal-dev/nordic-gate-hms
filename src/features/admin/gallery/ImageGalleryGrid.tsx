import React, { useState } from 'react';
import { ApiGalleryItem, getGalleryCategoryDisplay, getRoomTypeName } from './galleryTypes';
import { Star, Edit2, Trash2, BedDouble, AlertCircle, Image as ImageIcon } from 'lucide-react';

export interface ImageGalleryGridProps {
  items: ApiGalleryItem[];
  onEdit: (item: ApiGalleryItem) => void;
  onDelete: (item: ApiGalleryItem) => void;
}

export const ImageGalleryGrid: React.FC<ImageGalleryGridProps> = ({
  items,
  onEdit,
  onDelete,
}) => {
  const [brokenImages, setBrokenImages] = useState<Record<number, boolean>>({});

  const handleImageError = (id: number) => {
    setBrokenImages((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {items.map((item) => {
        const isBroken = brokenImages[item.id];
        const roomName = item.room_type_name || getRoomTypeName(item.room_type);

        return (
          <div
            key={item.id}
            className="group bg-white rounded-xl border border-[#EDE7DC] hover:border-[#BF8641] shadow-xs hover:shadow-md transition-all flex flex-col overflow-hidden"
          >
            {/* Image Preview Container */}
            <div className="relative aspect-4/3 bg-stone-900 overflow-hidden">
              {isBroken ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-[#F8F5EF] text-stone-400 p-4 text-center">
                  <AlertCircle className="w-6 h-6 text-rose-500 mb-1" />
                  <p className="text-xs font-semibold text-[#0D1A26]">Image preview error</p>
                  <p className="text-[10px] text-stone-400 font-mono truncate max-w-full">
                    {item.image_url}
                  </p>
                </div>
              ) : (
                <img
                  src={item.image_url}
                  alt={item.title}
                  onError={() => handleImageError(item.id)}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              )}

              {/* Featured Ribbon Badge */}
              {item.is_featured && (
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#0D1A26]/85 backdrop-blur-xs text-[#F2C777] text-[10px] font-bold shadow-md">
                  <Star className="w-3 h-3 fill-[#F2C777]" />
                  <span>Featured</span>
                </div>
              )}

              {/* Display Order Tag */}
              <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-[#02070D]/75 backdrop-blur-xs text-white font-mono text-[10px] font-semibold">
                #{item.display_order}
              </div>

              {/* Hover Overlay Action Bar */}
              <div className="absolute inset-0 bg-[#02070D]/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(item)}
                  className="p-2 rounded-lg bg-white text-[#0D1A26] hover:bg-[#BF8641] hover:text-white transition-colors cursor-pointer shadow-md"
                  title="Edit image details"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(item)}
                  className="p-2 rounded-lg bg-white text-rose-600 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer shadow-md"
                  title="Delete image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#BF8641]">
                    {item.category_display || getGalleryCategoryDisplay(item.category)}
                  </span>
                  <span className="text-[10px] font-mono text-stone-400">
                    ID #{item.id}
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-[#0D1A26] line-clamp-1 group-hover:text-[#BF8641] transition-colors">
                  {item.title}
                </h4>
                {item.description && (
                  <p className="text-[11px] text-[#5D6B78] line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>

              {/* Room Association or General Asset Footer */}
              <div className="pt-2 border-t border-[#EDE7DC]/70 flex items-center justify-between text-[11px] text-[#5D6B78]">
                {roomName ? (
                  <div className="flex items-center gap-1.5 text-[#0D1A26] font-medium truncate">
                    <BedDouble className="w-3.5 h-3.5 text-[#BF8641] shrink-0" />
                    <span className="truncate">{roomName}</span>
                  </div>
                ) : (
                  <span className="text-stone-400">General Property</span>
                )}
                <span className="text-[10px] text-stone-400 shrink-0">
                  {item.created_at ? item.created_at.split(' ')[0] : 'Live'}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
