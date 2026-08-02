import { useState, useEffect } from "react";
import { BANGLADESH_ZONES } from "@/lib/calculatorData";
import { ZoneOption } from "@/types/calculator";

export function useDynamicZones() {
  const [zones, setZones] = useState<ZoneOption[]>(BANGLADESH_ZONES);

  useEffect(() => {
    const loadZones = () => {
      try {
        const stored = localStorage.getItem("customZones");
        if (stored) {
          const parsed = JSON.parse(stored);
          const activeOnly = parsed.filter((z: any) => z.active);
          
          if (activeOnly.length > 0) {
            const mapped: ZoneOption[] = activeOnly.map((z: any) => ({
              id: z.name.toLowerCase().replace(/\s+/g, "-"),
              name: z.name,
              slug: z.name.toLowerCase().replace(/\s+/g, "-"),
              priceMultiplier: parseFloat(z.mult.replace(/[^0-9.]/g, "") || "1"),
            }));
            setZones(mapped);
          } else {
            // Fallback if none are active
            setZones(BANGLADESH_ZONES);
          }
        }
      } catch (e) {
        console.error("Failed to load custom zones", e);
      }
    };

    loadZones();

    window.addEventListener("dashboard-data-update", loadZones);
    return () => {
      window.removeEventListener("dashboard-data-update", loadZones);
    };
  }, []);

  return zones;
}
