import type { User } from "@supabase/supabase-js";
import { USER_DATA } from "../constants";
import type { ImpactRecord, ImpactStats, OrderSummary, Product, ProfileData, Tree } from "../types";
import { isSupabaseConfigured, supabase } from "./supabase";
import { normalizeRetailPrice } from "./utils";

function normalizeImageUrl(row: any) {
  const imageUrl = String(row?.image_url ?? "").trim();

  if (!imageUrl) {
    return "/images/products/signature-sneaker.jpg";
  }

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://") || imageUrl.startsWith("/")) {
    return imageUrl;
  }

  return `/${imageUrl.replace(/^\/+/, "")}`;
}

function normalizeProduct(row: any): Product {
  const name = String(row?.name ?? "EkoKintsugi Product");
  const price = normalizeRetailPrice(row?.base_price);

  return {
    id: String(row?.id ?? crypto.randomUUID()),
    name,
    price,
    currency: "INR",
    description: String(row?.description ?? "Crafted from reclaimed materials for a lower-footprint luxury experience."),
    co2Saved: Number(row?.co2_factor ?? 0),
    wasteSavedKg: Number(row?.waste_factor ?? 0),
    image: normalizeImageUrl(row),
    category: String(row?.category ?? "Collection"),
    materials: ["Reclaimed leather", "Circular construction", "Low-impact finishing"],
    highlights: ["Synced with shared catalog", "Impact-aware purchase flow", "Ready for repairs and returns"],
  };
}

export async function syncProfileForUser(user: User, overrides?: { name?: string; email?: string }): Promise<ProfileData> {
  const fallbackName = overrides?.name || user.user_metadata?.name || user.email?.split("@")[0] || USER_DATA.fullName;
  const fallbackEmail = overrides?.email || user.email || USER_DATA.email;

  if (!isSupabaseConfigured || !supabase) {
    return {
      id: user.id,
      name: fallbackName,
      email: fallbackEmail,
      createdAt: new Date().toISOString(),
    };
  }

  const { data: existingProfile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    return {
      id: user.id,
      name: fallbackName,
      email: fallbackEmail,
      createdAt: new Date().toISOString(),
    };
  }

  if (!existingProfile) {
    const newProfile = {
      id: user.id,
      name: fallbackName,
      email: fallbackEmail,
    };

    await supabase.from("profiles").insert(newProfile);

    return {
      id: user.id,
      name: fallbackName,
      email: fallbackEmail,
      createdAt: new Date().toISOString(),
    };
  }

  return {
    id: existingProfile.id,
    name: existingProfile.name || fallbackName,
    email: existingProfile.email || fallbackEmail,
    createdAt: existingProfile.created_at || new Date().toISOString(),
  };
}

export async function fetchCatalog(): Promise<Product[]> {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
  if (error || !data || data.length === 0) {
    return [];
  }
  return data
    .filter((row: any) => row?.id && row?.name)
    .map(normalizeProduct);
}

export async function fetchImpactStats(userId: string): Promise<ImpactStats> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      totalCo2: 0,
      totalWaste: 0,
      treeCount: 0,
      credits: 0,
      records: [],
    };
  }
  const [{ data: records, error: recordsError }, { data: ledger, error: ledgerError }] = await Promise.all([
    supabase.from("esg_records").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    supabase.from("carbon_ledger").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
  ]);

  if (recordsError || ledgerError) {
    return {
      totalCo2: 0,
      totalWaste: 0,
      treeCount: 0,
      credits: 0,
      records: [],
    };
  }

  const safeRecords: ImpactRecord[] = (records || []).map((record: any) => ({
    id: String(record.id),
    created_at: String(record.created_at),
    co2_saved_kg: Number(record.co2_saved_kg ?? 0),
    waste_diverted_kg: Number(record.waste_diverted_kg ?? 0),
    tree_id: record.tree_id ? String(record.tree_id) : null,
  }));

  const credits = (ledger || []).reduce(
    (sum: number, entry: any) => sum + Number(entry.credits_earned || 0) - Number(entry.credits_used || 0),
    0
  );

  return {
    totalCo2: safeRecords.reduce((sum, record) => sum + record.co2_saved_kg, 0),
    totalWaste: safeRecords.reduce((sum, record) => sum + record.waste_diverted_kg, 0),
    treeCount: safeRecords.filter((record) => Boolean(record.tree_id)).length,
    credits,
    records: safeRecords,
  };
}

function deriveOrderStatus(createdAt: string): OrderSummary["status"] {
  const age = Date.now() - new Date(createdAt).getTime();
  const day = 1000 * 60 * 60 * 24;
  if (age < day * 2) return "Crafting";
  if (age < day * 7) return "In Transit";
  return "Delivered";
}

export async function fetchOrders(userId: string): Promise<OrderSummary[]> {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }
  const { data, error } = await supabase
    .from("orders")
    .select("id, quantity, total_price, created_at, product_id, products(id, name, image_url, category, description, co2_factor, waste_factor, base_price)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map((row: any) => {
    const product = row.products
      ? normalizeProduct(row.products)
      : {
          id: String(row.product_id),
          name: "EkoKintsugi Product",
          price: normalizeRetailPrice(row.total_price ?? 0),
          currency: "INR",
          description: "Shared order linked from the EkoKintsugi catalog.",
          co2Saved: 0,
          wasteSavedKg: 0,
          image: "/images/products/signature-sneaker.jpg",
          category: "Collection",
          materials: ["Circular construction"],
          highlights: ["Shared with website"],
        };
    const createdAt = String(row.created_at);
    const eta = new Date(new Date(createdAt).getTime() + 5 * 24 * 60 * 60 * 1000).toISOString();

    return {
      id: String(row.id),
      productId: String(row.product_id),
      status: deriveOrderStatus(createdAt),
      placedOn: createdAt,
      eta,
      carbonSavedKg: Number(product.co2Saved) * Number(row.quantity ?? 1),
      quantity: Number(row.quantity ?? 1),
      totalPrice: normalizeRetailPrice(row.total_price ?? 0),
      product,
    };
  });
}

export async function fetchTrees(userId: string): Promise<Tree[]> {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }
  const { data, error } = await supabase
    .from("trees")
    .select("*")
    .eq("user_id", userId)
    .order("planted_at", { ascending: false });

  if (error || !data || data.length === 0) {
    return [];
  }

  return data.map((tree: any, index: number) => ({
    id: String(tree.id),
    species: `Restoration Tree ${index + 1}`,
    location: {
      lat: 27.1767,
      lng: 78.0081,
      name: String(tree.location ?? "Agra Reforest Zone"),
    },
    plantedDate: String(tree.planted_at ?? new Date().toISOString()),
    status: tree.status === "grown" ? "mature" : tree.status === "sapling" ? "growing" : "seedling",
    photoUrl:
      [
        "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=900&q=80",
      ][index % 3],
    story: `Linked to your shared EkoKintsugi account and synced from the same Supabase tree ledger used by the website.`,
  }));
}

export async function createOrder(userId: string, product: Product, quantity = 1) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured. Add the shared website credentials to .env.local first.");
  }
  const totalPrice = product.price * quantity;
  const co2Saved = product.co2Saved * quantity;
  const wasteDiverted = product.wasteSavedKg * quantity;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      product_id: product.id,
      quantity,
      total_price: totalPrice,
    })
    .select()
    .single();

  if (orderError || !order) throw orderError || new Error("Unable to create order.");

  const { data: tree, error: treeError } = await supabase
    .from("trees")
    .insert({
      user_id: userId,
      location: "Agra Reforest Zone B-12",
      status: "seed",
    })
    .select()
    .single();

  if (treeError) throw treeError;

  const { error: impactError } = await supabase.from("esg_records").insert({
    order_id: order.id,
    user_id: userId,
    co2_saved_kg: co2Saved,
    waste_diverted_kg: wasteDiverted,
    tree_id: tree?.id ?? null,
  });

  if (impactError) throw impactError;

  const { error: ledgerError } = await supabase.from("carbon_ledger").insert({
    user_id: userId,
    credits_earned: co2Saved / 1000,
    source_order_id: order.id,
  });

  if (ledgerError) throw ledgerError;

  return order.id;
}
