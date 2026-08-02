import { useState, useEffect } from "react";
import { EventPackage } from "@/types/package";

export const DEFAULT_PACKAGES: EventPackage[] = [
  {
    id: "pkg-royal-wedding",
    title: "Royal Wedding Premium",
    subtitle: "Complete photography, cinematic video, and grand stage decor.",
    eventTypeId: "evt-type-wedding",
    basePrice: 120000,
    discountPercentage: 15,
    imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    popular: true,
    configuredServices: [
      { serviceKey: "photography", tierId: "photo-luxury", coverageId: "2d", addons: ["album", "drone"] },
      { serviceKey: "videography", tierId: "video-premium", coverageId: "2d", addons: ["drone"] },
    ]
  },
  {
    id: "pkg-gaye-holud",
    title: "Vibrant Gaye Holud",
    subtitle: "Floral stage, photography, and DJ performance.",
    eventTypeId: "evt-type-holud",
    basePrice: 50000,
    discountPercentage: 10,
    imageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
    popular: true,
    configuredServices: [
      { serviceKey: "photography", tierId: "photo-premium", coverageId: "1d", addons: [] },
      { serviceKey: "dj", tierId: "dj-basic", coverageId: "4h", addons: ["cold-fire"] },
    ]
  }
];

export function useDynamicPackages() {
  const [packages, setPackages] = useState<EventPackage[]>(DEFAULT_PACKAGES);

  useEffect(() => {
    const loadPackages = () => {
      try {
        const stored = localStorage.getItem("customPackages");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.length > 0) {
            setPackages(parsed);
          } else {
            setPackages(DEFAULT_PACKAGES);
          }
        }
      } catch (e) {
        console.error("Failed to load custom packages", e);
      }
    };

    loadPackages();

    window.addEventListener("dashboard-data-update", loadPackages);
    return () => {
      window.removeEventListener("dashboard-data-update", loadPackages);
    };
  }, []);

  return packages;
}
