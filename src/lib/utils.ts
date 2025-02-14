import { Archive } from "@/components/ArchiveManager";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function storeArchives(data: Record<string, Archive>): void {
  localStorage.setItem("presets", JSON.stringify(data));
}

function getArchives(): Record<string, Archive> | null {
  const presetsContent = localStorage.getItem("presets");
  if (!presetsContent) return null;
  return JSON.parse(presetsContent);
}

function getInteractionColor(grade: number, active = true): string {
  if (!active) return "transparent";

  if (grade <= 5) return "rgb(239, 68, 68)";
  if (grade <= 10) return "rgb(234, 179, 8)";
  if (grade <= 15) return "rgb(34, 197, 94)";
  return "rgb(59, 130, 246)";
}

function clamp(value: number, min: number, max: number): number {
  if (max < value) return max;
  if (min > value) return min;
  return value;
}

export { cn, storeArchives, getArchives, getInteractionColor, clamp };
