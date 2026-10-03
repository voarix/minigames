import { API_BASE_URL } from "./api-config.ts";

export interface Category {
  readonly slug: string;
  readonly label: string;
  readonly isDefault: boolean;
}

interface CategoriesResponse {
  readonly data: readonly Category[];
}

export const getCategories = async () => {
  const response = await fetch(API_BASE_URL + "/categories");

  if (!response.ok) {
    throw new Error("Failed to load categories.");
  }

  const result: CategoriesResponse = await response.json();
  return result.data;
};
