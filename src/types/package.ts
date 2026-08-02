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
  discountPercentage: number;
  imageUrl?: string;
  popular?: boolean;
  configuredServices: ConfiguredPackageService[];
}
