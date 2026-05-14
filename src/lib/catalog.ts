import type { Product, ProductType } from "../types";

export type ProductTypeMeta = {
  slug: string;
  label: ProductType;
  title: string;
  description: string;
  heroImage: string;
};

export const PRODUCT_TYPE_META: ProductTypeMeta[] = [
  {
    slug: "wallets",
    label: "Wallets",
    title: "Wallet catalogue",
    description: "Compact leather essentials with sharp utility, premium tactility, and circular craft detailing.",
    heroImage: "/images/products/wallet-classic.jpg",
  },
  {
    slug: "bags",
    label: "Bags",
    title: "Bag catalogue",
    description: "Carry silhouettes designed for work, movement, and everyday luxury with reclaimed materials.",
    heroImage: "/images/products/urban-backpack.jpg",
  },
  {
    slug: "shoes",
    label: "Shoes",
    title: "Shoe catalogue",
    description: "Footwear built around comfort, polish, and visible impact across sneakers, loafers, and boots.",
    heroImage: "/images/products/signature-sneaker.jpg",
  },
  {
    slug: "accessories",
    label: "Accessories",
    title: "Accessories catalogue",
    description: "Circular finishing pieces that extend the collection with repair-ready, low-footprint details.",
    heroImage: "/images/products/braided-keychain.jpg",
  },
];

const PRODUCT_TYPE_RULES: Array<{ type: ProductType; keywords: string[] }> = [
  { type: "Wallets", keywords: ["wallet", "cardholder", "card holder", "billfold"] },
  { type: "Bags", keywords: ["bag", "backpack", "tote", "duffel", "satchel", "briefcase", "crossbody", "pack"] },
  { type: "Shoes", keywords: ["shoe", "sneaker", "boot", "loafer", "derby", "oxford", "moccasin", "sandal", "footwear"] },
  { type: "Accessories", keywords: ["accessory", "keychain", "belt", "strap", "pouch", "sleeve", "case", "luggage tag"] },
];

function buildProductSearchText(productLike: Partial<Product> & { id?: string }) {
  return [
    productLike.id,
    productLike.name,
    productLike.category,
    productLike.description,
    ...(productLike.materials || []),
    ...(productLike.highlights || []),
    productLike.image,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function deriveProductType(productLike: Partial<Product> & { id?: string }): ProductType {
  const searchText = buildProductSearchText(productLike);

  for (const rule of PRODUCT_TYPE_RULES) {
    if (rule.keywords.some((keyword) => searchText.includes(keyword))) {
      return rule.type;
    }
  }

  return "Other";
}

export function getProductTypeMeta(type: ProductType) {
  return PRODUCT_TYPE_META.find((entry) => entry.label === type) ?? null;
}

export function getProductTypeFromSlug(slug?: string | null): ProductType | null {
  if (!slug) return null;
  return PRODUCT_TYPE_META.find((entry) => entry.slug === slug.toLowerCase())?.label ?? null;
}

export function getCataloguableProductTypes(products: Product[]) {
  return PRODUCT_TYPE_META.filter((entry) => products.some((product) => product.productType === entry.label));
}

export function getProductsForType(products: Product[], type: ProductType) {
  return products.filter((product) => product.productType === type);
}
