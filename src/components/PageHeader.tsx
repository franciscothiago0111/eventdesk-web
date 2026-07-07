interface IPageHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: IPageHeaderProps) {
  return (
    <header className="flex flex-col gap-2">
      <h2 className="text-lg md:text-xl lg:text-2xl text-neutral-950 font-bold">{title}</h2>
      {subtitle && <p className="text-xs md:text-sm lg:text-base text-neutral-600 font-normal">{subtitle}</p>}
    </header>
  );
}
