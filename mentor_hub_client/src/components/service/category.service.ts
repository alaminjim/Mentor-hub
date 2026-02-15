import { env } from "../../../env";

const API_URL = env.NEXT_PUBLIC_BACKEND_URL;

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
}

export const getCategories = async (): Promise<Category[]> => {
  try {
    const res = await fetch(`${API_URL}/api/category`, {
      credentials: "include",
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch categories");

    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error("getCategories error:", err);
    return [];
  }
};

export const createCategory = async (
  data: CreateCategoryData,
): Promise<Category> => {
  const res = await fetch(`${API_URL}/api/category/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create category");
  }

  const json = await res.json();
  return json.data;
};

export const updateCategory = async (
  id: string,
  data: UpdateCategoryData,
): Promise<Category> => {
  const res = await fetch(`${API_URL}/api/category/update/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to update category");
  }

  const json = await res.json();
  return json.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  const res = await fetch(`${API_URL}/api/category/delete/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to delete category");
  }
};
