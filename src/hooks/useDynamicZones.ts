import { useState, useEffect } from "react";
import { BANGLADESH_ZONES } from "@/lib/calculatorData";
import { ZoneOption } from "@/types/calculator";
import apiClient from "@/lib/apiClient";

export function useDynamicZones() {
  const [zones, setZones] = useState<ZoneOption[]>(BANGLADESH_ZONES);

  useEffect(() => {
    const loadZones = async () => {
      let localMapped: ZoneOption[] = [];
      try {
        const stored = localStorage.getItem("customZones");
        if (stored) {
          const parsed = JSON.parse(stored);
          const activeOnly = parsed.filter((z: any) => z.active);
          if (activeOnly.length > 0) {
            localMapped = activeOnly.map((z: any) => ({
              id: z.name.toLowerCase().replace(/\s+/g, "-"),
              name: z.name,
              slug: z.name.toLowerCase().replace(/\s+/g, "-"),
              priceMultiplier: parseFloat(z.mult ? z.mult.replace(/[^0-9.]/g, "") : "1") || 1.0,
            }));
          }
        }
      } catch (e) {}

      let apiZones: ZoneOption[] = [];
      try {
        const res = await apiClient.get("/zones").catch(() => apiClient.get("/packages/zones")).catch(() => null);
        if (res && res.data && res.data.data && Array.isArray(res.data.data)) {
          apiZones = res.data.data.map((z: any) => ({
            id: String(z.id || z.name.toLowerCase().replace(/\s+/g, "-")),
            name: z.name,
            slug: z.slug || z.name.toLowerCase().replace(/\s+/g, "-"),
            priceMultiplier: Number(z.priceMultiplier || z.mult || 1.0),
          }));
        }
      } catch (e) {}

      const pool = [...localMapped, ...apiZones, ...BANGLADESH_ZONES];
      const unique = pool.filter(
        (z, idx, self) =>
          idx ===
          self.findIndex(
            (item) => String(item.name).toLowerCase() === String(z.name).toLowerCase()
          )
      );
      setZones(unique);
    };

    loadZones();

    window.addEventListener("dashboard-data-update", loadZones);
    return () => {
      window.removeEventListener("dashboard-data-update", loadZones);
    };
  }, []);

  return zones;
}
