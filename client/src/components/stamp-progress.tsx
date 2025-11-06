import { Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StampProgressProps {
  current: number;
  total: number;
}

export default function StampProgress({ current, total }: StampProgressProps) {
  const stamps = Array.from({ length: total }, (_, i) => i < current);
  const progress = Math.round((current / total) * 100);

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-text-primary">
            Stamp Collection
          </h3>
          <span className="text-sm font-semibold text-text-primary">
            {current}/{total}
          </span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{
              width: `${progress}%`,
              backgroundColor: "#7c3aed",
            }}
          />
        </div>
        <p className="text-xs text-text-dim text-right">{progress}% complete</p>
      </div>
      
      <div className="grid grid-cols-5 gap-2">
        {stamps.map((filled, index) => (
          <div
            key={index}
            className={`aspect-square rounded-full flex items-center justify-center font-bold text-sm transition-all hover-lift ${
              filled
                ? "bg-accent text-white"
                : "bg-card border border-border text-text-muted"
            }`}
          >
            {filled ? <Award className="w-5 h-5" /> : index + 1}
          </div>
        ))}
      </div>
      
      {current === total && (
        <div className="text-center pt-4 border-t border-line">
          <Badge className="bg-success/20 text-success border-success/30 px-4 py-2">
            <Award className="w-4 h-4 mr-2" />
            Free Gyoza Available!
          </Badge>
        </div>
      )}
    </div>
  );
}
