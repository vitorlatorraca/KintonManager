import { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PillProps {
  children: ReactNode;
  icon?: ReactNode;
  variant?: "default" | "outline";
  className?: string;
}

export default function Pill({
  children,
  icon,
  variant = "outline",
  className = "",
}: PillProps) {
  return (
    <Badge
      variant={variant === "outline" ? "outline" : "default"}
      className={cn(
        "rounded-full px-3 py-1 text-xs font-medium border-border bg-card text-text-primary hover:bg-card-hover transition-colors",
        className
      )}
    >
      {icon && <span className="mr-1.5">{icon}</span>}
      {children}
    </Badge>
  );
}

