import React, { useState } from 'react';
import {
  Star,
  Edit2,
  Trash2,
  BedDouble,
  AlertCircle,
  Maximize2,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { ApiGalleryItem, getGalleryCategoryDisplay } from './galleryTypes';

export interface ImageGalleryGridProps {
  items: ApiGalleryItem[];
  onEdit: (item: ApiGalleryItem) => void;
  onDelete: (item: ApiGalleryItem) => void;
  onPreview: (item: ApiGalleryItem) => void;
}

export const ImageGalleryGrid: React.FC<ImageGalleryGridProps> = ({
  items,
  onEdit,
  onDelete,
  onPreview,
}) => {
  const [brokenImages, setBrokenImages] = useState<Record<number, boolean>>({});

  const handleImageError = (id: number) => {
    setBrokenImages((prev) => ({ ...prev, [id]: true }));
  };

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#D3C8B9] p-12 text-center">
        <div className="w-12 h-12 rounded-xl bg-[#F8F5EF] text-[#BF8641] flex items-center justify-center mx-auto mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-[#02070D]">No gallery images found</h3>
        <p className="text-xs text-[#5D6B78] mt-1">
          Try adjusting your search criteria, category filters, or add a new photograph.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {items.map((item) => {
        const isBroken = brokenImages[item.id];

        return (
          <div
            key={item.id}
            className="group bg-white rounded-2xl border border-[#EDE7DC] hover:border-[#BF8641] shadow-2xs hover:shadow-md transition-all flex flex-col overflow-hidden"
          >
            {/* Image Thumbnail Container */}
            <div
              onClick={() => onPreview(item)}
              className="relative aspect-4/3 bg-stone-900 overflow-hidden cursor-pointer"
            >
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
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 select-none"
                />
              )}

              {/* Featured Ribbon Badge */}
              {item.is_featured && (
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#0D1A26]/85 backdrop-blur-xs text-[#F2C777] text-[10px] font-bold shadow-md">
                  <Star className="w-3 h-3 fill-[#F2C777]" />
                  <span>Featured</span>
                </div>
              )}

              {/* Status Pill */}
              <div className="absolute bottom-2.5 left-2.5">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold backdrop-blur-xs shadow-md ${
                    item.is_active
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                      : 'bg-stone-900/80 text-stone-400 border border-stone-600/30'
                  }`}
                >
                  {item.is_active ? (
                    <>
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                      <span>Active</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-2.5 h-2.5 text-stone-400" />
                      <span>Inactive</span>
                    </>
                  )}
                </span>
              </div>

              {/* Display Order Tag */}
              <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-[#02070D]/75 backdrop-blur-xs text-white font-mono text-[10px] font-semibold">
                #{item.display_order}
              </div>

              {/* Hover Overlay Action Bar */}
              <div
                onClick={() => onPreview(item)}
                className="absolute inset-0 bg-[#02070D]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreview(item);
                  }}
                  className="p-2 rounded-xl bg-white text-[#0D1A26] hover:bg-[#BF8641] hover:text-white transition-colors cursor-pointer shadow-md"
                  title="Preview Full Image"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(item);
                  }}
                  className="p-2 rounded-xl bg-white text-[#0D1A26] hover:bg-[#0D1A26] hover:text-[#F2C777] transition-colors cursor-pointer shadow-md"
                  title="Edit image details"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item);
                  }}
                  className="p-2 rounded-xl bg-white text-rose-600 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer shadow-md"
                  title="Delete image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#BF8641]">
                    {item.category_display || getGalleryCategoryDisplay(item.category)}
                  </span>
                  <span className="text-[10px] font-mono text-stone-400">
                    ID #{item.id}
                  </span>
                </div>

                <h4
                  onClick={() => onPreview(item)}
                  className="text-xs sm:text-sm font-bold text-[#0D1A26] line-clamp-1 group-hover:text-[#BF8641] transition-colors cursor-pointer"
                  title={item.title}
                >
                  {item.title}
                </h4>

                {item.description && (
                  <p className="text-[11px] text-[#5D6B78] line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>

              {/* Room Type Association Footer */}
              <div className="pt-2 border-t border-[#EDE7DC]/70 flex items-center justify-between text-xs">
                {item.room_type_name ? (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#0D1A26] truncate">
                    <BedDouble className="w-3.5 h-3.5 text-[#BF8641] shrink-0" />
                    <span className="truncate">{item.room_type_name}</span>
                  </span>
                ) : (
                  <span className="text-[10px] text-stone-400 italic">
                    General Hotel Image
                  </span>
                )}

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => onEdit(item)}
                    className="p-1 text-stone-400 hover:text-[#0D1A26] rounded transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(item)}
                    className="p-1 text-stone-400 hover:text-rose-600 rounded transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
