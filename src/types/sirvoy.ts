export interface SirvoyRoomTypeMapping {
  djangoRoomTypeId?: number;
  djangoRoomSlug: string;
  sirvoyRoomTypeId?: string;
  roomName: string;
  maxOccupancy: number;
}

export interface SirvoyEmbedConfig {
  /**
   * Controlled feature flag. Enabled for development / testing with official test form.
   */
  enabled: boolean;
  widgetUrl?: string;
  accountId?: string;
  formId?: string;
  mappings: Record<string, string>;
}

export interface BookingCriteriaValidation {
  isValid: boolean;
  error?: string;
}
