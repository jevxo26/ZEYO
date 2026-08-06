import { useState, useEffect } from "react";
import { BANGLADESH_ZONES } from "@/lib/calculatorData";
import { ZoneOption } from "@/types/calculator";
import apiClient from "@/lib/apiClient";

export function useDynamicZones() {
  const [zones, setZones] = useState<ZoneOption[]>(BANGLADESH_ZONES);

  useEffect(() => {
    const loadZones = async () => {
      try {
        const res = await apiClient.get("/zones").catch(() => apiClient.get("/packages/zones")).catch(() => null);
        if (res && res.data && res.data.data && Array.isArray(res.data.data)) {
          const apiZones: ZoneOption[] = res.data.data.map((z: any) => ({
            id: String(z.id || z.name.toLowerCase().replace(/\s+/g, "-")),
            name: z.name,
            slug: z.slug || z.name.toLowerCase().replace(/\s+/g, "-"),
            priceMultiplier: Number(z.priceMultiplier || z.mult || 1.0),
          }));
          setZones(apiZones);
        }
      } catch (e) {}
    };

    loadZones();

    window.addEventListener("dashboard-data-update", loadZones);
    return () => {
      window.removeEventListener("dashboard-data-update", loadZones);
    };
  }, []);

  return zones;
}
