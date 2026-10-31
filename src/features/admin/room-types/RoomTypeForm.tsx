import React from 'react';
import { useForm, Controller } from 'react-hook-form';
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
import { loadRoomAmenities } from '../../../data/adminMockData';

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
