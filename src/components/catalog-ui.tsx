import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import type { ProductTypeMeta } from "../lib/catalog";
import { formatInr } from "../lib/utils";
import { GlassCard, Pill } from "./app-ui";
import type { Product } from "../types";

export function CategoryCatalogCard({
  meta,
  productCount,
}: {
  key?: string;
  meta: ProductTypeMeta;
  productCount: number;
}) {
  return (
    <Link to={`/catalogues/${meta.slug}`} className="block">
      <GlassCard className="overflow-hidden">
        <div className="relative h-52">
          <img
            src={meta.heroImage}
            alt={meta.title}
            className="h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.src = "/images/products/signature-sneaker.jpg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-pine via-pine/35 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 text-cream">
            <div className="flex items-center justify-between gap-3">
              <Pill className="kinetic-pill border-white/10 bg-white/10 text-cream">{meta.label}</Pill>
              <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-cream/72">
                {productCount} item{productCount === 1 ? "" : "s"}
              </span>
            </div>
            <h3 className="mt-4 font-serif text-[1.7rem] leading-none">{meta.title}</h3>
            <p className="mt-3 max-w-xs text-sm text-cream/75">{meta.description}</p>
            <div className="mt-4 inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.28em] text-gold">
              Open catalogue
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </GlassCard>
    </Link>
  );
}

export function ProductCatalogCard({
  product,
  index,
}: {
  key?: string;
  product: Product;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <Link to={`/shop/${product.id}`} className="block">
        <GlassCard className="editorial-grid p-4">
          <div className="relative z-10 flex gap-4">
            <div className="image-shell relative h-28 w-28 shrink-0">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
                onError={(event) => {
                  event.currentTarget.src = "/images/products/signature-sneaker.jpg";
                }}
              />
              <div className="absolute left-2 top-2 rounded-full bg-black/40 px-2 py-1 text-[8px] font-mono uppercase tracking-[0.22em] text-white">
                0{index + 1}
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <Pill>{product.category}</Pill>
                <div className="flex items-center gap-1 text-gold">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.22em]">eco luxe</span>
                </div>
              </div>

              <h3 className="mt-3 font-serif text-[1.5rem] leading-tight text-olive">{product.name}</h3>
              <p className="support-text mt-2 line-clamp-2">{product.description}</p>

              <div className="mt-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-olive">{formatInr(product.price)}</p>
                  <p className="mini-label mt-1">{product.co2Saved} kg CO2 saved</p>
                </div>
                <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.24em] text-gold">
                  Open catalogue item
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </Link>
    </motion.div>
  );
}

export function ProductCatalogueImageCard({
  product,
  index,
}: {
  key?: string;
  product: Product;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <Link to={`/shop/${product.id}`} className="block">
        <GlassCard className="overflow-hidden">
          <div className="relative h-64 sm:h-72">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
              onError={(event) => {
                event.currentTarget.src = "/images/products/signature-sneaker.jpg";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-pine/45 via-transparent to-transparent opacity-70 transition-opacity duration-300 hover:opacity-90" />
            <div className="absolute left-3 top-3 rounded-full bg-black/40 px-2 py-1 text-[8px] font-mono uppercase tracking-[0.22em] text-white">
              0{index + 1}
            </div>
            <div className="absolute bottom-4 right-4 rounded-full bg-white/78 p-3 text-gold shadow-[0_12px_28px_-18px_rgba(17,31,26,0.9)] backdrop-blur-md">
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </GlassCard>
      </Link>
    </motion.div>
  );
}
