export interface SirvoyRoomTypeMapping {
  djangoRoomTypeId?: number;
  djangoRoomSlug: string;
  sirvoyRoomTypeId?: string;
  roomName: string;
  maxOccupancy: number;
}

export interface SirvoyEmbedConfig {
  /**
   * Controlled feature flag. Must remain false until official Sirvoy
   * widget code, channel mappings, and hotel management approval are verified.
   */
  enabled: boolean;
  widgetUrl?: string;
  accountId?: string;
  mappings: Record<string, string>;
}

export interface BookingCriteriaValidation {
  isValid: boolean;
  error?: string;
}
