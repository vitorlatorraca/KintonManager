interface StampProgressProps {
  current: number;
  total: number;
}

export default function StampProgress({ current, total }: StampProgressProps) {
  const percentage = Math.min((current / total) * 100, 100);
  const circumference = 327; // 2 * π * 52
  const strokeDashoffset = circumference - (circumference * percentage) / 100;

  return (
    <div className="relative">
      <svg className="progress-ring w-16 h-16" viewBox="0 0 120 120">
        <circle
          className="progress-ring-circle"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="8"
          fill="transparent"
          r="52"
          cx="60"
          cy="60"
        />
        <circle
          className="progress-ring-circle"
          stroke="white"
          strokeWidth="8"
          fill="transparent"
          r="52"
          cx="60"
          cy="60"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold text-white">{current}</span>
        <span className="text-sm text-white">/{total}</span>
      </div>
    </div>
  );
}
