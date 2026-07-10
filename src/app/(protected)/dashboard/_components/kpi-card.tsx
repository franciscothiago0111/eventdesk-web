interface KpiCardProps {
  label: string;
  value: string | number;
  sub?: string;
  accent: string;
}

export function KpiCard({ label, value, sub, accent }: KpiCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className={`absolute inset-y-0 left-0 w-1 ${accent}`} />
      <div className="pl-1">
        <p className="text-sm font-medium text-neutral-600">{label}</p>
        <p className="mt-3 text-3xl font-bold tracking-tight text-neutral-950">
          {value}
        </p>
        {sub && <p className="mt-1 text-xs text-neutral-500">{sub}</p>}
      </div>
    </div>
  );
}
