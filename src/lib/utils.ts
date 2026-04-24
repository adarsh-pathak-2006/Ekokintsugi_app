import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeRetailPrice(value: unknown) {
  const numericValue = Number(value ?? 0);

  if (!Number.isFinite(numericValue) || numericValue <= 0) return 0;

  // Database seed prices are stored as compact catalog units such as 45, 120, 210.
  // The app presents them as retail INR values.
  return numericValue < 1000 ? numericValue * 100 : numericValue;
}

export function formatInr(value: unknown) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0) || 0);
}
