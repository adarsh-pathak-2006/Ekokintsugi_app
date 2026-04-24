import { ComponentPropsWithoutRef, HTMLAttributes, ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

export function PageTransition({
  children,
  className,
  ...props
}: {
  children: ReactNode;
  className?: string;
} & ComponentPropsWithoutRef<typeof motion.div>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      className={cn("app-page page-glow", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function GlassCard({
  children,
  className,
  ...props
}: {
  children: ReactNode;
  className?: string;
} & ComponentPropsWithoutRef<typeof motion.section>) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, scale: 1.01 }}
      className={cn("surface-card", className)}
      {...props}
    >
      {children}
    </motion.section>
  );
}

export function DarkCard({
  children,
  className,
  ...props
}: {
  children: ReactNode;
  className?: string;
} & ComponentPropsWithoutRef<typeof motion.section>) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5, scale: 1.01 }}
      className={cn("dark-surface", className)}
      {...props}
    >
      {children}
    </motion.section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="gold-label">{children}</p>;
}

export function SectionTitle({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.38 }}
      className="flex items-end justify-between gap-4"
    >
      <div>
        <h2 className="section-title text-[1.8rem]">{title}</h2>
        {description ? <p className="support-text mt-2 max-w-xs">{description}</p> : null}
      </div>
      {action}
    </motion.div>
  );
}

export function Pill({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("badge-chip", className)}>{children}</span>;
}

export function MetricTile({
  label,
  value,
  detail,
  className,
}: {
  label: string;
  value: string;
  detail?: string;
  className?: string;
}) {
  return (
    <GlassCard className={cn("p-5", className)}>
      <p className="mini-label mb-3">{label}</p>
      <p className="font-serif text-[2rem] leading-none text-olive">{value}</p>
      {detail ? <p className="support-text mt-2">{detail}</p> : null}
    </GlassCard>
  );
}

export function PageHeader({
  title,
  subtitle,
  detail,
}: {
  title: string;
  subtitle: string;
  detail?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-3"
    >
      <Eyebrow>{subtitle}</Eyebrow>
      <h1 className="section-title text-[2.55rem]">{title}</h1>
      {detail ? <p className="support-text max-w-sm">{detail}</p> : null}
    </motion.div>
  );
}

export function FloatingOrb({ className }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("pointer-events-none absolute rounded-full blur-3xl", className)} />;
}
