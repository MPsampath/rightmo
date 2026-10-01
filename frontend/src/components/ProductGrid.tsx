"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "@/lib/products";
import { getApiErrorMessage } from "@/lib/errors";
import type { Category } from "@/types/category";
import type {
  PaginatedProducts,
  Product,
  ProductFormValues,
} from "@/types/product";

interface ProductGridProps {
  isAdmin?: boolean;
  initialResult: PaginatedProducts;
  categories: Category[];
}

export default function ProductGrid({
  isAdmin = false,
  initialResult,
  categories,
}: ProductGridProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [result, setResult] = useState<PaginatedProducts>(initialResult);
  // Re-sync local state whenever the server supplies fresh SSR data (new URL/filters).
  const [lastInitialResult, setLastInitialResult] = useState(initialResult);
  if (initialResult !== lastInitialResult) {
    setLastInitialResult(initialResult);
    setResult(initialResult);
  }

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [searchInput, setSearchInput] = useState(searchParams.get("search") ?? "");
  const [minPriceInput, setMinPriceInput] = useState(searchParams.get("min_price") ?? "");
  const [maxPriceInput, setMaxPriceInput] = useState(searchParams.get("max_price") ?? "");

  const products = result.data;

  function updateSearchParams(updates: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === undefined || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateSearchParams({ search: searchInput || undefined });
  }

  function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    updateSearchParams({ category_id: e.target.value || undefined });
  }

  function handlePriceFilterSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateSearchParams({
      min_price: minPriceInput || undefined,
      max_price: maxPriceInput || undefined,
    });
  }

  function handleSortChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const [sort_by, sort_dir] = e.target.value.split(":");
    updateSearchParams({ sort_by: sort_by || undefined, sort_dir: sort_by ? sort_dir : undefined });
  }

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`${pathname}?${params.toString()}`);
  }

  function openAddModal() {
    setEditingProduct(null);
    setModalOpen(true);
  }

  function openEditModal(product: Product) {
    setEditingProduct(product);
    setModalOpen(true);
  }

  async function handleSubmit(values: ProductFormValues): Promise<Product> {
    if (editingProduct) {
      const updated = await updateProduct(editingProduct.id, values);
      setResult((prev) => ({
        ...prev,
        data: prev.data.map((p) => (p.id === updated.id ? updated : p)),
      }));
      return updated;
    }

    const created = await createProduct(values);
    
    setResult((prev) => ({ ...prev, data: [created, ...prev.data] }));
    return created;
  }

  async function handleDelete(product: Product) {
    if (!window.confirm(`Delete "${product.name}"?`)) return;
    try {
      await deleteProduct(product.id);
      setResult((prev) => ({
        ...prev,
        data: prev.data.filter((p) => p.id !== product.id),
      }));
      toast.success("Product deleted successfully!");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to delete product."));
    }
  }

  function handleImageUploaded(updated: Product) {
    setResult((prev) => ({
      ...prev,
      data: prev.data.some((product) => product.id === updated.id)
        ? prev.data.map((product) => (product.id === updated.id ? updated : product))
        : [updated, ...prev.data],
    }));
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Product Dashboard
        </h1>
        {isAdmin && (
          <button
            type="button"
            onClick={openAddModal}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900"
          >
            + Add New Product
          </button>
        )}
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <form onSubmit={handleSearchSubmit} className="flex flex-1 gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products by name…"
            className="flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
          />
          <button
            type="submit"
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Search
          </button>
        </form>

        <select
          onChange={handleSortChange}
          defaultValue={
            searchParams.get("sort_by")
              ? `${searchParams.get("sort_by")}:${searchParams.get("sort_dir") ?? "asc"}`
              : ""
          }
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
        >
          <option value="">Sort by…</option>
          <option value="price:asc">Price: Low to High</option>
          <option value="price:desc">Price: High to Low</option>
          <option value="rating:asc">Rating: Low to High</option>
          <option value="rating:desc">Rating: High to Low</option>
        </select>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <select
          value={searchParams.get("category_id") ?? ""}
          onChange={handleCategoryChange}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <form onSubmit={handlePriceFilterSubmit} className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            step="0.01"
            placeholder="Min price"
            value={minPriceInput}
            onChange={(e) => setMinPriceInput(e.target.value)}
            className="w-28 rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
          />
          <span className="text-sm text-zinc-500">to</span>
          <input
            type="number"
            min={0}
            step="0.01"
            placeholder="Max price"
            value={maxPriceInput}
            onChange={(e) => setMaxPriceInput(e.target.value)}
            className="w-28 rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
          />
          <button
            type="submit"
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Apply
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isAdmin={isAdmin}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {products.length === 0 && (
        <p className="text-sm text-zinc-500">No products found.</p>
      )}

      {result.last_page > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            disabled={result.current_page <= 1}
            onClick={() => goToPage(result.current_page - 1)}
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-200"
          >
            Previous
          </button>
          <span className="text-sm text-zinc-500">
            Page {result.current_page} of {result.last_page}
          </span>
          <button
            type="button"
            disabled={result.current_page >= result.last_page}
            onClick={() => goToPage(result.current_page + 1)}
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-200"
          >
            Next
          </button>
        </div>
      )}

      {isAdmin && (
        <ProductModal
          open={modalOpen}
          product={editingProduct}
          categories={categories}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          onImageUploaded={handleImageUploaded}
        />
      )}
    </div>
  );
}
