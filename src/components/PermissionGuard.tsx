"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/core/hooks/use-auth";
import type { AuthUser } from "@/core/services/auth.service";
import { UnauthorizedState } from "./UnauthorizedState";

interface IPermissionGuardProps {
  children: ReactNode;
  requiredRole: AuthUser["role"];
  redirectTo?: string;
}

export function PermissionGuard({
  children,
  requiredRole,
  redirectTo = "/dashboard",
}: IPermissionGuardProps) {
  const user = useAuth((state) => state.user);
  const router = useRouter();

  if (!user) {
    return null;
  }

  if (user.role !== requiredRole) {
    return (
      <UnauthorizedState redirectTo={redirectTo} onBack={() => router.back()} />
    );
  }

  return <>{children}</>;
}
