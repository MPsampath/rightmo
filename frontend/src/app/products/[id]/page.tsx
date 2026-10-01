import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import type { AxiosError } from "axios";
import StarRating from "@/components/StarRating";
import { fetchProductById } from "@/lib/products";
import { getServerApiClient } from "@/lib/server-api";
import RatingForm from "@/components/RatingForm";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

// SSR product detail page: image on the left, details on the right.
export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const client = await getServerApiClient();
  const cookieStore = await cookies();
  const isAdmin = Boolean(cookieStore.get("access_token")?.value);
  const backHref = isAdmin ? "/admin" : "/";

  const product = await fetchProductById(id, client).catch((error: AxiosError) => {
    if (error.response?.status === 401) {
      redirect(`/login?next=/products/${id}`);
    }
    notFound();
  });

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href={backHref} className="mb-6 inline-block text-sm text-zinc-500 hover:underline">
        ← Back to {isAdmin ? "admin dashboard" : "dashboard"}
      </Link>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              unoptimized
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-zinc-400">
              No image
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            {product.category?.name ?? "Uncategorized"}
          </span>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            {product.name}
          </h1>
          <StarRating rating={product.rating} />
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            ${Number(product.price).toFixed(2)}
          </p>

          {!isAdmin && (
          <div className="mt-2 border-t border-zinc-200 pt-4 dark:border-zinc-800">
            <RatingForm productId={product.id} />
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
