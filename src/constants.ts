import {
  FeatureCard,
  NotificationItem,
  OrderItem,
  Product,
  RewardOption,
  TimelineEvent,
  Tree,
} from "./types";

export const PRODUCTS: Product[] = [
  {
    id: "signature-sneaker",
    name: "Signature Sneaker",
    price: 12490,
    currency: "INR",
    description: "A refined everyday sneaker crafted from reclaimed leather, sugarcane foam, and traceable circular textiles.",
    co2Saved: 3.8,
    wasteSavedKg: 1.9,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    category: "Origin",
    materials: ["Reclaimed leather upper", "Sugarcane sole", "Cork-lined footbed"],
    highlights: ["Serialized NFC passport", "Repair-ready modular outsole", "Low-impact luxury finish"],
  },
  {
    id: "urban-backpack",
    name: "Urban Backpack",
    price: 8990,
    currency: "INR",
    description: "A sleek commuter silhouette with water-safe lining, smart pockets, and reclaimed artisan trims.",
    co2Saved: 2.6,
    wasteSavedKg: 1.3,
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    category: "Regen",
    materials: ["Recovered leather panels", "Recycled canvas shell", "Plant-fiber webbing"],
    highlights: ["Laptop compartment", "Passport pocket", "Urban ride silhouette"],
  },
  {
    id: "executive-tote",
    name: "Executive Tote",
    price: 10990,
    currency: "INR",
    description: "A sculpted work tote designed for creative professionals balancing function, form, and impact.",
    co2Saved: 2.9,
    wasteSavedKg: 1.6,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80",
    category: "Infinite",
    materials: ["Reclaimed leather body", "Organic cotton interior", "Metal-free finishing"],
    highlights: ["Structured base", "Document sleeve", "Convertible carry modes"],
  },
  {
    id: "wallet-classic",
    name: "Classic Wallet",
    price: 3490,
    currency: "INR",
    description: "Compact, tactile, and built from premium offcuts rescued from luxury footwear production.",
    co2Saved: 1.2,
    wasteSavedKg: 0.7,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=80",
    category: "Origin",
    materials: ["Premium offcut leather", "Bio-based reinforcement", "Soft-touch lining"],
    highlights: ["Slim profile", "RFID shield", "Monogram-ready"],
  },
];

export const FEATURE_CARDS: FeatureCard[] = [
  {
    eyebrow: "Craft Ledger",
    title: "Track each piece from rescued material to final polish.",
    description: "Every order carries a passport with material origin, artisan touchpoints, and lifecycle support milestones.",
    metric: "12 trace points",
  },
  {
    eyebrow: "Circular Wallet",
    title: "Convert returns, repairs, and impact into spendable value.",
    description: "Your eco points, carbon credit balance, and future rewards live in one elegant member wallet.",
    metric: "3 reward rails",
  },
  {
    eyebrow: "Forest View",
    title: "See the living footprint behind every reclaimed purchase.",
    description: "Geo-tagged reforestation zones, growth stories, and seasonal health updates stay visible in the app.",
    metric: "24 live saplings",
  },
];

export const IMPACT_TIMELINE: TimelineEvent[] = [
  {
    id: "evt-1",
    title: "Material batch rescued in Agra",
    detail: "Offcuts from premium production were sorted and recut for your collection.",
    timestamp: "Today, 09:10",
    status: "completed",
  },
  {
    id: "evt-2",
    title: "Forest cluster assigned",
    detail: "Two saplings are linked to your member profile for the monsoon restoration cycle.",
    timestamp: "Today, 13:45",
    status: "live",
  },
  {
    id: "evt-3",
    title: "Repair credit unlocked",
    detail: "Your next service request is pre-funded through circular loyalty rewards.",
    timestamp: "Tomorrow, 11:00",
    status: "scheduled",
  },
];

export const MOCK_TREES: Tree[] = [
  {
    id: "tree-01",
    species: "Neem Canopy 04",
    location: { lat: 23.6102, lng: 85.2799, name: "Jharkhand Regeneration Belt" },
    plantedDate: "2025-08-15",
    status: "growing",
    photoUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=80",
    story: "Growing in a mixed native patch with high biodiversity recovery potential.",
  },
  {
    id: "tree-02",
    species: "Arjuna Grove 09",
    location: { lat: 27.0238, lng: 74.2179, name: "Rajasthan Waterline Project" },
    plantedDate: "2025-06-02",
    status: "mature",
    photoUrl: "https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?auto=format&fit=crop&w=900&q=80",
    story: "Already stabilizing soil moisture in a semi-arid restoration zone.",
  },
  {
    id: "tree-03",
    species: "Jamun Cluster 02",
    location: { lat: 12.9716, lng: 77.5946, name: "Bengaluru Urban Edge" },
    plantedDate: "2026-01-21",
    status: "seedling",
    photoUrl: "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=900&q=80",
    story: "A young native fruiting tree selected for long-term pollinator support.",
  },
];

export const REWARD_OPTIONS: RewardOption[] = [
  {
    id: "reward-1",
    title: "Repair Atelier Voucher",
    points: 500,
    description: "Bring back any pair for a premium repair session and material refresh.",
    accent: "from-amber-400/80 to-orange-300/70",
  },
  {
    id: "reward-2",
    title: "Limited Capsule Access",
    points: 950,
    description: "Unlock early access to members-only drops and pre-order silhouettes.",
    accent: "from-emerald-400/80 to-lime-300/70",
  },
  {
    id: "reward-3",
    title: "Forest Expansion Credit",
    points: 1200,
    description: "Allocate your rewards to sponsor additional native planting zones.",
    accent: "from-teal-400/80 to-cyan-300/70",
  },
];

export const NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n-1",
    title: "Your repair slot is reserved",
    description: "Pickup is scheduled for Friday with carbon-neutral reverse logistics.",
    time: "5 min ago",
    type: "order",
  },
  {
    id: "n-2",
    title: "Impact snapshot updated",
    description: "Your profile crossed 12.4 kg of CO2 savings this week.",
    time: "38 min ago",
    type: "impact",
  },
  {
    id: "n-3",
    title: "Reward booster unlocked",
    description: "Complete one return this month to multiply wallet earnings by 1.4x.",
    time: "2 hr ago",
    type: "reward",
  },
  {
    id: "n-4",
    title: "Community planting weekend",
    description: "Members in Delhi NCR can join an on-ground restoration event next Sunday.",
    time: "Yesterday",
    type: "community",
  },
];

export const ORDER_HISTORY: OrderItem[] = [
  {
    id: "ORD-2408",
    productId: "signature-sneaker",
    status: "In Transit",
    placedOn: "2026-04-18",
    eta: "2026-04-27",
    carbonSavedKg: 3.8,
  },
  {
    id: "ORD-2381",
    productId: "executive-tote",
    status: "Delivered",
    placedOn: "2026-03-02",
    eta: "2026-03-10",
    carbonSavedKg: 2.9,
  },
  {
    id: "ORD-2312",
    productId: "wallet-classic",
    status: "Returned",
    placedOn: "2026-01-11",
    eta: "2026-01-17",
    carbonSavedKg: 1.2,
  },
];

export const USER_DATA = {
  name: "Dushyant",
  fullName: "Dushyant Singh",
  email: "exposshere@gmail.com",
  treesPlanted: 3,
  co2Saved: 12.4,
  pairsRecycled: 2,
  ecoPoints: 1820,
};
