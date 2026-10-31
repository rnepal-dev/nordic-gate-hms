import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  RoomAmenity,
  RoomAmenityPayload,
  RoomAmenityFormValues,
  generateAmenitySlug,
} from './amenityTypes';
import { TextField } from '../../../components/ui/TextField';
import { Textarea } from '../../../components/ui/Textarea';
import { IconPicker } from '../../../components/ui/IconPicker';
import { BooleanField } from '../../../components/ui/BooleanField';
import { FormActions } from '../../../components/ui/FormActions';
import { Hash, Sparkles } from 'lucide-react';

export interface RoomAmenityFormProps {
  initialData?: RoomAmenity | null;
  onSubmit: (payload: RoomAmenityPayload & { id?: number; slug?: string }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const RoomAmenityForm: React.FC<RoomAmenityFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<RoomAmenityFormValues>({
    defaultValues: {
      name: initialData?.name || '',
      icon: initialData?.icon || 'sparkles',
      description: initialData?.description || '',
      is_active: initialData?.is_active ?? true,
      display_order: initialData?.display_order ?? 1,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        icon: initialData.icon || 'sparkles',
        description: initialData.description || '',
        is_active: initialData.is_active,
        display_order: initialData.display_order,
      });
    } else {
      reset({
        name: '',
        icon: 'sparkles',
        description: '',
        is_active: true,
        display_order: 1,
      });
    }
  }, [initialData, reset]);

  const watchedName = watch('name');
  const watchedDescription = watch('description') || '';
  const descCharCount = watchedDescription.length;
  const isDescOverLimit = descCharCount > 255;
  const computedSlug = initialData?.slug || generateAmenitySlug(watchedName || '');

  const onFormSubmit = (data: RoomAmenityFormValues) => {
    const payload: RoomAmenityPayload = {
      name: data.name.trim(),
      icon: data.icon || 'sparkles',
      description: data.description.trim(),
      is_active: data.is_active,
      display_order: Number(data.display_order) || 0,
    };

    onSubmit({
      ...payload,
      ...(initialData?.id ? { id: initialData.id, slug: initialData.slug } : { slug: computedSlug }),
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Read-Only Server Metadata (when editing) */}
      {initialData?.id && (
        <div className="p-3.5 bg-[#F8F5EF] border border-[#D3C8B9] rounded-xl space-y-1 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-[#BF8641]" />
              <span className="font-bold text-[#0D1A26]">
                Amenity ID #{initialData.id}
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#EDE7DC] text-[#25303A] uppercase">
                Read-Only
              </span>
            </div>
            <span className="font-mono text-stone-500 text-[11px]">
              slug: {initialData.slug}
            </span>
          </div>
        </div>
      )}

      {/* Name Field */}
      <div>
        <TextField
          label="Amenity Name"
          required
          placeholder="e.g. High-Speed Wi-Fi 6, Hansgrohe Rain Shower"
          error={errors.name?.message}
          helperText="Required, maximum 120 characters"
          {...register('name', {
            required: 'Amenity name is required',
            maxLength: {
              value: 120,
              message: 'Name cannot exceed 120 characters',
            },
          })}
        />
        {watchedName && (
          <p className="mt-1 text-[11px] font-mono text-[#5D6B78] pl-1">
            Generated Slug: <span className="text-[#BF8641]">{computedSlug}</span>
          </p>
        )}
      </div>

      {/* Icon Picker Component */}
      <div>
        <Controller
          name="icon"
          control={control}
          render={({ field }) => (
            <IconPicker
              label="Amenity Icon"
              value={field.value}
              onChange={field.onChange}
              helperText="Icon identifier (max 100 characters)"
            />
          )}
        />
      </div>

      {/* Description Field with Live Character Counter */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#02070D]">
            Description (Optional)
          </label>
          <span
            className={`text-[11px] font-mono ${
              isDescOverLimit
                ? 'text-rose-600 font-bold'
                : descCharCount > 200
                ? 'text-amber-600'
                : 'text-stone-400'
            }`}
          >
            {descCharCount}/255 chars
          </span>
        </div>
        <Textarea
          rows={3}
          placeholder="Describe the amenity, brand or specifications (e.g. Hansgrohe mixer, 43-inch 4K UHD)..."
          error={errors.description?.message}
          {...register('description', {
            maxLength: {
              value: 255,
              message: 'Description cannot exceed 255 characters',
            },
          })}
        />
      </div>

      {/* Is Active Toggle */}
      <div className="pt-2 border-t border-[#EDE7DC]">
        <Controller
          name="is_active"
          control={control}
          render={({ field }) => (
            <BooleanField
              label="Amenity Active Status"
              description="Active amenities can be linked to room types and displayed to guests."
              checked={field.value}
              onChange={field.onChange}
              trueBadge="Active"
              falseBadge="Inactive"
            />
          )}
        />
      </div>

      {/* Display Order */}
      <div className="max-w-xs">
        <TextField
          label="Display Order"
          type="number"
          min={0}
          max={2147483647}
          error={errors.display_order?.message}
          helperText="0 to 2,147,483,647 (lower numbers display first)"
          {...register('display_order', {
            valueAsNumber: true,
            min: {
              value: 0,
              message: 'Display order cannot be negative',
            },
            max: {
              value: 2147483647,
              message: 'Display order cannot exceed 2,147,483,647',
            },
          })}
        />
      </div>

      {/* Reusable FormActions */}
      <FormActions
        onCancel={onCancel}
        isSubmitting={isLoading}
        submitLabel={initialData?.id ? 'Save Amenity' : 'Create Amenity'}
        submitDisabled={isDescOverLimit}
      />
    </form>
  );
};
