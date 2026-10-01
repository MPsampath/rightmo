import type { AxiosInstance } from "axios";
import { apiClient } from "@/lib/api";
import type {
  PaginatedProducts,
  Product,
  ProductFormValues,
  ProductQueryParams,
} from "@/types/product";

export async function fetchProducts(
  params: ProductQueryParams = {},
  client: AxiosInstance = apiClient
): Promise<PaginatedProducts> {
  const { data } = await client.get<{ data: PaginatedProducts }>("/products", {
    params,
  });
  return data.data;
}

export async function fetchProductById(
  id: number | string,
  client: AxiosInstance = apiClient
): Promise<Product> {
  const { data } = await client.get<{ data: Product }>(`/products/${id}`);
  return data.data;
}

// Converts Next.js' searchParams (string | string[] | undefined) into typed API query params.
export function parseProductSearchParams(
  searchParams: Record<string, string | string[] | undefined>
): ProductQueryParams {
  const get = (key: string): string | undefined => {
    const value = searchParams[key];
    return Array.isArray(value) ? value[0] : value;
  };
  const toNumber = (value?: string): number | undefined =>
    value !== undefined && value !== "" ? Number(value) : undefined;

  return {
    search: get("search") || undefined,
    category_id: toNumber(get("category_id")),
    min_price: toNumber(get("min_price")),
    max_price: toNumber(get("max_price")),
    sort_by: (get("sort_by") as ProductQueryParams["sort_by"]) || undefined,
    sort_dir: (get("sort_dir") as ProductQueryParams["sort_dir"]) || undefined,
    page: toNumber(get("page")) ?? 1,
  };
}

export async function createProduct(values: ProductFormValues): Promise<Product> {
  const { data } = await apiClient.post<{ data: Product }>("/products", {
    name: values.name,
    category_id: values.category_id,
    price: values.price,
    rating: values.rating,
  });
  return data.data;
}

export async function updateProduct(
  id: number,
  values: ProductFormValues
): Promise<Product> {
  const { data } = await apiClient.put<{ data: Product }>(`/products/${id}`, {
    name: values.name,
    category_id: values.category_id,
    price: values.price,
    rating: values.rating,
  });
  return data.data;
}

export async function deleteProduct(id: number): Promise<void> {
  await apiClient.delete(`/products/${id}`);
}

export async function submitProductRating(
  id: number | string,
  rating: number
): Promise<void> {
  await apiClient.post(`/products/${id}/ratings`, { rating });
}

export async function uploadProductImage(
  id: number,
  file: File,
  onProgress?: (percent: number) => void
): Promise<Product> {
  const formData = new FormData();
  formData.append("image", file);

  const { data } = await apiClient.post<{ data: Product }>(
    `/products/${id}/image`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (event) => {
        if (!onProgress || !event.total) return;
        onProgress(Math.round((event.loaded / event.total) * 100));
      },
    }
  );
  return data.data;
}
