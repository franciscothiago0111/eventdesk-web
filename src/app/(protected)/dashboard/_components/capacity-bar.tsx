interface CapacityBarProps {
  registered: number;
  capacity: number;
}

export function CapacityBar({ registered, capacity }: CapacityBarProps) {
  const percent = capacity > 0 ? Math.min(100, (registered / capacity) * 100) : 0;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between text-sm text-neutral-600">
        <span>Capacity</span>
        <span>
          {registered} / {capacity}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-neutral-200">
        <div
          className="h-2 rounded-full bg-primary-main transition-[width]"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
