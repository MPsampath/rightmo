import { Suspense } from "react";
import AuthGuard from "@/components/AuthGuard";
import ProductGrid from "@/components/ProductGrid";
import { fetchCategories } from "@/lib/categories";
import { fetchProducts, parseProductSearchParams } from "@/lib/products";

interface AdminDashboardPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

// System Admin dashboard with create/edit/delete capabilities.
export default async function AdminDashboardPage({ searchParams }: AdminDashboardPageProps) {
  const filters = parseProductSearchParams(await searchParams);
  const [result, categories] = await Promise.all([
    fetchProducts(filters),
    fetchCategories(),
  ]);

  return (
    <AuthGuard>
      <Suspense>
        <ProductGrid isAdmin initialResult={result} categories={categories} />
      </Suspense>
    </AuthGuard>
  );
}
