import { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  hint?: string;
  icon?: ReactNode;
  className?: string;
}

export default function MetricCard({
  title,
  value,
  hint,
  icon,
  className = "",
}: MetricCardProps) {
  return (
    <div className={`card-base p-5 hover-lift ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-text-muted mb-1">{title}</p>
          <p className="text-2xl font-bold text-text-primary">{value}</p>
          {hint && (
            <p className="text-xs text-text-dim mt-1">{hint}</p>
          )}
        </div>
        {icon && (
          <div className="text-text-muted">{icon}</div>
        )}
      </div>
    </div>
  );
}

