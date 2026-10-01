import { Suspense } from "react";
import ProductGrid from "@/components/ProductGrid";
import { fetchCategories } from "@/lib/categories";
import { fetchProducts, parseProductSearchParams } from "@/lib/products";

interface HomeProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

// Public, read-only product dashboard. Fetches data server-side so the page loads fully populated.
export default async function Home({ searchParams }: HomeProps) {
  const filters = parseProductSearchParams(await searchParams);
  const [result, categories] = await Promise.all([
    fetchProducts(filters),
    fetchCategories(),
  ]);

  return (
    <Suspense>
      <ProductGrid isAdmin={false} initialResult={result} categories={categories} />
    </Suspense>
  );
}
