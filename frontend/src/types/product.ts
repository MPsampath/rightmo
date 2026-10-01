import type { Category } from "@/types/category";

export interface Product {
  id: number;
  name: string;
  category_id: number;
  category?: Category | null;
  price: number;
  rating: number;
  image_path: string | null;
  image_url: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ProductFormValues {
  name: string;
  category_id: number;
  price: number;
  rating: number;
  image?: File | null;
}

// Query params accepted by GET /products (ProductController::list -> ProductService::getAllProducts).
export interface ProductQueryParams {
  search?: string;
  category_id?: number;
  min_price?: number;
  max_price?: number;
  sort_by?: "price" | "rating";
  sort_dir?: "asc" | "desc";
  page?: number;
}

// Shape returned by Laravel's LengthAwarePaginator::toJson().
export interface PaginatedProducts {
  data: Product[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
