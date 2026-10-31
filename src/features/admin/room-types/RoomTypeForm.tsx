import React, { useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Star, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { TextField } from '../../../components/ui/TextField';
import { Textarea } from '../../../components/ui/Textarea';
import { BooleanField } from '../../../components/ui/BooleanField';
import { FormActions } from '../../../components/ui/FormActions';
import { BedConfigurationEditor } from './BedConfigurationEditor';
import { RoomAmenityMultiSelect } from './RoomAmenityMultiSelect';
import {
  RoomType,
  RoomTypePayload,
  RoomTypeFormValues,
  generateRoomTypeSlug,
} from './roomTypeTypes';
import { loadRoomAmenities, loadAdminGallery } from '../../../data/adminMockData';
import { useHotel } from '../../../context/HotelContext';

export interface RoomTypeFormProps {
  initialData?: RoomType | null;
  onSubmit: (data: RoomTypePayload) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const RoomTypeForm: React.FC<RoomTypeFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const isEditing = Boolean(initialData);
  const { navigate } = useHotel();

  // Derive linked gallery photos for this room type
  const relatedGallery = useMemo(() => {
    if (!initialData?.id) return [];
    const allGallery = loadAdminGallery();
    return allGallery.filter((item) => item.room_type === initialData.id);
  }, [initialData]);

  const defaultValues: RoomTypeFormValues = {
    name: initialData?.name || '',
    description: initialData?.description || '',
    max_occupancy: initialData?.max_occupancy || 2,
    bed_configuration: initialData?.bed_configuration || { king_bed: 1 },
    size_sqm: initialData?.size_sqm || '24.00',
    amenity_ids: initialData?.amenity_ids || [1, 2, 3],
    is_active: initialData?.is_active !== undefined ? initialData.is_active : true,
  };

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<RoomTypeFormValues>({
    defaultValues,
  });

  const watchedName = watch('name');
  const watchedBedConfig = watch('bed_configuration');
  const previewSlug = initialData?.slug || (watchedName ? generateRoomTypeSlug(watchedName) : 'generated-on-save');

  const onFormSubmit = (values: RoomTypeFormValues) => {
    const payload: RoomTypePayload = {
      name: values.name.trim(),
      description: values.description.trim(),
      max_occupancy: Number(values.max_occupancy),
      bed_configuration: values.bed_configuration || {},
      size_sqm: values.size_sqm ? values.size_sqm.trim() : null,
      amenity_ids: values.amenity_ids || [],
      is_active: values.is_active,
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Read-only System Identifiers Banner */}
      <div className="p-3.5 bg-[#F8F5EF] rounded-xl border border-[#EDE7DC] space-y-2 text-xs">
        <div className="flex items-center justify-between text-[#5D6B78]">
          <span className="font-semibold text-[#02070D]">Django REST System Metadata</span>
          {isEditing && (
            <span className="px-2 py-0.5 rounded font-mono font-bold bg-[#0D1A26] text-[#F2C777]">
              ID: #{initialData?.id}
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px] text-[#5D6B78] font-mono">
          <div>
            <span className="text-stone-400">Slug (read-only): </span>
            <span className="font-semibold text-[#0D1A26]">{previewSlug}</span>
          </div>
          {isEditing && initialData?.created_at && (
            <div>
              <span className="text-stone-400">Created: </span>
              <span className="text-[#0D1A26]">
                {new Date(initialData.created_at).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* General Information */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#02070D] border-b border-[#EDE7DC] pb-2">
          1. General Details
        </h4>

        <TextField
          label="Room Type Name"
          required
          placeholder="e.g. Superior Double, Nordic Penthouse Suite"
          error={errors.name?.message}
          {...register('name', {
            required: 'Room type name is required',
            maxLength: {
              value: 120,
              message: 'Name cannot exceed 120 characters',
            },
          })}
        />

        <Textarea
          label="Description"
          rows={3}
          placeholder="Detailed narrative describing the atmosphere, views, finishes, and experience..."
          error={errors.description?.message}
          {...register('description')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField
            label="Max Occupancy (Guests)"
            type="number"
            required
            min={1}
            max={32767}
            placeholder="e.g. 2"
            error={errors.max_occupancy?.message}
            {...register('max_occupancy', {
              required: 'Max occupancy is required',
              valueAsNumber: true,
              min: { value: 1, message: 'Minimum occupancy is 1' },
              max: { value: 32767, message: 'Maximum occupancy is 32,767' },
            })}
          />

          <TextField
            label="Room Size (sqm)"
            type="text"
            placeholder="e.g. 24.00 or 32.5"
            helperText="Surface area in square meters (nullable string)"
            error={errors.size_sqm?.message}
            {...register('size_sqm', {
              pattern: {
                value: /^[0-9]+(\.[0-9]{1,2})?$/,
                message: 'Enter a valid decimal (e.g. 24.00)',
              },
            })}
          />
        </div>

        <Controller
          name="is_active"
          control={control}
          render={({ field }) => (
            <BooleanField
              label="Is Active & Bookable"
              description="When unchecked, this room type will be disabled across public bookings and inventory assignment."
              checked={field.value}
              onChange={field.onChange}
              trueBadge="Active"
              falseBadge="Inactive"
            />
          )}
        />
      </div>

      {/* Bed Configuration */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#02070D] border-b border-[#EDE7DC] pb-2">
          2. Bed Configuration
        </h4>
        <Controller
          name="bed_configuration"
          control={control}
          rules={{
            validate: (value) =>
              (value && Object.keys(value).length > 0) ||
              'At least one bed type configuration is required',
          }}
          render={({ field, fieldState }) => (
            <BedConfigurationEditor
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />
      </div>

      {/* Amenities Multi-Select */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#02070D] border-b border-[#EDE7DC] pb-2">
          3. Room Amenities
        </h4>
        <Controller
          name="amenity_ids"
          control={control}
          render={({ field, fieldState }) => (
            <RoomAmenityMultiSelect
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />
      </div>

      {/* Section 4: Related Gallery Photography */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between border-b border-[#EDE7DC] pb-2">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#02070D]">
              4. Related Gallery Photography
            </h4>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EDE7DC] text-[#25303A]">
              {relatedGallery.length} {relatedGallery.length === 1 ? 'Photo' : 'Photos'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => navigate('/admin/gallery')}
            className="text-xs font-semibold text-[#BF8641] hover:text-[#8C5F27] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Manage in Gallery</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-[11px] text-[#5D6B78] -mt-1">
          Photos associated with this room class. Preferred preview prioritizes active featured images, then display order.
        </p>

        {relatedGallery.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-2.5 bg-[#F8F5EF]/60 rounded-xl border border-[#EDE7DC]">
            {relatedGallery.map((img) => (
              <div
                key={img.id}
                className="relative rounded-lg overflow-hidden border border-[#D3C8B9] bg-stone-900 group shadow-2xs"
              >
                <img
                  src={img.image_url}
                  alt={img.title}
                  className="w-full h-24 object-cover"
                />
                {img.is_featured && (
                  <div className="absolute top-1.5 left-1.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[#0D1A26]/85 text-[#F2C777] text-[9px] font-bold shadow-xs">
                    <Star className="w-2.5 h-2.5 fill-[#F2C777]" />
                    <span>Featured</span>
                  </div>
                )}
                <div className="absolute bottom-1.5 left-1.5">
                  <span
                    className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      img.is_active
                        ? 'bg-emerald-950/80 text-emerald-300'
                        : 'bg-stone-900/80 text-stone-400'
                    }`}
                  >
                    {img.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="absolute top-1.5 right-1.5 px-1 py-0.5 rounded bg-black/60 text-[9px] font-mono text-white">
                  #{img.display_order}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-xl border border-dashed border-[#D3C8B9] text-center bg-white space-y-2">
            <ImageIcon className="w-6 h-6 text-stone-300 mx-auto" />
            <p className="text-xs text-[#5D6B78]">
              No gallery photography is linked to this room type yet.
            </p>
            <button
              type="button"
              onClick={() => navigate('/admin/gallery')}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-[#0D1A26] bg-[#EDE7DC] hover:bg-[#D3C8B9] rounded-lg transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Link or Upload Photo in Gallery</span>
            </button>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <FormActions
        onCancel={onCancel}
        isSubmitting={isLoading}
        submitLabel={isEditing ? 'Save Room Type Changes' : 'Create Room Type'}
        cancelLabel="Cancel"
      />
    </form>
  );
};
