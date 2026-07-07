import React from "react";
import { cn } from "@/lib/utils";

const variantStyles: Record<string, string> = {
  success: "bg-green-100 text-green-700",
  error: "bg-red-100 text-red-700",
  warning: "bg-yellow-100 text-yellow-700",
  info: "bg-blue-100 text-blue-700",
  default: "bg-slate-100 text-slate-700",
};

interface IBadgeProps {
  label?: string;
  showBadge?: boolean;
  badgeText?: string;
  className?: string;
  variant?: string;
  children?: React.ReactNode;
}

export function Badge({
  label,
  showBadge = false,
  badgeText = "NOVO",
  className,
  variant,
  children,
}: IBadgeProps) {
  if (children !== undefined || variant !== undefined) {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium leading-none",
          variant ? (variantStyles[variant] ?? variantStyles.default) : variantStyles.default,
          className
        )}
      >
        {children}
      </span>
    );
  }

  return (
    <>
      <span className=" truncate">{label}</span>
      {showBadge && (
        <span className={cn(" flex items-center rounded-full  px-2.5 py-1 text-xs font-medium leading-none ", className)}>
          {badgeText}
        </span>
      )}
    </>
  );
}
