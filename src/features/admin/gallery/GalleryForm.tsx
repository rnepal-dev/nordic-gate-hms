import React, { useState, useEffect } from 'react';
import {
  ApiGalleryItem,
  ApiGalleryPayload,
  GalleryCategoryEnum,
  GALLERY_CATEGORIES,
  ROOM_TYPES_CATALOG,
  getGalleryCategoryDisplay,
  getRoomTypeName,
  validateGalleryFields,
} from './galleryTypes';
import { TextField } from '../../../components/ui/TextField';
import { Textarea } from '../../../components/ui/Textarea';
import { Select } from '../../../components/ui/Select';
import { ImageUploader } from '../../../components/ui/ImageUploader';
import { BooleanField } from '../../../components/ui/BooleanField';
import { FormActions } from '../../../components/ui/FormActions';
import { Hash, Calendar, Layers, BedDouble } from 'lucide-react';

export interface GalleryFormProps {
  initialData?: ApiGalleryItem | null;
  onSubmit: (payload: ApiGalleryPayload & { id?: number }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const GalleryForm: React.FC<GalleryFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || '');
  const [category, setCategory] = useState<GalleryCategoryEnum>(
    initialData?.category || 'rooms'
  );
  const [isFeatured, setIsFeatured] = useState<boolean>(
    initialData?.is_featured ?? false
  );
  const [roomType, setRoomType] = useState<number | null>(
    initialData?.room_type ?? null
  );
  const [displayOrder, setDisplayOrder] = useState<number>(
    initialData?.display_order ?? 1
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setImageUrl(initialData.image_url);
      setCategory(initialData.category);
      setIsFeatured(initialData.is_featured);
      setRoomType(initialData.room_type);
      setDisplayOrder(initialData.display_order);
    } else {
      setTitle('');
      setDescription('');
      setImageUrl('');
      setCategory('rooms');
      setIsFeatured(false);
      setRoomType(null);
      setDisplayOrder(1);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: ApiGalleryPayload = {
      title: title.trim(),
      description: description.trim(),
      image_url: imageUrl.trim(),
      category,
      is_featured: isFeatured,
      room_type: roomType,
      display_order: displayOrder,
    };

    const validationErrors = validateGalleryFields(payload);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    onSubmit({
      ...payload,
      ...(initialData?.id ? { id: initialData.id } : {}),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Read-Only Server Identifiers Header */}
      {initialData?.id && (
        <div className="p-3.5 bg-[#F8F5EF] border border-[#D3C8B9] rounded-xl space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-[#BF8641]" />
              <span className="font-bold text-[#0D1A26]">
                Gallery Asset ID #{initialData.id}
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#EDE7DC] text-[#25303A] uppercase">
                Read-Only
              </span>
            </div>
            {initialData.created_at && (
              <div className="flex items-center gap-1 text-[11px] text-stone-500">
                <Calendar className="w-3.5 h-3.5" />
                <span>Uploaded: {initialData.created_at}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4 text-[11px] text-[#5D6B78] pt-1 border-t border-[#EDE7DC]">
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-[#BF8641]" />
              Category Display: <strong>{initialData.category_display}</strong>
            </span>
            {initialData.room_type_name && (
              <span className="flex items-center gap-1">
                <BedDouble className="w-3.5 h-3.5 text-[#BF8641]" />
                Room: <strong>{initialData.room_type_name}</strong>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Image Uploader & Live Preview */}
      <div>
        <ImageUploader
          label="Photography Asset"
          value={imageUrl}
          onChange={(url) => {
            setImageUrl(url);
            if (errors.image_url) setErrors((prev) => ({ ...prev, image_url: '' }));
          }}
          error={errors.image_url}
        />
      </div>

      {/* Title */}
      <div>
        <TextField
          label="Image Title"
          required
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
          }}
          placeholder="e.g. Superior Double King Bed & Nordic Armchair"
          error={errors.title}
          helperText="Descriptive caption for alt text and gallery lightbox"
        />
      </div>

      {/* Description */}
      <div>
        <Textarea
          label="Image Description (Optional)"
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe room materials, natural lighting, or architectural context..."
          helperText="Supporting context for media asset catalog"
        />
      </div>

      {/* Category & Room Association Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Category"
          required
          value={category}
          onChange={(e) => setCategory(e.target.value as GalleryCategoryEnum)}
          options={GALLERY_CATEGORIES.map((cat) => ({
            value: cat.value,
            label: cat.label,
          }))}
        />

        <Select
          label="Room Category Association"
          value={roomType !== null ? roomType.toString() : ''}
          onChange={(e) => {
            const val = e.target.value;
            setRoomType(val === '' ? null : parseInt(val, 10));
          }}
          options={[
            { value: '', label: 'General Hotel / No Room Association' },
            ...ROOM_TYPES_CATALOG.map((room) => ({
              value: room.id.toString(),
              label: `${room.name} (ID: ${room.id})`,
            })),
          ]}
        />
      </div>

      {/* Featured Toggle & Sort Order */}
      <div className="space-y-4 pt-2 border-t border-[#EDE7DC]">
        <BooleanField
          label="Featured Gallery Image"
          description="Highlight this photo in hero carousels and top-level gallery highlights"
          checked={isFeatured}
          onChange={setIsFeatured}
          trueBadge="Featured"
          falseBadge="Standard"
        />

        <div className="max-w-xs">
          <TextField
            label="Display Sort Order"
            type="number"
            min={0}
            value={displayOrder.toString()}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              setDisplayOrder(isNaN(val) ? 0 : val);
            }}
            error={errors.display_order}
            helperText="0 to 2,147,483,647 (lower numbers display first)"
          />
        </div>
      </div>

      {/* Reusable FormActions */}
      <FormActions
        onCancel={onCancel}
        isSubmitting={isLoading}
        submitLabel={initialData?.id ? 'Save Image Details' : 'Add to Gallery'}
      />
    </form>
  );
};
