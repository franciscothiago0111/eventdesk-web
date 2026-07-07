import type { ReactNode } from "react";

interface IPageHeaderGroupProps {
  children: ReactNode;
}

export function PageHeaderGroup({ children }: IPageHeaderGroupProps) {
  return (
    <div className="flex flex-row items-center justify-between  p-2 border-b border-b-neutral-300 md:border-none lg:p-0">
      {children}
    </div>
  );
}
