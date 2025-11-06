import { ReactNode } from "react";

interface HeroTitleProps {
  children: ReactNode;
  className?: string;
}

export default function HeroTitle({ children, className = "" }: HeroTitleProps) {
  return (
    <h1 className={`text-5xl font-extrabold tracking-[-0.02em] text-text-primary leading-tight ${className}`}>
      {children}
    </h1>
  );
}

