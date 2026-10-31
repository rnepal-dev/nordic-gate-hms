// Physical Rooms Model - Exactly aligned with Django REST Swagger specification

export type RoomStatus = 'active' | 'maintenance' | 'out_of_service';

export interface RoomStatusOption {
  value: RoomStatus;
  label: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  dotBg: string;
}

export const ROOM_STATUS_CONFIG: Record<RoomStatus, RoomStatusOption> = {
  active: {
    value: 'active',
    label: 'Active',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-800',
    badgeBorder: 'border-emerald-200',
    dotBg: 'bg-emerald-500',
  },
  maintenance: {
    value: 'maintenance',
    label: 'Maintenance',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-800',
    badgeBorder: 'border-amber-200',
    dotBg: 'bg-amber-500',
  },
  out_of_service: {
    value: 'out_of_service',
    label: 'Out of Service',
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-800',
    badgeBorder: 'border-rose-200',
    dotBg: 'bg-rose-500',
  },
};

export interface PhysicalRoom {
  id: number; // integer, Read-only
  room_number: string; // string, Required, max 20
  room_type: number; // integer, Required, Room Type ID
  room_type_name: string; // string, Read-only
  floor: number | null; // nullable integer, Min 0, max 32767
  status: RoomStatus; // enum: active, maintenance, out_of_service
  notes: string; // string, Editable
  created_at: string; // datetime string, Read-only
  updated_at: string; // datetime string, Read-only
}

// Request payload for create/update (read-only fields excluded)
export interface RoomPayload {
  room_number: string; // required, max 20
  room_type: number; // required, integer
  floor?: number | null; // min 0, max 32767
  status?: RoomStatus;
  notes?: string;
}

// Form values schema for React Hook Form
export interface RoomFormValues {
  room_number: string;
  room_type: number;
  floor: string; // formatted as string in input, parsed to integer/null on submit
  status: RoomStatus;
  notes: string;
}

export const validateRoomFields = (data: Partial<RoomPayload>): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.room_number || !data.room_number.trim()) {
    errors.room_number = 'Room number is required';
  } else if (data.room_number.length > 20) {
    errors.room_number = `Room number cannot exceed 20 characters (currently ${data.room_number.length})`;
  }

  const roomTypeId = Number(data.room_type);
  if (!roomTypeId || isNaN(roomTypeId) || roomTypeId <= 0) {
    errors.room_type = 'Please select a valid Room Type';
  }

  if (data.floor !== undefined && data.floor !== null) {
    const floorNum = Number(data.floor);
    if (isNaN(floorNum) || !Number.isInteger(floorNum) || floorNum < 0 || floorNum > 32767) {
      errors.floor = 'Floor must be an integer between 0 and 32,767';
    }
  }

  if (data.status && !['active', 'maintenance', 'out_of_service'].includes(data.status)) {
    errors.status = 'Invalid status value. Allowed: active, maintenance, out_of_service';
  }

  return errors;
};
