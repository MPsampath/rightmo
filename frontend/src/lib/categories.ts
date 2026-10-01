import type { AxiosInstance } from "axios";
import { apiClient } from "@/lib/api";
import type { Category } from "@/types/category";

export async function fetchCategories(
  client: AxiosInstance = apiClient
): Promise<Category[]> {
  const { data } = await client.get<{ data: Category[] }>("/categories");
  return data.data;
}
