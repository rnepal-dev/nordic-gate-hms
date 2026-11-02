import React, { useMemo, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ShieldCheck, Coffee, Waves, AlertCircle, Sparkles, Bed, Info } from 'lucide-react';
import { TextField } from '../../../../components/ui/TextField';
import { Textarea } from '../../../../components/ui/Textarea';
import { Select } from '../../../../components/ui/Select';
import { BooleanField } from '../../../../components/ui/BooleanField';
import { FormActions } from '../../../../components/ui/FormActions';
import type { RatePlan, RatePlanPayload, CancellationPolicy } from '../../../../redux/feature/pricing/pricingTypes';
import { loadRoomTypes } from '../../../../data/adminMockData';

export interface RatePlanFormProps {
  initialData?: RatePlan | null;
  onSubmit: (data: RatePlanPayload) => void;
  onCancel: () => void;
  isLoading?: boolean;
  isViewOnly?: boolean;
}

export interface RatePlanFormValues {
  name: string;
  code: string;
  description: string;
  cancellation_policy: CancellationPolicy;
  free_cancellation_deadline_hours: number | null | string;
  breakfast_included: boolean;
  pool_included: boolean;
  is_active: boolean;
  room_types: number[];
}

export const RatePlanForm: React.FC<RatePlanFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  isViewOnly = false,
}) => {
  const isEditing = Boolean(initialData);

  // Load available room types from system
  const availableRoomTypes = useMemo(() => loadRoomTypes(), []);

  // Merge any historical room types from initialData that may not be in availableRoomTypes
  const allSelectableRoomTypes = useMemo(() => {
    const list = [...availableRoomTypes];
    if (initialData?.room_types) {
      initialData.room_types.forEach((id) => {
        if (!list.some((r) => r.id === id)) {
          list.push({
            id,
            name: `Legacy Room Type #${id}`,
            slug: `legacy-room-${id}`,
            description: 'Historical room type retained for data integrity',
            max_occupancy: 2,
            bed_configuration: {},
            size_sqm: '20.00',
            amenities: '',
            amenity_ids: [],
            is_active: false,
            created_at: '',
            updated_at: '',
          });
        }
      });
    }
    return list;
  }, [availableRoomTypes, initialData]);

  const defaultValues: RatePlanFormValues = {
    name: initialData?.name || '',
    code: initialData?.code || '',
    description: initialData?.description || '',
    cancellation_policy: initialData?.cancellation_policy || 'flexible',
    free_cancellation_deadline_hours:
      initialData?.free_cancellation_deadline_hours !== undefined
        ? initialData.free_cancellation_deadline_hours
        : 24,
    breakfast_included:
      initialData?.breakfast_included !== undefined ? initialData.breakfast_included : true,
    pool_included:
      initialData?.pool_included !== undefined ? initialData.pool_included : true,
    is_active: initialData?.is_active !== undefined ? initialData.is_active : true,
    room_types: initialData?.room_types ? [...initialData.room_types] : [1, 2, 3, 4, 5],
  };

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RatePlanFormValues>({
    defaultValues,
  });

  const watchedPolicy = watch('cancellation_policy');
  const watchedRoomTypes = watch('room_types') || [];
  const watchedName = watch('name');

  // Auto-generate uppercase code if empty and name changes
  useEffect(() => {
    if (!isEditing && watchedName && !initialData?.code) {
      const generated = watchedName
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, '_')
        .slice(0, 15);
      setValue('code', generated, { shouldValidate: true });
    }
  }, [watchedName, isEditing, initialData, setValue]);

  const handleToggleRoomType = (roomTypeId: number) => {
    if (isViewOnly) return;
    const current = new Set(watchedRoomTypes);
    if (current.has(roomTypeId)) {
      current.delete(roomTypeId);
    } else {
      current.add(roomTypeId);
    }
    setValue('room_types', Array.from(current), { shouldValidate: true });
  };

  const handleSelectAllRooms = () => {
    if (isViewOnly) return;
    const allIds = allSelectableRoomTypes.map((r) => r.id);
    setValue('room_types', allIds, { shouldValidate: true });
  };

  const handleClearAllRooms = () => {
    if (isViewOnly) return;
    setValue('room_types', [], { shouldValidate: true });
  };

  const onFormSubmit = (values: RatePlanFormValues) => {
    const isFlexible = values.cancellation_policy === 'flexible';
    let deadlineHours: number | null = null;
    if (isFlexible) {
      const parsed = Number(values.free_cancellation_deadline_hours);
      deadlineHours = isNaN(parsed) || parsed < 0 ? 24 : Math.floor(parsed);
    }

    const payload: RatePlanPayload = {
      name: values.name.trim(),
      code: values.code.trim().toUpperCase(),
      description: values.description.trim(),
      cancellation_policy: values.cancellation_policy,
      free_cancellation_deadline_hours: deadlineHours,
      breakfast_included: Boolean(values.breakfast_included),
      pool_included: Boolean(values.pool_included),
      is_active: Boolean(values.is_active),
      room_types: values.room_types.map(Number),
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Read-only System Metadata Banner */}
      <div className="p-3.5 bg-[#F8F5EF] rounded-xl border border-[#EDE7DC] space-y-2 text-xs">
        <div className="flex items-center justify-between text-[#5D6B78]">
          <span className="font-semibold text-[#02070D]">Django REST Pricing Contract</span>
          {isEditing && (
            <span className="px-2 py-0.5 rounded font-mono font-bold bg-[#0D1A26] text-[#F2C777]">
              RATE PLAN ID: #{initialData?.id}
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px] text-[#5D6B78] font-mono">
          <div>
            <span className="text-stone-400">Endpoint: </span>
            <span className="font-semibold text-[#0D1A26]">/pricing/api/rate-plans/</span>
          </div>
          {isEditing && initialData?.updated_at && (
            <div>
              <span className="text-stone-400">Last Updated: </span>
              <span className="text-[#0D1A26]">
                {new Date(initialData.updated_at).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 1. Basic Plan Identifiers */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#02070D] flex items-center gap-1.5 pb-2 border-b border-[#EDE7DC]">
          <Sparkles className="w-3.5 h-3.5 text-[#BF8641]" />
          <span>Plan Identifiers</span>
        </h4>

        <TextField
          label="Rate Plan Name *"
          placeholder="e.g. Flexible Heritage Rate"
          disabled={isViewOnly}
          {...register('name', {
            required: 'Rate plan name is required',
            minLength: { value: 3, message: 'Name must be at least 3 characters' },
            maxLength: { value: 120, message: 'Name cannot exceed 120 characters' },
          })}
          error={errors.name?.message}
          helperText="Display name shown to guests during room booking selection."
        />

        <TextField
          label="Rate Plan Code *"
          placeholder="e.g. FLEX, ADV15, DINE"
          disabled={isViewOnly}
          {...register('code', {
            required: 'Plan code is required',
            pattern: {
              value: /^[A-Z0-9_-]+$/i,
              message: 'Code must contain only letters, numbers, hyphens, and underscores',
            },
            maxLength: { value: 20, message: 'Code cannot exceed 20 characters' },
          })}
          error={errors.code?.message}
          helperText="Unique uppercase identifier used by HMS and channel integrations."
        />

        <Textarea
          label="Description"
          rows={3}
          placeholder="Detailed explanation of rate terms, meal inclusions, and booking conditions..."
          disabled={isViewOnly}
          {...register('description')}
          error={errors.description?.message}
          helperText="Optional description rendered in the rate plan drawer and confirmation voucher."
        />
      </div>

      {/* 2. Cancellation Policy Configuration */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#02070D] flex items-center gap-1.5 pb-2 border-b border-[#EDE7DC]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#BF8641]" />
          <span>Cancellation Policy & Guarantee</span>
        </h4>

        <Controller
          control={control}
          name="cancellation_policy"
          rules={{ required: 'Please select a cancellation policy' }}
          render={({ field }) => (
            <Select
              label="Cancellation Policy *"
              disabled={isViewOnly}
              value={field.value}
              onChange={field.onChange}
              options={[
                { value: 'flexible', label: 'Flexible (Free cancellation before deadline)' },
                { value: 'non_refundable', label: 'Non-Refundable (Non-refundable, best rate guaranteed)' },
              ]}
              error={errors.cancellation_policy?.message}
            />
          )}
        />

        {watchedPolicy === 'flexible' ? (
          <TextField
            label="Free Cancellation Deadline (Hours prior to arrival) *"
            type="number"
            min={0}
            max={720}
            disabled={isViewOnly}
            placeholder="24"
            {...register('free_cancellation_deadline_hours', {
              required: watchedPolicy === 'flexible' ? 'Deadline hours are required for flexible policy' : false,
              min: { value: 0, message: 'Hours must be 0 or greater' },
              max: { value: 720, message: 'Maximum 720 hours (30 days)' },
            })}
            error={errors.free_cancellation_deadline_hours?.message}
            helperText="Number of hours before 15:00 check-in when guests can cancel without penalty (typically 24 or 48 hours)."
          />
        ) : (
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-[#5D6B78] flex items-center gap-2">
            <Info className="w-4 h-4 text-[#BF8641] shrink-0" />
            <span>
              For non-refundable rate plans, the cancellation deadline is strictly <strong>null</strong>. Bookings cannot be cancelled or refunded after payment.
            </span>
          </div>
        )}
      </div>

      {/* 3. Inclusions & Status Switches */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#02070D] flex items-center gap-1.5 pb-2 border-b border-[#EDE7DC]">
          <Coffee className="w-3.5 h-3.5 text-[#BF8641]" />
          <span>Inclusions & Availability Status</span>
        </h4>

        <div className="space-y-3 bg-[#F8F5EF] p-4 rounded-xl border border-[#EDE7DC]">
          <Controller
            control={control}
            name="breakfast_included"
            render={({ field }) => (
              <BooleanField
                label="Breakfast Buffet Included"
                description="Includes daily organic Scandinavian breakfast buffet in Tullhuset restaurant."
                checked={field.value}
                onChange={field.onChange}
                disabled={isViewOnly}
              />
            )}
          />

          <Controller
            control={control}
            name="pool_included"
            render={({ field }) => (
              <BooleanField
                label="Indoor Heated Pool & Sauna Access"
                description="Includes complimentary access to the 28°C indoor pool and Finnish sauna."
                checked={field.value}
                onChange={field.onChange}
                disabled={isViewOnly}
              />
            )}
          />

          <Controller
            control={control}
            name="is_active"
            render={({ field }) => (
              <BooleanField
                label="Active Status"
                description="When enabled, this rate plan is published and bookable via the public booking engine."
                checked={field.value}
                onChange={field.onChange}
                disabled={isViewOnly}
              />
            )}
          />
        </div>
      </div>

      {/* 4. Applicable Room Types Multi-Select */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#EDE7DC]">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#02070D] flex items-center gap-1.5">
            <Bed className="w-3.5 h-3.5 text-[#BF8641]" />
            <span>Applicable Room Types * ({watchedRoomTypes.length} selected)</span>
          </h4>
          {!isViewOnly && (
            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={handleSelectAllRooms}
                className="text-[#BF8641] hover:underline font-semibold cursor-pointer"
              >
                Select All
              </button>
              <span className="text-stone-300">|</span>
              <button
                type="button"
                onClick={handleClearAllRooms}
                className="text-stone-500 hover:underline cursor-pointer"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {watchedRoomTypes.length === 0 && (
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>At least one room type should be linked for this rate plan to be available.</span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-1">
          {allSelectableRoomTypes.map((room) => {
            const isSelected = watchedRoomTypes.includes(room.id);
            return (
              <div
                key={room.id}
                onClick={() => handleToggleRoomType(room.id)}
                className={`p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-amber-50/50 border-[#BF8641] shadow-xs'
                    : 'bg-white border-[#EDE7DC] hover:border-[#D3C8B9]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleToggleRoomType(room.id)}
                    disabled={isViewOnly}
                    className="rounded accent-[#BF8641] text-[#BF8641] focus:ring-[#BF8641] w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#0D1A26] block">
                      {room.name}
                    </span>
                    <span className="text-[11px] text-[#5D6B78]">
                      ID #{room.id} · {room.slug} {!room.is_active && '(Inactive)'}
                    </span>
                  </div>
                </div>

                <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                  isSelected ? 'bg-[#0D1A26] text-[#F2C777]' : 'bg-stone-100 text-stone-500'
                }`}>
                  {isSelected ? 'LINKED' : 'UNLINKED'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Action Buttons */}
      <FormActions
        onCancel={onCancel}
        submitLabel={isViewOnly ? 'Close' : isEditing ? 'Save Changes' : 'Create Rate Plan'}
        isSubmitting={isLoading}
        submitDisabled={isViewOnly}
      />
    </form>
  );
};
