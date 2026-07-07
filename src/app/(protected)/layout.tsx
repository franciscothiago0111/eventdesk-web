import { ProtectedShell } from './_components/protected-shell';

// Client-only auth state (Zustand + localStorage) can't be statically
// prerendered — this whole route group must render per-request.
export const dynamic = 'force-dynamic';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedShell>{children}</ProtectedShell>;
}
