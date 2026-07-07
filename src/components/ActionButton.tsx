"use client";

import Link from "next/link";
import { Plus, Pencil, Trash2, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type ActionType = "create" | "update" | "delete" | "download" | "upload";

interface IActionButtonProps {
  action: ActionType;
  href: string;
  label?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success" | "default";
  className?: string;
}

const actionConfig: Record<ActionType, { icon: React.ComponentType<{ size: number; className?: string }>; defaultLabel: string }> = {
  create: { icon: Plus, defaultLabel: "Criar" },
  update: { icon: Pencil, defaultLabel: "Editar" },
  delete: { icon: Trash2, defaultLabel: "Deletar" },
  download: { icon: Download, defaultLabel: "Baixar" },
  upload: { icon: Upload, defaultLabel: "Enviar" },
};

export function ActionButton({
  action,
  href,
  label,
  size = "md",
  variant = "primary",
  className,
}: IActionButtonProps) {
  const config = actionConfig[action];
  const Icon = config.icon;
  const displayLabel = label || config.defaultLabel;

  return (
    <Button asChild size={size} variant={variant} className={cn("md:px-5 md:py-2.5", className)}>
      <Link href={href} className="inline-flex items-center justify-center gap-2 px-3 py-3 md:px-0 md:py-0">
        <Icon size={20} className="shrink-0" />
        <span className="hidden md:inline">{displayLabel}</span>
      </Link>
    </Button>
  );
}
