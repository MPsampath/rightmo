"use client";

import { forwardRef } from "react";

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string[];
}

// Standard text/number input with a label and inline validation error message.
const FormInput = forwardRef<HTMLInputElement, FormInputProps>(function FormInput(
  { label, error, className = "", id, ...inputProps },
  ref
) {
  const hasError = Boolean(error?.length);
  const inputId = id ?? inputProps.name;

  return (
    <div className="flex flex-col gap-1 text-sm">
      {label && (
        <label htmlFor={inputId} className="font-medium text-zinc-700 dark:text-zinc-300">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        aria-invalid={hasError}
        className={`rounded-md border px-3 py-2 text-sm dark:bg-zinc-800 ${
          hasError
            ? "border-red-400 bg-red-50 text-red-900 placeholder:text-red-300 focus:border-red-500 focus:outline-none dark:border-red-700 dark:bg-red-950/40"
            : "border-zinc-300 dark:border-zinc-700"
        } ${className}`}
        {...inputProps}
      />
      {hasError && <p className="text-xs text-red-500">{error![0]}</p>}
    </div>
  );
});

export default FormInput;
