import { useState, useEffect } from "react";
import { EventPackage } from "@/types/package";

const UNIQUE_PACKAGE_IMAGES = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80", // Royal Palace Wedding
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80", // Floral Stage & Reception
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80", // Vibrant Yellow Gaye Holud
  "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80", // Corporate Seminar Gala
  "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80", // Birthday Party Decor
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80", // Imperial Banquet Dinner
];

export const DEFAULT_PACKAGES: EventPackage[] = [
  {
    id: "pkg-admin-grand-gala",
    title: "Dhaka Royal Grand Wedding Gala",
    subtitle: "Exclusive 5-Star Stage Decor, 4K Drone & Cinematic Film, Gourmet Catering & Live Concert Sound.",
    eventTypeId: "evt-type-wedding",
    basePrice: 350000,
    discountPercentage: 20,
    imageUrl: UNIQUE_PACKAGE_IMAGES[0],
    popular: true,
    included: [
      "4K Drone & Cinematic Film",
      "Royal Stage Floral Backdrop",
      "Exclusive Bride & Groom Jhula",
      "Live Concert Sound & DJ",
      "5-Member Master Photo Team",
      "Dedicated Escrow Operations Manager",
    ],
    configuredServices: [
      { serviceKey: "photography", tierId: "photo-luxury", coverageId: "2d", addons: ["album", "drone"] },
      { serviceKey: "videography", tierId: "video-premium", coverageId: "2d", addons: ["drone"] },
      { serviceKey: "decor", tierId: "decor-luxury", coverageId: "2d", addons: ["stage", "lighting"] },
    ],
  },
  {
    id: "pkg-royal-wedding",
    title: "Royal Wedding Premium",
    subtitle: "Complete photography, cinematic video, and grand stage decor.",
    eventTypeId: "evt-type-wedding",
    basePrice: 120000,
    discountPercentage: 15,
    imageUrl: UNIQUE_PACKAGE_IMAGES[1],
    popular: true,
    included: [
      "Full Photography",
      "Cinematic Video",
      "Floral Stage Decor",
    ],
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
    imageUrl: UNIQUE_PACKAGE_IMAGES[2],
    popular: true,
    included: [
      "Floral Yellow Backdrop",
      "DJ & Sound System",
      "Event Photography",
    ],
    configuredServices: [
      { serviceKey: "photography", tierId: "photo-premium", coverageId: "1d", addons: [] },
      { serviceKey: "dj", tierId: "dj-basic", coverageId: "4h", addons: ["cold-fire"] },
    ]
  },
  {
    id: "pkg-corporate-gala",
    title: "Executive Corporate Gala",
    subtitle: "Modern stage lighting, digital podium, concert audio, and full VIP catering.",
    eventTypeId: "evt-type-corporate",
    basePrice: 220000,
    discountPercentage: 12,
    imageUrl: UNIQUE_PACKAGE_IMAGES[3],
    popular: false,
    included: [
      "Digital LED Podium & Screen",
      "Concert Audio & Wireless Mics",
      "Executive Banquet Catering",
      "Professional PR Photography",
    ],
    configuredServices: [
      { serviceKey: "photography", tierId: "photo-premium", coverageId: "1d", addons: [] },
      { serviceKey: "catering", tierId: "catering-premium", coverageId: "1d", addons: [] },
    ]
  },
  {
    id: "pkg-birthday-gala",
    title: "Joyous Birthday Gala",
    subtitle: "Theme balloon decor, cake ceremony lighting, photo booth, and live music.",
    eventTypeId: "evt-type-birthday",
    basePrice: 45000,
    discountPercentage: 5,
    imageUrl: UNIQUE_PACKAGE_IMAGES[4],
    popular: false,
    included: [
      "Custom Theme Balloon Entrance",
      "Instant Photo Printing Stall",
      "DJ & Sound System",
    ],
    configuredServices: [
      { serviceKey: "photography", tierId: "photo-basic", coverageId: "1d", addons: [] },
      { serviceKey: "dj", tierId: "dj-basic", coverageId: "4h", addons: [] },
    ]
  }
];

import apiClient from "@/lib/apiClient";

export function useDynamicPackages() {
  const [packages, setPackages] = useState<EventPackage[]>(DEFAULT_PACKAGES);

  useEffect(() => {
    const loadPackages = async () => {
      let localCustom: EventPackage[] = [];
      try {
        const stored = localStorage.getItem("customPackages");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            localCustom = parsed.map((p: any, idx: number) => ({
              ...p,
              imageUrl: p.imageUrl && !p.imageUrl.includes("placeholder") ? p.imageUrl : UNIQUE_PACKAGE_IMAGES[idx % UNIQUE_PACKAGE_IMAGES.length],
              configuredServices: p.configuredServices || [],
            }));
          }
        }
      } catch (e) {}

      let apiPackages: EventPackage[] = [];
      try {
        const res = await apiClient.get("/packages").catch(() => null);
        if (res && res.data && res.data.data && Array.isArray(res.data.data)) {
          apiPackages = res.data.data.map((p: any, idx: number) => ({
            id: String(p.id || `pkg-api-${p.slug || Date.now()}`),
            title: p.name || p.title || "Package",
            subtitle: p.shortDescription || p.subtitle || p.description || "",
            eventTypeId: p.eventId ? `evt-type-${p.eventId}` : "evt-type-wedding",
            basePrice: Number(p.basePrice || p.price || 0),
            discountPercentage: Number(p.discountPercentage || 0),
            imageUrl: p.imageUrl || UNIQUE_PACKAGE_IMAGES[(idx + 2) % UNIQUE_PACKAGE_IMAGES.length],
            popular: Boolean(p.isFeatured || p.popular),
            included: p.included || ["Full Event Photography", "Cinematic Film", "Stage Decor"],
            configuredServices: p.configuredServices || [],
          }));
        }
      } catch (e) {}

      const pool = [...localCustom, ...apiPackages, ...DEFAULT_PACKAGES];
      const unique = pool.filter(
        (p, idx, self) => idx === self.findIndex((item) => String(item.id) === String(p.id))
      );

      // Guarantee every package card has a distinct HD image
      const sanitizedUnique = unique.map((p, idx) => ({
        ...p,
        imageUrl: p.imageUrl || UNIQUE_PACKAGE_IMAGES[idx % UNIQUE_PACKAGE_IMAGES.length],
      }));

      setPackages(sanitizedUnique);
    };

    loadPackages();

    window.addEventListener("dashboard-data-update", loadPackages);
    return () => {
      window.removeEventListener("dashboard-data-update", loadPackages);
    };
  }, []);

  return packages;
}
