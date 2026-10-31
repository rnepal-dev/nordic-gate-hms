import React, { useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField } from '../../../components/ui/TextField';
import { Textarea } from '../../../components/ui/Textarea';
import { Select } from '../../../components/ui/Select';
import { FormActions } from '../../../components/ui/FormActions';
import {
  PhysicalRoom,
  RoomPayload,
  RoomFormValues,
  RoomStatus,
  ROOM_STATUS_CONFIG,
} from './roomTypes';
import { loadRoomTypes } from '../../../data/adminMockData';

export interface RoomFormProps {
  initialData?: PhysicalRoom | null;
  onSubmit: (data: RoomPayload) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const RoomForm: React.FC<RoomFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const isEditing = Boolean(initialData);
  const roomTypes = useMemo(() => loadRoomTypes(), []);

  const defaultValues: RoomFormValues = {
    room_number: initialData?.room_number || '',
    room_type: initialData?.room_type || (roomTypes[0]?.id ?? 1),
    floor: initialData?.floor !== null && initialData?.floor !== undefined ? String(initialData.floor) : '1',
    status: initialData?.status || 'active',
    notes: initialData?.notes || '',
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RoomFormValues>({
    defaultValues,
  });

  const onFormSubmit = (values: RoomFormValues) => {
    const payload: RoomPayload = {
      room_number: values.room_number.trim(),
      room_type: Number(values.room_type),
      floor: values.floor !== '' && values.floor !== undefined ? Number(values.floor) : null,
      status: values.status,
      notes: values.notes.trim(),
    };
    onSubmit(payload);
  };

  const roomTypeOptions = useMemo(() => {
    return roomTypes.map((rt) => ({
      value: String(rt.id),
      label: `${rt.name} (${rt.max_occupancy} guests, ${rt.size_sqm ? rt.size_sqm + ' m²' : 'std'})`,
    }));
  }, [roomTypes]);

  const statusOptions = [
    { value: 'active', label: 'Active - Available for guest reservations' },
    { value: 'maintenance', label: 'Maintenance - Temporary upkeep / inspection' },
    { value: 'out_of_service', label: 'Out of Service - Off-line / deep renovation' },
  ];

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Django REST Metadata Header */}
      <div className="p-3.5 bg-[#F8F5EF] rounded-xl border border-[#EDE7DC] space-y-2 text-xs">
        <div className="flex items-center justify-between text-[#5D6B78]">
          <span className="font-semibold text-[#02070D]">Django REST Physical Room</span>
          {isEditing && (
            <span className="px-2 py-0.5 rounded font-mono font-bold bg-[#0D1A26] text-[#F2C777]">
              Room ID: #{initialData?.id}
            </span>
          )}
        </div>
        {isEditing && (
          <div className="grid grid-cols-2 gap-2 text-[11px] text-[#5D6B78] font-mono">
            <div>
              <span className="text-stone-400">Class (read-only): </span>
              <span className="font-semibold text-[#0D1A26]">{initialData?.room_type_name}</span>
            </div>
            {initialData?.created_at && (
              <div>
                <span className="text-stone-400">Created: </span>
                <span className="text-[#0D1A26]">
                  {new Date(initialData.created_at).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Room Details */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField
            label="Room Number"
            required
            placeholder="e.g. 101, 204B, 501"
            helperText="Max 20 alphanumeric characters"
            error={errors.room_number?.message}
            {...register('room_number', {
              required: 'Room number is required',
              maxLength: {
                value: 20,
                message: 'Room number cannot exceed 20 characters',
              },
            })}
          />

          <TextField
            label="Floor Level"
            type="number"
            min={0}
            max={32767}
            placeholder="e.g. 1"
            helperText="Floor number (0 to 32,767, optional)"
            error={errors.floor?.message}
            {...register('floor', {
              validate: (val) => {
                if (val === '' || val === undefined) return true;
                const n = Number(val);
                return (!isNaN(n) && Number.isInteger(n) && n >= 0 && n <= 32767) ||
                  'Floor must be an integer between 0 and 32,767';
              },
            })}
          />
        </div>

        <Controller
          name="room_type"
          control={control}
          rules={{ required: 'Room type selection is required' }}
          render={({ field, fieldState }) => (
            <Select
              label="Room Type (Foreign Key)"
              required
              options={roomTypeOptions}
              value={String(field.value)}
              onChange={(e) => field.onChange(Number(e.target.value))}
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          name="status"
          control={control}
          rules={{ required: 'Status is required' }}
          render={({ field, fieldState }) => (
            <Select
              label="Physical Room Operational Status"
              required
              options={statusOptions}
              value={field.value}
              onChange={(e) => field.onChange(e.target.value as RoomStatus)}
              error={fieldState.error?.message}
            />
          )}
        />

        <Textarea
          label="Internal Staff Notes"
          rows={3}
          placeholder="e.g. Quiet courtyard facing, wheelchair ramp accessible, adjoining door to 102..."
          error={errors.notes?.message}
          {...register('notes')}
        />
      </div>

      <FormActions
        onCancel={onCancel}
        isSubmitting={isLoading}
        submitLabel={isEditing ? 'Save Room Changes' : 'Create Physical Room'}
        cancelLabel="Cancel"
      />
    </form>
  );
};
