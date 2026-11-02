import React, { useMemo, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Calendar, DollarSign, Bed, ShieldCheck, AlertCircle, Info, Lock } from 'lucide-react';
import { TextField } from '../../../../components/ui/TextField';
import { Select } from '../../../../components/ui/Select';
import { BooleanField } from '../../../../components/ui/BooleanField';
import { FormActions } from '../../../../components/ui/FormActions';
import type { 
  NightlyRate, 
  NightlyRatePayload, 
  RatePlan 
} from '../../../../redux/feature/pricing/pricingTypes';
import { loadRoomTypes } from '../../../../data/adminMockData';

export interface NightlyRateFormProps {
  initialData?: NightlyRate | null;
  ratePlans: RatePlan[];
  onSubmit: (data: NightlyRatePayload) => void;
  onCancel: () => void;
  isLoading?: boolean;
  isViewOnly?: boolean;
}

export interface NightlyRateFormValues {
  room_type: number | string;
  rate_plan: number | string;
  stay_date: string;
  price: string;
  currency: string;
  minimum_stay: number | string;
  is_closed_to_arrival: boolean;
  is_closed_to_departure: boolean;
}

export const NightlyRateForm: React.FC<NightlyRateFormProps> = ({
  initialData,
  ratePlans,
  onSubmit,
  onCancel,
  isLoading = false,
  isViewOnly = false,
}) => {
  const isEditing = Boolean(initialData);

  // Available room types
  const roomTypes = useMemo(() => loadRoomTypes(), []);

  // Today or tomorrow default stay date
  const defaultStayDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }, []);

  const defaultValues: NightlyRateFormValues = {
    room_type: initialData?.room_type || roomTypes[0]?.id || 1,
    rate_plan: initialData?.rate_plan || ratePlans[0]?.id || 1,
    stay_date: initialData?.stay_date || defaultStayDate,
    price: initialData?.price ? initialData.price : '1295.00',
    currency: initialData?.currency || 'SEK',
    minimum_stay: initialData?.minimum_stay !== undefined ? initialData.minimum_stay : 1,
    is_closed_to_arrival:
      initialData?.is_closed_to_arrival !== undefined ? initialData.is_closed_to_arrival : false,
    is_closed_to_departure:
      initialData?.is_closed_to_departure !== undefined ? initialData.is_closed_to_departure : false,
  };

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<NightlyRateFormValues>({
    defaultValues,
  });

  const watchedRatePlanId = Number(watch('rate_plan'));
  const watchedRoomTypeId = Number(watch('room_type'));

  // Selected Rate Plan
  const selectedPlan = useMemo(() => {
    return ratePlans.find((p) => p.id === watchedRatePlanId);
  }, [ratePlans, watchedRatePlanId]);

  // Compatibility checking: Check if current room type is linked to the selected rate plan
  const isRoomCompatible = useMemo(() => {
    if (!selectedPlan || !selectedPlan.room_types || selectedPlan.room_types.length === 0) {
      return true;
    }
    return selectedPlan.room_types.includes(watchedRoomTypeId);
  }, [selectedPlan, watchedRoomTypeId]);

  const onFormSubmit = (values: NightlyRateFormValues) => {
    // Format price cleanly as decimal string without rounding distortion
    const rawPrice = values.price.trim().replace(',', '.');
    const parsedNum = parseFloat(rawPrice);
    const decimalPriceStr = isNaN(parsedNum) ? '1295.00' : parsedNum.toFixed(2);

    const payload: NightlyRatePayload = {
      room_type: Number(values.room_type),
      rate_plan: Number(values.rate_plan),
      stay_date: values.stay_date.trim(),
      price: decimalPriceStr,
      currency: values.currency.trim().toUpperCase() || 'SEK',
      minimum_stay: Math.max(1, Math.floor(Number(values.minimum_stay) || 1)),
      is_closed_to_arrival: Boolean(values.is_closed_to_arrival),
      is_closed_to_departure: Boolean(values.is_closed_to_departure),
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Django REST Metadata Header */}
      <div className="p-3.5 bg-[#F8F5EF] rounded-xl border border-[#EDE7DC] space-y-2 text-xs">
        <div className="flex items-center justify-between text-[#5D6B78]">
          <span className="font-semibold text-[#02070D]">Django REST Yield & Pricing Rule</span>
          {isEditing && (
            <span className="px-2 py-0.5 rounded font-mono font-bold bg-[#0D1A26] text-[#F2C777]">
              RATE ID: #{initialData?.id}
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px] text-[#5D6B78] font-mono">
          <div>
            <span className="text-stone-400">Endpoint: </span>
            <span className="font-semibold text-[#0D1A26]">/pricing/api/nightly-rates/</span>
          </div>
          <div>
            <span className="text-stone-400">Currency: </span>
            <span className="font-semibold text-[#0D1A26]">SEK (Swedish Krona)</span>
          </div>
        </div>
      </div>

      {/* 1. Date & Associations */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#02070D] flex items-center gap-1.5 pb-2 border-b border-[#EDE7DC]">
          <Calendar className="w-3.5 h-3.5 text-[#BF8641]" />
          <span>Stay Date & Target Category</span>
        </h4>

        <TextField
          label="Stay Date (Calendar Night) *"
          type="date"
          disabled={isViewOnly}
          {...register('stay_date', {
            required: 'Stay date is required (YYYY-MM-DD)',
            pattern: {
              value: /^\d{4}-\d{2}-\d{2}$/,
              message: 'Must be in YYYY-MM-DD format',
            },
          })}
          error={errors.stay_date?.message}
          helperText="The specific overnight calendar date for which this rate applies."
        />

        <Controller
          control={control}
          name="rate_plan"
          rules={{ required: 'Rate plan is required' }}
          render={({ field }) => (
            <Select
              label="Rate Plan *"
              disabled={isViewOnly}
              value={field.value.toString()}
              onChange={(val) => field.onChange(Number(val))}
              options={ratePlans.map((rp) => ({
                value: rp.id.toString(),
                label: `${rp.name} (${rp.code}) — ${rp.cancellation_policy === 'flexible' ? 'Flexible' : 'Non-Ref'}`,
              }))}
              error={errors.rate_plan?.message}
              helperText="Pricing structure defining cancellation terms and meal inclusions."
            />
          )}
        />

        <Controller
          control={control}
          name="room_type"
          rules={{ required: 'Room type is required' }}
          render={({ field }) => (
            <Select
              label="Room Type *"
              disabled={isViewOnly}
              value={field.value.toString()}
              onChange={(val) => field.onChange(Number(val))}
              options={roomTypes.map((rt) => {
                const isCompatible = !selectedPlan?.room_types || selectedPlan.room_types.includes(rt.id);
                return {
                  value: rt.id.toString(),
                  label: `${rt.name} (Max ${rt.max_occupancy} guests)${!isCompatible ? ' ⚠️ (Outside plan scope)' : ''}`,
                };
              })}
              error={errors.room_type?.message}
              helperText="The room category to which this nightly rate will be mapped."
            />
          )}
        />

        {/* Compatibility Warning Notice */}
        {!isRoomCompatible && (
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-300 text-xs text-amber-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Rate Plan Scope Notice</span>
              <span>
                The selected rate plan &ldquo;{selectedPlan?.name}&rdquo; does not list this room type in its configured room types. Saving this rate will allow the rate to exist, but ensure the rate plan is also linked to this room type if it should appear in the public booking engine.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Pricing & Restrictions */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#02070D] flex items-center gap-1.5 pb-2 border-b border-[#EDE7DC]">
          <DollarSign className="w-3.5 h-3.5 text-[#BF8641]" />
          <span>Pricing & Minimum Stay</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField
            label="Nightly Price (SEK) *"
            placeholder="1295.00"
            disabled={isViewOnly}
            {...register('price', {
              required: 'Nightly price is required',
              pattern: {
                value: /^\d+(\.\d{1,2})?$/,
                message: 'Enter a valid decimal price (e.g. 1295.00)',
              },
              validate: (val) => {
                const n = parseFloat(val);
                return n > 0 || 'Price must be greater than zero';
              },
            })}
            error={errors.price?.message}
            helperText="Gross nightly price in SEK (includes 12% Swedish hotel VAT)."
          />

          <TextField
            label="Currency"
            disabled
            value="SEK"
            helperText="Authoritative hotel currency for Hotel Nordic Gate in Gothenburg."
          />
        </div>

        <TextField
          label="Minimum Length of Stay (Nights) *"
          type="number"
          min={1}
          max={90}
          disabled={isViewOnly}
          {...register('minimum_stay', {
            required: 'Minimum stay is required',
            min: { value: 1, message: 'Minimum stay must be at least 1 night' },
            max: { value: 90, message: 'Maximum 90 nights' },
          })}
          error={errors.minimum_stay?.message}
          helperText="Minimum consecutive nights required when this date is part of the stay."
        />
      </div>

      {/* 3. Availability Restrictions (CTA / CTD) */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#02070D] flex items-center gap-1.5 pb-2 border-b border-[#EDE7DC]">
          <Lock className="w-3.5 h-3.5 text-[#BF8641]" />
          <span>Yield Restrictions (Arrival & Departure)</span>
        </h4>

        <div className="space-y-3 bg-[#F8F5EF] p-4 rounded-xl border border-[#EDE7DC]">
          <Controller
            control={control}
            name="is_closed_to_arrival"
            render={({ field }) => (
              <BooleanField
                label="Closed to Arrival (CTA)"
                description="When enabled, guests cannot begin a stay (check-in) on this calendar date."
                checked={field.value}
                onChange={field.onChange}
                disabled={isViewOnly}
              />
            )}
          />

          <Controller
            control={control}
            name="is_closed_to_departure"
            render={({ field }) => (
              <BooleanField
                label="Closed to Departure (CTD)"
                description="When enabled, guests cannot end a stay (check-out) on this calendar date."
                checked={field.value}
                onChange={field.onChange}
                disabled={isViewOnly}
              />
            )}
          />
        </div>
      </div>

      {/* Form Actions */}
      <FormActions
        onCancel={onCancel}
        submitLabel={isViewOnly ? 'Close' : isEditing ? 'Save Rate' : 'Create Nightly Rate'}
        isSubmitting={isLoading}
        submitDisabled={isViewOnly}
      />
    </form>
  );
};
