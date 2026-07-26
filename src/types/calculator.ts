export interface ZoneOption {
  id: string;
  name: string;
  slug: string;
  priceMultiplier: number; // e.g. Dhaka = 1.0, Chattogram = 1.2, Rajshahi = 0.8
}

export interface EventTypeOption {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
}

export interface ServiceTierOption {
  id: string;
  name: string; // Basic, Premium, Luxury
  price: number;
  description: string;
  features: string[];
}

export interface ServiceAddonOption {
  id: string;
  name: string;
  price: number;
  isPerGuest?: boolean;
}

export interface CoverageOption {
  id: string;
  name: string; // e.g. "4 Hours", "8 Hours", "1 Day", "2 Days", "3 Days"
  multiplier: number;
}

export interface CalculatorServiceDefinition {
  id: string;
  key: string; // 'photography', 'videography', 'catering', etc.
  name: string;
  description: string;
  iconName: string;
  isPerGuest?: boolean;
  defaultGuestPrice?: number;
  tiers: ServiceTierOption[];
  coverages: CoverageOption[];
  addons: ServiceAddonOption[];
}

export interface ConfiguredServiceState {
  serviceKey: string;
  serviceName: string;
  selectedTierId: string;
  tierName: string;
  tierPrice: number;
  selectedCoverageId: string;
  coverageName: string;
  coverageMultiplier: number;
  guestCount: number;
  selectedAddons: {
    id: string;
    name: string;
    price: number;
    isPerGuest?: boolean;
  }[];
  calculatedPrice: number;
}

export interface SmartCalculatorState {
  step: number; // 1: Zone & Event, 2: Select Services, 3: Configure Services, 4: Summary
  zoneId: string;
  zoneName: string;
  eventTypeId: string;
  eventTypeName: string;
  eventDate: string;
  globalGuestCount: number;
  selectedServiceKeys: string[];
  configuredServices: Record<string, ConfiguredServiceState>;
}
