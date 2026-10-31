import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  UploadCloud,
  Image as ImageIcon,
  X,
  AlertCircle,
  Link as LinkIcon,
  Sparkles,
  RefreshCw,
  Hash,
  Calendar,
  Layers,
  BedDouble,
  FileCheck,
} from 'lucide-react';
import {
  ApiGalleryItem,
  ApiGalleryPayload,
  GalleryCategoryEnum,
  GALLERY_CATEGORIES,
  GalleryFormValues,
} from './galleryTypes';
import { TextField } from '../../../components/ui/TextField';
import { Textarea } from '../../../components/ui/Textarea';
import { Select } from '../../../components/ui/Select';
import { BooleanField } from '../../../components/ui/BooleanField';
import { FormActions } from '../../../components/ui/FormActions';
import { loadRoomTypes } from '../../../data/adminMockData';
import { HOTEL_IMAGES } from '../../../data/hotelData';

export interface GalleryFormProps {
  initialData?: ApiGalleryItem | null;
  onSubmit: (payload: ApiGalleryPayload, selectedFile?: File | null) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const GalleryForm: React.FC<GalleryFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const isEditing = Boolean(initialData);

  // Dynamic Room Types catalog from shared source
  const roomTypes = useMemo(() => loadRoomTypes(), []);

  // Dropzone and file state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(initialData?.image_url || '');
  const [activeAssetMode, setActiveAssetMode] = useState<'upload' | 'presets'>('upload');
  const [fileError, setFileError] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Keep track of created object URLs to revoke them and prevent memory leaks
  const createdObjectUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    return () => {
      // Clean up temporary object URLs on unmount
      createdObjectUrlsRef.current.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch {
          // ignore
        }
      });
    };
  }, []);

  const defaultValues: GalleryFormValues = {
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || 'room',
    is_featured: initialData?.is_featured ?? false,
    is_active: initialData?.is_active ?? true,
    room_type: initialData?.room_type !== null && initialData?.room_type !== undefined
      ? String(initialData.room_type)
      : 'null',
    display_order: initialData?.display_order ?? 1,
  };

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<GalleryFormValues>({
    defaultValues,
  });

  // Handle local file selection with validation
  const handleProcessFile = (file: File) => {
    setFileError('');

    // File type validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setFileError('Invalid file format. Please select a JPEG, PNG, WebP, or AVIF image.');
      return;
    }

    // Size limit check (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setFileError('File exceeds 10MB size limit. Please choose a smaller photo.');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    createdObjectUrlsRef.current.push(objectUrl);

    setSelectedFile(file);
    setPreviewUrl(objectUrl);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleChoosePreset = (presetUrl: string, label: string) => {
    setFileError('');
    setSelectedFile(null);
    setPreviewUrl(presetUrl);
    if (!watch('title')) {
      setValue('title', label);
    }
  };

  const handleClearImage = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setFileError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onFormSubmit = (values: GalleryFormValues) => {
    if (!previewUrl && !selectedFile) {
      setFileError('An image is required. Please upload a file or select a hotel asset.');
      return;
    }

    const parsedRoomType =
      values.room_type === 'null' || values.room_type === ''
        ? null
        : parseInt(values.room_type, 10);

    const payload: ApiGalleryPayload = {
      title: values.title.trim(),
      description: values.description.trim(),
      image_url: previewUrl,
      category: values.category,
      is_featured: values.is_featured,
      is_active: values.is_active,
      room_type: isNaN(parsedRoomType as number) ? null : parsedRoomType,
      display_order: Number(values.display_order),
    };

    onSubmit(payload, selectedFile);
  };

  // Preset options
  const presets = [
    { label: 'Hotel Facade at Twilight', url: HOTEL_IMAGES.facadeHero, cat: 'exterior' as const },
    { label: 'The Heritage Suite Living Area', url: HOTEL_IMAGES.heritageSuite, cat: 'room' as const },
    { label: 'Deluxe Canal View Bedroom', url: HOTEL_IMAGES.deluxeCanal, cat: 'room' as const },
    { label: 'Nordic Restaurant & Dining Hall', url: HOTEL_IMAGES.diningRestaurant, cat: 'restaurant' as const },
    { label: 'Heated Indoor Pool & Sauna', url: HOTEL_IMAGES.spaWellness, cat: 'pool' as const },
    { label: 'Artisanal Cocktail Lounge', url: HOTEL_IMAGES.barLounge, cat: 'interior' as const },
    { label: 'Handcrafted Swedish Cocktails', url: HOTEL_IMAGES.barDrinks, cat: 'restaurant' as const },
  ];

  // Room Type dropdown options
  const roomTypeOptions = useMemo(() => {
    return [
      { value: 'null', label: 'General Hotel / No Specific Room Type' },
      ...roomTypes.map((rt) => ({
        value: String(rt.id),
        label: `${rt.name} (${rt.max_occupancy} guests, ${rt.size_sqm ? rt.size_sqm + ' m²' : 'std'})${!rt.is_active ? ' [Inactive]' : ''}`,
      })),
    ];
  }, [roomTypes]);

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Read-Only Server Identifiers Header */}
      {isEditing && initialData && (
        <div className="p-3.5 bg-[#F8F5EF] border border-[#D3C8B9] rounded-xl space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-[#BF8641]" />
              <span className="font-bold text-[#0D1A26]">
                Gallery Asset #{initialData.id}
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#EDE7DC] text-[#25303A] uppercase">
                Read-Only Metadata
              </span>
            </div>
            {initialData.created_at && (
              <div className="flex items-center gap-1 text-[11px] text-stone-500 font-mono">
                <Calendar className="w-3.5 h-3.5" />
                <span>Uploaded: {initialData.created_at}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4 text-[11px] text-[#5D6B78] pt-1 border-t border-[#EDE7DC]">
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-[#BF8641]" />
              Category: <strong>{initialData.category_display}</strong>
            </span>
            {initialData.room_type_name && (
              <span className="flex items-center gap-1">
                <BedDouble className="w-3.5 h-3.5 text-[#BF8641]" />
                Linked Class: <strong>{initialData.room_type_name}</strong>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Section 1: Image Upload / Dropzone */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#02070D]">
            1. Photography Asset <span className="text-rose-500">*</span>
          </label>
          {/* Mode Switcher */}
          <div className="flex items-center gap-1 p-0.5 bg-[#EDE7DC]/60 rounded-lg border border-[#D3C8B9]">
            <button
              type="button"
              onClick={() => setActiveAssetMode('upload')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                activeAssetMode === 'upload'
                  ? 'bg-white text-[#0D1A26] shadow-2xs'
                  : 'text-[#5D6B78] hover:text-[#0D1A26]'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5 text-[#BF8641]" />
              <span>Upload / File</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveAssetMode('presets')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                activeAssetMode === 'presets'
                  ? 'bg-white text-[#0D1A26] shadow-2xs'
                  : 'text-[#5D6B78] hover:text-[#0D1A26]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#BF8641]" />
              <span>Hotel Library</span>
            </button>
          </div>
        </div>

        {activeAssetMode === 'upload' ? (
          <div className="space-y-3">
            {/* Drag & Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
                isDragging
                  ? 'border-[#BF8641] bg-amber-50/60 scale-[1.01]'
                  : 'border-[#D3C8B9] hover:border-[#BF8641] bg-[#F8F5EF]/40 hover:bg-[#F8F5EF]'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInputChange}
                accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
                className="hidden"
              />

              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="w-12 h-12 rounded-xl bg-[#0D1A26] text-[#F2C777] flex items-center justify-center shadow-xs">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-[#0D1A26]">
                    Drop your image here or <span className="text-[#BF8641] underline underline-offset-2">browse files</span>
                  </p>
                  <p className="text-[11px] text-[#5D6B78] mt-0.5">
                    Supports high-resolution JPEG, PNG, WebP, AVIF up to 10MB
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-stone-400 font-mono">
                  <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Django multipart/form-data upload ready (field: image_url)</span>
                </div>
              </div>
            </div>

            {/* URL input fallback */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <LinkIcon className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={previewUrl}
                  onChange={(e) => {
                    setSelectedFile(null);
                    setPreviewUrl(e.target.value);
                    setFileError('');
                  }}
                  placeholder="Or paste an image URL directly..."
                  className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-[#D3C8B9] rounded-xl text-[#0D1A26] placeholder-stone-400 focus:outline-none focus:border-[#BF8641]"
                />
              </div>
            </div>
          </div>
        ) : (
          /* Presets from Hotel Library */
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3 bg-[#F8F5EF]/60 rounded-2xl border border-[#EDE7DC]">
            {presets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  handleChoosePreset(preset.url, preset.label);
                  setValue('category', preset.cat);
                }}
                className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all cursor-pointer ${
                  previewUrl === preset.url
                    ? 'border-[#BF8641] bg-amber-50 shadow-xs'
                    : 'border-[#EDE7DC] bg-white hover:bg-[#EDE7DC]/40'
                }`}
              >
                <img
                  src={preset.url}
                  alt={preset.label}
                  className="w-10 h-10 rounded-lg object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold text-[#0D1A26] truncate">
                    {preset.label}
                  </p>
                  <p className="text-[10px] text-stone-400 capitalize">{preset.cat}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Selected Image Preview with Replace / Remove Actions */}
        {previewUrl ? (
          <div className="relative rounded-2xl border border-[#D3C8B9] overflow-hidden bg-stone-950 shadow-xs group">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-48 object-cover"
            />

            <div className="absolute top-2.5 right-2.5 flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 rounded-lg bg-black/75 hover:bg-[#BF8641] text-white text-xs font-semibold flex items-center gap-1.5 backdrop-blur-xs transition-colors cursor-pointer shadow-md"
                title="Replace image"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Replace</span>
              </button>
              <button
                type="button"
                onClick={handleClearImage}
                className="p-1 rounded-lg bg-black/75 hover:bg-rose-600 text-white transition-colors cursor-pointer shadow-md"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 text-white flex items-center justify-between text-[11px]">
              <span className="font-mono text-stone-300 truncate max-w-xs">
                {selectedFile ? `${selectedFile.name} (${Math.round(selectedFile.size / 1024)} KB)` : previewUrl}
              </span>
              {selectedFile && (
                <span className="px-2 py-0.5 rounded bg-emerald-600 font-semibold text-[10px] text-white uppercase tracking-wider shrink-0">
                  New File Selected
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="h-24 border border-dashed border-[#D3C8B9] rounded-2xl flex flex-col items-center justify-center text-stone-400 bg-white">
            <ImageIcon className="w-6 h-6 text-stone-300 mb-1" />
            <span className="text-xs">No image selected yet</span>
          </div>
        )}

        {fileError && (
          <p className="text-xs text-rose-600 font-medium flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{fileError}</span>
          </p>
        )}
      </div>

      {/* Section 2: Image Information */}
      <div className="space-y-4 pt-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#02070D] border-b border-[#EDE7DC] pb-2">
          2. Image Details
        </h4>

        <TextField
          label="Image Title"
          required
          placeholder="e.g. Superior Double King Bed & Nordic Armchair"
          helperText="Required, maximum 200 characters"
          error={errors.title?.message}
          {...register('title', {
            required: 'Image title is required',
            maxLength: {
              value: 200,
              message: 'Title cannot exceed 200 characters',
            },
          })}
        />

        <Textarea
          label="Description (Optional)"
          rows={3}
          placeholder="Describe room materials, interior finishes, lighting, or architectural context..."
          helperText="Context for guest view and search filters"
          error={errors.description?.message}
          {...register('description')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Controller
            name="category"
            control={control}
            rules={{ required: 'Category is required' }}
            render={({ field, fieldState }) => (
              <Select
                label="Gallery Category"
                required
                options={GALLERY_CATEGORIES.map((cat) => ({
                  value: cat.value,
                  label: cat.label,
                }))}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value as GalleryCategoryEnum)}
                error={fieldState.error?.message}
              />
            )}
          />

          <TextField
            label="Display Sort Order"
            type="number"
            min={0}
            max={2147483647}
            placeholder="e.g. 1"
            helperText="0 to 2,147,483,647 (lower numbers display first)"
            error={errors.display_order?.message}
            {...register('display_order', {
              required: 'Display order is required',
              valueAsNumber: true,
              min: { value: 0, message: 'Minimum order is 0' },
              max: { value: 2147483647, message: 'Maximum order is 2,147,483,647' },
            })}
          />
        </div>
      </div>

      {/* Section 3: Room Type Association */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#02070D] border-b border-[#EDE7DC] pb-2">
          3. Room Class Association
        </h4>

        <Controller
          name="room_type"
          control={control}
          render={({ field }) => (
            <Select
              label="Associated Room Type (Optional)"
              options={roomTypeOptions}
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              helperText="Link this photo to a room type to display it automatically across public room pages and physical room views."
            />
          )}
        />
      </div>

      {/* Section 4: Visibility & Status */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#02070D] border-b border-[#EDE7DC] pb-2">
          4. Visibility & Highlighting
        </h4>

        <Controller
          name="is_featured"
          control={control}
          render={({ field }) => (
            <BooleanField
              label="Featured Gallery Image"
              description="Highlight this photo in hero showcases, gallery top picks, and room tier cards."
              checked={field.value}
              onChange={field.onChange}
              trueBadge="Featured"
              falseBadge="Standard"
            />
          )}
        />

        <Controller
          name="is_active"
          control={control}
          render={({ field }) => (
            <BooleanField
              label="Active Status"
              description="When unchecked, this image will be hidden from public guest view."
              checked={field.value}
              onChange={field.onChange}
              trueBadge="Active"
              falseBadge="Inactive"
            />
          )}
        />
      </div>

      <FormActions
        onCancel={onCancel}
        isSubmitting={isLoading}
        submitLabel={isEditing ? 'Save Image Details' : 'Add to Gallery'}
        cancelLabel="Cancel"
      />
    </form>
  );
};
