import { ArrowLeft, BadgeCheck, Leaf, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useCart } from "../CartContext";
import { DarkCard, GlassCard, PageTransition, Pill, SectionTitle } from "../components/app-ui";
import { fetchCatalog } from "../lib/data";
import { formatInr } from "../lib/utils";
import type { Product } from "../types";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem, getQuantity, hasItem, isReady } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [purchaseMessage, setPurchaseMessage] = useState("");

  useEffect(() => {
    let mounted = true;
    fetchCatalog().then((catalog) => {
      if (mounted) {
        setProducts(catalog);
        setIsLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const product = products.find((entry) => entry.id === id) ?? null;
  const isInCart = product ? hasItem(product.id) : false;
  const cartQuantity = product ? getQuantity(product.id) : 0;

  if (isLoading) {
    return (
      <PageTransition>
        <GlassCard className="p-6">
          <p className="relative z-10 text-sm text-olive">Loading product from the shared catalog...</p>
        </GlassCard>
      </PageTransition>
    );
  }

  if (!product) {
    return (
      <PageTransition>
        <Link to="/shop" className="secondary-button w-fit">
          <ArrowLeft className="h-4 w-4" />
          Back to shop
        </Link>
        <GlassCard className="p-6">
          <p className="relative z-10 text-sm text-olive">This product was not found in the shared website catalog.</p>
        </GlassCard>
      </PageTransition>
    );
  }

  function handleAddToCart() {
    if (!user) {
      setPurchaseMessage("Sign in first so your cart and checkout stay linked to the shared website account.");
      return;
    }
    if (!product) return;
    addItem(product, 1);
    setPurchaseMessage(
      isInCart
        ? `${product.name} quantity updated in your cart.`
        : `${product.name} added to cart.`
    );
  }

  function handleCheckoutShortcut() {
    if (!user) {
      setPurchaseMessage("Sign in first so your cart and checkout stay linked to the same account.");
      return;
    }

    if (!product) return;

    if (!isInCart) {
      addItem(product, 1);
    }

    navigate("/cart");
  }

  return (
    <PageTransition>
      <Link to="/shop" className="secondary-button w-fit">
        <ArrowLeft className="h-4 w-4" />
        Back to shop
      </Link>

      <GlassCard className="overflow-hidden">
        <div className="ambient-ring -right-14 -top-14 h-40 w-40 opacity-35" />
        <div className="relative h-80">
          <div className="absolute inset-4 image-shell">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
              onError={(event) => {
                event.currentTarget.src = "/images/products/signature-sneaker.jpg";
              }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-pine via-pine/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 text-cream">
            <Pill className="kinetic-pill border-white/10 bg-white/10 text-cream">{product.category}</Pill>
            <h1 className="mt-4 font-serif text-[2.2rem] leading-none">{product.name}</h1>
            <p className="mt-3 max-w-sm text-sm text-cream/76">{product.description}</p>
          </div>
        </div>
      </GlassCard>

      <DarkCard className="p-5">
        <div className="relative z-10 grid grid-cols-3 gap-3">
          <div className="rounded-[1.4rem] border border-white/10 bg-white/10 p-4">
            <p className="mini-label text-cream/55">Price</p>
            <p className="mt-3 font-serif text-[1.65rem] text-gold">{formatInr(product.price)}</p>
          </div>
          <div className="rounded-[1.4rem] border border-white/10 bg-white/10 p-4">
            <p className="mini-label text-cream/55">CO2</p>
            <p className="mt-3 font-serif text-[1.65rem] text-gold">{product.co2Saved}kg</p>
          </div>
          <div className="rounded-[1.4rem] border border-white/10 bg-white/10 p-4">
            <p className="mini-label text-cream/55">Waste</p>
            <p className="mt-3 font-serif text-[1.65rem] text-gold">{product.wasteSavedKg}kg</p>
          </div>
        </div>
      </DarkCard>

      <GlassCard className="p-5">
        <SectionTitle title="Material composition" description="Premium tactility, reclaimed inputs, and lifecycle-ready construction." />
        <div className="relative z-10 mt-5 space-y-3">
          {product.materials.map((material) => (
            <div key={material} className="flex items-center gap-3 rounded-[1.2rem] border border-white/55 bg-white/55 px-4 py-4">
              <Leaf className="h-4 w-4 text-gold" />
              <span className="text-sm text-olive">{material}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="p-5">
        <SectionTitle title="Why it feels premium" description="Feature storytelling translated from the website into mobile-first cards." />
        <div className="relative z-10 mt-5 grid gap-3">
          {product.highlights.map((highlight, index) => {
            const icons = [Sparkles, ShieldCheck, BadgeCheck];
            const Icon = icons[index % icons.length];
            return (
              <div key={highlight} className="flex items-start gap-3 rounded-[1.3rem] border border-white/55 bg-white/55 p-4">
                <div className="mt-0.5 rounded-2xl bg-olive/8 p-2 text-gold">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-olive">{highlight}</p>
                  <p className="support-text mt-1">Designed to make the app feel more editorial and trustworthy, not template-driven.</p>
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="grid grid-cols-2 gap-4"
      >
        <button type="button" onClick={handleAddToCart} disabled={!isReady} className="secondary-button py-4 disabled:opacity-60">
          {isInCart ? `Add another (${cartQuantity})` : "Add to cart"}
        </button>
        <button type="button" onClick={handleCheckoutShortcut} disabled={!isReady} className="primary-button py-4 text-center disabled:opacity-60">
          {isInCart ? "View cart" : "Go to checkout"}
        </button>
      </motion.div>

      {purchaseMessage ? (
        <GlassCard className="p-4">
          <p className="relative z-10 text-sm text-olive">{purchaseMessage}</p>
        </GlassCard>
      ) : null}
    </PageTransition>
  );
}
