// src/services/category.service.ts
import { env } from "../../../env";

const API_URL = env.NEXT_PUBLIC_APP_URL;

// Category type for TypeScript
export interface Category {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export const getCategories = async (): Promise<Category[]> => {
  try {
    const res = await fetch(`${API_URL}/api/category`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch categories");

    const json = await res.json();

    // If your API returns { data: [...] }
    return json.data || []; // ensures we always return an array
  } catch (err) {
    console.error("getCategories error:", err);
    return []; // fallback to empty array
  }
};
