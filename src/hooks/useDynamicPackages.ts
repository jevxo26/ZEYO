import { useState, useEffect } from "react";
import { EventPackage } from "@/types/package";
import apiClient from "@/lib/apiClient";

export const DEFAULT_PACKAGES: EventPackage[] = [];

export function useDynamicPackages() {
  const [packages, setPackages] = useState<EventPackage[]>([]);

  useEffect(() => {
    const loadPackages = async () => {
      try {
        const res = await apiClient.get("/packages").catch(() => apiClient.get("/admin/packages")).catch(() => null);
        if (res && res.data && (Array.isArray(res.data.data) || Array.isArray(res.data))) {
          const raw = Array.isArray(res.data.data) ? res.data.data : res.data;
          const apiPackages: EventPackage[] = raw.map((p: any) => ({
            id: String(p.id || `pkg-api-${p.slug || Date.now()}`),
            title: p.name || p.title || "Package",
            subtitle: p.shortDescription || p.subtitle || p.description || "",
            eventTypeId: p.eventId ? `evt-type-${p.eventId}` : "evt-type-wedding",
            basePrice: Number(p.basePrice || p.price || 0),
            discountPercentage: Number(p.discountPercentage || 0),
            imageUrl: p.imageUrl || "",
            popular: Boolean(p.isFeatured || p.popular),
            included: p.included || [],
            configuredServices: p.configuredServices || [],
          }));
          setPackages(apiPackages);
        }
      } catch (e) {}
    };

    loadPackages();

    window.addEventListener("dashboard-data-update", loadPackages);
    return () => {
      window.removeEventListener("dashboard-data-update", loadPackages);
    };
  }, []);

  return packages;
}
