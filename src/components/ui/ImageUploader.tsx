import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, AlertCircle, Link as LinkIcon, Sparkles } from 'lucide-react';
import { HOTEL_IMAGES } from '../../data/hotelData';

export interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  helperText?: string;
  error?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  label = 'Image',
  helperText = 'Paste an image URL or choose a hotel photography asset',
  error,
}) => {
  const [activeMode, setActiveMode] = useState<'url' | 'presets'>('url');
  const [imageLoadError, setImageLoadError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const presets = [
    { label: 'Hotel Facade', url: HOTEL_IMAGES.facadeHero },
    { label: 'Heritage Suite', url: HOTEL_IMAGES.heritageSuite },
    { label: 'Deluxe Canal View', url: HOTEL_IMAGES.deluxeCanal },
    { label: 'Nordic Restaurant', url: HOTEL_IMAGES.diningRestaurant },
    { label: 'Pool & Wellness', url: HOTEL_IMAGES.spaWellness },
    { label: 'Cocktail Lounge', url: HOTEL_IMAGES.barLounge },
    { label: 'Craft Cocktails', url: HOTEL_IMAGES.barDrinks },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Frontend-only object URL
      const localUrl = URL.createObjectURL(file);
      setImageLoadError(false);
      onChange(localUrl);
    }
  };

  const handleClear = () => {
    setImageLoadError(false);
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-semibold text-[#0D1A26] uppercase tracking-wider">
          {label}
        </label>
      )}

      {/* Mode switcher tabs */}
      <div className="flex items-center gap-1 p-0.5 bg-[#EDE7DC]/60 rounded-lg w-fit border border-[#D3C8B9]">
        <button
          type="button"
          onClick={() => setActiveMode('url')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
            activeMode === 'url'
              ? 'bg-white text-[#0D1A26] shadow-xs'
              : 'text-[#5D6B78] hover:text-[#0D1A26]'
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" />
          <span>Image URL / Upload</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveMode('presets')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
            activeMode === 'presets'
              ? 'bg-white text-[#0D1A26] shadow-xs'
              : 'text-[#5D6B78] hover:text-[#0D1A26]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#BF8641]" />
          <span>Hotel Assets</span>
        </button>
      </div>

      {activeMode === 'url' ? (
        <div className="space-y-2">
          {/* URL text input */}
          <div className="relative">
            <input
              type="text"
              value={value}
              onChange={(e) => {
                setImageLoadError(false);
                onChange(e.target.value);
              }}
              placeholder="https://images.unsplash.com/... or /assets/..."
              className={`w-full px-3 py-2 text-xs bg-white border rounded-lg text-[#0D1A26] placeholder-stone-400 focus:outline-none focus:border-[#BF8641] ${
                error ? 'border-rose-300' : 'border-[#D3C8B9]'
              }`}
            />
          </div>

          {/* Local file selection trigger */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[#D3C8B9] hover:border-[#BF8641] rounded-xl p-3 text-center bg-[#F8F5EF]/40 hover:bg-[#F8F5EF] transition-colors cursor-pointer"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <div className="flex items-center justify-center gap-2 text-xs text-[#5D6B78]">
              <UploadCloud className="w-4 h-4 text-[#BF8641]" />
              <span className="font-semibold text-[#0D1A26]">Browse local file</span>
              <span className="text-[11px] text-stone-400">(Frontend preview only)</span>
            </div>
          </div>
        </div>
      ) : (
        /* Hotel Assets presets */
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-2 bg-[#F8F5EF]/50 rounded-xl border border-[#EDE7DC]">
          {presets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                setImageLoadError(false);
                onChange(preset.url);
              }}
              className={`flex items-center gap-2 p-1.5 rounded-lg border text-left transition-all cursor-pointer ${
                value === preset.url
                  ? 'border-[#BF8641] bg-amber-50 shadow-xs'
                  : 'border-[#EDE7DC] bg-white hover:bg-[#EDE7DC]/40'
              }`}
            >
              <img
                src={preset.url}
                alt={preset.label}
                className="w-8 h-8 rounded object-cover shrink-0"
              />
              <span className="text-[11px] font-semibold text-[#0D1A26] truncate">
                {preset.label}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Live Preview Card */}
      {value ? (
        <div className="relative rounded-xl border border-[#D3C8B9] overflow-hidden bg-stone-900 group">
          {imageLoadError ? (
            <div className="h-40 flex flex-col items-center justify-center bg-[#F8F5EF] text-stone-400 p-4 text-center">
              <AlertCircle className="w-6 h-6 text-rose-500 mb-1" />
              <p className="text-xs font-semibold text-[#0D1A26]">Failed to load image preview</p>
              <p className="text-[10px] text-stone-500">Check the URL or choose another image</p>
            </div>
          ) : (
            <img
              src={value}
              alt="Preview"
              onError={() => setImageLoadError(true)}
              className="w-full h-44 object-cover"
            />
          )}

          <button
            type="button"
            onClick={handleClear}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-[#02070D]/75 text-white hover:bg-rose-600 transition-colors cursor-pointer shadow-md"
            title="Remove image"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 text-white">
            <p className="text-[10px] truncate font-mono text-stone-200">
              {value}
            </p>
          </div>
        </div>
      ) : (
        <div className="h-28 border border-dashed border-[#EDE7DC] rounded-xl flex flex-col items-center justify-center text-stone-400 bg-white">
          <ImageIcon className="w-6 h-6 text-stone-300 mb-1" />
          <span className="text-xs">No image selected yet</span>
        </div>
      )}

      {error ? (
        <p className="text-xs text-rose-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-[#5D6B78]">{helperText}</p>
      ) : null}
    </div>
  );
};
