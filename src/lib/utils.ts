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

export const getCookies = (cookie: string) =>
  new Map(
    cookie
      .split(";")
      .map((c) => c.trim())
      .map((c) => [c.split("=")[0], c.split("=")[1]])
  );

export const setCookies = (z: Map<string, string>) =>
  Array.from(z.entries())
    .map((c) => c.join("="))
    .join(";");
