import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function filterUniqueBasedOn<T>(array: T[], property: keyof T): T[] {
  return Array.from(
    new Map(array.map((item) => [item[property], item])).values()
  );
}
