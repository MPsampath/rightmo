"use client";

import Image from "next/image";
import Link from "next/link";
import StarRating from "@/components/StarRating";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  isAdmin?: boolean;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onImageUploaded?: (product: Product) => void;
}

export default function ProductCard({
  product,
  isAdmin = false,
  onEdit,
  onDelete,
}: ProductCardProps) {

  const imageUrl = product.image_url;

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <Link href={`/products/${product.id}`} className="relative block aspect-square w-full bg-zinc-100 dark:bg-zinc-800">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-zinc-400">
            No image
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <span className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          {product.category?.name ?? "Uncategorized"}
        </span>
        <h3 className="line-clamp-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          <Link href={`/products/${product.id}`} className="hover:underline">
            {product.name}
          </Link>
        </h3>
        <StarRating rating={product.rating} className="mt-1" />
        <p className="mt-2 text-lg font-bold text-zinc-900 dark:text-zinc-50">
          ${Number(product.price).toFixed(2)}
        </p>

        {isAdmin && (
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => onEdit?.(product)}
              className="flex-1 rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete?.(product)}
              className="flex-1 rounded-md border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
