import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { fetchCatalog } from "./lib/data";
import type { Product } from "./types";

type StoredCartLine = {
  productId: string;
  quantity: number;
};

export type CartLine = {
  product: Product;
  quantity: number;
};

type CartContextValue = {
  items: CartLine[];
  itemCount: number;
  subtotal: number;
  isReady: boolean;
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  hasItem: (productId: string) => boolean;
  getQuantity: (productId: string) => number;
  refreshCart: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_PREFIX = "ekokintsugi-app-cart";

function getStorageKey(userId?: string | null) {
  return `${STORAGE_PREFIX}:${userId || "guest"}`;
}

function serializeItems(items: CartLine[]): StoredCartLine[] {
  return items.map((item) => ({
    productId: item.product.id,
    quantity: item.quantity,
  }));
}

function readStoredCart(userId?: string | null): StoredCartLine[] {
  try {
    const raw = window.localStorage.getItem(getStorageKey(userId));
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((entry) => ({
        productId: String(entry?.productId || ""),
        quantity: Number(entry?.quantity || 0),
      }))
      .filter((entry) => entry.productId && Number.isInteger(entry.quantity) && entry.quantity > 0);
  } catch {
    return [];
  }
}

function mergeCartWithCatalog(storedItems: StoredCartLine[], catalog: Product[]) {
  const catalogMap = new Map(catalog.map((product) => [product.id, product]));

  return storedItems.reduce<CartLine[]>((accumulator, entry) => {
    const product = catalogMap.get(entry.productId);
    if (!product) return accumulator;

    accumulator.push({
      product,
      quantity: Math.max(1, entry.quantity),
    });
    return accumulator;
  }, []);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartLine[]>([]);
  const [isReady, setIsReady] = useState(false);
  const activeUserIdRef = useRef<string | null>(null);

  const refreshCart = async () => {
    const currentUserId = user?.id ?? null;
    const storedItems = readStoredCart(currentUserId);

    if (storedItems.length === 0) {
      setItems([]);
      setIsReady(true);
      return;
    }

    try {
      const catalog = await fetchCatalog();
      setItems(mergeCartWithCatalog(storedItems, catalog));
    } catch {
      setItems([]);
    } finally {
      setIsReady(true);
    }
  };

  useEffect(() => {
    const currentUserId = user?.id ?? null;
    activeUserIdRef.current = currentUserId;
    setIsReady(false);
    void refreshCart();
  }, [user?.id]);

  useEffect(() => {
    if (!isReady) return;
    window.localStorage.setItem(getStorageKey(activeUserIdRef.current), JSON.stringify(serializeItems(items)));
  }, [isReady, items]);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      items,
      itemCount,
      subtotal,
      isReady,
      addItem: (product, quantity = 1) => {
        const safeQuantity = Number.isInteger(quantity) && quantity > 0 ? quantity : 1;

        setItems((current) => {
          const existing = current.find((item) => item.product.id === product.id);
          if (existing) {
            return current.map((item) =>
              item.product.id === product.id
                ? { ...item, product, quantity: item.quantity + safeQuantity }
                : item
            );
          }

          return [...current, { product, quantity: safeQuantity }];
        });
      },
      updateQuantity: (productId, quantity) => {
        setItems((current) =>
          current
            .map((item) =>
              item.product.id === productId
                ? { ...item, quantity: Number.isInteger(quantity) ? quantity : item.quantity }
                : item
            )
            .filter((item) => item.quantity > 0)
        );
      },
      removeItem: (productId) => {
        setItems((current) => current.filter((item) => item.product.id !== productId));
      },
      clearCart: () => setItems([]),
      hasItem: (productId) => items.some((item) => item.product.id === productId),
      getQuantity: (productId) => items.find((item) => item.product.id === productId)?.quantity ?? 0,
      refreshCart,
    };
  }, [isReady, items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
