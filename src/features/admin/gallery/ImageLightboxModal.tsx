import React, { useEffect } from 'react';
import { X, Star, CheckCircle2, XCircle, BedDouble, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { ApiGalleryItem, getGalleryCategoryDisplay } from './galleryTypes';

export interface ImageLightboxModalProps {
  item: ApiGalleryItem | null;
  items?: ApiGalleryItem[];
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (item: ApiGalleryItem) => void;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  item,
  items = [],
  isOpen,
  onClose,
  onNavigate,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (items.length > 1 && onNavigate && item) {
        const currentIndex = items.findIndex((i) => i.id === item.id);
        if (e.key === 'ArrowRight' && currentIndex < items.length - 1) {
          onNavigate(items[currentIndex + 1]);
        } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
          onNavigate(items[currentIndex - 1]);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, item, items, onClose, onNavigate]);

  if (!isOpen || !item) return null;

  const currentIndex = items.findIndex((i) => i.id === item.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < items.length - 1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#02070D]/85 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#0D1A26] text-white border-b border-white/10">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#BF8641] text-white uppercase tracking-wider">
              {item.category_display || getGalleryCategoryDisplay(item.category)}
            </span>
            <h3 className="text-sm font-semibold text-[#F8F5EF] truncate">
              {item.title}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            {items.length > 1 && (
              <span className="text-xs font-mono text-stone-400">
                {currentIndex + 1} / {items.length}
              </span>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Image Display Area with Navigation Arrows */}
        <div className="relative bg-stone-950 flex items-center justify-center min-h-[300px] max-h-[70vh] overflow-hidden">
          <img
            src={item.image_url}
            alt={item.title}
            className="w-full h-auto max-h-[70vh] object-contain select-none"
          />

          {/* Previous Arrow */}
          {hasPrev && onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate(items[currentIndex - 1])}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-[#BF8641] text-white transition-all cursor-pointer shadow-lg"
              title="Previous Photo (Left Arrow)"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Next Arrow */}
          {hasNext && onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate(items[currentIndex + 1])}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-[#BF8641] text-white transition-all cursor-pointer shadow-lg"
              title="Next Photo (Right Arrow)"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          {/* Featured & Order Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            {item.is_featured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#0D1A26]/85 backdrop-blur-xs text-[#F2C777] text-xs font-bold shadow-md">
                <Star className="w-3.5 h-3.5 fill-[#F2C777]" />
                Featured
              </span>
            )}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-xs shadow-md ${
                item.is_active
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                  : 'bg-stone-900/80 text-stone-400 border border-stone-600/30'
              }`}
            >
              {item.is_active ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Active
                </>
              ) : (
                <>
                  <XCircle className="w-3 h-3 text-stone-400" />
                  Inactive
                </>
              )}
            </span>
          </div>

          <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/70 backdrop-blur-xs text-white font-mono text-[11px]">
            Order #{item.display_order}
          </div>
        </div>

        {/* Footer Meta & Description */}
        <div className="p-4 sm:p-5 bg-white space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              {item.room_type_name ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#EDE7DC] text-[#0D1A26] font-semibold">
                  <BedDouble className="w-3.5 h-3.5 text-[#BF8641]" />
                  <span>Linked Room Class: {item.room_type_name}</span>
                </span>
              ) : (
                <span className="text-stone-400 font-medium">
                  General Hotel Photography (No specific room type)
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 text-stone-400 font-mono text-[11px]">
              <span>Asset ID: #{item.id}</span>
              {item.created_at && <span>Uploaded: {item.created_at}</span>}
            </div>
          </div>

          {item.description && (
            <p className="text-xs text-[#5D6B78] leading-relaxed pt-1 border-t border-[#EDE7DC]">
              {item.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
