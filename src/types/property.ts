export type VerificationStatus = 
  | 'confirmed_for_nordic_gate'
  | 'reported_for_reference_property'
  | 'pending_verification'
  | 'demo_placeholder';

export type DataSource = 
  | 'quality_hotel_winn_listing'
  | 'nordic_gate_brand_charter'
  | 'guest_experience_spec'
  | 'demo_environment';

export interface VerifiableValue<T> {
  value: T;
  source: DataSource;
  status: VerificationStatus;
  notes?: string;
}

export type FacilityCategory = 
  | 'wellness'
  | 'dining'
  | 'family'
  | 'connectivity'
  | 'accessibility'
  | 'parking'
  | 'services'
  | 'pets';

export interface FacilityItem {
  id: string;
  category: FacilityCategory;
  nameEn: string;
  nameSv: string;
  descriptionEn?: string;
  descriptionSv?: string;
  iconName: string;
  status: VerificationStatus;
  reportedInReference: boolean;
  notes?: string;
}

export type RoomCategoryTier = 
  | 'compact' 
  | 'standard' 
  | 'superior' 
  | 'family' 
  | 'suite';

export interface RoomType {
  id: string;
  propertyId: string;
  name: string;
  nameSv: string;
  taglineEn?: string;
  taglineSv?: string;
  descriptionEn: string;
  descriptionSv: string;
  category: RoomCategoryTier;
  sizeM2?: number; // optional, can remain unset if unverified
  bedConfigurationEn: string;
  bedConfigurationSv: string;
  adultCapacity: number;
  childCapacity: number;
  maxGuests: number;
  accessibilityAttributes: string[];
  petEligible: boolean;
  amenities: {
    key: string;
    labelEn: string;
    labelSv: string;
  }[];
  images: string[];
  displayOrder: number;
  inventoryQuantity?: number;
  startingPriceSEK?: number;
  verificationStatus: VerificationStatus;
  notes?: string;
}

export interface HotelPolicy {
  key: string;
  titleEn: string;
  titleSv: string;
  valueEn: string;
  valueSv: string;
  detailsEn?: string;
  detailsSv?: string;
  category: 'check_in_out' | 'children_beds' | 'pets' | 'parking' | 'payment' | 'accessibility';
  status: VerificationStatus;
}

export interface TransportDetail {
  modeEn: string;
  modeSv: string;
  descriptionEn: string;
  descriptionSv: string;
  estimatedTime?: string;
  distanceKm?: number;
  status: VerificationStatus;
}

export interface PropertyInformationModel {
  brandName: VerifiableValue<string>;
  propertyIdentity: VerifiableValue<string>;
  referenceProperty: {
    name: string;
    listingUrl: string;
    relationStatus: string;
  };
  address: {
    street: VerifiableValue<string>;
    postalCode: VerifiableValue<string>;
    city: VerifiableValue<string>;
    country: VerifiableValue<string>;
    district: VerifiableValue<string>;
    coordinates?: { lat: number; lng: number };
  };
  contact: {
    phone: VerifiableValue<string>;
    email: VerifiableValue<string>;
  };
  descriptions: {
    shortEn: VerifiableValue<string>;
    shortSv: VerifiableValue<string>;
    fullEn: VerifiableValue<string>;
    fullSv: VerifiableValue<string>;
  };
  facilities: FacilityItem[];
  rooms: RoomType[];
  policies: HotelPolicy[];
  transport: TransportDetail[];
  nearbyAttractions: {
    nameEn: string;
    nameSv: string;
    distanceKm: number;
    descriptionEn: string;
    descriptionSv: string;
  }[];
  seo: {
    titleEn: string;
    titleSv: string;
    metaDescriptionEn: string;
    metaDescriptionSv: string;
  };
}

export interface ReconciliationRow {
  id: string;
  domain: 'Brand & Identity' | 'Location & Address' | 'Wellness & Pool' | 'Dining & Breakfast' | 'Room Catalog' | 'Policies' | 'Parking & Transport';
  previousContent: string;
  qualityWinnListing: string;
  confirmedBySource: boolean;
  verifiedForNordicGate: boolean;
  designDataModelChange: string;
}
