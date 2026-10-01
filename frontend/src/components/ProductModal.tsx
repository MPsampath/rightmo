"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import FormInput from "@/components/FormInput";
import { uploadProductImage } from "@/lib/products";
import {
  getApiErrorMessage,
  getValidationErrors,
  isValidationError,
} from "@/lib/errors";
import type { Category } from "@/types/category";
import type { Product, ProductFormValues } from "@/types/product";

interface ProductModalProps {
  open: boolean;
  product?: Product | null;
  categories: Category[];
  onClose: () => void;
  onSubmit: (values: ProductFormValues) => Promise<Product>;
  onImageUploaded?: (product: Product) => void;
}

const emptyValues: ProductFormValues = {
  name: "",
  category_id: 0,
  price: 0,
  rating: 0,
};

export default function ProductModal({
  open,
  product,
  categories,
  onClose,
  onSubmit,
  onImageUploaded,
}: ProductModalProps) {
  const [values, setValues] = useState<ProductFormValues>(emptyValues);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Re-seed the form whenever the modal opens for a (possibly different) product.
  const openKey = open ? `${product?.id ?? "new"}` : null;
  const [lastOpenKey, setLastOpenKey] = useState<string | null>(null);
  if (openKey !== null && openKey !== lastOpenKey) {
    setLastOpenKey(openKey);
    setFieldErrors({});
    setImageFile(null);
    setPreviewUrl(null);
    setValues(
      product
        ? {
            name: product.name,
            category_id: product.category_id,
            price: product.price,
            rating: product.rating,
          }
        : { ...emptyValues, category_id: categories[0]?.id ?? 0 },
    );
  }

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (!open) return null;

  function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFieldErrors({});

    try {
      const savedProduct = await onSubmit(values);
      if (product?.id) {
        toast.success("Product updated successfully!");
      } else {
        toast.success("Product saved successfully!");
      }

      if (imageFile) {
        uploadImageWithProgressToast(savedProduct.id, imageFile);
      }
      setLastOpenKey(null);
      setImageFile(null);
      setPreviewUrl(null);
      onClose();
    } catch (error) {
      if (isValidationError(error)) {
        setFieldErrors(getValidationErrors(error));
        toast("Please check the highlighted fields.", { icon: "⚠️" });
      } else {
        toast.error(getApiErrorMessage(error));
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function uploadImageWithProgressToast(productId: number, file: File) {
    const toastId = toast.loading("Uploading image… 0%");
    try {
      const updated = await uploadProductImage(productId, file, (percent) => {
        toast.loading(`Uploading image… ${percent}%`, { id: toastId });
      });
      toast.success("Image uploaded successfully!", { id: toastId });
      onImageUploaded?.(updated);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Image upload failed."), {
        id: toastId,
      });
    }
  }

  const existingImageUrl = product?.image_url ?? null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          {product ? "Edit Product" : "Add New Product"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              Image
            </span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-md border border-dashed border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800"
            >
              {previewUrl || existingImageUrl ? (
                <Image
                  src={previewUrl ?? existingImageUrl!}
                  alt="Product preview"
                  fill
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <span className="text-xs text-zinc-500">
                  Click to choose an image
                </span>
              )}

              {existingImageUrl && (
                <span className="absolute bottom-2 right-2 rounded-md bg-black/60 px-2 py-1 text-xs font-medium text-white">
                  Change photo
                </span>
              )}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelected}
            />
          </div>

          <FormInput
            label="Name"
            name="name"
            required
            type="text"
            value={values.name}
            onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
            error={fieldErrors.name}
          />

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              Category
            </span>
            <select
              required
              value={values.category_id || ""}
              onChange={(e) =>
                setValues((v) => ({
                  ...v,
                  category_id: Number(e.target.value),
                }))
              }
              className={`rounded-md border px-3 py-2 text-sm dark:bg-zinc-800 ${
                fieldErrors.category_id
                  ? "border-red-400 bg-red-50 dark:border-red-700 dark:bg-red-950/40"
                  : "border-zinc-300 dark:border-zinc-700"
              }`}
            >
              <option value="" disabled>
                Select a category…
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {fieldErrors.category_id && (
              <p className="text-xs text-red-500">
                {fieldErrors.category_id[0]}
              </p>
            )}
          </label>

          <div className="flex gap-4">
            <FormInput
              label="Price"
              name="price"
              required
              type="number"
              min={0}
              step="0.01"
              value={values.price}
              onChange={(e) =>
                setValues((v) => ({ ...v, price: Number(e.target.value) }))
              }
              error={fieldErrors.price}
              className="flex-1"
            />
          </div>

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900"
            >
              {submitting
                ? "Saving…"
                : product
                  ? "Save Changes"
                  : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
