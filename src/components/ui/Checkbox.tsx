"use client";

import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ICheckboxProps
  extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, ICheckboxProps>(
  ({ className, error, label, id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            className={cn(
              `
              h-4
              w-4
              rounded
              border
              border-neutral-300
              bg-white
              accent-green-600
              focus:ring-2
              focus:ring-green-200
              focus:ring-offset-0
              disabled:cursor-not-allowed
              disabled:opacity-50
              `,
              className
            )}
            {...props}
          />

          {label && (
            <label
              htmlFor={inputId}
              className="
                select-none
                ms-2
                cursor-pointer
                text-sm
                font-medium
                text-neutral-900
              "
            >
              {label}
            </label>
          )}
        </div>

        {error && (
          <span className="ms-6 text-xs text-feedback-error-main">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";