interface BudgetBarProps {
  label: string;
  value: number;
  pct: number;
  color: string;
  className?: string;
}

export default function BudgetBar({
  label,
  value,
  pct,
  color,
  className = "",
}: BudgetBarProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-text-primary">{label}</span>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-text-primary">
            {value.toLocaleString()}
          </span>
          <span className="text-xs text-text-dim">{pct}%</span>
        </div>
      </div>
      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{
            width: `${Math.min(pct, 100)}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}

