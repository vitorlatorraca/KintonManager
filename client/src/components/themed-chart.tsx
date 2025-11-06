import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ThemedChartProps {
  children: ReactNode;
  className?: string;
}

export default function ThemedChart({ children, className = "" }: ThemedChartProps) {
  return (
    <div className={cn("w-full", className)}>
      <style>{`
        .recharts-cartesian-axis-tick text {
          fill: #9AA7B2;
          font-size: 12px;
        }
        .recharts-cartesian-grid line {
          stroke: #1b2531;
        }
        .recharts-legend-item-text {
          color: #9AA7B2;
          font-size: 12px;
        }
        .recharts-tooltip-wrapper {
          outline: none;
        }
        .recharts-default-tooltip {
          background: #0f141a !important;
          border: 1px solid #1e2936 !important;
          border-radius: 8px !important;
          box-shadow: 0 1px 0 rgba(255,255,255,0.02), 0 8px 30px rgba(0,0,0,0.35) !important;
        }
        .recharts-tooltip-label {
          color: #e6edf3 !important;
          font-weight: 600;
        }
        .recharts-tooltip-item {
          color: #9AA7B2 !important;
        }
      `}</style>
      {children}
    </div>
  );
}

