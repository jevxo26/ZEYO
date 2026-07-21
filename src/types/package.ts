export interface EventPackage {
  id: string | number;
  title?: string;
  subtitle?: string;
  price?: number;
  currency?: string;
  imageUrl?: string;
  included?: string[];
  popular?: boolean;
  tier?: string;
  maxGuests?: number;
}
