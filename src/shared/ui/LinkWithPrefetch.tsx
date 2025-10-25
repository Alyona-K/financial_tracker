import React from "react";

type Props = {
  to: string;
  prefetch?: () => void;
  children: React.ReactNode;
};

export function LinkPrefetch({ to, prefetch, children }: Props) {
  return (
    <a
      href={to}
      onMouseEnter={() => prefetch?.()}
      onFocus={() => prefetch?.()} // для клавиатуры
    >
      {children}
    </a>
  );
}
