export interface ConfiguredPackageService {
  serviceKey: string;
  tierId: string;
  coverageId: string;
  addons: string[];
}

export interface EventPackage {
  id: string;
  title: string;
  subtitle: string;
  eventTypeId: string;
  basePrice: number;
  price?: number;
  currency?: string;
  maxGuests?: number;
  included?: string[];
  discountPercentage: number;
  imageUrl?: string;
  popular?: boolean;
  tier?: string;
  configuredServices: ConfiguredPackageService[];
}
