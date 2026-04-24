export interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  description: string;
  co2Saved: number;
  wasteSavedKg: number;
  image: string;
  category: string;
  materials: string[];
  highlights: string[];
}

export interface ProfileData {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface ESGStats {
  co2SavedTotal: number;
  treesPlanted: number;
  wasteDivertedKg: number;
  pairsRecycled: number;
}

export interface Tree {
  id: string;
  species: string;
  location: {
    lat: number;
    lng: number;
    name: string;
  };
  plantedDate: string;
  status: "seedling" | "growing" | "mature";
  photoUrl: string;
  story: string;
}

export interface UserImpact {
  userId: string;
  totalCo2Saved: number;
  treesOwned: string[];
  loyaltyPoints: number;
}

export interface ImpactRecord {
  id: string;
  created_at: string;
  co2_saved_kg: number;
  waste_diverted_kg: number;
  tree_id: string | null;
}

export interface ImpactStats {
  totalCo2: number;
  totalWaste: number;
  treeCount: number;
  credits: number;
  records: ImpactRecord[];
}

export interface FeatureCard {
  title: string;
  eyebrow: string;
  description: string;
  metric: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  detail: string;
  timestamp: string;
  status: "live" | "scheduled" | "completed";
}

export interface RewardOption {
  id: string;
  title: string;
  points: number;
  description: string;
  accent: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "impact" | "order" | "reward" | "community";
}

export interface OrderItem {
  id: string;
  productId: string;
  status: "Crafting" | "In Transit" | "Delivered" | "Returned";
  placedOn: string;
  eta: string;
  carbonSavedKg: number;
}

export interface OrderSummary extends OrderItem {
  quantity: number;
  totalPrice: number;
  product: Product;
}
