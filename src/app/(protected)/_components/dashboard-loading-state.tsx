export function DashboardLoadingState() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50">
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-neutral-200 border-t-primary-main" />
        <p className="text-sm text-neutral-600">Loading...</p>
      </div>
    </div>
  );
}
