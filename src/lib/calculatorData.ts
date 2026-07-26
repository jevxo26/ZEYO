import {
  ZoneOption,
  EventTypeOption,
  CalculatorServiceDefinition,
} from "@/types/calculator";

export const BANGLADESH_ZONES: ZoneOption[] = [
  { id: "dhaka", name: "Dhaka", slug: "dhaka", priceMultiplier: 1.0 },
  { id: "chattogram", name: "Chattogram", slug: "chattogram", priceMultiplier: 1.15 },
  { id: "rajshahi", name: "Rajshahi", slug: "rajshahi", priceMultiplier: 0.85 },
  { id: "sylhet", name: "Sylhet", slug: "sylhet", priceMultiplier: 1.05 },
  { id: "khulna", name: "Khulna", slug: "khulna", priceMultiplier: 0.9 },
  { id: "rangpur", name: "Rangpur", slug: "rangpur", priceMultiplier: 0.8 },
  { id: "barishal", name: "Barishal", slug: "barishal", priceMultiplier: 0.85 },
];

export const EVENT_TYPES: EventTypeOption[] = [
  { id: "wedding", name: "Wedding", slug: "wedding", icon: "Heart", description: "Grand wedding celebration with full service management" },
  { id: "reception", name: "Reception", slug: "reception", icon: "GlassWater", description: "Elegant wedding reception event" },
  { id: "holud", name: "Gaye Holud", slug: "holud", icon: "Sparkles", description: "Traditional vibrant Gaye Holud ceremony" },
  { id: "birthday", name: "Birthday Party", slug: "birthday", icon: "Cake", description: "Joyous birthday celebration for all ages" },
  { id: "corporate", name: "Corporate Event", slug: "corporate", icon: "Briefcase", description: "Professional corporate meetings, galas & seminars" },
  { id: "seminar", name: "Seminar & Conference", slug: "seminar", icon: "Users", description: "Large scale conference or academic seminar" },
  { id: "picnic", name: "Annual Picnic", slug: "picnic", icon: "Sun", description: "Corporate or community outdoor picnic" },
  { id: "anniversary", name: "Anniversary", slug: "anniversary", icon: "Award", description: "Milestone celebration and dining" },
];

export const CALCULATOR_SERVICES: CalculatorServiceDefinition[] = [
  {
    id: "photo",
    key: "photography",
    name: "Photography",
    description: "Professional event photography with high-resolution editing",
    iconName: "Camera",
    tiers: [
      { id: "photo-basic", name: "Basic Photography", price: 8000, description: "1 Senior Photographer, Unlimited Clicks, Color Correction", features: ["1 Senior Photographer", "Unlimited Clicks", "Color Graded Photos"] },
      { id: "photo-premium", name: "Premium Photography", price: 12000, description: "2 Photographers, Candid Specialist, High Res Retouching", features: ["2 Senior Photographers", "Candid Specialist", "Special Retouching"] },
      { id: "photo-luxury", name: "Luxury Photography", price: 18000, description: "3 Photographers, Lead Master Photographer, Premium Editing", features: ["3 Master Photographers", "Dedicated Director", "Fine-Art Retouching"] },
    ],
    coverages: [
      { id: "4h", name: "4 Hours", multiplier: 1.0 },
      { id: "8h", name: "8 Hours", multiplier: 1.6 },
      { id: "1d", name: "1 Day", multiplier: 2.0 },
      { id: "2d", name: "2 Days", multiplier: 3.5 },
      { id: "3d", name: "3 Days", multiplier: 5.0 },
    ],
    addons: [
      { id: "album", name: "Premium Photo Album", price: 2500, isPerGuest: false },
      { id: "extra-photographer", name: "Extra Photographer", price: 5000, isPerGuest: false },
      { id: "live-printing", name: "Live Instant Photo Printing", price: 8000, isPerGuest: false },
    ],
  },
  {
    id: "video",
    key: "videography",
    name: "Videography",
    description: "Cinematic videography, drone shots & highlight teasers",
    iconName: "Video",
    tiers: [
      { id: "video-basic", name: "Basic Videography", price: 10000, description: "1 HD Videographer, Standard Editing, Event Coverage", features: ["1 HD Videographer", "Full Event Video", "Standard Audio"] },
      { id: "video-premium", name: "Premium Videography", price: 18000, description: "2 Cinematographers, 4K Footage, Cinematic Teaser", features: ["2 Cinematographers", "4K Ultra HD", "Cinematic Teaser"] },
      { id: "video-luxury", name: "Luxury Videography", price: 25000, description: "3 Cinematographers, Master Editor, Feature Film Style", features: ["3 Cinematographers", "Cinematic Film", "Advanced Color Grading"] },
    ],
    coverages: [
      { id: "1d", name: "1 Day", multiplier: 1.0 },
      { id: "2d", name: "2 Days", multiplier: 1.8 },
      { id: "3d", name: "3 Days", multiplier: 2.6 },
    ],
    addons: [
      { id: "drone", name: "Drone Aerial Cinematography", price: 10000, isPerGuest: false },
      { id: "highlight", name: "3-Minute Highlight Video", price: 3000, isPerGuest: false },
      { id: "full-movie", name: "Full Movie Feature Editing", price: 8000, isPerGuest: false },
    ],
  },
  {
    id: "catering",
    key: "catering",
    name: "Catering & Dining",
    description: "Premium authentic food menus served per guest",
    iconName: "Utensils",
    isPerGuest: true,
    tiers: [
      { id: "menu-a", name: "Menu A (Standard Feast)", price: 450, description: "Plain Polao, Chicken Roast, Beef Rezala, Borhani, Salad", features: ["Plain Polao", "Chicken Roast", "Beef Rezala", "Borhani & Salad"] },
      { id: "menu-b", name: "Menu B (Royal Kacchi)", price: 650, description: "Kachhi Biryani, Chicken Roast, Jali Kebab, Chutney, Borhani", features: ["Mutton Kachhi Biryani", "Chicken Roast", "Jali Kebab", "Special Borhani"] },
      { id: "menu-c", name: "Menu C (Imperial Grand)", price: 900, description: "Mutton Kachhi, Tiger Prawn, Whole Chicken Roast, Firni, Borhani", features: ["Mutton Kachhi Biryani", "Tiger Prawn Malai", "Whole Chicken Roast", "Special Firni"] },
    ],
    coverages: [
      { id: "standard", name: "Per Guest Feast", multiplier: 1.0 },
    ],
    addons: [
      { id: "dessert", name: "Special Traditional Dessert", price: 120, isPerGuest: true },
      { id: "soft-drinks", name: "Unlimited Soft Drinks & Water", price: 40, isPerGuest: true },
      { id: "ice-cream", name: "Premium Ice Cream Counter", price: 80, isPerGuest: true },
    ],
  },
  {
    id: "decor",
    key: "decoration",
    name: "Decoration & Floral",
    description: "Stage decor, entrance gates, floral setups and ambiance",
    iconName: "Sparkles",
    tiers: [
      { id: "decor-basic", name: "Basic Decoration", price: 15000, description: "Elegant artificial floral backdrop, entrance arch, table decor", features: ["Artificial Floral Backdrop", "Entrance Welcome Gate", "Standard Table Decor"] },
      { id: "decor-premium", name: "Premium Decoration", price: 35000, description: "Fresh flower stage backdrop, walkway floral pillars, lighting", features: ["Fresh Flower Stage", "Walkway Floral Pillars", "LED Warm Ambiance"] },
      { id: "decor-luxury", name: "Luxury Theme Decoration", price: 65000, description: "Custom theme stage, imported exotic flowers, royal entrance", features: ["Custom 3D Theme Stage", "Imported Exotic Flowers", "Royal Palace Entrance"] },
    ],
    coverages: [
      { id: "1d", name: "Single Event Setup", multiplier: 1.0 },
      { id: "2d", name: "2-Day Multi Setup", multiplier: 1.7 },
    ],
    addons: [
      { id: "flower-decor", name: "Fresh Flower Walkway & Ceilings", price: 12000, isPerGuest: false },
      { id: "entrance-decor", name: "Grand Royal Entrance Setup", price: 7000, isPerGuest: false },
    ],
  },
  {
    id: "stage",
    key: "stage",
    name: "Stage & Truss Setup",
    description: "Custom stage platforms, truss roofs & wedding thrones",
    iconName: "Layers",
    tiers: [
      { id: "stage-basic", name: "Basic Stage Setup", price: 10000, description: "Standard wooden platform with carpeting & backdrop frame", features: ["Standard Wooden Stage", "Premium Carpeting", "Backdrop Frame"] },
      { id: "stage-premium", name: "Premium Acrylic Stage", price: 22000, description: "Glossy acrylic floor, LED edge lighting, royal sofa seating", features: ["Glossy Acrylic Floor", "LED Edge Lighting", "Royal Sofa Seating"] },
      { id: "stage-luxury", name: "Grand Truss Stage", price: 40000, description: "Heavy truss roof, LED screen background frame, multi-level stage", features: ["Heavy Truss Roof", "LED Screen Frame", "Multi-Level Stage"] },
    ],
    coverages: [
      { id: "1d", name: "1 Day Setup", multiplier: 1.0 },
      { id: "2d", name: "2 Days Setup", multiplier: 1.6 },
    ],
    addons: [
      { id: "led-screen", name: "LED Background Wall (12x8 ft)", price: 15000, isPerGuest: false },
      { id: "royal-sofa", name: "Imported Royal Throne Sofa", price: 5000, isPerGuest: false },
    ],
  },
  {
    id: "lighting",
    key: "lighting",
    name: "Event Lighting",
    description: "Fairy lights, spotlights, wash lights, and chandelier decor",
    iconName: "Sun",
    tiers: [
      { id: "light-basic", name: "Standard Ambiance Lighting", price: 7000, description: "Warm LED fairy strings, stage halogen wash lights", features: ["Warm LED Fairy Strings", "Stage Wash Lights", "Standard Cabling"] },
      { id: "light-premium", name: "Premium Dynamic Lighting", price: 16000, description: "Moving head lights, RGB PAR cans, venue facade lighting", features: ["Moving Head Spotlights", "RGB PAR Cans", "Venue Facade Lighting"] },
      { id: "light-luxury", name: "Royal Light & Laser Show", price: 30000, description: "Crystal chandeliers, laser beams, DMX programmed show", features: ["Crystal Chandeliers", "DMX Programmed Show", "Laser Beams"] },
    ],
    coverages: [
      { id: "1d", name: "1 Evening", multiplier: 1.0 },
      { id: "2d", name: "2 Evenings", multiplier: 1.8 },
    ],
    addons: [
      { id: "chandeliers", name: "3 Crystal Grand Chandeliers", price: 6000, isPerGuest: false },
      { id: "fog-machine", name: "Low-lying Dry Ice Fog Machine", price: 4500, isPerGuest: false },
    ],
  },
  {
    id: "sound",
    key: "sound",
    name: "Sound System",
    description: "Professional JBL/Yamaha acoustic speakers & wireless mics",
    iconName: "Volume2",
    tiers: [
      { id: "sound-basic", name: "Basic Sound Setup", price: 6000, description: "2 High-power Speakers, 2 Cordless Mics, Audio Mixer", features: ["2 JBL Speakers", "2 Wireless Mics", "Audio Mixer"] },
      { id: "sound-premium", name: "Premium Concert Audio", price: 14000, description: "4 Line Array Speakers, Subwoofers, Professional Sound Engineer", features: ["4 Line Array Speakers", "Subwoofers", "Sound Engineer"] },
      { id: "sound-luxury", name: "Luxury Line Array System", price: 25000, description: "Full acoustic concert rigging, digital mixer, 6 wireless mics", features: ["Concert Rigging", "Digital Console", "6 Wireless Mics"] },
    ],
    coverages: [
      { id: "4h", name: "4 Hours", multiplier: 1.0 },
      { id: "8h", name: "8 Hours", multiplier: 1.5 },
    ],
    addons: [
      { id: "extra-mics", name: "4 Additional Wireless Mics", price: 2000, isPerGuest: false },
      { id: "podium", name: "Acrylic Digital Podium", price: 3500, isPerGuest: false },
    ],
  },
  {
    id: "tent",
    key: "tent",
    name: "Tent & Pandal",
    description: "Waterproof event pavilions, German hangars, and shamianas",
    iconName: "Home",
    tiers: [
      { id: "tent-basic", name: "Traditional Shamiana Pandal", price: 12000, description: "Colorful cloth canopy, bamboo/iron structure, carpeted floor", features: ["Traditional Cloth Canopy", "Carpeted Flooring", "Ceiling Drapes"] },
      { id: "tent-premium", name: "White Waterproof Hangar", price: 28000, description: "White waterproof canopy, side draping, standing AC ready", features: ["Waterproof Hangar", "Side Satin Draping", "AC Duct Ready"] },
      { id: "tent-luxury", name: "Air-Conditioned Glass Tent", price: 55000, description: "Transparent roof pavilion, full AC cooling, luxury wooden floor", features: ["Transparent Glass Roof", "Full AC Cooling", "Wooden Flooring"] },
    ],
    coverages: [
      { id: "1d", name: "1 Day Event", multiplier: 1.0 },
      { id: "2d", name: "2 Days Event", multiplier: 1.7 },
    ],
    addons: [
      { id: "ac-unit", name: "2 Standing 5-Ton AC Units", price: 12000, isPerGuest: false },
      { id: "misting", name: "Water Misting Cooling Fans", price: 4000, isPerGuest: false },
    ],
  },
  {
    id: "generator",
    key: "generator",
    name: "Power Generator",
    description: "Silent diesel backup generators with dedicated operators",
    iconName: "Zap",
    tiers: [
      { id: "gen-basic", name: "30 KVA Backup Generator", price: 8000, description: "Supports lighting, sound system, and small fans for 6 hours", features: ["30 KVA Capacity", "Dedicated Operator", "Fuel Included (6h)"] },
      { id: "gen-premium", name: "60 KVA Silent Generator", price: 15000, description: "Supports full lighting, stage, sound, and catering equipment", features: ["60 KVA Silent Engine", "Automatic Transfer", "Fuel Included (8h)"] },
      { id: "gen-luxury", name: "100 KVA Industrial Generator", price: 25000, description: "Supports heavy AC units, LED walls, and complete venue load", features: ["100 KVA Heavy Load", "Twin Backup Engine", "Full Day Fuel"] },
    ],
    coverages: [
      { id: "6h", name: "6 Hours", multiplier: 1.0 },
      { id: "12h", name: "12 Hours", multiplier: 1.6 },
    ],
    addons: [
      { id: "extra-fuel", name: "Extra Fuel Reserve (4 Hours)", price: 3500, isPerGuest: false },
    ],
  },
  {
    id: "transport",
    key: "transportation",
    name: "Transportation & Cars",
    description: "Luxury wedding cars, bridal transport & guest microbuses",
    iconName: "Car",
    tiers: [
      { id: "trans-basic", name: "Decorated Sedan Car", price: 6000, description: "Air-conditioned sedan (Allion/Premio) with floral decoration", features: ["AC Sedan Car", "Fresh Flower Decor", "Experienced Chauffeur"] },
      { id: "trans-premium", name: "Luxury SUV / Prado", price: 15000, description: "Toyota Land Cruiser Prado with VIP floral decoration", features: ["Land Cruiser Prado", "VIP Floral Ribbon", "Full Day Service"] },
      { id: "trans-luxury", name: "Royal Mercedes / Audi", price: 35000, description: "Mercedes E-Class or Audi A6 for grand bridal entrance", features: ["Mercedes / Audi", "Royal Floral Bouquet", "Red Carpet Arrival"] },
    ],
    coverages: [
      { id: "6h", name: "6 Hours Inside City", multiplier: 1.0 },
      { id: "12h", name: "12 Hours Full Day", multiplier: 1.7 },
    ],
    addons: [
      { id: "guest-hiace", name: "11-Seat Guest Hiace Microbus", price: 7000, isPerGuest: false },
    ],
  },
  {
    id: "security",
    key: "security",
    name: "Event Security & VIP Guard",
    description: "Trained security personnel, crowd control and VIP escorts",
    iconName: "Shield",
    tiers: [
      { id: "sec-basic", name: "2 Security Officers", price: 4000, description: "2 Uniformed security guards for entrance & guest assistance", features: ["2 Security Officers", "Uniformed Staff", "Entrance Supervision"] },
      { id: "sec-premium", name: "5 Security Officers + Supervisor", price: 9000, description: "Full venue perimeter control, parking assistance, supervisor", features: ["5 Security Guards", "Dedicated Supervisor", "Parking Coordination"] },
      { id: "sec-luxury", name: "VIP Security Team (10 Guards)", price: 18000, description: "VIP escort guards, metal detector entrance, crowd control team", features: ["10 VIP Security Guards", "Metal Detector Gate", "Crowd Control Team"] },
    ],
    coverages: [
      { id: "6h", name: "6 Hours Coverage", multiplier: 1.0 },
      { id: "12h", name: "12 Hours Coverage", multiplier: 1.8 },
    ],
    addons: [
      { id: "walkie-talkie", name: "Walkie-Talkie Communication Team", price: 2500, isPerGuest: false },
    ],
  },
  {
    id: "cake",
    key: "cake",
    name: "Celebration Cake",
    description: "Custom designer tiered cakes by master pastry chefs",
    iconName: "Cake",
    tiers: [
      { id: "cake-basic", name: "2-Tier Designer Cake (4 kg)", price: 6000, description: "Fondant or buttercream finish with floral icing", features: ["4 kg Total Weight", "2 Elegant Tiers", "Choice of Flavor"] },
      { id: "cake-premium", name: "3-Tier Wedding Cake (8 kg)", price: 14000, description: "Luxury handcrafted sugar flowers, custom monogram", features: ["8 kg Total Weight", "3 Grand Tiers", "Handcrafted Sugar Art"] },
      { id: "cake-luxury", name: "5-Tier Royal Chandelier Cake (15 kg)", price: 28000, description: "Grand edible gold foil cake, hanging chandelier display", features: ["15 kg Total Weight", "5 Royal Tiers", "Edible Gold Foil"] },
    ],
    coverages: [
      { id: "std", name: "Standard Delivery & Setup", multiplier: 1.0 },
    ],
    addons: [
      { id: "cupcakes", name: "50 Matching Gourmet Cupcakes", price: 4500, isPerGuest: false },
      { id: "cake-table", name: "Decorated Acrylic Cake Table", price: 3000, isPerGuest: false },
    ],
  },
  {
    id: "makeup",
    key: "makeup",
    name: "Bridal & Groom Makeup",
    description: "Top-tier makeup artists at home, venue, or studio",
    iconName: "Sparkles",
    tiers: [
      { id: "mk-basic", name: "Senior Makeup Artist", price: 8000, description: "HD Makeup, hairstyle, saree/dupatta draping", features: ["HD Facial Makeup", "Professional Hairstyle", "Draping Assistance"] },
      { id: "mk-premium", name: "Master Makeup Artist", price: 16000, description: "Airbrush makeup, premium MAC/Fenty products, trial session", features: ["Airbrush HD Makeup", "Luxury Brands (MAC/Fenty)", "Free Trial Session"] },
      { id: "mk-luxury", name: "Celebrity Makeup Artist", price: 30000, description: "Celebrity artist booking, groom grooming, family makeup", features: ["Celebrity Artist", "Groom Styling Included", "2 Party Makeups"] },
    ],
    coverages: [
      { id: "single", name: "1 Event Session", multiplier: 1.0 },
      { id: "double", name: "2 Events (Holud + Wedding)", multiplier: 1.8 },
    ],
    addons: [
      { id: "party-makeup", name: "Extra Party Makeup (Per Person)", price: 2500, isPerGuest: false },
    ],
  },
  {
    id: "dj",
    key: "dj",
    name: "DJ & Music Performance",
    description: "Professional DJ, dance floor lighting, and music curation",
    iconName: "Music",
    tiers: [
      { id: "dj-basic", name: "Standard DJ Performance", price: 8000, description: "Experienced DJ, console, standard dance floor hits", features: ["4-Hour Performance", "DJ Console", "Custom Playlist"] },
      { id: "dj-premium", name: "Celebrity DJ + Visuals", price: 16000, description: "Top club DJ, LED DJ booth, live MC host", features: ["Celebrity DJ", "LED DJ Booth", "Live MC Host"] },
      { id: "dj-luxury", name: "DJ + Live Percussion & Dhol", price: 28000, description: "DJ paired with live dhol artists & saxophone performer", features: ["DJ + Live Dhol Players", "Saxophone Performer", "Confetti Blast"] },
    ],
    coverages: [
      { id: "4h", name: "4 Hours Set", multiplier: 1.0 },
      { id: "6h", name: "6 Hours Extended", multiplier: 1.4 },
    ],
    addons: [
      { id: "cold-fire", name: "6 Cold Pyro Fire Fountains", price: 4000, isPerGuest: false },
      { id: "confetti", name: "CO2 Confetti Cannon Blast", price: 3000, isPerGuest: false },
    ],
  },
  {
    id: "stream",
    key: "live_streaming",
    name: "Live Streaming & LED Wall",
    description: "Multi-camera HD live broadcast to YouTube/Facebook & LED TVs",
    iconName: "Radio",
    tiers: [
      { id: "str-basic", name: "Single Camera Live Stream", price: 6000, description: "HD stream to private Facebook/YouTube link", features: ["1 HD Broadcast Cam", "Custom Private Link", "Recorded Backup"] },
      { id: "str-premium", name: "3-Camera Multi-Angle Stream", price: 14000, description: "Live switcher console, graphic lower-thirds, clear audio", features: ["3 Broadcast Cameras", "Live Switcher Engineer", "Custom Lower-Thirds"] },
      { id: "str-luxury", name: "Live TV Broadcast + 2 LED Screens", price: 28000, description: "2 large LED screens in hall + multi-cam online broadcast", features: ["2 Live LED TVs in Hall", "Multi-Camera Broadcast", "Live Instant Replay"] },
    ],
    coverages: [
      { id: "4h", name: "4 Hours Broadcast", multiplier: 1.0 },
      { id: "8h", name: "8 Hours Full Coverage", multiplier: 1.6 },
    ],
    addons: [
      { id: "extra-screen", name: "Additional 55-Inch Stand TV", price: 4000, isPerGuest: false },
    ],
  },
  {
    id: "invitation",
    key: "invitation",
    name: "Invitation Cards & Gifts",
    description: "Custom printed wedding cards, digital invites, and return gifts",
    iconName: "Mail",
    tiers: [
      { id: "inv-basic", name: "100 Luxury Printed Cards", price: 5000, description: "Gold foil printed cards with matching envelopes", features: ["100 Printed Cards", "Gold Foil Accent", "Matching Envelope"] },
      { id: "inv-premium", name: "250 Printed Cards + Digital Invite", price: 12000, description: "250 luxury cards + custom animated video invitation", features: ["250 Printed Cards", "Animated Video Invite", "WhatsApp RSVP Setup"] },
      { id: "inv-luxury", name: "500 Boxed Gift Invites + Video", price: 28000, description: "500 velvet gift box invites with sweets compartment", features: ["500 Velvet Gift Boxes", "Sweets Compartment", "Full Digital Suite"] },
    ],
    coverages: [
      { id: "std", name: "Standard Package", multiplier: 1.0 },
    ],
    addons: [
      { id: "extra-100", name: "Extra 100 Printed Cards", price: 3500, isPerGuest: false },
    ],
  },
];

export function calculateServicePrice(
  service: CalculatorServiceDefinition,
  tierId: string,
  coverageId: string,
  guestCount: number,
  selectedAddonIds: string[],
  zoneMultiplier: number = 1.0
): number {
  const tier = service.tiers.find((t) => t.id === tierId) || service.tiers[0];
  const coverage = service.coverages.find((c) => c.id === coverageId) || service.coverages[0];

  let basePrice = tier.price;

  if (service.isPerGuest) {
    // For catering: Tier Price * Guest Count
    basePrice = tier.price * guestCount;
  } else {
    // For normal service: Tier Price * Coverage Multiplier
    basePrice = tier.price * coverage.multiplier;
  }

  // Calculate addons
  let addonsTotal = 0;
  for (const addonId of selectedAddonIds) {
    const addon = service.addons.find((a) => a.id === addonId);
    if (addon) {
      if (addon.isPerGuest) {
        addonsTotal += addon.price * guestCount;
      } else {
        addonsTotal += addon.price;
      }
    }
  }

  const zoneAdjustedPrice = (basePrice + addonsTotal) * zoneMultiplier;
  return Math.round(zoneAdjustedPrice);
}
